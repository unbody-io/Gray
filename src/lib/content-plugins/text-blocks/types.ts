import {GetQueryResult} from "@unbody-io/ts-client";
import {ITextBlock} from "@unbody-io/ts-client/build/core/documents";
import {fields} from "./config";

export type Fields = typeof fields[number];

// @ts-ignore
export type CDefaultTextBlockResponse = GetQueryResult<Pick<ITextBlock, Fields>>;

export type CDefaultTextBlockResponsePayload = CDefaultTextBlockResponse['payload'];
export type CDefaultTextBlock = Pick<CDefaultTextBlockResponsePayload[number], Fields>;
