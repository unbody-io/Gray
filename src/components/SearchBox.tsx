import { Input, InputProps } from "@nextui-org/input";
import { ChatIcon, SearchIcon } from "@/components/icons";

import React, { useEffect } from "react";
import { Tab, Tabs } from "@nextui-org/react";
import { SearchInputPlaceholder } from "@/config/copy.config";
import clsx from "clsx";
import { KeywordChip } from "@/components/keyword-chip";
import { QueryContextKey } from "@/types/data.types";
import { useSearchBar } from "@/context/context.search-bar";
import { notEmpty } from "@/utils/general.utils";
import { useRouter } from "next/router";
import { ESearchMode } from "@/types/ui.types";
import { getChipColor } from "@/utils/ui.utils";

interface SearchInputProps extends InputProps {
  placeHolder?: string;
  label?: string;
  mode: ESearchMode;
}

const SearchInput = ({
  placeHolder,
  label,
  mode,
  onValueChange,
  onClear,
  ...rest
}: SearchInputProps) => {
  // We should not handle the state of the input here
  // but NextUI input does not clear the input value when the clear button is clicked
  // so we need to handle it here
  return (
    <Input
      isClearable={true}
      radius="lg"
      label={label}
      classNames={{
        label: "text-black/50 dark:text-white/90 capitalize",
        input: [
          "bg-transparent",
          "text-black/90 dark:text-white/90",
          "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          "focus:text-lg",
          "transition-all",
          "autocomplete-off",
        ],
        innerWrapper: "bg-transparent pt-1",
        inputWrapper: [
          "shadow-xl",
          "bg-default-200/50",
          "dark:bg-default/60",
          "backdrop-blur-xl",
          "backdrop-saturate-200",
          "hover:bg-default-200/70",
          "dark:hover:bg-default/70",
          "group-data-[focused=true]:bg-default-200/50",
          "dark:group-data-[focused=true]:bg-default/60",
          "!cursor-text",
        ],
      }}
      placeholder={placeHolder}
      startContent={
        mode === ESearchMode.Read ? (
          <ChatIcon className="text-black/50 fill-black/30 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        ) : (
          <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        )
      }
      onValueChange={(value) => {
        if (onValueChange) onValueChange(value);
      }}
      onClear={() => {
        if (onClear) onClear();
      }}
      {...rest}
    />
  );
};

export interface SearchBoxProps {
  onModeChange?: (mode: ESearchMode) => void;
  mode?: ESearchMode;
}

export const SearchBox = (props: SearchBoxProps) => {
  const { onModeChange } = props;

  const {
    clearQuery,
    topics,
    keywords,
    entities,
    query,
    setQueryState,
    setFilters,
    setMode,
    mode,
  } = useSearchBar();

  const [inputFocused, setInputFocused] = React.useState(false);
  const [internalQuery, setInternalQuery] = React.useState<string | undefined>(
    query
  );
  const router = useRouter();

  const handleModeChange = (mode: ESearchMode) => {
    onModeChange?.(mode);
    setMode(mode);
    if (mode === ESearchMode.Read) {
      // push to the read page but keep all the query params
      router.push({
        pathname: "/explore/read",
        query: router.query,
      });
    }
    if (mode === ESearchMode.Search) {
      // push to the explore page but keep all the query params
      router.push({
        pathname: "/explore/search",
        query: router.query,
      });
    }
  };

  const onInputFocused = () => {
    setInputFocused(true);
  };
  const onInputBlurred = () => {
    setInputFocused(false);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQueryState(internalQuery);
  };

  // adjust the url params based
  const onKeywordClose = (type: QueryContextKey, value: string) => {
    setFilters(type, value);
  };

  const onClear = () => {
    clearQuery();
  };

  useEffect(() => {
    setInternalQuery(query);
  }, [query]);

  return (
    <div className={"w-full h-full flex"}>
      <div className={"flex w-full flex-col relative"}>
        <Tabs
          aria-label="Options"
          size={"sm"}
          variant={"light"}
          selectedKey={mode}
          onSelectionChange={(key) => handleModeChange(key as ESearchMode)}
          className={clsx(
            "absolute top-1/2 right-20 transform -translate-y-1/2 z-10",
            `opacity-${
              inputFocused ? 100 : 50
            } hover:opacity-100 transition-opacity duration-300`
          )}
        >
          <Tab key={ESearchMode.Search} title={ESearchMode.Search} />
          <Tab key={ESearchMode.Read} title={ESearchMode.Read} />
        </Tabs>
        <form onSubmit={onSubmit} autoComplete={"off"}>
          <SearchInput
            placeHolder={SearchInputPlaceholder[mode]}
            mode={mode}
            onValueChange={(value) => setInternalQuery(value)}
            onClear={onClear}
            onFocus={onInputFocused}
            onBlur={onInputBlurred}
            value={internalQuery}
          />
        </form>
      </div>
      <div className={"flex flex-row  gap-2 pt-2"}>
        {topics
          ?.split(",")
          .filter(notEmpty)
          .map((topic, index) => (
            <KeywordChip
              key={`t-${index}`}
              text={topic}
              color={getChipColor("topics")}
              onClose={() => onKeywordClose(QueryContextKey.topic, topic)}
            />
          ))}
        {entities
          ?.split(",")
          .filter(notEmpty)
          .map((entity, index) => (
            <KeywordChip
              key={`e-${index}`}
              text={entity}
              color={getChipColor("entities")}
              onClose={() => onKeywordClose(QueryContextKey.entity, entity)}
            />
          ))}
        {keywords
          ?.split(",")
          .filter(notEmpty)
          .map((keyword, index) => (
            <KeywordChip
              key={`k-${index}`}
              text={keyword}
              color={getChipColor("keywords")}
              onClose={() => onKeywordClose(QueryContextKey.keyword, keyword)}
            />
          ))}
      </div>
    </div>
  );
};
