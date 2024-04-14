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


export type PromptTemplate = {
    create: (...args: any) => string;
    parse: <T extends any>(rawResult: string) => T;
    transform?: (data: any) => any;
}
