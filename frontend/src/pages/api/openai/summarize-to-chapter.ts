import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai';
import { codeBlock, oneLine } from 'common-tags';
import fs from 'fs';

export default async function handler(req: NextApiRequest, response: NextApiResponse) {
  const { vttText, vttfilepath } = req.body;
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
    console.log(1);
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const req_function = async () => {
      const res = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 512,
        temperature: 0.8,
      });
      return res;
    };
    const res_completion = await req_function();
    const { choices } = res_completion.data;

    // console.log(choices);
    if (choices.length === 0) throw new Error('choices is none.');
    // const { data } = await res_completion.json();
    const { text: vttTextResult } = choices[0];

    // fs.writeFile(vttfilepath, vttTextResult, (err) => {
    //   if (err) throw err;
    // console.log('write vttfile completed.');
    // const file = fs.readFileSync('public/output.vtt', 'utf-8');
    // });
    // const fileExt = file.name.split('.').pop();
    // const fileName = `${Math.random()}.${fileExt}`;
    // const filePath = `${fileName}`;
    // const { error: updateError } = await supabase.storage
    //   .from('videos')
    //   .upload(`${user?.id}/${filePath}`, file);
    // if (updateError) throw new Error(updateError.message);

    response.status(200).json(vttTextResult);
  } catch (err) {
    response.status(500).json(err);
  }
}
