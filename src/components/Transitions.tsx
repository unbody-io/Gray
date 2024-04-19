import React from "react";
import { Transition } from "@tailwindui/react";

type Props = {
  show: boolean;
  appear?: boolean;
  delay?: number;
} & React.HTMLProps<HTMLDivElement>;

export const FadeIn = ({ show, delay, children }: Props) => {
  return (
    <Transition
      show={show}
      enter={`transition-opacity duration-750 ${
        delay ? `transition-delay-${delay}` : ""
      }`}
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave={`transition-opacity duration-750 ${
        delay ? `transition-delay-${delay}` : ""
      }`}
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {children}
    </Transition>
  );
};
