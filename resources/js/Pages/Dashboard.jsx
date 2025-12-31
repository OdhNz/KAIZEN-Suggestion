import { Button, DatePicker, Spin, Modal } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState, useRef } from "react";
import UseChartPie from "../Components/UseChartPie";
import UseChartBar from "../Components/UseChartBar";
import { useQuery } from "@tanstack/react-query";
import useStore from "../State/useStore";
import { toast } from "react-toastify";
import DeptSummaryTable from "../Components/DeptSummaryTable";
import CategoryModal from "../Components/CategoryModal";

const Dashboard = () => {
    const { fetchDashboardKaizen } = useStore();
    const [searchMonth, setSearchMonth] = useState(dayjs());
    const [dataKaizen, setDataKaizen] = useState({});
    const [dataCategory, setDataCategory] = useState([]);
    const [dataKaizenDept, setDataKaizenDept] = useState([]);
    const [datakaizenDay, setDataKaizenDay] = useState([]);

    const { data: dashboardData = [], isFetching, refetch } = useQuery({
        queryKey: ["dashboardData", searchMonth ? searchMonth.format("YYYYMMDD") : "no-date"],
        queryFn: async () => {
            return await fetchDashboardKaizen({
                tlDate: searchMonth.format("YYYYMMDD"),
            });
        },
        enabled: !!searchMonth,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
      };
      

    useEffect(() => {
        if (dashboardData?.status === 200) {
            //console.log("✅ dashboardData:", dashboardData);

            const day = dashboardData.DAY.map((item) => ({
                letter: item.letter,
                frequency: item.frequency > 0 ? Number(item.frequency) : null,
            }));
    
            setDataKaizen(dashboardData.ALL[0]);
            setDataCategory(dashboardData.CAT);
            setDataKaizenDept(dashboardData.DEPT);

            //console.log("✅ dataKaizenDept (set from DEPT):", dashboardData.DEPT);

            setDataKaizenDay(day);
        }
    }, [dashboardData]);
    
    const onSearch = () => {
        refetch().then((res) => {
            const { data } = res;

            //console.log("🔄 onSearch result:", data);

            if (data.status == 200) {
                const day = data.DAY.map((item) => {
                    return {
                        letter: item.letter,
                        frequency: item.frequency > 0 ? Number(item.frequency) : null,
                    };
                });

                setDataKaizen(data.ALL[0]);
                setDataCategory(data.CAT);
                setDataKaizenDept(data.DEPT);

                console.log("✅ dataKaizenDept (set from DEPT):", data.DEPT);
                
                setDataKaizenDay(day);
            } else {
                toast.error(data.message);
            }
        });
    };

    return (
        <div className="flex flex-col min-w-full min-h-full gap-3 pb-16 md:pb-0 ">
            <div className="flex flex-col justify-between items-start w-full h-max p-1 gap-2 md:flex-row lg:px-10">
                <div className="text-left">
                    <span className="font-medium text-gray-500 lg:text-gray-200">
                        Kaizen Administrator Dashboard
                    </span>
                </div>
                <div className="flex flex-col gap-2 md:flex-row">
                    <div className="flex flex-col gap-2 md:gap-2 md:flex-row">
                        <span className="text-xs text-gray-700 font-semibold min-w-fit md:text-sm md:m-auto">
                            Month :
                        </span>
                        <DatePicker
                            defaultValue={dayjs()}
                            onChange={(res) => setSearchMonth(res)}
                            picker="month"
                        />
                    </div>
                    <Button
                        className="bg-emerald-700 text-white font-medium hover:!bg-emerald-600 hover:!text-white hover:!outline-white"
                        onClick={onSearch}
                    >
                        Search
                    </Button>
                </div>
            </div>
            <Spin spinning={isFetching}>
                <div className="flex flex-col items-start justify-center w-full min-h-full gap-3 md:flex-row mb-3">
                    <div className="flex flex-col w-full h-full bg-white rounded shadow-lg p-5 md:w-1/3 md:min-h-[372px]">
                        <span className="text-sm text-gray-400 px-10">
                            Summary by Category
                        </span>
                        <div className="flex flex-col items-start justify-center w-full ">
                            <div className="flex flex-col items-center justify-center w-full gap-3 py-5">
                                <div className="text-3xl text-gray-500 font-bold m-auto">
                                    TOTAL
                                </div>
                                <div className="text-8xl text-gray-700 font-bold m-auto">
                                    {dataKaizen.tot}
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 items-center justify-between w-full m-auto">
                                <div className="flex flex-col items-center justify-center w-1/3 py-5">
                                    <div className="text-base  md:text-sm lg:text-xl text-blue-500 font-bold m-auto">
                                        NEW
                                    </div>
                                    <div className="text-5xl text-blue-700 font-bold m-auto">
                                        {dataKaizen.n}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center w-1/3 py-5">
                                    <div className="text-base md:text-sm lg:text-xl text-red-500 font-bold m-auto">
                                        REJECTED
                                    </div>
                                    <div className="text-5xl text-red-700 font-bold m-auto">
                                        {dataKaizen.r}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center w-1/3 py-5">
                                    <div className="text-base  md:text-sm lg:text-xl text-emerald-500 font-bold m-auto">
                                        APPROVED
                                    </div>
                                    <div className="text-5xl text-emerald-700 font-bold m-auto">
                                        {dataKaizen.a}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full h-full bg-white rounded shadow-lg p-5 md:w-2/3 md:min-h-[360px]">
                        <span className="text-sm text-gray-400 px-10">
                            Summary by Category
                        </span>
                        <div className="flex flex-row flex-wrap items-center justify-center w-full">
                            {dataCategory.map((res, index) => {
                                return (
                                    <div
                                        className="flex flex-col items-center justify-center w-1/3 gap-2 py-10 rounded shadow-sm"
                                        key={"CAT" + index}
                                        onClick={() => handleCategoryClick(res)}
                                    >
                                        {" "}
                                        <div
                                            style={{ color: res.color }}
                                            className="text-center text-sm font-bold md:text-xl "
                                        >
                                            {res.name}
                                        </div>
                                        <div
                                            style={{ color: res.color }}
                                            className="text-4xl font-bold"
                                        >
                                            {res.cnt}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col h-full items-center justify-center gap-3 md:flex-row md:max-h-fit">
                    <div className="w-full h-full md:w-2/3 bg-white rounded shadow-lg">
                        <UseChartBar data={datakaizenDay} />
                    </div>
                    <div className="w-full h-full  md:w-1/3 bg-white rounded shadow-lg">
                        {/* <UseChartPie data={dataKaizenDept} /> */}
                        <DeptSummaryTable data={dataKaizenDept} searchMonth={searchMonth} />
                    </div>
                </div>
                <CategoryModal 
                category={selectedCategory} 
                open={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                searchMonth={searchMonth} />
            </Spin>
        </div>
    );
};

export default Dashboard;
