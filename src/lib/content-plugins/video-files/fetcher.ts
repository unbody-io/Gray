import {unbody} from "@/services/unbody.service";
import {fields} from "./config";
import {CDefaultVideoFileResponsePayload, Fields} from "./types";

export default async (path: string, _fields?: Fields[]): Promise<CDefaultVideoFileResponsePayload> => {
    const { data: { payload } } = await unbody.get
        .videoFile
        // @ts-ignore
        .select(...(_fields || fields))
        .where(({Like}) => ({
            pathString: Like(path)
        }))
        .exec();

    return payload;
};
