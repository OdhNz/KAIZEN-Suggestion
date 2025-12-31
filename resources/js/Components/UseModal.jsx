import Modal from "antd/es/modal/Modal";
import React, { useContext, useEffect, useState } from "react";
import UseLabelHeader from "./UseLabelHeader";

const useModal = (props) => {
    const {
        modalStatus = false,
        toggleModal,
        size = "3xl",
        modalName = "Kaizen Sugestion",
        className = "overflow-x-hidden",
    } = props;
    return (
        <Modal
            title={
                <h1 className="text-emerald-700 rounded-sm font-medium dark:text-emerald-700">
                    {modalName}
                </h1>
            }
            className="w-max"
            open={modalStatus}
            maskClosable={false}
            footer={null}
            onCancel={() => toggleModal()}
        >
            <div className="flex flex-col items-start w-full">
                <span className={className}>{props.children}</span>
            </div>
        </Modal>
    );
};

export default useModal;
