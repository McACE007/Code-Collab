"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFile = exports.fetchFileContent = exports.fetchDir = void 0;
const fs_1 = __importDefault(require("fs"));
const types_1 = require("./types");
const path_1 = __importDefault(require("path"));
const fetchDir = (dir, baseDir) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readdir(dir, { withFileTypes: true }, (err, files) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(files.map(file => {
                    return { type: file.isDirectory() ? types_1.Type.DIRECTORY : types_1.Type.FILE, name: file.name, path: path_1.default.join(baseDir, `/${file.name}`) };
                }));
            }
        });
    });
};
exports.fetchDir = fetchDir;
const fetchFileContent = (file) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(file, "utf8", (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
exports.fetchFileContent = fetchFileContent;
const saveFile = async (file, content) => {
    return new Promise((resolve, reject) => {
        fs_1.default.writeFile(file, content, "utf8", (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};
exports.saveFile = saveFile;
//# sourceMappingURL=fs.js.map