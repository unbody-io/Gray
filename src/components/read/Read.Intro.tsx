// if no query params then we show blog intro with highlighted keys and then show a note that in this page you can
// read as you go, meaning that you will be constructing your narrative as you read by either clicking on the highlighted
// keys or by using the text input to search for more information.

import { InteractiveParagraph } from "@/components/InteractiveParagraph";
import { TextReveal } from "@/components/TextReveal";
import React from "react";
import { TagProps } from "@/types/ui.types";

type Props = {
  tags: TagProps[];
  intro: string;
};

export const ReadPageIntro = (props: Props) => {
  const { tags, intro } = props;

  return (
    <div>
      <TextReveal>
        <InteractiveParagraph tags={tags} text={intro} alwaysActive={true} />
      </TextReveal>
    </div>
  );
};
