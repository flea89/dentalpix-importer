import exifReader from 'exif-reader';
import sharp from 'sharp';
import QRReader from 'qrcode-reader';

// TODO: give this a better name.
export class ImageErrorNotAvailable extends Error {
  constructor(message) {
    super(message);
    this.name = 'MyError';
  }
}

export default class Image {
  #sharpImage: sharp.Sharp;

  #hasMetadataBeenRead = false;

  #hasQrCodeBeenChecked = false;

  #exif: Metadata['exif'] | undefined;

  #qrCodeValue: string | undefined;

  constructor(image: Buffer | string) {
    this.#sharpImage = sharp(image);
  }

  get raw() {
    async function getRaw(image) {
      return image.raw().toBuffer();
    }
    return getRaw(this.#sharpImage);
  }

  get bitmap() {
    async function getBitmap(image) {
      const { data, info } = await image
        .raw()
        .toBuffer({ resolveWithObject: true });
      return {
        data,
        width: info.width,
        height: info.height,
      };
    }
    return getBitmap(this.#sharpImage);
  }

  async readExif() {
    if (!this.#hasMetadataBeenRead) {
      const metadata = await this.#sharpImage.metadata();
      if (!metadata.exif) {
        this.#exif = undefined;
      } else {
        const tiff = exifReader(metadata.exif);
        this.#exif = tiff.exif;
      }
      this.#hasMetadataBeenRead = true;
    }

    return this.#exif;
  }

  async readQRCode() {
    console.debug('Reading qrcode');
    if (!this.#hasQrCodeBeenChecked) {
      const qrReader = new QRReader();
      const bitmap = await this.bitmap;

      const qrCodeValuePromise = new Promise((resolve, reject) => {
        qrReader.callback = (err: object, v: string | null) => {
          if (err != null) {
            reject(err);
          } else {
            resolve(v);
          }
        };
        qrReader.decode(bitmap);
      });

      try {
        const qrcode: any = await qrCodeValuePromise;
        this.#qrCodeValue = qrcode.result;
      } catch (e) {
        this.#qrCodeValue = undefined;
      } finally {
        this.#hasQrCodeBeenChecked = true;
      }
    }

    return this.#qrCodeValue;
  }

  /**
   * Return metadata syncronously. It requires
   * the metadata to have been read already if not it throws
   */
  get exif() {
    if (this.#hasMetadataBeenRead === false) {
      throw new ImageErrorNotAvailable(
        'Exif not available. Need to readExif() first.'
      );
    }
    return this.#exif;
  }

  /**
   * Return metadata syncronously. It requires
   * the metadata to have been read already if not it throws.
   */
  get qrCodeValue() {
    if (this.#hasQrCodeBeenChecked === null) {
      throw new ImageErrorNotAvailable(
        'QRCode not checked. Need to readQRCode() first.'
      );
    }
    return this.#qrCodeValue;
  }
}
