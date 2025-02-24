'use server';

import fs from 'fs';
import path from 'path';

const POSTS_PATH = path.join(process.cwd(), 'app/blog');

interface FileSystem {
  readDirectory: (dirPath: string) => Promise<string[]>;
  isDirectory: (path: string) => Promise<boolean>;
  readFile: (filePath: string) => Promise<string>;
}

class NodeFileSystem implements FileSystem {
  async readDirectory(dirPath: string): Promise<string[]> {
    return fs.readdirSync(dirPath);
  }

  async isDirectory(path: string): Promise<boolean> {
    return fs.statSync(path).isDirectory();
  }

  async readFile(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, 'utf-8');
  }
}

const fileSystem = new NodeFileSystem();

export async function getCategories(): Promise<string[]> {
  try {
    const paths = await fileSystem.readDirectory(POSTS_PATH);
    const categories = [];

    for (const path of paths) {
      if (await fileSystem.isDirectory(`${POSTS_PATH}/${path}`)) {
        categories.push(path);
      }
    }

    return categories;
  } catch {
    return [];
  }
}

export async function getCategoryFiles(category: string): Promise<string[]> {
  try {
    const categoryPath = path.join(POSTS_PATH, category);
    const files = await fileSystem.readDirectory(categoryPath);

    return files.filter((file) => /\.mdx?$/.test(file));
  } catch {
    return [];
  }
}

export async function readPostFile(
  category: string,
  fileName: string,
): Promise<string | null> {
  try {
    const filePath = path.join(POSTS_PATH, category, fileName);

    return await fileSystem.readFile(filePath);
  } catch {
    return null;
  }
}
