import { Pie } from "@ant-design/charts";
import React from "react";
const useChartPie = (props) => {
    const { data } = props;
    console.log(data);
    const config = {
        data: [...data],
        angleField: "value",
        colorField: "type",
        label: {
            text: "value",
            style: {
                fontWeight: "bold",
            },
        },
        legend: {
            color: {
                title: false,
                position: "right",
                rowPadding: 5,
            },
        },
    };
    return (
        <div className="w-full h-full">
            {" "}
            <Pie {...config} />
        </div>
    );
};

export default useChartPie;
