import React from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
    DropdownSection
} from "@nextui-org/react";
import clsx from "clsx";
import {useSiteData} from "@/context/context.site-data";
import {EmailIcon, GithubIcon, MenuIcon} from "@/components/icons";
import {Button} from "@nextui-org/button";
import Link from "next/link";

export const DefaultsMenu = () => {
    const {context, icon} = useSiteData();
    return (
        <div className={clsx(
            "flex items-center gap-4 fixed",
            "bottom-4 left-4 z-50"
        )}>
            <Dropdown placement="top-start"
                      size={"lg"}
                      backdrop={"blur"}
                      className={"bg-transparent backdrop-blur-xl"}
                      classNames={{
                          backdrop: "bg-transparent",
                      }}
            >
                <DropdownTrigger>
                    <Button isIconOnly={true}>
                        <MenuIcon size={32}
                                  fill={"rgba(0,0,0,0.6)"}
                        />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Menu Actions"
                              variant="shadow"
                              className={"md:w-[400px]"}
                >
                    <DropdownSection title="Pages" showDivider>
                        <DropdownItem key="profile">
                            <div className={"flex gap-4"}>
                                <Avatar
                                    size={"md"}
                                    as="button"
                                    className="transition-transform"
                                    src={icon||"/img.png"}
                                />
                                <div className="flex flex-col">
                                    <strong className={"font-semibold"}>
                                        {context.title}
                                    </strong>
                                    <p className={"text-gray-500 capitalize"}>
                                        {context.siteType}
                                    </p>
                                </div>
                            </div>
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection title="profile" showDivider>
                        <DropdownItem key="settings">
                            <Link href={"/"}>
                                Home
                            </Link>
                        </DropdownItem>
                        <DropdownItem key="settings">
                            <Link href={"/explore/search?query=Explore this blog"}>
                                Explore
                            </Link>
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection title="Provider" showDivider>
                        <DropdownItem>
                            <div className={"text-gray-500 capitalize flex gap-2"}>
                                <EmailIcon fill={"gray"}
                                           width={24}
                                />
                                <a href={"mailto:info@unbody.io"}>
                                    Get your own Gray blog
                                </a>
                            </div>
                        </DropdownItem>
                        <DropdownItem>
                            <div className={"text-gray-500 capitalize flex gap-2 items-center"}>
                                <GithubIcon fill={"gray"}
                                            width={24}
                                />
                                <a href={"https://github.com/unbody-io/Gray"}>
                                    Build your own Gray blog
                                </a>
                            </div>
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection>
                        <DropdownItem variant={"light"}>
                            <p className={"text-tiny"}>
                                <span>Powered by </span>
                                <span className={"text-gray-500"}>
                                    GRAY
                                </span>
                                <span> from </span>
                                <a href={"https://unbody.io"} target={"_blank"}
                                   className={"underline-offset-2 underline"}>Unbody</a>
                            </p>
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}
