import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter, useDisclosure
} from "@nextui-org/react";
import React from "react";
import {Button} from "@nextui-org/button";
import {useSiteData} from "@/context/context.site-data";

type Props = {
    open?: boolean
    onChange?: (isOpen: boolean) => void
}

export const Menu = (props: Props) => {
    const {open, onChange} = props;
    const {context} = useSiteData();

    const {isOpen, onOpen, onOpenChange} = useDisclosure({
        isOpen: open
    });

    const handleChange = (_isOpen: boolean) => {
        onChange!(_isOpen);
        onOpenChange();
    }

    return (
        <Modal isOpen={isOpen}
               onOpenChange={handleChange}
               size={"3xl"}
               backdrop={"blur"}
        >
            <ModalContent className={"bg-gray-100"}>
                {
                    (onClose) => (
                        <>
                            <ModalHeader>{context?.title}</ModalHeader>
                            <ModalBody>
                                body
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}
