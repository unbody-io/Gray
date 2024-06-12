import type {NextApiRequest, NextApiResponse} from 'next'
import {IGoogleDoc} from "@unbody-io/ts-client/build/core/documents";
import {readFile} from "fs/promises";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IGoogleDoc|null>
) {
    return res.status(200).json(
        await readFile("public/data/site-data.json", "utf-8").then((data) => JSON.parse(data))
    );
}
