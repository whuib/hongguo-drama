import { danmakuEmojiFiles } from './danmakuEmoji.mjs';

const EMOJI_TOKEN = /(\[[^[\]\s]{1,8}\])/u;
const MAX_UNITS = 80;

export function createDanmakuDisplay(content, count = 1) {
  const units = [];
  // Captured bracket tokens occupy the odd slots. Unknown tokens are ordinary text.
  for (const [index, part] of content.split(EMOJI_TOKEN).entries()) {
    const file = index % 2 ? danmakuEmojiFiles.get(part.slice(1, -1)) : undefined;
    if (file) {
      units.push({ src: `./danmaku-emoji/${file}`, alt: part });
    } else {
      for (const char of part) {
        units.push(char);
        if (units.length > MAX_UNITS) break;
      }
    }
    if (units.length > MAX_UNITS) break;
  }
  if (units.length > MAX_UNITS) units.splice(MAX_UNITS - 1, 2, '…');

  const segments = [];
  let text = '';
  let plain = '';
  let widthEm = 1;
  for (const unit of units) {
    if (typeof unit === 'string') {
      plain += unit;
      text += unit;
      widthEm++;
    } else {
      if (plain) segments.push(plain);
      plain = '';
      segments.push(unit);
      text += unit.alt;
      widthEm += 1.15;
    }
  }
  if (plain) segments.push(plain);
  const countLabel = count > 1 ? `× ${count}` : '';
  // Reserve room for the full-size count and its left margin when scheduling lanes.
  if (countLabel) widthEm += countLabel.length + 0.3;
  return { text, segments, count, countLabel, widthEm };
}
