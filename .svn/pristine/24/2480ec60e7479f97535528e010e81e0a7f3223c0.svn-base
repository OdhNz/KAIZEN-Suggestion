import { Divider, Tag } from "antd";
import React, { useContext } from "react";
import Marquee from "react-fast-marquee";

const UseLabelHeader = (props) => {
    const { title, label, desc, color = "#009966", marquee } = props;
    return (
        <>
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-600 md:text-5xl lg:text-6xl ">
                <mark
                    style={{ backgroundColor: color }}
                    className="px-2 text-white rounded-sm dark:bg-emerald-500"
                >
                    {title}
                </mark>{" "}
                {label}
            </h1>
            {marquee ? (
                <Marquee className="bg-emerald-600">
                    <span className="text-2xl text-white font-bold bg-emerald-600 px-1">
                        {marquee}
                    </span>
                </Marquee>
            ) : null}
            {desc ? (
                <Tag
                    bordered={false}
                    color="green"
                    className="text-lg !text-gray-600 font-bold md:text-3xl"
                >
                    {desc}
                </Tag>
            ) : null}
            <Divider />
        </>
    );
};

export default UseLabelHeader;
