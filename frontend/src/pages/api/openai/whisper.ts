import { Configuration, OpenAIApi } from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const form = formidable({ multiples: true, keepExtensions: true });

const isFile = (file: File | File[]): file is File => {
  return !Array.isArray(file) && file?.filepath !== undefined;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const fileContent: any = await new Promise((resolve, reject) => {
      form.parse(req, (err, _fields, files) => {
        if (isFile(files.file)) {
          // resolve(fs.createReadStream(files.file.filepath));
          // const f = files.file;
          console.log(files.file);
          // console.log(f);
          resolve(files.file);
        }

        return reject(new Error('file is not found'));
      });
    });

    // Whisper
    // console.log(fileContent);
    // console.log(typeof fileContent);
    // console.log(fileContent);
    // const response = await openai.createTranscription(fileContent, 'whisper-1');
    // const response = await openai.createTranscription(
    //   new File('/var/folders/qh/4v6m95511ysdflt2psgnw87r0000gp/T/85113ce6111a1e374b3b6460a.mp3'),
    //   'whisper-1'
    // );
    const response = await openai.createTranscription(fileContent, 'whisper-1');
    // console.log(response);

    const transcript = response.data.text;

    res.status(200).json({ transcript });
  } catch (error) {
    // console.error(error);
    res.status(500).send('Something went wrong');
  }
}
