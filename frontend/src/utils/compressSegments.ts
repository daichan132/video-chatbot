import { Segment } from '@/types/customSupabase';

export function compressSegments(segments: Segment[]): Segment[] {
  let compressedText = '';
  let currentStart = 0;
  let id = 0;
  const resultSegments = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const s of segments) {
    const duration = s.end - currentStart;

    if (segments[segments.length - 1] === s) {
      resultSegments.push({ id, start: currentStart, end: s.end, text: compressedText });
      break;
    }

    if (duration <= 30) {
      compressedText += s.text;
    } else {
      resultSegments.push({ id, start: currentStart, end: s.end, text: compressedText });
      compressedText = '';
      currentStart = s.end;
      id += 1;
    }
  }

  return resultSegments;
}
