import { PromptTemplate } from "@/types/prompt.types";
import { QueryContextItem } from "@/types/data.types";

export const readContextPrompt: PromptTemplate = {
  create: (
    contextItems: QueryContextItem[],
    query?: string,
    lastBlock?: string,
    firstPage: boolean = false
  ) => {
    const firstPageNote =
      !lastBlock && firstPage
        ? ` Start with a conversational tone linking to the query.`
        : "";
    const lastBlockNote = lastBlock
      ? `Continue from the last block: ${lastBlock}.\n\n`
      : "";

    return `
            Glue these 3 text blocks into one cohesive narrative with 3 paragraphs. 
            Use the original blocks as the content of the paragraphs with some glue sentences at the end or beginning of each paragraph.
            ${firstPageNote}
            ${lastBlockNote}
        `.trim();
  },
  parse: <T>(rawResult: string): T => {
    return rawResult as T;
  },
};
