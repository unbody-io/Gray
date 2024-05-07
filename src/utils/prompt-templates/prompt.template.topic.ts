import { renderPrompt } from '@/utils/prompt-templates/prompt.utils';
import { PromptTemplate } from '@/types/prompt.types';
import { QueryContextItem } from '@/types/data.types';

`
     
`;

export const searchContextPrompt: PromptTemplate = {
    create: (contextItems: QueryContextItem[], query?: string) => {
        const hasQuery = !!query;
        const filters = contextItems.map(({ value }) => value).join(', ');
        const hasFilters = contextItems.length > 0;

        return renderPrompt({
            introduction: `Analyze texts from various blog posts based on the user's input. The user has ${
                hasQuery ? `searched for "${query}"` : ''
            }${
                hasFilters
                    ? `${
                          hasQuery ? '. and has' : ''
                      }expressed interest in following topics & filters: ` + filters
                    : ''
            }`,
            instructions: [
                `Step 1: Generate an introduction that elucidates the relevance of these inputs to the blog posts, without directly mentioning the posts or titles.`,
                `the user query is in human natural language, so the introduction should be tailored to the user's interests. For example if it is a question, the introduction should be a clear and concise answer to the question. And still be tailored to the user's selected topics and filters.`,
                `watch out sometimes user can ask questions without using question words or "?"`,
                '-This will a paragraph at the beginning of a search result page and it should show a clear understanding of the context of the search.\n',
                `-The introduction should target the user as our software is a human\n`,
                '-Avoid direct mentions of the blog post or its title.\n',
                hasQuery
                    ? `Step 2: Determine if user query:("${query}") is a question or not\n`
                    : '',
                hasQuery ? `Step 3: Extract key concepts up to 3, from user query\n` : ''
            ],
            examples: [],
            output: `output the result in the following JSON format: 
                        \`\`\`json{
                                "introduction": "your answer to user's query and context of the search",
                                ${hasQuery ? `"isQuestion": boolean,` : ''}
                                ${
                                    hasQuery
                                        ? `"concepts": ["concept1", "concept2", "concept3"]`
                                        : ''
                                }
                            }
                        \`\`\`
                `
        });
    },
    parse: <T>(rawResult: string): T => {
        try {
            const cleanJsonString = rawResult.replace(/```json|```/g, '');
            const data = JSON.parse(cleanJsonString);
            return data as T;
        } catch (e) {
            console.log('error', e);
            return JSON.parse(rawResult) as unknown as T;
        } finally {
        }
        return rawResult as unknown as T;
    }
};
