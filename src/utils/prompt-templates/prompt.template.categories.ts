import {PromptTemplate} from "@/types/prompt.types";
import {renderPrompt} from "@/utils/prompt-templates/prompt.utils";

export const categoriesPrompt: PromptTemplate = {
    create: (topics: string[], entities: string[]) => renderPrompt(
        {
            introduction: "Analyze given articles which are about given topics and entities bellow, and Create 3 unique categories that organize the articles into thematic groups. These categories should",
            instructions: [
                `Topics: ${topics.join(", ")}`,
                `Entities: ${entities.join(", ")}`,
                "Titles should be imaginative, reflecting the content's diversity in a manner similar to engaging Netflix category names. You can combine different topics and genres in one category, jazz it up and make it interesting.",
                "For each category, provide:",
                "- **title**: A creative and descriptive title.",
                "- **summary**: A concise summary, one or two sentence, encapsulating the category's essence.",
                "- **topics**: A list of main topics related to this category, derived from given topics",
                "- **entities**: A list of main entities related to this category, derived from given entities."
            ],
            output: (`\`\`\`json [
                                {
                                  "title": "Creative Category Title 1",
                                  "summary": "Summary of what this category covers.",
                                  "topics": ["Related Topic A", "Related Topic B"],
                                  "entities": ["Related Entity A", "Related Entity B"]
                                },
                                ...
		            ] \`\`\``),
        }
    ),
    parse: <T>(rawResult: string): T  => {
        try{
            const cleanJsonString = rawResult.replace(/```json|```/g, '');
            const data = JSON.parse(cleanJsonString);
            return data as T;
        }catch (e){
            return JSON.parse(rawResult) as unknown as T;
        }finally {

        }
        return rawResult as unknown as T;
    }
}
