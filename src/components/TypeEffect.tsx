import React, { HTMLProps } from 'react';
import Typewriter from 'typewriter-effect';
import { renderToString } from 'react-dom/server';

type TypeEffectProps = {
    delay?: number;
    children: React.ReactElement | string;
    cursor?: string;
    onEnd?: () => void;
} & HTMLProps<HTMLDivElement>;

export const TypeEffect = ({
    children,
    cursor,
    delay = 10,
    onEnd = () => {}
}: TypeEffectProps) => {
    return (
        children && (
            <Typewriter
                onInit={(typewriter) => {
                    typewriter
                        .typeString(
                            typeof children === 'string'
                                ? children
                                : renderToString(children)
                        )
                        .callFunction((state) => {
                            state.elements.cursor.style.display = 'none';
                            onEnd();
                        })
                        .start();
                }}
                options={{
                    delay,
                    autoStart: true,
                    ...(cursor ? { cursor } : {})
                }}
            />
        )
    );
};

TypeEffect.defaultProps = {
    delay: 10,
    cursor: undefined,
    onEnd: undefined
};
