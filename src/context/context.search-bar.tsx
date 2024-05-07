import React, { createContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { QueryContextKey } from '@/types/data.types';
import { ESearchMode } from '@/types/ui.types';

type SearchBarState = {
    query?: string;
    topics?: string;
    entities?: string;
    keywords?: string;
    mode: ESearchMode;

    setQueryState: (query: string | undefined) => void;
    setFilters: (type: QueryContextKey, value: string) => void;
    setMode: (mode: ESearchMode) => void;
    clearQuery: () => void;
};

const initialState: SearchBarState = {
    query: undefined,
    topics: undefined,
    entities: undefined,
    keywords: undefined,
    setQueryState: () => {},
    setFilters: () => {},
    clearQuery: () => {},
    setMode: () => {},
    mode: ESearchMode.Search
};

const SearchBarContext = createContext(initialState);

export const SearchBarProvider = ({ children }: { children: React.ReactNode }) => {
    const [query, setQuery] = React.useState<string | undefined>(undefined);
    const [topics, setTopic] = React.useState<string | undefined>(undefined);
    const [entities, setEntity] = React.useState<string | undefined>(undefined);
    const [keywords, setKeyword] = React.useState<string | undefined>(undefined);
    const [mode, setMode] = React.useState<ESearchMode>(ESearchMode.Search);

    const router = useRouter();

    const isValidFilter = (value: string) => {
        return value !== undefined && value.trim() !== '';
    };

    useEffect(() => {
        setQuery(router.query.query as string);
        setTopic(
            isValidFilter(router.query.topics as string)
                ? (router.query.topics as string)
                : undefined
        );
        setEntity(
            isValidFilter(router.query.entities as string)
                ? (router.query.entities as string)
                : undefined
        );
        setKeyword(
            isValidFilter(router.query.keywords as string)
                ? (router.query.keywords as string)
                : undefined
        );
    }, [
        router.query.query,
        router.query.topics,
        router.query.entities,
        router.query.keywords
    ]);

    useEffect(() => {
        if (router.pathname.includes('/read')) {
            setMode(ESearchMode.Read);
        } else if (router.pathname.includes('/explore')) {
            setMode(ESearchMode.Search);
        }
        // setMode(router.pathname.split("/")[2] as ESearchMode)
    }, [router.pathname]);

    const setModeState = (mode: ESearchMode) => {
        if (!router.pathname.startsWith('/explore')) return;
        router.push(
            {
                pathname: `/explore/${mode}`,
                query: router.query
            },
            undefined,
            { shallow: false }
        );
    };

    const setQueryState = (query: string | undefined) => {
        router.push(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    ...(query !== undefined ? { query } : undefined)
                }
            },
            undefined,
            { shallow: false }
        );
    };

    const setFilters = (type: QueryContextKey, value: string) => {
        const current = router.query[type] as string;
        console.log(current, value);
        const newValue = (current as string)
            .split(',')
            .filter((v) => v !== value)
            .join(',');
        let newQuery = { ...router.query };

        if (newValue.trim().length > 0) {
            newQuery[type] = newValue;
        } else {
            delete newQuery[type];
        }

        router.push(
            {
                pathname: router.pathname,
                query: newQuery
            },
            undefined,
            { shallow: false }
        );
    };

    const clearQuery = () => {
        router.push(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    query: undefined
                }
            },
            undefined,
            { shallow: false }
        );
    };

    return (
        <SearchBarContext.Provider
            value={{
                query,
                topics,
                entities,
                keywords,
                setQueryState,
                setFilters,
                clearQuery,
                setMode: setModeState,
                mode
            }}
        >
            {children}
        </SearchBarContext.Provider>
    );
};

export const useSearchBar = () => {
    const context = React.useContext(SearchBarContext);
    if (!context) {
        throw new Error('useSearchBar must be used within a SearchBarProvider');
    }
    return context;
};
