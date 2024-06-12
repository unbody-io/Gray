import React, {createContext, useEffect} from "react";
import {useRouter} from "next/router";
import {ESearchMode, ESearchScope} from "@/types/ui.types";

type SearchBarState = {
    query?: string;
    filters?: string;

    mode: ESearchMode;

    scope: ESearchScope;
    setScope: (scope: ESearchScope) => void;
    scopeLabel: string|null;
    setScopeLabel: (label: string) => void;

    setQuery: (query: string|undefined) => void;
    setFilters: (value: string) => void;

    pushQuery: (query: string|undefined) => void;
    pushFilters: (filters: string|undefined) => void;

    setMode: (mode: ESearchMode) => void;
    clearQuery: () => void;

    isFocused: boolean;
    setFocused: (value: boolean) => void;
}

const initialState: SearchBarState = {
    query: undefined,
    filters: undefined,
    setQuery: () => {},
    setFilters: () => {},
    clearQuery: () => {},
    setMode: () => {},
    mode: ESearchMode.Search,
    scope: ESearchScope.global,
    setScope: () => {},
    scopeLabel: null,
    setScopeLabel: () => {},

    pushFilters: () => {},
    pushQuery: () => {},

    isFocused: false,
    setFocused: () => {},

}

const SearchBarContext = createContext(initialState)

export const SearchBarProvider = ({children}: {children: React.ReactNode}) => {
    const [query, setQuery] = React.useState<string|undefined>(undefined);
    const [filters, setFilters] = React.useState<string|undefined>(undefined);
    const [mode, setMode] = React.useState<ESearchMode>(ESearchMode.Search);
    const [scope, setScope] = React.useState<ESearchScope>(ESearchScope.global);
    const [scopeLabel, setScopeLabel] = React.useState<string|null>(null);
    const [isFocused, setFocused] = React.useState<boolean>(false);

    const router = useRouter();

    const isValidFilter = (value: string) => {
        return value !== undefined && value.trim() !== "";
    }

    useEffect(() => {
        const {query = undefined, filters = undefined} = router.query;
        if (query){
            setQuery(query as string);
        }
        if (filters){
            _setFilters(filters as string);
        }
    }, [
        router.query.query,
        router.query.filters
    ]);

    useEffect(() => {
        if(router.pathname.includes("/read")){
            setMode(ESearchMode.Read)
        }else if(router.pathname.includes("/explore")){
            setMode(ESearchMode.Search)
        }

        if(router.pathname.startsWith("/posts")){
            const scope = router.pathname.split("/")[2] as ESearchScope;
            setScope(scope);
        }else{
            setScope(ESearchScope.global);
        }

    }, [router.pathname]);

    const setModeState = (mode: ESearchMode) => {
        if (!router.pathname.startsWith("/explore")) return;
        router.push(
            {
                pathname: `/explore/${mode}`,
                query: router.query
            },
            undefined,
            {shallow: false}
        )
    }

    const pushQuery = (query: string|undefined) => {
        if(scope !== ESearchScope.global){
            return
        }
        router.push(
            {
                pathname: "/explore/search",
                query: {
                    ...router.query,
                    ...(query !== undefined ? {query} : undefined)
                }
            },
            undefined,
            {shallow: false}
        )
    }


    const pushFilters = (filters: string|undefined) => {
        if(scope !== ESearchScope.global){
            return
        }
        console.log("filters", filters)
        router.push(
            {
                pathname: "/explore/search",
                query: {
                    query,
                    ...(filters?.length ? {filters} : {})
                }
            },
            undefined,
            // {shallow: false}
        )
    }


    const _setFilters = (newValue: string) => {
        // const current = router.query.filters;
        // let newState = current && typeof current === "string" ? current.split(",") : [];

        let newState = newValue.split(",");

        if (newState.length === 0){
            pushFilters(undefined);
            return;
        }

        setFilters(newState.join(","));
    }

    const clearQuery = () => {
        router.push(
            {
                pathname: router.pathname,
                query: {},
            },
            undefined,
            {shallow: false}
        )
    }

    return (
        <SearchBarContext.Provider
            value={{
                query,
                filters,
                pushQuery,
                pushFilters,
                setQuery,
                setFilters: _setFilters,
                clearQuery,
                setMode: setModeState,
                mode,
                scope,
                setScope,
                scopeLabel,
                setScopeLabel,
                isFocused,
                setFocused
            }}
        >
            {children}
        </SearchBarContext.Provider>
    )
}

export const useSearchBar = () => {
    const context = React.useContext(SearchBarContext);
    if (!context) {
        throw new Error("useSearchBar must be used within a SearchBarProvider");
    }
    return context;
}
