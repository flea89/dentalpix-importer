import path from 'path';
import * as fs from 'fs/promises';

import FileSystemStorage from '../services/Storage';
import { emptyFolder } from './utils';

describe('FileSytemStorage', () => {
  const fsRoot = path.join(__dirname, 'test-fss-folder');
  let fss: FileSystemStorage;
  afterEach(async () => {
    await emptyFolder(fsRoot);
  });
  beforeEach(() => {
    fss = new FileSystemStorage(fsRoot);
  });

  describe('writeFile', () => {
    it('should write a file', async () => {
      const target = 'afile.txt';
      const absTarget = path.join(fsRoot, 'afile.txt');
      const contentSrc = 'hi';

      await fss.writeFile(target, Buffer.from(contentSrc, 'utf-8'));
      const content = await fs.readFile(absTarget, 'utf-8');
      expect(content).toBe(contentSrc);
    });

    it('should not overwrite', async () => {
      const target = 'afile.txt';
      const absTarget = path.join(fsRoot, 'afile.txt');

      const contentSrc = 'hi';
      await fs.writeFile(absTarget, contentSrc);
      await expect(
        fss.writeFile(target, Buffer.from(contentSrc, 'utf-8'))
      ).rejects.toThrow();
    });
  });

  describe('exists', () => {
    it('should return true if uri already exists', async () => {
      const target = 'afile.txt';
      const absTarget = path.join(fsRoot, 'afile.txt');

      const contentSrc = 'hi';
      await fs.writeFile(absTarget, contentSrc);
      expect(await fss.exists(target)).toBe(true);
    });

    it('should return false if uri does not exist', async () => {
      expect(await fss.exists('arandomfile.txt')).toBe(false);
    });

    it('should return true if uri directory already exists', async () => {
      const target = 'adir';
      const absTarget = path.join(fsRoot, target);

      await fs.mkdir(absTarget);
      expect(await fss.exists(target)).toBe(true);
    });

    it('should return false if uri directory does not exist', async () => {
      expect(await fss.exists('adir')).toBe(false);
    });
  });

  describe('createDirectory', () => {
    it('should throw if already exists', async () => {
      const target = 'aDirectory';
      const absTarget = path.join(fsRoot, target);
      await fs.mkdir(absTarget);
      await expect(fss.createDirectory(target)).rejects.toThrow();
    });

    it('should create a directory', async () => {
      const target = 'aDirectory';
      fss.createDirectory(target);
      await expect(fs.open(path.join(target), 'wx')).rejects.toThrow();
    });
  });
});
