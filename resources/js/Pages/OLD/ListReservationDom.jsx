import { usePage } from "@inertiajs/react";
import React, { useState, useMemo, useEffect } from "react";
import { Button, Card } from "flowbite-react";
import UseTable from "../Components/useTable";
import UseModal from "../Components/UseModal";
import useStore from "../State/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TabItem, Tabs } from "flowbite-react";
import {
    HiBookOpen,
    HiBriefcase,
    HiCheckCircle,
    HiNewspaper,
    HiOutlineXCircle,
} from "react-icons/hi";

import { toast } from "react-toastify";
import UseLabelHeader from "../Components/UseLabelHeader";
import AdminReservationApproveForm from "./AdminReservation/AdminReservationApproveForm";
import UserReservationForm from "./UserReservation/UserReservationForm";
import AdminReservationCompleteForm from "./AdminReservation/AdminReservationCompleteForm";
import UserReservationFormReview from "./UserReservation/UserReservationFormReview";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import ListReservationModal from "../Components/ListReservationModal";

const columnData = [
    {
        accessorKey: "company",
        header: () => <span>Company</span>,
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "loc_grp_nm",
        header: () => "Group Location",
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "loc_nm",
        header: () => "Location",
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "tl_date",
        header: "Date",
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "rsv_user",
        header: "User",
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "name",
        header: "Name",
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "dept_nm",
        header: "Dept",
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "repair_grp_nm",
        header: "Repair Group",
        footer: (props) => props.column.id,
    },

    {
        accessorKey: "repair_nm",
        header: "Repair Type",
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "remark",
        header: "Remark",
        footer: (props) => props.column.id,
    },
];

const ListReservationDom = () => {
    const [formData, setFormData] = useState([]);
    const [bgnDate, setBgnDate] = useState(dayjs().startOf("month"));
    const [endDate, setEndDate] = useState(dayjs().endOf("month"));
    const [rangeDate, setRangeDate] = useState({
        bgn: dayjs().startOf("month").format("YYYY-MM-DD"),
        end: dayjs().endOf("month").format("YYYY-MM-DD"),
    });
    const [rsvDomModal, setRsvDomModal] = useState(false);
    const [eventStatus, setEventStatus] = useState(false);
    const { rsvListRsvDomFetch, rsvRepairStatusSet } = useStore();
    const {
        data: rsvData = [],
        isFetching: isFetchRsvData,
        refetch: refetchRsvData,
    } = useQuery({
        queryKey: ["rsvDataDom", { ...rangeDate }],
        queryFn: rsvListRsvDomFetch,
        enabled: false,
    });
    const rsvStatusSetMutaion = useMutation({
        mutationFn: rsvRepairStatusSet,
        onSuccess: (result, variables, context) => {
            if (result.data.status == 200) {
                toast.success(result.data.message);
                refetchRsvData();
            } else {
                toast.error(result.data.message);
            }
        },
        onError: (res) => {
            console.log(res);
            toast.error(res.message + " " + res.messageDtl);
        },
    });
    const onSearch = () => {
        refetchRsvData();
    };
    const onChangeRangeDt = (res) => {
        setRangeDate({
            bgn: res[0].format("YYYY-MM-DD"),
            end: res[1].format("YYYY-MM-DD"),
        });
    };
    const dataRsv = (status) => {
        return rsvData.filter((item) => item.status?.includes(status));
    };
    const onNewDetail = (res) => {
        setFormData({ ...res, formStatus: "V" });
        setEventStatus("N");
        setRsvDomModal(true);
    };
    const onDetail = (res) => {
        setFormData({ ...res, formStatus: "V" });
        setEventStatus("P");
        setRsvDomModal(true);
    };
    const onReview = (res) => {
        setFormData({ ...res, formStatus: "V" });
        setEventStatus("C");
        setRsvDomModal(true);
    };
    const onComplete = (res) => {
        rsvStatusSetMutaion.mutate({ ...res, status: "C" });
    };
    const onCompleteDtl = (res) => {
        setFormData({ ...res, formStatus: "V" });
        setEventStatus("C");
        setRsvDomModal(true);
    };
    const onAppeal = (res) => {};
    const columnsData = useMemo(() => [...columnData], []);
    const tabItems = useMemo(
        () => [
            {
                title: "New Reservation",
                icon: HiNewspaper,
                status: "N",
                fn: onNewDetail,
                fn_nm: "Detail",
            },
            {
                title: "On Going",
                icon: HiBriefcase,
                status: "P",
                fn: onDetail,
                fn_nm: "Detail",
            },
            {
                title: "Review",
                icon: HiBookOpen,
                status: "S",
                fn: onReview,
                fn_nm: "Review",
                fn_style:
                    "font-medium text-amber-600 cursor-pointer hover:underline dark:text-amber-600",
                fn2: onComplete,
                fn2_nm: "Complete",
                fn2_style:
                    "font-medium text-blue-600 cursor-pointer hover:underline dark:text-blue-600",
            },
            {
                title: "Complete",
                icon: HiCheckCircle,
                status: "C",
                fn: onCompleteDtl,
                fn_nm: "Detail",
                fn_style:
                    "font-medium text-amber-600 cursor-pointer hover:underline dark:text-amber-600",
            },
            {
                title: "Rejection",
                icon: HiOutlineXCircle,
                status: "R",
                fn: onAppeal,
                fn_nm: "Appeal",
                fn_style:
                    "font-medium text-green-600 cursor-pointer hover:underline dark:text-green-600",
            },
        ],
        []
    );

    return (
        <div className="flex flex-col p-2 w-full bg-transparent">
            <ListReservationModal
                status={eventStatus}
                formData={formData}
                modal={rsvDomModal}
                setModal={setRsvDomModal}
            />
            <Card className="w-full h-fit">
                <div className="flex flex-col w-full h-full">
                    <div className="flex flex-row align-bottom">
                        <h2 className="text-3xl font-medium text-zinc-600">
                            LIST RESERVATION DOM
                        </h2>
                        <div className="flex flex-row gap-3 ml-auto mt-auto h-10">
                            <span className="m-auto text-center text-gray-700 font-semibold">
                                Date :
                            </span>
                            <DatePicker.RangePicker
                                defaultValue={[bgnDate, endDate]}
                                onChange={(res) => onChangeRangeDt(res)}
                                disabled={[false, false]}
                            />
                            <Button color="success" onClick={onSearch}>
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
            <Card className="w-full h-[730px] mt-4">
                <div className="flex flex-col w-full h-full overflow-auto">
                    <div className="flex flex-row p-1 ">
                        <Tabs
                            aria-label="Tabs with underline"
                            variant="underline"
                        >
                            {tabItems.map((res, i) => {
                                return (
                                    <TabItem
                                        active
                                        title={res.title}
                                        icon={res.icon}
                                        key={"tab" + i}
                                    >
                                        <div className="flex flex-row w-full">
                                            <UseTable
                                                data={dataRsv(res.status)}
                                                columns={columnsData}
                                                style={
                                                    "overflow-auto h-[530px]"
                                                }
                                                isLoading={isFetchRsvData}
                                                onEdit={res.fn}
                                                editNm={res.fn_nm}
                                                editStyle={res.fn_style}
                                                onDelete={res.fn2}
                                                deleteNm={res.fn2_nm}
                                                deleteStyle={res.fn2_style}
                                            />
                                        </div>
                                    </TabItem>
                                );
                            })}
                        </Tabs>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ListReservationDom;
