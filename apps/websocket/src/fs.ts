import fs from "fs";
import { File, Type } from "@repo/types/src"
import path from 'path'

type FileType = Partial<File>

export const fetchDir = (dir: string, baseDir: string): Promise<FileType[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files.map(file => {
          return { type: file.isDirectory() ? Type.DIRECTORY : Type.FILE, name: file.name, path: path.join(baseDir, `/${file.name}`) }
        }
        ))
      }
    });
  });
}

export const fetchFileContent = (file: string): Promise<string> => {
  console.log(file, "sdfffffsdfsdfsdfsdksdkfjklsdfjklsdfjfklsdfjklsdfj")
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
}

export const saveFile = async (file: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, "utf8", (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
