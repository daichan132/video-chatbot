import { OpenAI } from 'openai';
import { codeBlock, oneLine } from 'common-tags';
import { defer } from '@defer/client';

// async function generate_title(req: NextApiRequest) {
async function generate_title(vttText: string) {
  const prompt = codeBlock`
    ${oneLine`
    下に示すvttファイル形式のテキストから5~9文字程度のタイトルを生成して下さい
    `}
    
    vttファイル形式テキスト:
    ${vttText}
    """
    
    Answer as text (including related code snippets if available):
    `;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const req_function = async () => {
    const res = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 512,
      temperature: 0.8,
    });
    return res;
  };
  const res_completion = await req_function();
  const { choices } = res_completion;

  if (choices.length === 0) throw new Error('choices is none.');
  const { text: vttTextResult } = choices[0];

  return vttTextResult;
}

export default defer(generate_title);
