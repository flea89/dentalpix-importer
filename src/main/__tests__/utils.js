import QRCode from 'qrcode';
import path from 'path';
import * as fs from 'fs/promises';
import sharp from 'sharp';
import dateFormat from 'date-format';

let now = new Date()

const testImageFolder = path.join(__dirname, 'generated-test-images');

const exif: Metadata['exif'] = {
  FocalLength: '45',
};

const defaultimageDataUrl =
  'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==';

// eslint-disable-next-line import/prefer-default-export
export async function createImage({
  date = undefined,
  name = `${Math.floor(Math.random() * 1e6)}`,
  save = true,
  qrCode,
} = {}) {
  let image;
  let imageDataUrl;
  let created;
  const target = path.join(testImageFolder, `${name}.jpg`);

  if (!date) {
    // Make sure subsequent call to create image
    // create images with a later created date.
    created = new Date();
    created.setSeconds(now.getSeconds() + 1);
    now = created;
  } else {
    now = created;
  }

  if (qrCode) {
    imageDataUrl = await QRCode.toDataURL(JSON.stringify(qrCode));
  } else {
    imageDataUrl = defaultimageDataUrl;
  }

  image = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');

  image = sharp(Buffer.from(image, 'base64')).jpeg();
  exif.DateTimeOriginal = dateFormat.asString('yyyy:MM:dd hh:mm:ss', created);


  image = image.withMetadata({
    exif: {
      IFD0: exif,
      ifd0: exif,
      IFD1: exif,
      IFD2: exif,
      Ifd2: exif,
      ExifIFD: exif,
    },
  });

  if (save) {
    await image.toFile(target);
  }

  return image;
}

export async function emptyFolder(folder = testImageFolder) {
  const files = await fs.readdir(folder);
  return Promise.all(
    files.map(async (f) => {
      const p = path.join(folder, f);
      const stat = await fs.stat(p);
      if (stat.isDirectory()) {
        return fs.rm(p, { recursive: true, force: true });
      }

      return fs.unlink(p);
    })
  );
}
