import { PromptHandlerFn } from "@/types/plugins.types";

const handler: PromptHandlerFn = {
    create: (siteConfigs, siteData, input) => {
        let prompt = "";
        let intro = siteConfigs.copy.personaPromptInstruction(siteData);

        const outputFormat = input.output_format.length > 0
            ? input.output_format
            : siteConfigs.copy.promptsOutputFormatInstruction(input);

        const subjectTopic = typeof input.subject_topic === "string"
            ? input.subject_topic.split(",")
            : input.subject_topic;

        intro += `In this case, your job is to generate a response based on provided the metadata of images to complete the following task:\n`;
        // intro += ` Use only the provided content from Google Docs to complete the following task. If the records do not contain enough relevant information, inform the user that additional details are required:\n`;

        // Construct the dynamic parts based on input type
        switch (input.type) {
            case "Search Query":
                prompt += `${intro}\nThese are the relevant search results for the following keywords:\n`;
                prompt += input.concepts_key_terms.join(", ") + ".\n";
                prompt += "Generate a concise overview summary of this search based solely on the provided images metadata. Do not use general knowledge or make assumptions:\n";
                break;

            case "Question":
                prompt += `${intro}\nAnswer the following question based on the provided images metadata:\n`;
                prompt += `**Question:** ${input.core_question}\n`;
                prompt += "Use specific information from the records only. If the records do not provide enough information, indicate that more details are needed:\n";
                break;

            case "Instruction":
                prompt += `${intro}\nFollow this instruction using the provided images metadata:\n`;
                prompt += `**Task:** ${input.specific_task}\n`;
                prompt += `**Subject/Topic:** ${subjectTopic}\n`;
                prompt += `**Output Format:** ${outputFormat}\n`;
                // prompt += "Ensure that your response is based solely on the provided records. If the records are insufficient, ask for additional information:\n";
                break;

            case "Complex Task":
                prompt += `${intro}\nComplete this complex task using the provided images metadata:\n`;
                prompt += `**Task:** ${input.specific_task}\n`;
                prompt += `**Core Question:** ${input.core_question}\n`;
                prompt += `**Subject/Topic:** ${subjectTopic}\n`;
                prompt += `**Output Format:** ${outputFormat}\n`;
                // prompt += "Use only the provided records for this task. If more information is needed, clearly state that the records are not sufficient and request additional details:\n";
                break;

            default:
                // prompt += `${intro}\nUnrecognized input type. Use the following details to generate an appropriate response based solely on the provided records:\n`;
                // prompt += JSON.stringify(input, null, 2) + "\n";
                break;
        }

        prompt += `**additional information about entire ${siteData.context.siteType}**:\n${siteData.context.contentSummary}`;

        return prompt;
    },
    parse: (output: string) => {
        return output;
    }
};

export default handler;
