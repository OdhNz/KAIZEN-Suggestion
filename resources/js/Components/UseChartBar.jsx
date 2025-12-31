import { Column } from "@ant-design/plots";
import React from "react";

const UseChartBar = (props) => {
    const { data: value } = props;

    const data = value.filter((item) => item.frequency > 0);

   // const data = [...value];
    const config = {
        data,
        xField: "letter",
        yField: "frequency",
        onReady: ({ chart }) => {
            try {
                const { height } = chart._container.getBoundingClientRect();
                const tooltipItem =
                    data[Math.floor(Math.random() * data.length)];
                chart.on(
                    "afterrender",
                    () => {
                        chart.emit("tooltip:show", {
                            data: {
                                data: tooltipItem,
                            },
                            offsetY: height / 2 - 60,
                        });
                    },
                    true
                );
            } catch (e) {
                console.error(e);
            }
        },
    };
    return <Column {...config} />;
};
export default UseChartBar;
