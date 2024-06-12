import {unbody} from "@/services/unbody.service";

import {CDefaultGDocResponsePayload} from "./types";
import {fields} from "./config";
import {Fields} from "./types";

export default async (path: string, _fields?: Fields[]): Promise<CDefaultGDocResponsePayload> => {
    const { data: { payload } } = await unbody.get
        .googleDoc
        // @ts-ignore
        .select(...(_fields || fields))
        .where(({Like}) => ({
            pathString: Like(path)
        }))
        .exec();

    return payload;
};


