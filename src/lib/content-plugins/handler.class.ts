import {SupportedContentTypes} from "@/types/plugins.types";

type Config = {
    type: SupportedContentTypes;
    label?: string;
    fetcher: () => Promise<any[]>;
    enhancer?: (d: any) => Promise<any>;
    summarizer?: (d: any, i: number) => string;
    comparator?: (o: any, n: any) => any
    identifier?: string;
}

export default class ContentHandler<RD extends {}, ED extends {}> {
    type: SupportedContentTypes;
    label?: string;
    fetcher: () => Promise<RD[]>;
    enhancer: (d: RD) => Promise<ED>;
    summarizer: (d: RD, i: number) => string;
    comparator: (o: RD, n: RD) => boolean;
    identifier: string;

    constructor({
                    type,
                    label,
                    fetcher,
                    enhancer,
                    summarizer,
                    comparator,
                    identifier
                }: Config) {
        this.type = type;
        this.label = label || type;
        this.fetcher = fetcher;
        this.enhancer = enhancer? enhancer : this.defaultEnhancer;
        this.summarizer = summarizer? summarizer : this.defaultSummarizer;
        this.comparator = comparator ? comparator : this.defaultComparator;
        this.identifier = identifier||"remoteId";
    }

    private defaultComparator<RD extends { [key: string]: any }>(o: RD, n: RD): boolean {
        return (
            Object.keys(o).length === Object.keys(n).length &&
            Object.keys(o).every(key => n.hasOwnProperty(key) && o[key] === n[key])
        );
    }

    private defaultEnhancer<ED>(r: RD): Promise<ED> {
        return Promise.resolve(r as unknown as ED);
    }

    private defaultSummarizer(d: RD, i: number): string {
        return `${i}:${JSON.stringify(d)}`;
    }

}



