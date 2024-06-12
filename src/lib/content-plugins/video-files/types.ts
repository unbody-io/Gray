import {GetQueryResult} from "@unbody-io/ts-client";
import {IVideoFile} from "@unbody-io/ts-client/build/core/documents";

import {fields} from "./config";

export type Fields = typeof fields[number];

// @ts-ignore
export type CDefaultVideoFileResponse = GetQueryResult<Pick<IVideoFile, Fields>>;
export type CDefaultVideoFileResponsePayload = CDefaultVideoFileResponse['payload'];
export type CDefaultVideoFile = Pick<CDefaultVideoFileResponsePayload[number], Fields>;

export type CDefaultVideoFileWithContent = CDefaultVideoFile & {}
