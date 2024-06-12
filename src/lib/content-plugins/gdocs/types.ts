import {GetQueryResult} from "@unbody-io/ts-client";
import {IGoogleDoc, IImageBlock, ITextBlock} from "@unbody-io/ts-client/build/core/documents";
import {fields} from "./config";

export type Fields = typeof fields[number];

export type CDefaultGDocResponse = GetQueryResult<Pick<IGoogleDoc, Fields>>;
export type CDefaultGDocResponsePayload = CDefaultGDocResponse['payload'];
export type CDefaultGDoc = Pick<CDefaultGDocResponsePayload[number], Fields>;

export type CDefaultGDocWithContent = CDefaultGDoc & {
    blocks: {
        ImageBlock?: IImageBlock[]
        TextBlock?: ITextBlock[]
    }
};
