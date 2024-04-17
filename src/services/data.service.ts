import {SiteData} from "@/types/data.types";
import {readFile} from "fs/promises";

console.log("data")
// export const readSiteData = async (): Promise<SiteData> => {
//     return await readFile("public/data/site-data.json", "utf-8").then((data) => JSON.parse(data));
// }
export const readSiteData = async (): Promise<SiteData> => {
    try {
        const data = await readFile("public/data/site-data.json", "utf-8");
        console.log('Data read from file:', data); // Log the contents of the data variable
        if (!data.trim()) {
            throw new Error('Site data file is empty');
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        // Handle the error here, e.g., return a default value or throw a custom error
        throw new Error('Failed to parse site data');
    }
};