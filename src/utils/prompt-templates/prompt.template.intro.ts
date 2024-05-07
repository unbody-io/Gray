import { renderPrompt } from '@/utils/prompt-templates/prompt.utils';
import { PromptTemplate } from '@/types/prompt.types';

export const introPrompt: PromptTemplate = {
    create: (topics: string[], entities: string[]) =>
        renderPrompt({
            introduction:
                'Analyze given articles summary, and based on the topics and entities, create a blog introduction.',
            instructions: [
                `Topics: ${topics.join(', ')}`,
                `Entities: ${entities.join(', ')}`,
                'Step 1: Use topics & entities and compose a fluid & engaging short(280-380 chars) paragraph with a smart tone, akin to an editor’s note that invites readers into the blog.',
                'Step 2: Once you created the intro, then identify all topics and entities as well as their synonyms and related terms and highlight all of them in the introduction by wrapping them in square brackets.'
            ],
            examples: [
                // "For cohesive and similar topics: \"This blog post is where [topic-1] and [topic-2] come together...\"",
                // "For numerous and diverse topics: \"Dive into a world where [topic-1, e.g., 'Technology'] meets [topic-2, e.g., 'Art'], [topic-3, e.g., 'Culture'], and beyond...\""
            ],
            output: 'output the result in the following JSON format:\n```json\n{\n  "intro": "This blog is about topic-one and topic-two ..."\n}\n```'
        }),
    parse: <T>(rawResult: string): T => {
        try {
            const cleanJsonString = rawResult.replace(/```json|```/g, '');
            const data = JSON.parse(cleanJsonString);
            return data.intro as T;
        } catch (e) {
            return JSON.parse(rawResult).intro as unknown as T;
        } finally {
        }
        return rawResult as unknown as T;
    }
};
