import {join} from "path";

const APP_PATH = process.cwd();
export const DATA_FOLDER_PATH = join(APP_PATH, "/public/data");
export const SITE_DATA_PATH = join(DATA_FOLDER_PATH, "site-data.json");
export const CATEGORY_DATA_PATH = join(DATA_FOLDER_PATH, "categories.json");
export const POSTS_DATA_FOLDER_PATH = join(DATA_FOLDER_PATH, "posts");

