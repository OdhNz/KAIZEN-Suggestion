import React from "react";
import load from "../../assets/load.png";
import { Spin } from "antd";

const Loading = () => {
    return (
        <div className="flex w-full h-full items-center justify-center bg-opacity-75 fixed top-0 right-0">
            <Spin />
        </div>
    );
};

export default Loading;
