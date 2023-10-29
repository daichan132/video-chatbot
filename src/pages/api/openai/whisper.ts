import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import wisper from '../../../defer/wisper';

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
    const filepath = await new Promise<string>((resolve, reject) => {
      form.parse(req, (err, _fields, files) => {
        if (isFile(files.file)) {
          resolve(files.file.filepath);
        }
        return reject(new Error('file is not found'));
      });
    });
    const data = await wisper(filepath);
    res.status(200).json(data);
  } catch (error) {
    // console.error(error);
    res.status(500).send({ error });
  }
}
