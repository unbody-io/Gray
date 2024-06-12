import {unbody} from "@/services/unbody.service";

import {CDefaultImageBlockResponsePayload} from "./types";
import {fields} from "./config";
import {Fields} from "./types";

export default async (path: string, _fields?: Fields[]): Promise<CDefaultImageBlockResponsePayload> => {
    const { data: { payload } } = await unbody.get
        .imageBlock
        // @ts-ignore
        .select(...(_fields || fields))
        .where(({Like}) => ({
            document: {
                GoogleDoc: {
                    pathString: Like(path)
                }
            }
        }))
        .exec();

    return payload;
};


