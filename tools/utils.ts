import fs from 'fs';
import path from 'path';

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
export function lowercaseFirst(s: string): string {
  return s.charAt(0).toLocaleLowerCase() + s.slice(1);
}

export function writeFile(filepath: string, content: string) {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }
  fs.writeFileSync(filepath, content);
  console.log(`Created: ${filepath}`);
}
