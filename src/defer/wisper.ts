import { OpenAI } from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { defer } from '@defer/client';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function wisper(filepath: string) {
  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filepath),
    model: 'whisper-1',
    response_format: 'verbose_json',
  });
  return response;
}

export default defer(wisper);
