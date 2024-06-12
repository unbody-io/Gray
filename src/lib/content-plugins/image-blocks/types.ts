import {GetQueryResult} from "@unbody-io/ts-client";
import {IImageBlock} from "@unbody-io/ts-client/build/core/documents";
import {fields} from "./config";

export type Fields = typeof fields[number];

// @ts-ignore
export type CDefaultImageBlockResponse = GetQueryResult<Pick<IImageBlock, Fields>>;

export type CDefaultImageBlockResponsePayload = CDefaultImageBlockResponse['payload'];
export type CDefaultImageBlock = Pick<CDefaultImageBlockResponsePayload[number], Fields>;
