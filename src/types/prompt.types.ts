export type PromptConfig = {
    label?: string,
    instructions: string[],
    examples?: string[]
}

export type PromptInput = {
    introduction: string,
    instructions: string[],
    examples?: string[]
    output: string
    context?: (t:string) => string
}


export type PromptTemplate<O extends any> = {
    create: (...args: any) => string;
    parse: (rawResult: string) => O|null;
    transform?: (data: any) => any;
}

export enum UserInputType {
    SearchQuery = "Search Query",
    Question = "Question",
    Instruction = "Instruction",
    ComplexTask = "Complex Task"
}

export type StructuredUserInput = {
    type: UserInputType;
    concepts_key_terms: string[];
    core_question: string;
    subject_topic: string[]|string;
    specific_task: string;
    output_format: string;
    constraints: string;
    context: string;
    requires_search: boolean;
    original_user_input: string;
}
