import React, { useMemo } from "react";
import { highlightTags } from "@/components/TextWithHighlights";
import { TagProps } from "@/types/ui.types";

type IProps = {
  text: string;
  tags: TagProps[];
  alwaysActive?: boolean;
};

export const InteractiveParagraph = (props: IProps) => {
  const { text, tags, alwaysActive = false } = props;
  const [active, setActive] = React.useState<boolean>(true);

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    setActive(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!alwaysActive) {
      setActive(false);
    }
  };

  const h = useMemo(() => {
    return highlightTags({ tags, text, active: active });
  }, [text, tags]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: h }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={active ? "active" : ""}
    />
  );
};
