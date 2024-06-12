import React, {useState, useRef, useEffect} from 'react';
import clsx from 'clsx';


type Props = {
    onOpen?: () => void
    openIndex?: number
    index: number
    children: React.ReactNode
    height?: number
    maxStackSize?: number
    gap?: number
}

export const CardStack = (props: Props) => {
    const {onOpen, openIndex = -1, index, children, height = 100, maxStackSize = 3, gap=30} = props

    const isOneOfStacksOpen = openIndex > -1;
    const isOpen = openIndex === index;

    const [hovering, setHovering] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const onMouseEnter = () => setHovering(true);
    const onMouseLeave = () => setHovering(false);

    const childCount = React.Children.count(children);
    const childArray = React.Children.toArray(children).slice(0, isOpen?childCount:maxStackSize);

    const [totalHeightOfChildren, setTotalHeightOfChildren] = useState(0);
    useEffect(() => {
        if (ref.current && isOpen) {
            let totalHeight = 0;
            ref.current.childNodes.forEach((child) => {
                totalHeight += (child as HTMLElement).offsetHeight;
            });
            setTotalHeightOfChildren(totalHeight + childCount*gap);
        }
    }, [childArray.length]);

    const getTopWhenOpen = (index: number) => {
        return index*height + index*gap/2;
    }
    const getTopWhenClosed = (index: number) => {
        return hovering ? index * 10 : index * 7;
    }
    const getLeft = (index: number) => {
        return index * 3;
    }

    return (
        <div
            className={clsx([
                "transition-all ease-in-out duration-700",
                `${isOpen ? "drop-shadow-2xl py-6 px-4" : "drop-shadow-lg"}`,
                `${isOneOfStacksOpen && !isOpen ? "blur-lg opacity-30" : "opacity-100"}`
            ])}
            style={{
                minHeight: isOpen ? `${((childCount) * (height)) + gap+10}px` : `${height}px`,
                height: isOpen ? `${totalHeightOfChildren}px` : `${height}px`,
                zIndex: isOpen? 99999: index,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                className={"relative transition-all ease-in-out duration-700"}
                ref={ref}
                style={{
                    transform: `scale(${hovering && !isOneOfStacksOpen ? 1.05 : 1})`,
                }}
            >
                {
                    childArray
                        .map((child, _index) => {
                            if (!React.isValidElement(child)) return child;
                            const {className, style, ...rest} = child.props;

                            return (
                                    React.cloneElement(child, {
                                        className: clsx([
                                            "absolute w-full",
                                            className
                                        ]),
                                        style: {
                                            top: `${isOpen ? getTopWhenOpen(_index) : getTopWhenClosed(_index)}px`,
                                            left: `${(hovering || isOpen) ? 0 : getLeft(_index)}px`,
                                            minHeight: `${isOpen ? height : height}px`,
                                            zIndex: childCount + 1 - _index,
                                            transition: 'all 0.3s ease-in-out',
                                            ...style,
                                        },
                                        ...rest,
                                    })
                            )
                        })
                }
            </div>
        </div>
    );
};
