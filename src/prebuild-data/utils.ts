import { writeFileSync} from "fs";

export const saveToPublicData = async (filePath: string, data: any) => {
    console.log(`Writing to ${filePath}`);
    writeFileSync(filePath, JSON.stringify(data));
    console.log(`Wrote to ${filePath}`);
}

