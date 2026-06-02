import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync, promises as fsPromises } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

interface GraphQLUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}

export type UploadFile = Express.Multer.File | GraphQLUpload;

@Injectable()
export class FileStorageService {
  private readonly uploadDir = join(process.cwd(), 'uploads', 'profiles');

  async saveFile(file: UploadFile): Promise<string> {
    this.ensureUploadDir();
    const originalName = this.getOriginalName(file);
    const filename = this.buildFilename(originalName);
    const filePath = join(this.uploadDir, filename);

    if ('buffer' in file && file.buffer) {
      await fsPromises.writeFile(filePath, file.buffer);
      return filePath;
    }

    if ('createReadStream' in file && typeof file.createReadStream === 'function') {
      const readStream = file.createReadStream();
      const writeStream = createWriteStream(filePath);
      await streamPipeline(readStream, writeStream);
      return filePath;
    }

    throw new BadRequestException('Unsupported upload object');
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (existsSync(filePath)) {
        await fsPromises.unlink(filePath);
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete file');
    }
  }


  private ensureUploadDir() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private buildFilename(originalName: string): string {
    const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${Date.now()}-${safeName}`;
  }

  private getOriginalName(file: UploadFile): string {
    if ('originalname' in file && file.originalname) {
      return file.originalname;
    }
    return file.filename;
  }
}
