import { PromptInput } from '@/types/prompt.types';

export const renderPrompt = (prompt: PromptInput): string => {
    return [
        prompt.introduction,
        ...prompt.instructions.map((step) => `- ${step}`),
        prompt.examples && prompt.examples.length > 0
            ? `**Examples**:\n${prompt.examples
                  .map((example: string) => `- ${example}\n`)
                  .join('')}\n`
            : '',
        prompt.output
    ].join('\n');
};
