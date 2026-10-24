import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const source = new URL("../public/favicon.svg", import.meta.url);
const sizes = [16, 32, 48, 64];
const images = await Promise.all(
  sizes.map((size) => sharp(fileURLToPath(source), { density: 288 })
    .resize(size, size).png().toBuffer()),
);
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile(new URL("../public/favicon.ico", import.meta.url), Buffer.concat([header, ...images]));

for (const [filename, size] of [["favicon-32.png", 32], ["favicon-192.png", 192], ["apple-touch-icon.png", 180]]) {
  await sharp(fileURLToPath(source), { density: 288 })
    .resize(size, size)
    .png()
    .toFile(fileURLToPath(new URL(`../public/${filename}`, import.meta.url)));
}
