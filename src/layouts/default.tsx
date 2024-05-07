import React from 'react';
import { Navbar } from '@/components/navbar';
import { Head } from '@/layouts/head';
import { SearchBarProvider } from '@/context/context.search-bar';
import { SearchBoxProps } from '@/components/SearchBox';

type DefaultLayoutProps = {
    searchBoxProps?: SearchBoxProps;
    containerMaxWidth?: string;
} & { children: React.ReactNode };

export default function DefaultLayout({
    children,
    searchBoxProps,
    containerMaxWidth = 'max-w-screen-md'
}: DefaultLayoutProps) {
    return (
        <SearchBarProvider>
            <div
                className={`container items-center relative flex flex-col align-bottom h-screen basis-1/5 m-auto`}
            >
                <Head />
                <Navbar searchBoxProps={searchBoxProps} />
                <main className={`flex w-full flex-col gap-16 ${containerMaxWidth}`}>
                    {children}
                </main>
            </div>
        </SearchBarProvider>
    );
}
