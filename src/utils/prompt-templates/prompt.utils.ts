import {PromptInput} from "@/types/prompt.types";

export const renderPrompt = (prompt: PromptInput): string => {
    return [
        prompt.introduction,
        ...prompt.instructions.map(step => `- ${step}`),
        prompt.examples && prompt.examples.length>0? `**Examples**:\n${prompt.examples.map((example: string) => `- ${example}\n`).join("")}\n` : "",
        `${prompt.output}`,
        `output:`,
    ].join("\n")
}

export const parseJsonOutput = <T>(rawResult: string): T|null => {
    try {
        console.log("-")
        console.log("rawResult")
        console.log(rawResult)
        console.log("-")

        const cleanJsonString = rawResult.replace(/```json|```/g, '');
        console.log("cleanJsonString")
        console.log(cleanJsonString)
        return JSON.parse(cleanJsonString) as T;
    } catch (e) {
        console.log(rawResult);
        console.log("Seems like raw result is not a valid JSON", e);
        console.log("Trying to parse raw result as JSON");
        try {
            return JSON.parse(rawResult) as T;
        } catch (e) {
            console.log("Failed to parse raw result as well", e);
            return null;
        }
    }
}

export function extractAndParseJSON<T>(rawString: string): T| null {
    // Define the regex to find JSON blocks enclosed in ```json ... ```
    const jsonRegex = /```json([\s\S]*?)```/;

    // Find the match for the JSON block
    const match = rawString.match(jsonRegex);

    if (match && match[1]) {
        const jsonString = match[1].trim();
        try {
            // Parse the JSON string into an object
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
        }
    }

    console.warn("No JSON block found in the provided string.");
    return null;
}

