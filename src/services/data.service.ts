import {SiteData} from "@/types/data.types";
import {readFile} from "fs/promises";
import {SITE_DATA_PATH} from "@/prebuild-data/configs";

export const readSiteData = async (): Promise<SiteData> => {
    return await readFile(SITE_DATA_PATH, "utf-8").then((data) => JSON.parse(data));
}
