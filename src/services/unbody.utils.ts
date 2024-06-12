import {ApiTypes} from "@/types/api.type";
import {unbody} from "@/services/unbody.service";
import {promptTemplates} from "@/utils/prompt-templates";

export const parseUserInput = async (userInput: string): Promise<ApiTypes.Rs.ParsedQuery | null> => {
    const promptHandler = promptTemplates.parseQuery;
    const res = await generate(promptHandler.create(userInput)).catch(e => null);
    if (!res) return null;
    const json = promptHandler.parse(res);
    if (!json) return null;

    const data = {
        ...json,
        original_user_input: userInput
    } as ApiTypes.Rs.ParsedQuery

    if(typeof data.subject_topic === "string"){
        data.subject_topic = [data.subject_topic]
    }

    return data;
}


export const generate = async (prompt: string): Promise<string> => {
    const {data: {generate}} = await
        unbody
            .get
            .textBlock
            .limit(1)
            .generate
            .fromOne(`${prompt} \n ignore this line {tagName}`)
            .exec();
    return generate[0].result;
}
