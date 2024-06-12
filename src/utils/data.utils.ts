import {ESearchMode, SubtitleChunk} from "@/types/ui.types";
import {ISubtitleEntry} from "@unbody-io/ts-client/build/core/documents";

export const uniqueBy = <T, K extends keyof T>(arr: T[], key: K) => {
    const seen = new Set<T[K]>();
    return arr.filter((item) => {
        if (seen.has(item[key])) {
            return false;
        }
        seen.add(item[key]);
        return true;
    });
}

// a function that compares two arrays and return overlapping elements
export const findSimilar = (arr1: string[], arr2: string[]) => {
    return arr1.filter(value => arr2.includes(value));
}


export const transformTag = (key: string, type:string, searchMode: ESearchMode) => ({
    key: key.toLowerCase(),
    type,
    link: `/explore/${searchMode}?filters=${key.toLowerCase()}`
})



// Function to get the values of the enum
export function getEnumValues<E extends object>(enumObj: E): number[] {
    return Object.values(enumObj).filter(value => typeof value === 'number') as number[];
}



export function chunkEntriesSentenceAware(entries: ISubtitleEntry[], maxChunkSize: number): SubtitleChunk[] {
    const chunks: SubtitleChunk[] = [];
    let currentChunk: ISubtitleEntry[] = [];

    entries
        .sort((a, b) => (a.order as number || 0) - (b.order as number || 0))
        .forEach((entry, index) => {
            currentChunk.push(entry);

            // Check if the current chunk has reached the max size and if the current entry ends with a period.
            if (currentChunk.length >= maxChunkSize && (entry.text as string).endsWith(".")) {
                chunks.push({entries: currentChunk});
                currentChunk = [];
            }
        });

    // If there are any entries left in the current chunk at the end of the loop, add them as a final chunk
    if (currentChunk.length > 0) {
        chunks.push({entries: currentChunk});
    }

    return chunks;
}
