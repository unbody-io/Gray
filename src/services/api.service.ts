import React from "react";
import useSWR from "swr";

export type UseApiHook<I, O> = {
    data: O|null,
    error: any,
    isLoading: boolean,
    exec: (payload: I) => void
}

export const useApiPost = <I, O>(p: string, initialShouldFetch: boolean = false): UseApiHook<I, O> => {
    const [shouldFetch, setShouldFetch] = React.useState(initialShouldFetch);
    const [payload, setPayload] = React.useState<any>(null);

    const defaultApiFetcher = (url: string, payload: I) => {
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then(res => res.json());
    }

    const { data, error, isLoading } = useSWR(
        shouldFetch ? [p, payload] : null,
        () => defaultApiFetcher(p, payload),
        { revalidateOnFocus: false }
    );

    const exec = (newPayload: any) => {
        setPayload(newPayload);
        setShouldFetch(true);
    };

    return {
        data,
        error,
        isLoading,
        exec
    } as UseApiHook<I, O>;
}
