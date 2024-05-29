import {ContentHandler} from "@/lib/content-plugins";
import {existsSync, writeFileSync} from "fs";
import {join} from "path";
import {DATA_FOLDER_PATH} from "@/prebuild-data/configs";
import {readFile} from "fs/promises";

export const createPostsSummary = (handler: ContentHandler<any, any>, posts: any[]) => {
    return [
        `${handler.label}:\n`,
        ...posts.map(handler.summarizer)
    ].join("\n")
}

export const saveToPublicData = async (filePath: string, data: any) => {
    console.log(`Writing to ${filePath}`);
    writeFileSync(filePath, JSON.stringify(data));
    console.log(`Wrote to ${filePath}`);
}

export const readExistingPosts = async <T extends {}>(plugin: ContentHandler<T, any>): Promise<T[]> => {
    const filePath = join(DATA_FOLDER_PATH, `${plugin.type}.json`);
    const isFileExists = existsSync(filePath);
    if (isFileExists) {
        try {
            return await readFile(filePath, "utf-8").then(data => JSON.parse(data.toString()) as T[]);
        } catch (e) {
            console.error(`Error reading ${plugin.type}`);
            return []
        }
    } else {
        return []
    }
};

