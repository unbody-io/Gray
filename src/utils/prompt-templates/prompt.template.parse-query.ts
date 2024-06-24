import {PromptTemplate, StructuredUserInput} from "@/types/prompt.types";
import {extractAndParseJSON, parseJsonOutput} from "@/utils/prompt-templates/prompt.utils";

export const promptTemplateParseQuery: PromptTemplate<StructuredUserInput> = {
    create: (userInput: string): string => `
You are a system designed to analyze user inputs for a media outlet and blogging app. The user input can be a search query, a question, an instruction, or a complex task. Given the user input below, categorize it and extract key information for further processing.

**User Input:** "${userInput}"

**Instructions:**
1. **Determine the Type:**
   - Indicate whether the input is a **Search Query**, **Question**, **Instruction/Task**, or **Complex Task**.
2. **Extract Information:**
   - **For a Search Query:** 
     - Extract main **Concepts** and **Key Terms**.
     - Indicate that **requires_search** is \`true\`.
   - **For a Question:** 
     - Extract the **Core Question** and **Subject/Topic**.
     - Extract any **Context** if provided.
     - Set **requires_search** to \`true\` if it needs specific information from the database.
     - Set **requires_search** to \`false\` if it is a general or creative question.
   - **For an Instruction/Task:** 
     - Extract the **Specific Task**.
     - Identify the **Subject/Topic**.
     - Specify the **Output Format** and any **Constraints**.
     - Set **requires_search** to \`true\` if it needs specific information.
     - Set **requires_search** to \`false\` if it should use general data or context.
   - **For a Complex Task:**
     - Extract both **Core Question** and **Specific Task**.
     - Identify the **Subject/Topic**.
     - Specify the **Output Format** and any **Constraints**.
     - Set **requires_search** to \`true\`.

**Output Format:**
Wrap the output in a codeblock. Provide the result in the following JSON format:
\`\`\`json
{
  "type": "[Search Query / Question / Instruction / Complex Task]",
  "concepts_key_terms": ["[Extracted concepts and key terms]"],
  "core_question": "[Extracted core question]",
  "subject_topic": ["[Extracted subject or topic]"],
  "specific_task": "[Extracted specific task]",
  "output_format": "[Specified output format]",
  "constraints": "[Extracted constraints]",
  "context": "[Extracted context]",
  "requires_search": [true / false]
}
\`\`\`

**Examples:**

**Example 1:**
**User Input:** "Recent trends in electric vehicles and their impact on urban planning"
- **Output:**
\`\`\`json
{
  "type": "Search Query",
  "concepts_key_terms": ["trends", "electric vehicles", "impact", "urban planning"],
  "core_question": "",
  "subject_topic": ["electric vehicles", "urban planning"],
  "specific_task": "",
  "output_format": "",
  "constraints": "",
  "context": "",
  "requires_search": true
}
\`\`\`

**Example 2:**
**User Input:** "How does the rise of telemedicine affect healthcare costs?"
- **Output:**
\`\`\`json
{
  "type": "Question",
  "concepts_key_terms": ["telemedicine", "healthcare costs"],
  "core_question": "How does the rise of telemedicine affect healthcare costs?",
  "subject_topic": ["telemedicine", "healthcare costs"],
  "specific_task": "",
  "output_format": "",
  "constraints": "",
  "context": "",
  "requires_search": true
}
\`\`\`

**Example 3:**
**User Input:** "Generate a summary of the latest sustainable fashion trends in a 500-word article"
- **Output:**
\`\`\`json
{
  "type": "Instruction",
  "concepts_key_terms": ["latest", "sustainable fashion", "trends"],
  "core_question": "",
  "subject_topic": ["sustainable fashion"],
  "specific_task": "Generate a summary",
  "output_format": "500-word article",
  "constraints": "",
  "context": "",
  "requires_search": true
}
\`\`\`

**Example 4:**
**User Input:** "Show me detailed reports on the evolution of social media marketing strategies"
- **Output:**
\`\`\`json
{
  "type": "Search Query",
  "concepts_key_terms": ["detailed reports", "evolution", "social media marketing", "strategies"],
  "core_question": "",
  "subject_topic": ["social media marketing"],
  "specific_task": "",
  "output_format": "",
  "constraints": "",
  "context": "",
  "requires_search": true
}
\`\`\`

**Example 5:**
**User Input:** "What are the benefits of integrating AI in content creation for blogs?"
- **Output:**
\`\`\`json
{
  "type": "Question",
  "concepts_key_terms": ["AI", "content creation", "blogs", "benefits"],
  "core_question": "What are the benefits of integrating AI in content creation for blogs?",
  "subject_topic": ["AI", "content creation"],
  "specific_task": "",
  "output_format": "",
  "constraints": "",
  "context": "",
  "requires_search": true
}
\`\`\`

**Example 6:**
**User Input:** "Create an outline for a blog post about the challenges of remote work, including three key challenges and potential solutions"
- **Output:**
\`\`\`json
{
  "type": "Instruction",
  "concepts_key_terms": ["outline", "blog post", "challenges", "remote work", "key challenges", "potential solutions"],
  "core_question": "",
  "subject_topic": ["challenges of remote work"],
  "specific_task": "Create an outline",
  "output_format": "including three key challenges and potential solutions",
  "constraints": "",
  "context": "",
  "requires_search": false
}
\`\`\`

**Example 7:**
**User Input:** "Summarize Tomas's talk on renewable energy innovations and highlight three key points"
- **Output:**
\`\`\`json
{
  "type": "Instruction",
  "concepts_key_terms": ["Tomas", "talk", "renewable energy", "innovations", "summarize", "highlight", "key points"],
  "core_question": "",
  "subject_topic": ["Tomas's talk", "renewable energy innovations"],
  "specific_task": "Summarize the talk",
  "output_format": "highlight three key points",
  "constraints": "",
  "context": "",
  "requires_search": true
}
\`\`\`

**Example 8:**
**User Input:** "Compare the presentations on anxiety from the recent conference with our latest blog post on mental health"
- **Output:**
\`\`\`json
{
  "type": "Complex Task",
  "concepts_key_terms": ["compare", "presentations", "anxiety", "conference", "latest blog post", "mental health"],
  "core_question": "",
  "subject_topic": ["presentations on anxiety", "mental health blog post"],
  "specific_task": "Compare the presentations",
  "output_format": "",
  "constraints": "",
  "context": "",
  "requires_search": true
}
\`\`\`

**Example 9:**
**User Input:** "Summarize Tomas's talk and compare it with Amir's article on AI development"
- **Output:**
\`\`\`json
{
  "type": "Complex Task",
  "concepts_key_terms": ["Tomas", "talk", "summarize", "compare", "Amir", "article", "AI development"],
  "core_question": "",
  "subject_topic": ["Tomas's talk", "Amir's article on AI development"],
  "specific_task": "Summarize and compare",
  "output_format": "",
  "constraints": "",
  "context": "",
  "requires_search": true
}
\`\`\`

**Example 10:**
**User Input:** "What can be the next topics for our blog posts?"
- **Output:**
\`\`\`json
{
  "type": "Question",
  "concepts_key_terms": ["next topics", "blog posts"],
  "core_question": "What can be the next topics for our blog posts?",
  "subject_topic": ["blog post topics"],
  "specific_task": "",
  "output_format": "",
  "constraints": "",
  "context": "",
  "requires_search": false
}
\`\`\`

**Example 11:**
**User Input:** "Summarize the main topics in this blog"
- **Output:**
\`\`\`json
{
  "type": "Instruction",
  "concepts_key_terms": ["summarize", "main topics", "blog"],
  "core_question": "",
  "subject_topic": ["blog"],
  "specific_task": "Summarize the main topics",
  "output_format": "",
  "constraints": "",
  "context": "",
  "requires_search": false
}
\`\`\`
**Example 12:**
**User Input:** "What did Tomas talked about? compare it to Amir's presentation on AI apps]"
- **Output:**
\`\`\`json
{
  "type": "Complex Task",
  "concepts_key_terms": ["Tomas", "talk", "compare", "Amir", "presentation", "AI apps"],
  "core_question": "",
  "subject_topic": ["Tomas", "Amir", "AI apps"],
  "specific_task": "Compare the given talks",
  "output_format": "",
  "constraints": "",
  "context": "",
  "requires_search": true
}
\`\`\`

`,
    parse: (userInput: string) => {
        return extractAndParseJSON<StructuredUserInput>(userInput)
    }
}
