"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToS3 = exports.copyS3Folder = exports.fetchS3Folder = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT
});
const fetchS3Folder = async (key, localPath) => {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET ?? "",
            Prefix: key
        };
        const response = await s3.listObjectsV2(params).promise();
        if (response.Contents) {
            // Use Promise.all to run getObject operations in parallel
            await Promise.all(response.Contents.map(async (file) => {
                const fileKey = file.Key;
                if (fileKey) {
                    const getObjectParams = {
                        Bucket: process.env.S3_BUCKET ?? "",
                        Key: fileKey
                    };
                    const data = await s3.getObject(getObjectParams).promise();
                    if (data.Body) {
                        const fileData = data.Body;
                        const filePath = `${localPath}${fileKey.replace(key, "")}`;
                        //@ts-ignore
                        await writeFile(filePath, fileData);
                        console.log(`Downloaded ${fileKey} to ${filePath}`);
                    }
                }
            }));
        }
    }
    catch (error) {
        console.error('Error fetching folder:', error);
    }
};
exports.fetchS3Folder = fetchS3Folder;
async function copyS3Folder(sourcePrefix, destinationPrefix, continuationToken) {
    try {
        // List all objects in the source folder
        const listParams = {
            Bucket: process.env.S3_BUCKET || "",
            Prefix: sourcePrefix,
            ContinuationToken: continuationToken
        };
        const listedObjects = await s3.listObjectsV2(listParams).promise();
        if (!listedObjects.Contents || listedObjects.Contents.length === 0)
            return;
        // Copy each object to the new location
        await Promise.all(listedObjects.Contents.map(async (object) => {
            if (!object.Key)
                return;
            let destinationKey = object.Key.replace(sourcePrefix, destinationPrefix);
            let copyParams = {
                Bucket: process.env.S3_BUCKET ?? "",
                CopySource: `${process.env.S3_BUCKET}/${object.Key}`,
                Key: destinationKey
            };
            console.log(copyParams);
            await s3.copyObject(copyParams).promise();
            console.log(`Copied ${object.Key} to ${destinationKey}`);
        }));
        // Check if the list was truncated and continue copying if necessary
        if (listedObjects.IsTruncated) {
            listParams.ContinuationToken = listedObjects.NextContinuationToken;
            await copyS3Folder(sourcePrefix, destinationPrefix, continuationToken);
        }
    }
    catch (error) {
        console.error('Error copying folder:', error);
    }
}
exports.copyS3Folder = copyS3Folder;
function writeFile(filePath, fileData) {
    return new Promise(async (resolve, reject) => {
        await createFolder(path_1.default.dirname(filePath));
        fs_1.default.writeFile(filePath, fileData, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
function createFolder(dirName) {
    return new Promise((resolve, reject) => {
        fs_1.default.mkdir(dirName, { recursive: true }, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
const saveToS3 = async (key, filePath, content) => {
    const params = {
        Bucket: process.env.S3_BUCKET ?? "",
        Key: `${key}${filePath}`,
        Body: content
    };
    await s3.putObject(params).promise();
};
exports.saveToS3 = saveToS3;
//# sourceMappingURL=awt.js.map