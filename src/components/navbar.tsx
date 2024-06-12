import React, {useState} from "react";
import {Navbar as NextUINavbar, NavbarBrand,} from "@nextui-org/navbar";
import clsx from "clsx";

import {Menu} from "@/components/Menu";
import {SearchBar, SearchBarProps} from "@/components/SearchBar";

type NavbarProps = {
    searchBoxProps?: SearchBarProps
}

export const Navbar = (props: NavbarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <NextUINavbar position="sticky"
                          className={clsx(
                              "bg-transparent px-0 pt-8 pb-10 w-full",
                              "bg-gradient-to-b from-default-100 to-transparent",
                              "-mb-4"
                          )}
                          isBlurred={false}
            >
                <NavbarBrand className={"flex justify-center"}>
                    <SearchBar onSearch={() => {}} onClear={() => {}}/>
                </NavbarBrand>
                <Menu open={isMenuOpen}
                      onChange={setIsMenuOpen}
                />
            </NextUINavbar>
        </>
    );
};
