import { F_OK } from 'constants';
import * as fs from 'fs/promises';
import path from 'path';

export interface WriteOptions {
  readonly overwrite?: boolean;
}

export interface DataStorageProvider {
  /**
   * Write data to a file, replacing its entire contents.
   *
   * @param uri The uri of the file.
   * @param content The new content of the file.
   * @param options Defines if missing files should overwrite existing or raise if not.
   * @throws {FileExists}
   */
  writeFile(
    uri: string,
    content: Uint8Array,
    options?: WriteOptions
  ): Promise<void>;

  /**
   * Check if given uri exists.
   * @param uri
   * @returns
   */
  exists(uri: string): Promise<boolean>;

  /**
   * Create a new directory.
   *
   * @param uri The uri of the new folder.
   * @throws [`FileExists`](#FileSystemError.FileExists) when `uri` already exists.
   */
  createDirectory(uri: string): Promise<void>;
}

export class FileExists extends Error {}

/**
 * @todo Handle file permission?
 */
export default class FileSystemStorage implements DataStorageProvider {
  constructor(private root = '') {}

  async writeFile(
    uri: string,
    content: Uint8Array,
    { overwrite }: WriteOptions = { overwrite: false }
  ): Promise<void> {
    const resourcePath = this.getPath(uri);

    if (!overwrite && (await this.exists(uri))) {
      throw new FileExists();
    }

    return fs.writeFile(resourcePath, content);
  }

  async exists(uri: string) {
    const resourcePath = this.getPath(uri);

    try {
      await fs.open(path.join(resourcePath), 'r');
      return true;
      // eslint-disable-next-line no-empty
    } catch (err) {
      const error: any = err;
      if (error.code === 'ENOENT') {
        return false;
      }
      throw err;
    }
  }

  async createDirectory(uri: string) {
    const resourcePath = this.getPath(uri);
    if (await this.exists(uri)) {
      throw new FileExists();
    }
    return fs.mkdir(resourcePath);
  }

  private getPath(relativePath) {
    return path.join(this.root, relativePath);
  }
}
