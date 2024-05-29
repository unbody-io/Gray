import {unbody} from "@/services/unbody.service";
import {fields} from "./config";
import {CDefaultGDocResponse} from "@/lib/content-plugins/gdocs/types";

export default async (): Promise<CDefaultGDocResponse> => {
    const { data: { payload } } = await unbody.get
        .googleDoc
        .select(...fields)
        .exec();

    return payload;
};


