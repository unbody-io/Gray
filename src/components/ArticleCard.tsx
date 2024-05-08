import { Card, CardProps } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';

export const articleCardBaseClasses = clsx([
    'p-2',
    'shadow-lg',
    'bg-default-200/100',
    'backdrop-blur-xl',
    'backdrop-saturate-200',
    'hover:bg-default-200/80',
    'dark:bg-default/100',
    'dark:hover:bg-default/70',
    'translate-y-0',
    'translate-x-0',
    'transition-all'
]);

export const ArticleCard = (props: CardProps) => {
    const { children, className, ...rest } = props;

    return (
        <Card className={clsx(['pt-0', 'duration-700', className])} {...rest}>
            {children}
        </Card>
    );
};
