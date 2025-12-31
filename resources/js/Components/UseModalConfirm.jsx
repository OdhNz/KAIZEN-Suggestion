import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";

const useModalConfirm = (props) => {
    const {
        modalStatus = false,
        modalTitle = "Are you sure you want to delete data?",
        toggleModal,
        onSubmit,
        size = "3xl",
        modalName = "GA Reservation Utility",
    } = props;

    return (
        <Modal size={size} show={modalStatus} onClose={() => toggleModal()}>
            <Modal.Header className="text-sm">{modalName}</Modal.Header>
            <Modal.Body className="overflow-x-hidden">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-xl font-medium text-gray-900 dark:text-white">
                        {modalTitle}
                    </h1>
                    <div className="flex flex-row gap-4 mt-10">
                        <Button
                            color="failure"
                            onClick={() => {
                                onSubmit();
                                toggleModal();
                            }}
                        >
                            YES
                        </Button>
                        <Button onClick={() => toggleModal()}>NO</Button>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
        </Modal>
    );
};

export default useModalConfirm;
