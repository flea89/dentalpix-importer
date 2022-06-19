import Image from '../Image';

type CategorizedImages = Map<string, Image[]>;

async function categorize(buffers: Buffer[]): Promise<CategorizedImages> {
  let images: Array<Image> = buffers.flatMap((b) => {
    try {
      return [new Image(b)];
    } catch (e) {
      console.error('Not an image');
      return [];
    }
  });

  // read exif data and QRcodes
  console.debug('About to read exif and QRCodes');
  await Promise.all(images.flatMap((i) => [i.readExif(), i.readQRCode()]));
  console.debug('Read images exif and QRCodes');

  // For now exclude file that aren't images and without exif data.
  images = images.filter((i) => i.exif);

  // Order the images
  const orderedImages = images.sort((a: Image, b: Image) => {
    const aExif = a.exif as Metadata['exif'];
    const bExif = b.exif as Metadata['exif'];
    return (
      new Date(aExif.DateTimeOriginal).getTime() -
      new Date(bExif.DateTimeOriginal).getTime()
    );
  });

  const imagesMap = new Map().set('noCategory', []);

  orderedImages.reduce<Map<string, Image[]>>((imagesByCategory, image) => {
    // If an image is a delimiter create a bucket for it
    if (image.qrCodeValue) {
      let folder;
      try {
        folder = JSON.parse(image.qrCodeValue).folder;
        imagesByCategory.set(folder, []);
      } catch (e) {
        // Do nothing a QRcode that does not have folder info
        console.warn('Not a valid QRCode');
      }
    } else {
      const lastIdentifierAdded = [...imagesMap.keys()].pop();
      imagesMap.get(lastIdentifierAdded).push(image);
    }

    return imagesByCategory;
  }, imagesMap);

  return imagesMap;
}

export default categorize;
