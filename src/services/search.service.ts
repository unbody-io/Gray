import {useRouter} from "next/router";
import {UseApiHook, useApiPost} from "@/services/api.service";
import {useEffect} from "react";

export const useSearchApiCall = <I,O>(url: string): UseApiHook<I, O> => {
    const {query: {query, filters}} = useRouter();
    const state = useApiPost<I, O>(url);

    useEffect(() => {
        let body: Record<any, any> = {};
        if (query) {
            body.query = query;
        }
        if (filters) {
            body.filters = filters;
        }
        console.log("query has changed", query, filters, body);
        state.exec(body);
    }, [query]);

    return state;
}
