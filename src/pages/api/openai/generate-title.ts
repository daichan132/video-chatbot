import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { codeBlock, oneLine } from 'common-tags';

export default async function handler(req: NextApiRequest, response: NextApiResponse) {
  const { vttText } = req.body;
  try {
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

    response.status(200).json(vttTextResult);
  } catch (err) {
    response.status(500).json(err);
  }
}
