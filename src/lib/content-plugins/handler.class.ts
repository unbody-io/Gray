import {join} from "path";
import {existsSync, writeFileSync} from "fs";
import {readFile} from "fs/promises";

import {InitialPostsData, SupportedContentTypes} from "@/types/plugins.types";
import {POSTS_DATA_FOLDER_PATH} from "@/prebuild-data/configs";

import {PostRef, SiteData} from "@/types/data.types";
import {StructuredUserInput} from "@/types/prompt.types";
import {NexlogConfigAll} from "@/types/nexlog.types";


const fields: any[] = [];
export type Fields = typeof fields[number];

export type SearchFnProps = {
    siteConfig: NexlogConfigAll,
    siteData: SiteData;
    input: StructuredUserInput;
    filters?: string[];
    fields?: Fields[]
    forceGenerate?: boolean;
}

export type FetcherFn = (path: string, fields?: Fields[]) => Promise<any[]>;
export type EnhancerFn = (d: any) => Promise<any>;
export type SummarizerFn = (d: any, i: number) => string;
export type ComparatorFn = (o: any, n: any) => boolean;
export type SearcherFn<T> = (p:SearchFnProps, query?: any) => Promise<T>;
export type GetPostFn<T> = (idV: string) => Promise<T|null>;
export type GetPostHandlerFn<T> = (idK: string, idV: string) => Promise<T|null>;


export type UiComponentsOptions<T> = {
    "list"?: T;
    "card"?: T;
    "card_with_refs"?: T;
}

export type UiComponents<T> = {
    list: T
    card: T
    card_with_refs: T
}

// Very dangerous, but we need to use any here
// unless we somehow can get QueryBuilder to be generic and explicit
export type SearcherQueryFn = ({}:SearchFnProps) => any;

type CacheReaderFn<ED> = () => Promise<ED[]>;

export type HandlerPublicConfigs = {
    identifier: string;
    type: SupportedContentTypes;
    label: string;
    uiComponents?: UiComponentsOptions<string>;
}

export type ContentHandlerConfig = {
    type: SupportedContentTypes;
    label?: string;
    fetcher: FetcherFn;
    searcher: SearcherFn<any>;
    searcherQ?: SearcherQueryFn;
    enhancer?: EnhancerFn;
    summarizer?: SummarizerFn;
    comparator?: ComparatorFn;
    getPost: GetPostHandlerFn<any>;
    cacheReader?: CacheReaderFn<any>;
    identifier?: string;
    fields?: Fields[]
    uiComponents?: UiComponentsOptions<string>;

    prefetch?: boolean;
}

export default class ContentHandler<RD extends {}, ED extends {}> {
    type: SupportedContentTypes;
    label?: string;
    fetcher: FetcherFn;
    enhancer: EnhancerFn;
    summarizer: SummarizerFn;
    comparator: ComparatorFn;
    cacheReader: CacheReaderFn<ED>;
    searcher: SearcherFn<RD>;
    searcherQ?: SearcherQueryFn;
    getPost: GetPostFn<RD>;
    identifier: string;
    fields?: Fields[];
    uiComponents: UiComponentsOptions<string>;

    private data: ED[]|null = null;

    prefetch: boolean = true;

    constructor({
                    type,
                    label,
                    fetcher,
                    enhancer,
                    summarizer,
                    comparator,
                    searcher,
                    identifier,
                    cacheReader,
                    searcherQ,
                    fields,
                    uiComponents = {},
                    prefetch,
                    getPost
                }: ContentHandlerConfig) {
        this.type = type;
        this.label = label || type;
        this.identifier = identifier||"remoteId";
        this.fields = fields;

        this.fetcher = (path, _fields) => this.fetcherHandler(fetcher, path);
        this.searcherQ = searcherQ;
        this.getPost = (idV: string) => getPost(this.identifier, idV);
        this.searcher = (props: SearchFnProps) => this.searchHandler(searcher, props);
        this.enhancer = enhancer? enhancer : this.defaultEnhancer;
        this.summarizer = summarizer? summarizer : this.defaultSummarizer;
        this.comparator = comparator ? comparator : this.defaultComparator;
        this.cacheReader = cacheReader ? cacheReader : this.defaultCacheReader;
        // we need the default ui components because in case user has
        // provided a broken path to custom ui components, we can fallback while dynamic import
        this.uiComponents = uiComponents || {};

        this.prefetch = typeof prefetch === "boolean" ? prefetch : true;
    }

