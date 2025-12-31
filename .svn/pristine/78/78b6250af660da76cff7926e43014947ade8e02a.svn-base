import { Button, Card, HR } from "flowbite-react";
import React, { useEffect, useState, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import useStore from "../../State/useStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingPage from "./LoadingPage";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const Dashboard = () => {
    const { rsvDsbFetchAll } = useStore();
    const [sumData, setSumData] = useState();
    const [chartReq, setChartReq] = useState({});
    const [chartBarReq, setChartBarReq] = useState({});
    const [chartStarPie, setChartStarPie] = useState({});
    const queryClient = useQueryClient();
    const [dateMonth, setDateMonth] = useState(dayjs().format("YYYY-MM-DD"));
    const {
        data: dataDashboard = [],
        isFetching: isFetchDashboard,
        refetch: refetchDashboard,
    } = useQuery({
        queryKey: ["dataDashboard", { tl_date: dateMonth }],
        queryFn: rsvDsbFetchAll,
        enabled: false,
    });

    const onChartReq = (data) => {
        const newRev = data.map((res) => {
            return res.new;
        });
        const progRev = data.map((res) => {
            return res.ongo;
        });
        const compRev = data.map((res) => {
            return res.comp;
        });
        const date = data.map((res) => {
            return res.dt;
        });
        const chartOpt = {
            series: [
                {
                    name: "New",
                    data: [...newRev],
                },
                {
                    name: "On Going",
                    data: [...progRev],
                },
                {
                    name: "Complete",
                    data: [...compRev],
                },
            ],
            options: {
                chart: {
                    height: 350,
                    type: "line",
                    dropShadow: {
                        enabled: true,
                        color: "#000",
                        top: 18,
                        left: 7,
                        blur: 10,
                        opacity: 0.5,
                    },
                    zoom: {
                        enabled: false,
                    },
                    toolbar: {
                        show: false,
                    },
                },
                colors: ["#A1E3F9", "#F1BA88", "#81E7AF"],
                dataLabels: {
                    enabled: true,
                },
                stroke: {
                    curve: "smooth",
                },
                title: {
                    text: "Daily Reservations",
                    align: "left",
                },
                grid: {
                    borderColor: "#e7e7e7",
                    row: {
                        colors: ["#f3f3f3", "transparent"],
                        opacity: 0.5,
                    },
                },
                markers: {
                    size: 1,
                },
                xaxis: {
                    categories: [...date],
                    title: {
                        text: "Day",
                    },
                },
                yaxis: {
                    title: {
                        text: "Reservation",
                    },
                    min: 0,
                    max: 20,
                },
                legend: {
                    position: "top",
                    horizontalAlign: "right",
                    floating: true,
                    offsetY: -25,
                    offsetX: -5,
                },
            },
        };

        setChartReq({ ...chartOpt });
    };
    const onBarReq = (data) => {
        const group = Map.groupBy(data, (item) => item.status);
        const week = [
            ...new Set(
                data.map((res) => {
                    return res.week;
                })
            ),
        ];
        const barN = group.get("N").map((res) => {
            return res.val;
        });
        const barP = group.get("P").map((res) => {
            return res.val;
        });
        const barC = group.get("C").map((res) => {
            return res.val;
        });

        const chartOpt = {
            series: [
                {
                    name: "New",
                    data: [...barN],
                },
                {
                    name: "Progress",
                    data: [...barP],
                },
                {
                    name: "Complete",
                    data: [...barC],
                },
            ],
            options: {
                chart: {
                    type: "bar",
                    height: 350,
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: "55%",
                        borderRadius: 5,
                        borderRadiusApplication: "end",
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ["transparent"],
                },
                xaxis: {
                    categories: [...week],
                },
                yaxis: {
                    title: {
                        text: "Reservation",
                    },
                },
                fill: {
                    opacity: 1,
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + " reservation";
                        },
                    },
                },
            },
        };
        setChartBarReq({ ...chartOpt });
    };

    const onStarPie = (data) => {
        const star = data.map((res) => {
            return res.val;
        });
        const starData = {
            series: [...star],
            options: {
                chart: {
                    height: 390,
                    type: "radialBar",
                },
                plotOptions: {
                    radialBar: {
                        offsetY: 0,
                        startAngle: 0,
                        endAngle: 270,
                        hollow: {
                            margin: 5,
                            size: "30%",
                            background: "transparent",
                            image: undefined,
                        },
                        dataLabels: {
                            name: {
                                show: false,
                            },
                            value: {
                                show: false,
                            },
                        },
                        yaxis: {
                            min: 0,
                            max: 20,
                        },
                        barLabels: {
                            enabled: true,
                            useSeriesColors: true,
                            offsetX: -8,
                            fontSize: "16px",
                            formatter: function (seriesName, opts) {
                                return (
                                    seriesName +
                                    ":  " +
                                    opts.w.globals.series[opts.seriesIndex]
                                );
                            },
                        },
                    },
                },
                colors: ["#f2aa0f", "#f2c50f", "#f2e30f", "#e7f20f", "#ccf20f"],
                labels: ["⭐(5)", "⭐(4)", "⭐(3)", "⭐(2)", "⭐(1)"],
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            legend: {
                                show: false,
                            },
                        },
                    },
                ],
            },
        };
        setChartStarPie(starData);
        window.dispatchEvent(new Event("resize"));
    };
    const onSearch = async () => {
        queryClient.removeQueries({ queryKey: ["dataDashboard"] });
        refetchDashboard();
    };
    const onChangeDate = (res) => {
        res && setDateMonth(res.format("YYYY-MM-DD"));
    };
    useEffect(() => {
        if (dataDashboard.length !== 0) {
            setSumData(dataDashboard?.sum[0]);
            onStarPie(dataDashboard?.star);
            onChartReq(dataDashboard?.req);
            onBarReq(dataDashboard?.bar);
        }
    }, [dataDashboard]);

    return (
        <>
            {isFetchDashboard ? <LoadingPage /> : null}
            <div className="w-full bg-transparent p-4 flex flex-col gap-3">
                <Card className="w-full h-fit">
                    <div className="flex flex-col w-full h-full">
                        <div className="flex flex-row align-bottom">
                            <h2 className="text-3xl font-medium text-zinc-600 ">
                                DASHBOARD
                            </h2>
                            <div className="flex flex-row gap-3 ml-auto mt-auto h-10">
                                <span className="m-auto text-center text-gray-700 font-semibold">
                                    Month :
                                </span>
                                <DatePicker
                                    defaultValue={dayjs()}
                                    onChange={onChangeDate}
                                    picker="month"
                                />

                                <Button onClick={onSearch} color="success">
                                    Search
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col w-full gap-3 h-[670px] overflow-auto">
                        <div className="flex flex-row gap-6 items-center justify-center w-full">
                            <div className="flex flex-row flex-wrap w-1/2">
                                <div className="w-full">
                                    <p>Reservation by Location</p>
                                    <HR />
                                </div>
                                <Card className="w-full h-fit">
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="font-medium text-zinc-600">
                                            {sumData?.rsv_nm}
                                        </p>
                                        <h2 className="text-6xl font-bold text-zinc-700">
                                            {sumData?.rsv}
                                        </h2>
                                    </div>
                                </Card>
                                <Card className="w-1/2 h-fit">
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="font-medium text-zinc-600">
                                            {sumData?.loc_gen_nm}
                                        </p>
                                        <h2 className="text-6xl font-bold text-zinc-700">
                                            {sumData?.loc_gen}
                                        </h2>
                                    </div>
                                </Card>
                                <Card className="w-1/2 h-fit">
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="font-medium text-zinc-600">
                                            {sumData?.loc_dom_nm}
                                        </p>
                                        <h2 className="text-6xl font-bold text-zinc-700">
                                            {sumData?.loc_dom}
                                        </h2>
                                    </div>
                                </Card>
                            </div>
                            <div className="flex flex-row flex-wrap w-1/2">
                                <div className="w-full">
                                    <p>Reservation by Status</p>
                                    <HR />
                                </div>
                                <Card className="w-1/2 h-fit">
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="font-medium text-sky-700">
                                            {sumData?.new_nm}
                                        </p>
                                        <h2 className="text-6xl font-bold text-sky-800">
                                            {sumData?.new}
                                        </h2>
                                    </div>
                                </Card>
                                <Card className="w-1/2 h-fit">
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="font-medium text-amber-500">
                                            {sumData?.prog_nm}
                                        </p>
                                        <h2 className="text-6xl font-bold text-amber-600">
                                            {sumData?.prog}
                                        </h2>
                                    </div>
                                </Card>
                                <Card className="w-1/2 h-fit">
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="font-medium text-emerald-500">
                                            {sumData?.success_nm}
                                        </p>
                                        <h2 className="text-6xl font-bold text-emerald-600">
                                            {sumData?.success}
                                        </h2>
                                    </div>
                                </Card>
                                <Card className="w-1/2 h-fit">
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="font-medium text-red-600">
                                            {sumData?.rej_nm}
                                        </p>
                                        <h2 className="text-6xl font-bold text-red-700">
                                            {sumData?.rej}
                                        </h2>
                                    </div>
                                </Card>
                            </div>
                        </div>
                        <HR />
                        <div className="flex flex-row w-full">
                            <div className="w-2/3 flex flex-col">
                                <div className="w-full">
                                    <p>Weekly Reservations</p>
                                    <HR />
                                </div>
                                {chartBarReq.options ? (
                                    <ReactApexChart
                                        options={chartBarReq.options}
                                        series={chartBarReq.series}
                                        type="bar"
                                        height={450}
                                    />
                                ) : null}
                            </div>
                            <div className="w-1/3 flex flex-col">
                                <div className="w-full">
                                    <p>Star Accumulation</p>
                                    <HR />
                                </div>
                                {chartStarPie.options ? (
                                    <ReactApexChart
                                        options={chartStarPie.options}
                                        series={chartStarPie.series}
                                        type="radialBar"
                                        height={390}
                                    />
                                ) : null}
                            </div>
                        </div>
                        <div className="w-full max-w-[1610px]">
                            {chartReq.options ? (
                                <ReactApexChart
                                    options={chartReq.options}
                                    series={chartReq.series}
                                    type="line"
                                    height={450}
                                />
                            ) : null}
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Dashboard;
