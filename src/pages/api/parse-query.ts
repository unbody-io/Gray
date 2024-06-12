import { NextApiRequest, NextApiResponse } from "next";
import {ApiTypes} from "@/types/api.type";

import {parseUserInput} from "@/services/unbody.utils";
import {StructuredUserInput, UserInputType} from "@/types/prompt.types";

export default async function Handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiTypes.Rs.ParsedQuery|null>
) {
    const { input, filters = [] } = req.body as ApiTypes.Rq.ParsedQuery;

    if (req.method !== "POST") {
        return res.status(405).json(null)
    }

    if (!input && filters.length === 0) {
        return res.status(400).json(null)
    }

    if(!input){
        const structuredPrompt: StructuredUserInput = {
            concepts_key_terms: [],
            constraints: "",
            context: "",
            core_question: "",
            original_user_input: "",
            output_format: "",
            specific_task: "",
            subject_topic: "",
            type: UserInputType.SearchQuery,
            requires_search: false,
        }
        return res.status(200).json(structuredPrompt);
    }

    try {
        const structuredPrompt = await parseUserInput(input);
        console.log("structuredPrompt", structuredPrompt);
        return res.status(200).json(structuredPrompt);
    }catch (e){
        console.error(e)
        return res.status(500).json(null);
    }
}
