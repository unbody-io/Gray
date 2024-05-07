import { PropsWithChildren } from "react";

export const Note = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={`border px-4 py-3 rounded-xl border-default-200 dark:border-default-100 bg-default-200/20`}
    >
      {children}
    </div>
  );
};
