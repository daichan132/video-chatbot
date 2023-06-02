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
    const fileContent = await new Promise((resolve, reject) => {
      form.parse(req, (err, _fields, files) => {
        if (isFile(files.file)) {
          resolve(fs.createReadStream(files.file.filepath));
        }
        return reject(new Error('file is not found'));
      });
    });

    const response = await openai.createTranscription(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileContent as any,
      'whisper-1',
      'prompt',
      'srt'
    );
    const transcript = response.data;
    res.status(200).json({ transcript });
  } catch (error) {
    // console.error(error);
    res.status(500).send('Something went wrong');
  }
}
