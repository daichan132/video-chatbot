import { OpenAIStreamPayload } from '@/types/openai';
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

export async function OpenAIStream(payload: OpenAIStreamPayload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Authorization: `Bearer ${payload ?? ''}}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model: payload.model,
      messages: payload.messages,
      max_tokens: payload.max_tokens,
      temperature: payload.temperature,
      top_p: payload.top_p,
      presence_penalty: payload.presence_penalty,
      frequency_penalty: payload.frequency_penalty,
      n: payload.n,
      stream: true,
    }),
  });

  const stream = new ReadableStream({
    async start(controller) {
      // callback
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const { data } = event;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === '[DONE]') {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || '';
            if (counter < 2 && (text.match(/\n/) || []).length) {
              // this is a prefix character (i.e., "\n\n"), do nothing
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter += 1;
          } catch (e) {
            // maybe parse error
            controller.error(e);
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);
      // https://web.dev/streams/#asynchronous-iteration
      // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-explicit-any
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
