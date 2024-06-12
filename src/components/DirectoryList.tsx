import {Directory} from "@/types/data.types";
import {DirectoryCard} from "@/components/DirectoryCard";
import clsx from "clsx";

type Props = {
    data: Directory[]
}

export const DirectoryList = ({data: directories}: Props) => {

    const maskWidth = 100;
    const gap = `1rem`;
    const cols = 4;

    const commonClasses = [
        `px-[${maskWidth}px]`,
        `-translate-x-[${maskWidth}px]`,
        'relative',
    ]

    const gardenClassesL = [
        `absolute top-0`,
        `bg-gradient-to-r from-gray-100 to-transparent`,
        `z-10`,
        `w-[${maskWidth * 1.5}px] h-full`,
    ]

    const gardenClassesR = [
        `absolute right-0 top-0`,
        `bg-gradient-to-l from-gray-100 via-gray-100/80 to-transparent`,
        `z-10`,
        `h-full`,
    ]

    return (
        <div className={clsx(
            ...commonClasses,
            'overflow-hidden',
            'h-[420px]',
            '-mb-6 -mt-8',
            'py-2'
        )}
             style={{
                    width: `calc(100% + ${maskWidth * 2}px)`,
                    marginLeft: `-${maskWidth}px`,
             }}
        >
            <div className={clsx(...gardenClassesL)}
                 style={{
                     width: `${maskWidth*2}px`,
                        left: `-${maskWidth*0.1}px`,
                }}
            />
            <div className={clsx(...gardenClassesR)}
                 style={{width: `${maskWidth * 2}px`}}
            />
            <div className={clsx(
                ...commonClasses,
                'pb-24 pt-6',
                'overflow-x-scroll',
                'overflow-y-hidden',
                'flex'
            )}>
                <div className={`flex gap-4 z-1`}
                     style={{
                         gap,
                         width: `calc(10px + calc(${directories.length * 100}% / ${cols}))`,
                         paddingLeft: `${maskWidth}px`,
                    }}
                >
                    {
                        directories.map((directory, i) => (
                            <div key={i}
                                 className="flex-shrink-0"
                                 style={{ width: `calc(100% / ${cols})` }}
                            >
                                <DirectoryCard data={directory}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
