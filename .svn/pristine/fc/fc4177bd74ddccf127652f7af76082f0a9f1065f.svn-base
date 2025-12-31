import { usePage } from "@inertiajs/react";
import React, { useEffect, useState, useRef } from "react";
import DetailDashboardTable from "../Components/DetailDashboardTable";
import Notfound from "../Components/Notfound";
import { DownloadTableExcel } from "react-export-table-to-excel";
import MainLayout from "../Layouts/MainLayout";

const DetailDashboard = () => {
    const { detail } = usePage().props;
    const [dashboardData, setDasboardData] = useState([]);
    const tableRef = useRef(null);

    const getBack = () => {
        window.history.back();
    };
    useEffect(() => {
        setDasboardData([...detail]);
    }, []);

    return (
        <MainLayout>
            <div className="container flex flex-col justify-center items-center w-screen">
                <div className="container flex flex-col-reverse gap-2 items-stretch lg:flex-row lg: justify-between lg: items-center px-1 lg:px-20">
                    <div>
                        <h1 className=" text-xl text-primary lg:text-3xl font-extrabold">
                            Detail Dashboard
                        </h1>
                    </div>
                    <div className="flex flex-row gap-2 ">
                        <DownloadTableExcel
                            filename="Multiskill Detail Dashboard"
                            sheet="users"
                            currentTableRef={tableRef.current}
                        >
                            <button
                                type="button"
                                className="text-white py-3 bg-gradient-to-br from-cyan-950 to-sky-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-yellow-200 dark:focus:ring-yellow-800 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2"
                            >
                                Download
                            </button>
                        </DownloadTableExcel>
                        <button
                            onClick={() => getBack()}
                            className="w-48 btn btn-primary text-neutral"
                        >
                            Back
                        </button>
                    </div>
                </div>
                <div className="container m-5 w-full">
                    <DetailDashboardTable
                        data={dashboardData}
                        dataRef={tableRef}
                    ></DetailDashboardTable>
                </div>
                <div>
                    {dashboardData.length == 0 ? <Notfound></Notfound> : null}
                </div>
            </div>
        </MainLayout>
    );
};

export default DetailDashboard;
