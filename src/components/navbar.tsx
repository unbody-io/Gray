import React, {useState} from "react";
import NextLink from "next/link";
import {link as linkStyles} from "@nextui-org/theme";
import {
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarItem,
} from "@nextui-org/navbar";
import clsx from "clsx";

import {SearchBox, SearchBoxProps} from "@/components/SearchBox";
import {Button} from "@nextui-org/button";
import {MenuIcon} from "@/components/icons";
import {Menu} from "@/components/Menu";

type NavbarProps = {
    searchBoxProps?: SearchBoxProps
}

export const Navbar = (props: NavbarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <NextUINavbar position="sticky"
                          className={"bg-transparent px-0 pt-4 pb-4 lg:pt-8 lg:pb-10 max-w-screen-md"}
                          style={{
                              borderRadius: "0 0 25px 25px",
                              overflow: "hidden"
                          }}
            >
                <NavbarBrand>
                    <div className="flex  flex-row w-full gap-2 justify-center items-center rounded-xl">
                        <Button
                            isIconOnly={true}
                            aria-label="Home"
                            className={
                                clsx([
                                    "shadow-xl",
                                    "bg-default-200/50",
                                    "dark:bg-default/60",
                                    "backdrop-blur-xl",
                                    "backdrop-saturate-200",
                                    "hover:bg-default-200/70",
                                    "dark:hover:bg-default/70",
                                    "p-2",
                                    "rounded-full",
                                ])
                            }
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {
                                isMenuOpen?
                                    <MenuIcon className={"fill-gray-400    h-[24px] rotate-1"} size={32}/>
                                    :
                                    <MenuIcon className={"fill-gray-400   h-[24px]"} size={32}/>
                            }
                        </Button>
                        <SearchBox   {...(props.searchBoxProps||{})}/>
                    </div>
                </NavbarBrand>
                <Menu  open={isMenuOpen}
                      onChange={setIsMenuOpen}
                />
            </NextUINavbar>
        </>
    );
};
