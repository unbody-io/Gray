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

        intro += `In this case, your job is to generate a response based on the provided the metadata of videos to complete the following task:\n`;

        // Construct the dynamic parts based on input type
        switch (input.type) {
            case "Search Query":
                prompt += `${intro}\nThe given videos are the search results for for the following keywords:\n`;
                prompt += input.concepts_key_terms.join(", ") + ".\n";
                prompt += "Generate a concise overview summary of this search based on the provided videos:\n";
                prompt += `Make sure to ignore any irrelevant information and focus only on responding to ${input.original_user_input}.\n`;
                break;

            case "Question":
                prompt += `${intro}\nAnswer the following question based on the provided videos:\n`;
                prompt += `**Question:** ${input.core_question}\n`;
                // prompt += "Use specific information from the records only. If the records do not provide enough information, indicate that more details are needed:\n";
                break;

            case "Instruction":
                prompt += `${intro}\nFollow this instruction using the provided records:\n`;
                prompt += `**Task:** ${input.specific_task}\n`;
                prompt += `**Subject/Topic:** ${subjectTopic}\n`;
                // prompt += "Ensure that your response is based solely on the provided records. If the records are insufficient, ask for additional information:\n";
                break;

            case "Complex Task":
                prompt += `${intro}\nComplete this complex task using the provided records:\n`;
                prompt += `**Task:** ${input.specific_task}\n`;
                prompt += `**Core Question:** ${input.core_question}\n`;
                prompt += `**Subject/Topic:** ${subjectTopic}\n`;
                break;

            default:
                // prompt += `${intro}\nUnrecognized input type. Use the following details to generate an appropriate response based solely on the provided records:\n`;
                // prompt += JSON.stringify(input, null, 2) + "\n";
                break;
        }

        prompt += `**Output Format:** ${outputFormat}\n`;
        prompt += `**additional information about entire ${siteData.context.siteType}**:\n${siteData.context.contentSummary}`;

        return prompt;
    },
    parse: (output: string) => {
        return output;
    }
};

export default handler;


