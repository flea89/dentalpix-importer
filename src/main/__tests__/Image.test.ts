import path from 'path';
import * as fs from 'fs/promises';
import Image from '../Image';

const qrImagePaths = [
  path.join(__dirname, 'test-images', 'qrcode.png'),
  path.join(__dirname, 'test-images', 'qrcode.jpg'),
];
const exifImagePath = path.join(__dirname, 'test-images', 'a.jpg');

describe('Image', () => {
  jest.setTimeout(20_000);
  const qrValue = 'hi';
  it('should identify qrCodes', async () => {
    await Promise.all(
      qrImagePaths.map(async (iPath) => {
        const i = new Image(iPath);
        const qrRead = await i.readQRCode();
        expect(i.qrCodeValue).toBe(JSON.stringify(qrValue));
        expect(qrRead).toBe(JSON.stringify(qrValue));
      })
    );
  });

  it('should identify qrCodes from buffer', async () => {
    await Promise.all(
      qrImagePaths.map(async (iPath) => {
        const b = await fs.readFile(iPath);
        const i = new Image(b);
        const qrRead = await i.readQRCode();
        expect(qrRead).toBe(JSON.stringify(qrValue));
        expect(i.qrCodeValue).toBe(JSON.stringify(qrValue));
      })
    );
  });

  it('should not identify images that are not QRCodes as QRCodes', async () => {
    const i = new Image(exifImagePath);
    await i.readQRCode();
    expect(i.qrCodeValue).toBe(undefined);
  });

  it('should read exif data', async () => {
    const i = new Image(exifImagePath);
    await i.readExif();
    expect((i.exif as Metadata['exif']).FocalLength).toBe(50);
  });
});
