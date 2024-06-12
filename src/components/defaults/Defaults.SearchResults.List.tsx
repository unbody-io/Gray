import React, {PropsWithChildren} from "react";
import {Button} from "@nextui-org/button";
import DefaultsSearchResultsListHeader from "@/components/defaults/Defaults.SearchResults.List.Header";

export type SearchResultListProps = PropsWithChildren<{
    pageSize?: number
    wrapperClassName?: string
    listClassName?: string
    label: string
}>

const DefaultSearchResultsList = ({
                                      children,
                                      pageSize = 4,
                                      wrapperClassName,
                                      listClassName,
                                      label
                                  }: SearchResultListProps) => {
    const [page, setPage] = React.useState(1);
    const maxSize = React.Children.count(children);

    return (
        <div className={"flex flex-col w-full"}>
            <DefaultsSearchResultsListHeader
                label={label}
                size={maxSize}
            />
            <div className={wrapperClassName}>
                {
                    maxSize > 0 &&
                    <>
                        <div className={listClassName}>
                            {React.Children.toArray(children).slice(0, page * pageSize)}
                        </div>
                        <div className={"m-auto pt-4 flex gap-4"}>
                            {
                                page * pageSize < maxSize &&
                                <Button size={"sm"}
                                        variant={"ghost"}
                                        onClick={() => setPage(page + 1)}>Show more</Button>
                            }
                            {
                                page > 1 &&
                                <Button size={"sm"}
                                        variant={"ghost"}
                                        onClick={() => setPage(page - 1)}>Show less</Button>
                            }
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default DefaultSearchResultsList;
