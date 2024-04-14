import React, {ReactChildren, ReactNode, RefObject, useEffect, useLayoutEffect, useState} from "react";
import {AutoFields} from "@/types/data.types";
import {KeywordColor} from "@/types/ui.types";

export const getChipColor = (type: keyof AutoFields) => {
    switch (type) {
        case "topics":
        case "keywords":
            return KeywordColor.Default
        case "entities":
            return KeywordColor.Primary
        default:
            return KeywordColor.Default;
    }
}


export const useHover = <T extends HTMLElement>(): [React.RefObject<T>, boolean] => {
    const [value, setValue] = useState<boolean>(false);
    const ref = React.useRef<T>(null);
    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);

    React.useEffect(() => {
        const node = ref.current;
        if (node) {
            node.addEventListener("mouseover", handleMouseOver);
            node.addEventListener("mouseout", handleMouseOut);
            return () => {
                node.removeEventListener("mouseover", handleMouseOver);
                node.removeEventListener("mouseout", handleMouseOut);
            };
        }
    }, [ref.current]);
    return [ref, value];
}


export const useTimer = (time: number, callback?: () => {}): boolean => {
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setIsTimeUp(true);
            callback && callback();
        }, time);
        return () => clearTimeout(timeout);
    }, []);
    return isTimeUp;
}


export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const windowScrollY = () => {
    const [scrollY, setScrollY] = useState<number>(0);
    const handleScroll = () => setScrollY(window.scrollY);
    useIsomorphicLayoutEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return scrollY;
}


export const useDebouncedResize = (callback: () => void, delay = 100) => {
    useEffect(() => {
        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(callback, delay);
        };
        let timeout: NodeJS.Timeout;
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [callback, delay]);
}



export function useLinePixelWidths(ref: RefObject<HTMLDivElement>, children: ReactNode|undefined, maxWidth: number): number[] {
    const [linePixelWidths, setLinePixelWidths] = useState<number[]>([]);

    useEffect(() => {
        if (ref.current) {
            const text = ref.current.innerText.replaceAll("\n", " ");
            const words = text.split(" ");
            let tempLinePixelWidths: number[] = [];
            let currentLine = "";

            // Create a ghost element for measurements.
            const ghostElement = document.createElement('div');
            ghostElement.style.visibility = 'hidden';
            ghostElement.style.position = 'absolute';
            ghostElement.style.whiteSpace = 'nowrap';
            ref.current.appendChild(ghostElement);

            words.forEach((word, index) => {
                let potentialLine = currentLine + (currentLine ? " " : "") + word;
                ghostElement.innerText = potentialLine;

                // If the potential line fits, update the current line.
                if (ghostElement.offsetWidth <= maxWidth) {
                    currentLine = potentialLine;
                } else {
                    // If the current line is not empty, it means we've reached the end of a line.
                    if (currentLine) {
                        ghostElement.innerText = currentLine; // Measure the current line.
                        tempLinePixelWidths.push(ghostElement.offsetWidth);
                    }
                    // Start a new line with the current word.
                    currentLine = word;

                    // Immediately measure very long words that don't fit on their own line.
                    ghostElement.innerText = word;
                    if (ghostElement.offsetWidth > maxWidth) {
                        tempLinePixelWidths.push(ghostElement.offsetWidth);
                        currentLine = ""; // Reset currentLine if the word itself exceeds the lineWidth.
                    }
                }

                // At the last word, add the width of the remaining line.
                if (index === words.length - 1 && currentLine) {
                    ghostElement.innerText = currentLine; // Measure the final line.
                    tempLinePixelWidths.push(ghostElement.offsetWidth);
                }
            });

            // Clean up by removing the ghost element.
            ref.current.removeChild(ghostElement);

            setLinePixelWidths(tempLinePixelWidths);
        }
    }, [ref, children, maxWidth]);

    return linePixelWidths;
}
