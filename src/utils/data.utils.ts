import {ESearchMode} from "@/types/ui.types";

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
    link: `/explore/${searchMode}?${type}=${key.toLowerCase()}`
})



// Function to get the values of the enum
export function getEnumValues<E extends object>(enumObj: E): number[] {
    return Object.values(enumObj).filter(value => typeof value === 'number') as number[];
}