    private fetcherHandler(optHandler: FetcherFn, path: string): Promise<RD[]> {
        const {identifier} = this;
        if (this.fields){
            if(!this.fields.includes("pathString")) this.fields.push("pathString");
            if (!this.fields.includes("remoteId")) this.fields.push("remoteId");
            if (!this.fields.includes(identifier)) this.fields.push(identifier);
        }
        return optHandler(path, this.fields);
    }

    private searchHandler(optHandler: SearcherFn<any>, props: SearchFnProps): Promise<any> {
        if (this.searcherQ) {
            const query = this.searcherQ(props);
            return optHandler(props, query);
        }
        return optHandler(props);
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

    private get getDataFilePath(): string {
        return join(POSTS_DATA_FOLDER_PATH, `${this.type}.json`);
    }

    private async savePosts(posts: ED[]): Promise<void> {
        const filePath = this.getDataFilePath
        console.log(`Writing to ${filePath}`);
        await writeFileSync(filePath, JSON.stringify(posts));
        console.log(`Wrote to ${filePath}`);
    }

    private async defaultCacheReader(): Promise<ED[]>{
        if (this.data) return this.data as ED[];

        const filePath = this.getDataFilePath
        const isFileExists = existsSync(filePath);

        if (isFileExists) {
            try {
                this.data = await readFile(filePath, "utf-8").then(data => JSON.parse(data.toString()) as ED[]);
            } catch (e) {
                console.error(`Error reading ${this.type}`);
                this.data = [];
            }
        } else {
            this.data = []
        }

        return this.data as ED[];
    }

    public async fetchPosts(
        postsRemotePath: string
    ): Promise<InitialPostsData<ED>> {
        const {identifier} = this;

        // first read existing posts
        const existingPosts = await this.cacheReader();

        console.log(`Fetching ${this.type}`);
        const rawPosts = await this.fetcher(postsRemotePath).catch(e => {
            console.error(`Error fetching ${this.type}`);
            console.error(e);
            return [];
        })
        console.log(`Got ${rawPosts.length} ${this.type}`);

        const posts = await Promise.all(
            rawPosts
                .map(async (newPost) => {
                    const existingPost = existingPosts.find(
                        // @ts-ignore
                        post => post[identifier] === newPost[identifier]
                    );

                    // if existing post is found, and it is same as new post, then skip
                    if (existingPost && this.comparator(existingPost, newPost)) {
                        console.log(`Skipping enhancing ${this.type}: ${newPost[identifier]}`);
                        return existingPost;
                    }

                    return await this.enhancer(newPost).catch(e => {
                        console.error(`Error enhancing ${this.type}`);
                        console.error(e);
                        return null;
                    })
                })
        );
        console.log(`Enhanced ${this.type}: ${posts.length} posts`);

        await this.savePosts(posts);

        return {
            type: this.type,
            posts: posts,
            summary: [
                `From ${this.label}:\n`,
                ...posts.map(this.summarizer)
            ].join("\n")
        };
    }

    getPostReference<ED extends { [key: string]: any }>(post: ED): PostRef|null {
        if (!post[this.identifier]) return null;
        return {
            [this.identifier]: post[this.identifier],
            __typename: post.__typename as SupportedContentTypes,
        }
    }

    get configs():HandlerPublicConfigs{
        return {
            identifier: this.identifier,
            type: this.type,
            label: this.label || this.type,
            uiComponents: this.uiComponents
        }
    }
}

