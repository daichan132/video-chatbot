import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { codeBlock, oneLine } from 'common-tags';

export default async function handler(req: NextApiRequest, response: NextApiResponse) {
  const { vttText } = req.body;
  try {
    const prompt = codeBlock`
    ${oneLine`
    下に示すvttファイル形式のテキストを30秒〜1分程度のチャプターごとに要約してください。
    以下の箇条書きで示された条件を全て満たすように返事をしてください。
    ・出力はvttファイルの形式で、最初に「WEBVTT」という文字列を必ず含めてください。
    ・不要なバッククオーテーションなどは含めないでください。
    ・必ず1チャプター30秒以上になるようにしてください。
    ・1チャプターの要約は10文字以内にしてください。
    `}
    
    vttファイル形式テキスト:
    ${vttText}
    """
    
    Answer as markdown (including related code snippets if available):
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

    response.status(200).json(vttTextResult);
  } catch (err) {
    response.status(500).json(err);
  }
}
