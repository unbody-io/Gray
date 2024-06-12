import React, {HTMLProps} from "react";
import clsx from "clsx";

export const SectionTitle = ({children}: HTMLProps<HTMLSpanElement>) => {
    return (
        <span className={clsx(
            `block text-gray-500`,
            "px-2 pb-4"
        )}>
            {children}
        </span>
    )
}
