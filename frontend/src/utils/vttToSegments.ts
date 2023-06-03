import { Segment } from '@/types/customSupabase';

function VTTToSeconds(timeString: string): number {
  const [hour, minute, secondWithMillis] = timeString.split(':');
  const [second, millisecond = '000'] = secondWithMillis.split('.');

  return (
    parseInt(hour, 10) * 3600 +
    parseInt(minute, 10) * 60 +
    parseInt(second, 10) +
    parseInt(millisecond, 10) / 1000
  );
}

export function vttToSegments(vtt: string): Segment[] {
  const regex =
    /^(\d{2}:\d{2}:\d{2}[.,]\d{3})\s-->\s(\d{2}:\d{2}:\d{2}[.,]\d{3})\n(.*(?:\r?\n(?!\r?\n).*)*)/gm;

  let m;
  let id = 1;
  const segments: Segment[] = [];
  // eslint-disable-next-line no-cond-assign
  while ((m = regex.exec(vtt)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex += 1;
    }

    segments.push({
      id,
      start: VTTToSeconds(m[1]),
      end: VTTToSeconds(m[2]),
      text: m[3],
    });
    id += 1;
  }
  return segments;
}
