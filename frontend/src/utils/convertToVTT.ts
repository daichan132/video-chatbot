interface Segment {
  id: number;
  start: number;
  end: number;
  text: string;
  // other fields omitted for simplicity
}

function secondsToVTT(seconds: number) {
  const hour = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const minute = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const second = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  const millisecond = Math.floor((seconds * 1000) % 1000)
    .toString()
    .padStart(3, '0');

  return `${hour}:${minute}:${second}.${millisecond}`;
}

export function convertToVTT(segments: Segment[]): string {
  let output = 'WEBVTT\n\n';

  // eslint-disable-next-line no-restricted-syntax
  for (const segment of segments) {
    const start = secondsToVTT(segment.start);
    const end = secondsToVTT(segment.end);

    output += `${start} --> ${end}\n${segment.text}\n\n`;
  }

  return output;
}
