import React, { PropsWithChildren } from "react";
import { MiniArticle, MiniTextBlock } from "@/types/data.types";
import { SWRResponse } from "swr";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleCardBody } from "@/components/ArticleCard.Body";
import { Button } from "@nextui-org/button";
import { BlockCard } from "@/components/BlockCard";
import { TextBlockCardBody } from "@/components/TextBlockCard.Body";
import { LoadingIcon } from "@/components/icons";

type CategoryListProps = {
  onOpen?: (index: number) => void;
  onClosed?: () => void;
  articles: SWRResponse<MiniArticle[]> | null;
  blocks: SWRResponse<MiniTextBlock[]> | null;
} & PropsWithChildren<{}>;

type ListItemProps = PropsWithChildren<{
  loading: boolean;
  error?: any;
  pageSize: number;
  itemName: string;
  wrapperClassName?: string;
  listClassName?: string;
}>;

const List = ({
  children,
  loading,
  pageSize,
  error,
  itemName,
  wrapperClassName,
  listClassName,
}: ListItemProps) => {
  const [page, setPage] = React.useState(1);
  const maxSize = React.Children.count(children);

  const loadingLabel = `Loading ${itemName}...`;
  const noResultsLabel = `No ${itemName} found`;
  const label = `${itemName}`;

  return (
    <div className={wrapperClassName}>
      {
        <div className={"flex flex-row items-center gap-1"}>
          {loading && (
            <LoadingIcon className={"animate-spin h-2 w-2 text-current"} />
          )}

          <span className={"text-sm"}>
            {loading
              ? loadingLabel
              : error
              ? "Error loading data"
              : maxSize > 0
              ? `${maxSize} ${label}`
              : noResultsLabel}
          </span>
        </div>
      }
      {maxSize > 0 && (
        <>
          <div className={listClassName}>
            {React.Children.toArray(children).slice(0, page * pageSize)}
          </div>
          <div className={"m-auto pt-4 flex gap-4"}>
            {page * pageSize < maxSize && (
              <Button onClick={() => setPage(page + 1)}>More</Button>
            )}
            {page > 1 && (
              <Button onClick={() => setPage(page - 1)}>Less</Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export const SearchResultsList = ({
  articles,
  blocks,
  children,
}: CategoryListProps) => {
  return (
    <div>
      {articles && (
        <List
          loading={articles.isLoading}
          error={articles.error}
          pageSize={2}
          itemName={"Related Articles"}
          wrapperClassName={"flex flex-col gap-4"}
          listClassName={"flex flex-col gap-4"}
        >
          {articles.data?.map((article, i) => (
            <ArticleCard key={`a-${i}`} className={"bg-default-200/100 pb-3"}>
              {<ArticleCardBody data={article} />}
            </ArticleCard>
          ))}
        </List>
      )}
      {blocks && (
        <List
          loading={blocks.isLoading}
          error={blocks.error}
          pageSize={2}
          itemName={"Related Blocks"}
          listClassName={"grid gap-2 grid-cols-2"}
          wrapperClassName={"flex flex-col gap-4"}
        >
          {blocks.data?.map((block, i) => (
            <BlockCard key={i} className={""}>
              <TextBlockCardBody data={block as MiniTextBlock} />
            </BlockCard>
          ))}
        </List>
      )}
    </div>
  );
};
