import {GetQueryResult} from "@unbody-io/ts-client";
import {IGoogleDoc} from "@unbody-io/ts-client/build/core/documents";
import {fields} from "./config";

type Fields = typeof fields[number];

export type CDefaultGDocResponse = GetQueryResult<Pick<IGoogleDoc, Fields>>['payload'];
export type CDefaultGDoc = Pick<CDefaultGDocResponse[number], Fields>;
