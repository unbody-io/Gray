'use client';
import { Chip } from '@nextui-org/chip';
import { Link } from '@nextui-org/link';
import React from 'react';
import { KeywordColor } from '@/types/ui.types';

const formatKeywordToOriginal = (keyword: string) => {
    return keyword.replace(/-/g, ' ');
};

type KeywordChipProps = {
    text: string;
    color?: KeywordColor;
    link?: string;
    onClose?: () => void;
    icon?: React.ReactNode;
};

export const KeywordChip = ({ text, color, link, onClose, icon }: KeywordChipProps) => {
    return (
        <Chip
            color={color || 'default'}
            variant={'flat'}
            size='md'
            className={`mt-1 capitalize px-0 pt-0.5 pb-0.5 h-fit`}
            as={link ? Link : 'span'}
            {...(link ? { href: link } : {})}
            endContent={icon}
            onClose={onClose}
        >
            {formatKeywordToOriginal(text)}
        </Chip>
    );
};

KeywordChip.defaultProps = {
    color: '#fff',
    link: '#',
    onClose: () => {},
    icon: <div />
};
