import {PromptTemplate} from "@/types/prompt.types";
import {renderPrompt} from "@/utils/prompt-templates/prompt.utils";

export const entitiesPrompt: PromptTemplate<any> = {
    create: () => renderPrompt(
        {
            introduction: "Analyze given articles and Identify and list the entities (e.g., people, places, organizations) mentioned in the articles.",
            instructions: [
                "Include both named and nominal entities to capture the context and enrich the blog introduction and categories.",
                "format each entity in lowercase, and replace spaces with hyphens (e.g., 'elon-musk', 'new-york-times')."
            ],
            output: (`\`\`\`json [{n: "elon-musk", t: "person"}, {n: "amsterdam", t: "city"}] \`\`\``),
        }
    ),
    parse: <T>(rawResult: string): T  => {
        try{
            const cleanJsonString = rawResult.replace(/```json|```/g, '');
            const data = JSON.parse(cleanJsonString);
            return data as T;
        }catch (e){
            return JSON.parse(rawResult) as unknown as T;
        }
    }
}
