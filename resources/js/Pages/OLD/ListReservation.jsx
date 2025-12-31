import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Card } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import useStore from "../State/useStore";
import LoadingPage from "./LoadingPage";
import { DatePicker, Select, Tag } from "antd";
import dayjs from "dayjs";
import ListReservationModal from "../Components/ListReservationModal";
import UseTableAnt from "../Components/UseTableAnt";

const columns = [
    {
        title: "No",
        dataIndex: "no",
        key: "no",
        width: 15,
        fixed: "left",
        render: (id, record, index) => {
            ++index;
            return index;
        },
        filter: false,
        sort: false,
    },
    {
        title: "ID",
        dataIndex: "cd_nm",
        key: "cd_nm",
        width: 25,
        fixed: "left",
        filter: true,
        sort: true,
    },
    {
        title: "Location",
        dataIndex: "location_fnm",
        key: "location_fnm",
        width: 30,
        fixed: "left",
        onCell: (record, index) => ({
            style: {
                whiteSpace: "pre",
            },
        }),
        filter: true,
        sort: false,
    },
    {
        title: "Group Location",
        dataIndex: "loc_grp_nm",
        key: "loc_grp_nm",
        width: 40,
        hidden: true,
        filter: true,
        sort: false,
    },
    {
        title: "Location",
        dataIndex: "loc_nm",
        key: "loc_nm",
        width: 35,
        hidden: true,
        filter: true,
        sort: false,
    },
    {
        title: "Status",
        key: "operation",
        dataIndex: "status",
        width: 25,
        fixed: "left",
        render: (text, record, index) => (
            <Tag
                color={
                    record.status == "N"
                        ? "#108ee9"
                        : record.status == "P"
                        ? "#f50"
                        : record.status == "R"
                        ? "#fc1703"
                        : record.status == "S"
                        ? "#fcb103"
                        : "#87d068"
                }
            >
                {" "}
                {record.status_nm}
            </Tag>
        ),
    },
    {
        title: "Date",
        dataIndex: "tl_date",
        key: "tl_date",
        width: 25,
        filter: true,
        sort: true,
    },
    {
        title: "User",
        dataIndex: "id_nm",
        key: "id_nm",
        width: 40,
        onCell: (record, index) => ({
            style: {
                whiteSpace: "pre",
            },
        }),
        filter: true,
        sort: false,
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 150,
        hidden: true,
        filter: true,
        sort: false,
    },
    {
        title: "Dept",
        dataIndex: "dept_nm",
        key: "dept_nm",
        width: 25,
        filter: true,
        sort: false,
    },
    {
        title: "Repair Group",
        dataIndex: "repair_grp_nm",
        key: "repair_grp_nm",
        width: 100,
        hidden: true,
        filter: true,
        sort: false,
    },
    {
        title: "Repair",
        dataIndex: "repair_nm",
        key: "repair_nm",
        width: 100,
        hidden: true,
        filter: true,
        sort: false,
    },
    {
        title: "Remark",
        dataIndex: "remark",
        key: "remark",
        width: 50,
        filter: true,
        sort: false,
    },
    {
        title: "Proggress Date",
        key: "operation",
        width: 45,
        render: (text, record, index) => {
            return (
                <span>
                    {record.bgn_dt} - {record.end_dt}
                </span>
            );
        },
    },
    {
        title: "Progress Remark",
        dataIndex: "remark_dtl",
        key: "remark_dtl",
        width: 40,
        filter: true,
        sort: false,
    },
    {
        title: "Complete Date",
        dataIndex: "complete_dt",
        key: "complete_dt",
        width: 40,
        filter: true,
        sort: true,
    },
    {
        title: "Complete Remark",
        dataIndex: "complete_remark",
        key: "complete_remark",
        width: 40,
        filter: true,
        sort: false,
    },
    {
        title: "Rating",
        dataIndex: "score",
        key: "score",
        width: 20,
        hidden: false,
        filter: true,
        sort: false,
    },
];
const locationGrpOption = [
    { value: "", label: <span>ALL</span> },
    { value: "GEN", label: <span>GENERAL</span> },
    { value: "DOM", label: <span>DORMITORY</span> },
];
const ListReservation = () => {
    const { listReservationData, rsvById } = useStore();
    const [loadingPage, setLoadingPage] = useState(false);
    const [rsvModal, setRsvModal] = useState(false);
    const [srcLocGrp, setSrcLocGrp] = useState("");
    const [rangeDate, setRangeDate] = useState({
        bgn: dayjs().startOf("month"),
        end: dayjs().endOf("month"),
    });
    const [formData, setFormData] = useState([]);
    const {
        data: dataReservation = [],
        isFetching: isFetchReservation,
        refetch: refetchCalendar,
    } = useQuery({
        queryKey: [
            "ListReservationPage",
            {
                bgn: rangeDate.bgn.format("YYYY-MM-DD"),
                end: rangeDate.end.format("YYYY-MM-DD"),
                locGrp: srcLocGrp,
            },
        ],
        queryFn: listReservationData,
        enabled: false,
    });
    const onClickButtonDetail = (res) => {
        setFormData({ ...res, formStatus: "V" });
        setRsvModal(true);
    };
    const onChangeSrcLocGrp = (res) => {
        setSrcLocGrp(res);
    };
    const onChangeDate = (res) => {
        setRangeDate(() => {
            return {
                bgn: dayjs(res[0]),
                end: dayjs(res[1]),
            };
        });
    };
    const onSearch = async () => {
        const fetch = await refetchCalendar();
    };

    return (
        <>
            <ListReservationModal
                status={formData.status}
                formData={formData}
                modal={rsvModal}
                setModal={setRsvModal}
            />
            <div className="w-[calc(100%-10px)] h-[900px] p-4 bg-transparent overflow-hidden">
                <Card className="w-full h-full flex flex-col gap-3">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row align-bottom">
                            <h2 className="text-3xl font-medium text-zinc-600 ">
                                LIST RESERVATION
                            </h2>
                            <div className="flex flex-row gap-3 ml-auto mt-auto h-10">
                                <div className="flex flex-row gap-1 items-center">
                                    <span className="m-auto text-center text-gray-700 font-semibold">
                                        Group Location :
                                    </span>
                                    <Select
                                        style={{ width: 130, height: 40 }}
                                        options={[...locationGrpOption]}
                                        defaultValue={""}
                                        onChange={onChangeSrcLocGrp}
                                    />
                                </div>
                                <div className="flex flex-row gap-1">
                                    <span className="m-auto text-center text-gray-700 font-semibold">
                                        Date :
                                    </span>
                                    <DatePicker.RangePicker
                                        defaultValue={[
                                            rangeDate.bgn,
                                            rangeDate.end,
                                        ]}
                                        onChange={(res) => onChangeDate(res)}
                                        disabled={[false, false]}
                                    />
                                </div>

                                <Button color="success" onClick={onSearch}>
                                    Search
                                </Button>
                            </div>
                        </div>
                    </div>
                    <UseTableAnt
                        columns={[
                            ...columns,
                            {
                                title: "Action",
                                key: "operation",
                                width: 20,
                                fixed: "right",
                                render: (text, record, index) => (
                                    <div className="p-1">
                                        <Button
                                            className="bg-emerald-400 text-white hover:!bg-emerald-600"
                                            onClick={() =>
                                                onClickButtonDetail(record)
                                            }
                                        >
                                            Detail
                                        </Button>
                                    </div>
                                ),
                            },
                        ]}
                        loading={isFetchReservation}
                        data={dataReservation}
                        height={620}
                        width="2000px"
                    />
                </Card>
            </div>
        </>
    );
};

export default ListReservation;
