import { Card, CardProps } from "@nextui-org/react";
import clsx from "clsx";
import React from "react";

const BlockCardBaseClasses = clsx([
  "p-2",
  "shadow-lg",
  "bg-default-100/100",
  "backdrop-blur-xl",
  "backdrop-saturate-200",
  "hover:bg-default-200/80",
  "dark:bg-default/100",
  "dark:hover:bg-default/70",
  "translate-y-0",
  "translate-x-0",
  "transition-all",
]);

export const BlockCard = (props: CardProps) => {
  const { children, className, ...rest } = props;
  return (
    <Card
      className={clsx([
        BlockCardBaseClasses,
        "pt-0",
        "duration-700",
        className,
      ])}
      {...rest}
    >
      {children}
    </Card>
  );
};
