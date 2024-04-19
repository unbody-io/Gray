import { SiteData } from "@/types/data.types";
import { readFile } from "fs/promises";

export const readSiteData = async (): Promise<SiteData> => {
  return await readFile("public/data/site-data.json", "utf-8").then((data) =>
    JSON.parse(data)
  );
};
