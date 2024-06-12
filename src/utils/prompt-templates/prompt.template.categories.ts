import {PromptTemplate} from "@/types/prompt.types";
import {renderPrompt} from "@/utils/prompt-templates/prompt.utils";
import {CategoryRaw, SiteContext} from "@/types/data.types";

export const categoriesPrompt: PromptTemplate<CategoryRaw[]|null> = {
    create: ({autoTopics, autoEntities}: SiteContext) => renderPrompt(
        {
            // introduction: "Analyze given articles which are about given topics and entities bellow, and Create 3 unique categories that organize the articles into thematic groups. These categories should",
            introduction: "Here is a list of mixed documents and files we have. For each item, the title and a summary of the file is provided. All these docs and files are about set of topics and keywords. Analyze about given topics and entities bellow, and Create 5 unique categories that organize the docs and files into thematic groups.",
            instructions: [
                `Topics: ${autoTopics.join(", ")}`,
                `Entities: ${autoEntities.join(", ")}`,
                "Title of each category should be imaginative, reflecting the content's diversity in a manner similar to engaging Netflix category names. You can combine different topics and genres in one category, jazz it up and make it interesting.",
                "For each category, provide:",
                "- **title**: A creative and descriptive title.",
                "- **summary**: A concise summary, one or two sentence, encapsulating the category's essence.",
                "- **topics**: A list of main topics related to this category, derived from given topics",
                "- **entities**: A list of main name entities related to this category, derived from given entities.",
                "ignore this line - {tagName}"
            ],
            output: (`Output has to be exactly like the following JSON format:\n \`\`\`json [
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
    parse: (rawResult: string): CategoryRaw[]|null  => {
        try{
            const cleanJsonString = rawResult.replace(/```json|```/g, '');
            const data = JSON.parse(cleanJsonString.toLowerCase());
            return data as CategoryRaw[];
        }catch (e){
            return JSON.parse(rawResult) as unknown as CategoryRaw[];
        }finally {

        }
        return null;
    }
}
