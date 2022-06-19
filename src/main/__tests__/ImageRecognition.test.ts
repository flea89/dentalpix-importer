import * as fs from 'fs/promises';
import path from 'path';
import categorize from '../services/ImageRecognition';
import { createImage, emptyFolder } from './utils';

const images = [
  {
    folder: 'a',
  },
  'anImage',
  'anImage',
  {
    folder: 'b',
  },
  'anImage',
  'anImage',
];

describe('App', () => {
  jest.setTimeout(10000);

  beforeAll(async () => {
    await Promise.all(
      images.map((i) => {
        if (typeof i === 'string') {
          return createImage();
        }
        return createImage({
          qrCode: i,
        });
      })
    );
  });

  afterAll(async () => {
    await emptyFolder();
  });

  it('should exist', () => {
    expect(categorize).toBeTruthy();
  });

  it('should add all to category', async () => {
    const filesNames = await fs.readdir(
      path.join(__dirname, 'generated-test-images')
    );
    const files = await Promise.all(
      filesNames.map((f) =>
        fs.readFile(path.join(__dirname, 'generated-test-images', f))
      )
    );

    const map = await categorize(files);
    expect(map.get('a')?.length).toBe(2);
  });
});
