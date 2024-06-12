import React, {PropsWithChildren, useCallback, useEffect, useRef, useState} from "react";
import {Skeleton} from "@nextui-org/react";
import {useDebouncedResize, useLinePixelWidths} from "@/utils/ui.utils";

const revealSpeedPerLine = 250; // ms
const maxLineWidth = 800;
const minLineWidth = 300;

function useContainerSizes(ref: React.RefObject<any>): {lineHeight: number; lineWidth: number } {
    const [sizes, setSizes] = useState({ lineHeight: 0, lineWidth: 0 });

    const updateSizes = useCallback(() => {
        if (ref.current) {
            const computedStyle = window.getComputedStyle(ref.current);
            setSizes({
                lineHeight: parseInt(computedStyle.lineHeight),
                lineWidth: parseInt(computedStyle.width),
            });
        }
    }, [ref]);

    useEffect(() => {
        updateSizes();
    }, [updateSizes]);

    useDebouncedResize(updateSizes);

    return sizes;
}

const calculateTransitionSpeed = (lineWidth: number) =>
    ((lineWidth - minLineWidth) / (maxLineWidth - minLineWidth)) * revealSpeedPerLine;

type Props = PropsWithChildren<{
    onTransitionEnd?: () => void;
    withDefaultSkeleton?: boolean;
}>;
export const TextReveal = ({ children, onTransitionEnd, withDefaultSkeleton}: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const { lineHeight, lineWidth } = useContainerSizes(ref);
    const [revealedLines, setRevealedLines] = useState<number[]>([]);
    const [render, setRender] = useState(false);
    const widths = useLinePixelWidths(ref, children, lineWidth);
    const lineCount = widths.length;

    useEffect(() => {
        let interval: NodeJS.Timeout|number|undefined = undefined;
        if (lineCount > 0 && revealedLines.length < lineCount) {
            interval = setInterval(() => {
                setRevealedLines((prevLines) => {
                    const nextIndex = prevLines.length;
                    if (nextIndex < lineCount) {
                        return [...prevLines, nextIndex];
                    }
                    return prevLines;
                });

                if (revealedLines.length===lineCount-1) {
                    setTimeout(() => {
                        onTransitionEnd && onTransitionEnd();
                    }, calculateTransitionSpeed(lineWidth));
                }

            }, calculateTransitionSpeed(lineWidth));
        }
        return () => interval && clearInterval(interval);
    }, [lineCount, revealedLines.length, lineWidth]);

    useEffect(() => {
        setRender(lineCount > 0);
    }, [lineCount, children]);

    return (
        <div ref={ref} className="relative">
            <div className={`transition-all ${render||withDefaultSkeleton? 'opacity-1' : 'opacity-0'}`}>
                {children}
            </div>
            {
                withDefaultSkeleton || render?
                    <div className="absolute w-full top-0 left-0">
                        {new Array(lineCount||4).fill(0).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="w-full rounded-lg absolute bg-white/50 backdrop-blur-2xl"
                                style={{
                                    height: `${lineHeight - 2}px`,
                                    width: revealedLines.includes(index) ? `0%` : `${index===3&&!lineCount?50:(widths[index]+10) / lineWidth * 100}%`,
                                    right: `${100 - ((widths[index]+10) / lineWidth * 100)}%`,
                                    transition: `all ${calculateTransitionSpeed(lineWidth)}ms`,
                                    top: `${index * lineHeight + 1}px`,
                                }}
                            />
                        ))}
                    </div> : null
            }
        </div>
    );
};
