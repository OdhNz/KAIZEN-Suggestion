import { usePage } from "@inertiajs/react";
import React, { useState, useMemo, useEffect } from "react";
import { Button, Card, HR } from "flowbite-react";
import UseTable from "../../Components/useTable";
import UseModal from "../../Components/UseModal";
import useStore from "../../State/useStore";
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
import { DatePicker, Space } from "antd";

import AdminReservationApproveForm from "./AdminReservationApproveForm";
import UserReservationForm from "../UserReservation/UserReservationForm";
import AdminReservationCompleteForm from "./AdminReservationCompleteForm";
import UseLabelHeader from "../../Components/UseLabelHeader";
import AdminReservationRejectForm from "./AdminReservationRejectForm";
import UserReservationFormReview from "../UserReservation/UserReservationFormReview";
import UseTableAnt from "../../Components/UseTableAnt";
import dayjs from "dayjs";
const columnsAnt = [
    {
        title: "No",
        dataIndex: "no",
        key: "no",
        width: 50,
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
        width: 50,
        filter: true,
        sort: true,
    },
    {
        title: "Location",
        dataIndex: "location_fnm",
        key: "location_fnm",
        width: 70,
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
        width: 110,
        hidden: true,
        filter: true,
        sort: false,
    },
    {
        title: "Location",
        dataIndex: "loc_nm",
        key: "loc_nm",
        width: 110,
        hidden: true,
        filter: true,
        sort: false,
    },
    {
        title: "Date",
        dataIndex: "tl_date",
        key: "tl_date",
        width: 100,
        filter: true,
        sort: true,
    },
    {
        title: "User",
        dataIndex: "id_nm",
        key: "id_nm",
        width: 100,
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
        width: 100,
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
        width: 140,
        hidden: true,
        filter: true,
        sort: false,
    },
    {
        title: "Remark",
        dataIndex: "remark",
        key: "remark",
        width: 250,
        filter: true,
        sort: false,
    },
];

const AdminReservation = () => {
    const [formData, setFormData] = useState([]);
    const [userFormData, setUserFormData] = useState([]);
    const [adminFormData, setAdminFormData] = useState([]);
    const [rsvApproveModal, setRsvApproveModal] = useState(false);
    const [rsvRejectModal, setRsvRejectModal] = useState(false);
    const [rsvCompleteModal, setRsvCompleteModal] = useState(false);
    const [rsvReviewModal, setRsvReviewModal] = useState(false);
    const [rsvCompleteDtl, setRsvCompleteDtl] = useState(false);
    const [bgnDate, setBgnDate] = useState(dayjs().startOf("month"));
    const [endDate, setEndDate] = useState(dayjs().endOf("month"));
    const [rangeDate, setRangeDate] = useState({
        bgn: bgnDate.format("YYYY-MM-DD"),
        end: endDate.format("YYYY-MM-DD"),
    });
    const { rsvAdminFetch, rsvRepairStatusSet } = useStore();
    const {
        data: rsvData = [],
        isFetching: isFetchRsvData,
        refetch: refetchRsvData,
    } = useQuery({
        queryKey: ["rsvAdminData", rangeDate],
        queryFn: rsvAdminFetch,
        enabled: false,
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
    const toggleModal = (data, setData) => {
        setData(!data);
    };

    const onApprove = (res) => {
        setAdminFormData({ ...res, formStatus: "I" });
        setUserFormData({ ...res, formStatus: "V" });
        toggleModal(rsvApproveModal, setRsvApproveModal);
    };
    const onReject = (res) => {
        setFormData({ ...res, formStatus: "I" });
        toggleModal(rsvRejectModal, setRsvRejectModal);
    };
    const onComplete = (res) => {
        setFormData({ ...res, formStatus: "I" });
        setUserFormData({ ...res, formStatus: "V" });
        setAdminFormData({ ...res, formStatus: "V" });
        toggleModal(rsvCompleteModal, setRsvCompleteModal);
    };
    const onAppeal = (res) => {
        const data = { ...res, formStatus: "U" };
        setFormData(data);
        toggleModal(newReservationModal, setNewReservationModal);
    };
    const onReview = (res) => {
        setFormData({ ...res, formStatus: "V" });
        setUserFormData({ ...res, formStatus: "V" });
        setAdminFormData({ ...res, formStatus: "V" });
        toggleModal(rsvReviewModal, setRsvReviewModal);
    };
    const onCompleteDtl = (res) => {
        setFormData({ ...res, formStatus: "V" });
        toggleModal(rsvCompleteDtl, setRsvCompleteDtl);
    };
    const columnsData = useMemo(() => [...columnsAnt], []);
    const tabItems = useMemo(
        () => [
            {
                title: "New Reservation",
                icon: HiNewspaper,
                status: "N",
                fn: [
                    {
                        title: "Action",
                        key: "operation",
                        fixed: "right",
                        width: 100,
                        render: (text, record, index) => (
                            <div className="flex flex-row gap-2">
                                <span
                                    className="text-sky-800 font-semibold cursor-pointer"
                                    onClick={(e) => onApprove(record)}
                                >
                                    Approve
                                </span>
                                <span
                                    className="text-gray-600 font-semibold cursor-default
                                "
                                >
                                    |
                                </span>

                                <span
                                    className="text-red-700 font-semibold cursor-pointer"
                                    onClick={(e) => onReject(record)}
                                >
                                    Reject
                                </span>
                            </div>
                        ),
                    },
                ],
            },
            {
                title: "On Going",
                icon: HiBriefcase,
                status: "P",
                fn: [
                    {
                        title: "Action",
                        key: "operation",
                        fixed: "right",
                        width: 100,
                        render: (text, record, index) => (
                            <div>
                                <span
                                    className="text-sky-800 font-semibold cursor-pointer"
                                    onClick={(e) => onComplete(record)}
                                >
                                    Complete
                                </span>
                            </div>
                        ),
                    },
                ],
            },
            {
                title: "Review",
                icon: HiBookOpen,
                status: "S",
                fn: [
                    {
                        title: "Action",
                        key: "operation",
                        fixed: "right",
                        width: 100,
                        render: (text, record, index) => (
                            <div>
                                <span
                                    className="text-yellow-400 font-semibold cursor-pointer"
                                    onClick={(e) => onReview(record)}
                                >
                                    Detail
                                </span>
                            </div>
                        ),
                    },
                ],
            },
            {
                title: "Complete",
                icon: HiCheckCircle,
                status: "C",
                fn: [
                    {
                        title: "Action",
                        key: "operation",
                        fixed: "right",
                        width: 100,
                        render: (text, record, index) => (
                            <div>
                                <span
                                    className="text-green-600 font-semibold cursor-pointer"
                                    onClick={(e) => onCompleteDtl(record)}
                                >
                                    Detail
                                </span>
                            </div>
                        ),
                    },
                ],
            },
            {
                title: "Rejection",
                icon: HiOutlineXCircle,
                status: "R",
                fn: [
                    {
                        title: "Action",
                        key: "operation",
                        fixed: "right",
                        width: 100,
                        render: (text, record, index) => (
                            <div>
                                <span
                                    className="text-green-400 font-semibold cursor-pointer"
                                    onClick={(e) => onAppeal(record)}
                                >
                                    Appeal
                                </span>
                            </div>
                        ),
                    },
                ],
            },
        ],
        []
    );
    return (
        <div className="flex flex-col p-2 w-full bg-transparent">
            {rsvApproveModal ? (
                <UseModal
                    modalStatus={rsvApproveModal}
                    toggleModal={() =>
                        toggleModal(rsvApproveModal, setRsvApproveModal)
                    }
                    modalName={"Form Approve Reservation"}
                    size={"6xl"}
                >
                    <div className="flex flex-row flex-wrap">
                        <div className="flex flex-col gap-2 w-full md:w-1/2 h-full max-h-[600px] overflow-auto">
                            <div>
                                <UseLabelHeader label={"User Reservation"} />
                                <UserReservationForm
                                    onCloseForm={() =>
                                        toggleModal(
                                            rsvApproveModal,
                                            setRsvApproveModal
                                        )
                                    }
                                    formData={userFormData}
                                ></UserReservationForm>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 justify-start items-start h-full after:w-full md:w-1/2">
                            <div>
                                <UseLabelHeader
                                    label={" Admin Detail Reservation"}
                                />
                                <AdminReservationApproveForm
                                    onCloseForm={() =>
                                        toggleModal(
                                            rsvApproveModal,
                                            setRsvApproveModal
                                        )
                                    }
                                    formData={adminFormData}
                                ></AdminReservationApproveForm>
                            </div>
                        </div>
                    </div>
                </UseModal>
            ) : null}
            {rsvRejectModal ? (
                <UseModal
                    modalStatus={rsvRejectModal}
                    toggleModal={() =>
                        toggleModal(rsvRejectModal, setRsvRejectModal)
                    }
                    modalName={"Form Reject Reservation"}
                    size={"xl"}
                >
                    <div className="flex flex-row flex-wrap">
                        <h1 class="mb-4 px-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                            <span class="text-transparent bg-clip-text bg-gradient-to-r to-yellow-400 from-green-600">
                                Please Leave a
                            </span>{" "}
                            Message.
                        </h1>
                        <p class="text-lg px-4 font-normal text-gray-500 lg:text-xl dark:text-gray-400">
                            Tell the user why you rejected their reservation.
                        </p>

                        <AdminReservationRejectForm
                            onCloseForm={() =>
                                toggleModal(rsvRejectModal, setRsvRejectModal)
                            }
                            formData={formData}
                        />
                    </div>
                </UseModal>
            ) : null}
            {rsvCompleteModal ? (
                <UseModal
                    modalStatus={rsvCompleteModal}
                    toggleModal={() =>
                        toggleModal(rsvCompleteModal, setRsvCompleteModal)
                    }
                    modalName={"Form Approve Reservation"}
                    size={"6xl"}
                >
                    <div className="flex flex-row flex-wrap">
                        <div className="flex flex-col gap-2 w-full md:w-1/2 h-full max-h-[600px] overflow-auto">
                            <div>
                                <UseLabelHeader label={"User Reservation"} />
                                <UserReservationForm
                                    onCloseForm={() =>
                                        toggleModal(
                                            rsvCompleteModal,
                                            setRsvCompleteModal
                                        )
                                    }
                                    formData={userFormData}
                                ></UserReservationForm>
                                <UseLabelHeader
                                    label={"Admin Detail Reservation"}
                                />
                                <AdminReservationApproveForm
                                    onCloseForm={() =>
                                        toggleModal(
                                            rsvCompleteModal,
                                            setRsvCompleteModal
                                        )
                                    }
                                    formData={adminFormData}
                                ></AdminReservationApproveForm>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 justify-start items-start h-full w-full md:w-1/2">
                            <div className="w-full px-5">
                                <UseLabelHeader
                                    label={"Admin Complete Reservation"}
                                />
                                <AdminReservationCompleteForm
                                    onCloseForm={() =>
                                        toggleModal(
                                            rsvCompleteModal,
                                            setRsvCompleteModal
                                        )
                                    }
                                    formData={formData}
                                />
                            </div>
                        </div>
                    </div>
                </UseModal>
            ) : null}
            {rsvReviewModal ? (
                <UseModal
                    modalStatus={rsvReviewModal}
                    toggleModal={() =>
                        toggleModal(rsvReviewModal, setRsvReviewModal)
                    }
                    modalName={"Form Approve Reservation"}
                    size={"6xl"}
                >
                    <div className="flex flex-row flex-wrap">
                        <div className="flex flex-col gap-2 w-full md:w-1/2 h-full max-h-[600px] overflow-auto">
                            <div>
                                <UseLabelHeader label={"User Reservation"} />
                                <UserReservationForm
                                    onCloseForm={() =>
                                        toggleModal(
                                            rsvReviewModal,
                                            setRsvReviewModal
                                        )
                                    }
                                    formData={userFormData}
                                ></UserReservationForm>
                                <UseLabelHeader
                                    label={"Admin Detail Reservation"}
                                />
                                <AdminReservationApproveForm
                                    onCloseForm={() =>
                                        toggleModal(
                                            rsvReviewModal,
                                            setRsvReviewModal
                                        )
                                    }
                                    formData={adminFormData}
                                ></AdminReservationApproveForm>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 justify-start items-start h-full w-full md:w-1/2">
                            <div className="w-full px-5">
                                <UseLabelHeader
                                    label={"Admin Complete Reservation"}
                                />
                                <AdminReservationCompleteForm
                                    onCloseForm={() =>
                                        toggleModal(
                                            rsvReviewModal,
                                            setRsvReviewModal
                                        )
                                    }
                                    formData={formData}
                                />
                            </div>
                        </div>
                    </div>
                </UseModal>
            ) : null}
            {!rsvCompleteDtl ? null : (
                <UseModal
                    modalStatus={rsvCompleteDtl}
                    toggleModal={() =>
                        toggleModal(rsvCompleteDtl, setRsvCompleteDtl)
                    }
                    modalName={"Form Reservation"}
                    size={"6xl"}
                >
                    <div className="flex flex-row flex-wrap ">
                        <div className="w-full md:w-1/2">
                            <UseLabelHeader label="User Reservation" />
                            <UserReservationForm
                                onCloseForm={() =>
                                    onClose(
                                        toggleModal(
                                            rsvCompleteModal,
                                            setRsvCompleteModal
                                        )
                                    )
                                }
                                formData={formData}
                            ></UserReservationForm>
                            <UseLabelHeader label="Detail Reservation" />
                            <AdminReservationApproveForm
                                onCloseForm={() =>
                                    onClose(
                                        toggleModal(
                                            rsvCompleteModal,
                                            setRsvCompleteModal
                                        )
                                    )
                                }
                                formData={formData}
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <UseLabelHeader label="Complete Reservation" />
                            <AdminReservationCompleteForm
                                onCloseForm={() =>
                                    onClose(
                                        toggleModal(
                                            rsvCompleteModal,
                                            setRsvCompleteModal
                                        )
                                    )
                                }
                                formData={{ ...formData, form_id: "DTL" }}
                            />
                            <UseLabelHeader label="Form Review Reservation" />
                            <UserReservationFormReview
                                onCloseForm={() =>
                                    onClose(
                                        toggleModal(
                                            rsvCompleteModal,
                                            setRsvCompleteModal
                                        )
                                    )
                                }
                                formData={{ ...formData, form_id: "RVW" }}
                            />
                        </div>
                    </div>
                </UseModal>
            )}
            <Card className="w-full h-[830px] mt-4 ">
                <div className="flex flex-col w-full h-5">
                    <div className="flex flex-row align-bottom">
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
                <HR className="mb-0 mt-4" />
                <div className="flex flex-col w-full h-full overflow-auto">
                    <div className="flex flex-row px-1">
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
                                        <div className="w-full max-w-[1570px] pb-0">
                                            <UseTableAnt
                                                columns={[
                                                    ...columnsData,
                                                    ...res.fn,
                                                ]}
                                                loading={isFetchRsvData}
                                                data={dataRsv(res.status)}
                                                height={500}
                                            />
                                            {/* <UseTable
                                                data={dataRsv(res.status)}
                                                columns={columnsData}
                                                style={
                                                    "overflow-auto h-[500px]"
                                                }
                                                isLoading={isFetchRsvData}
                                                onEdit={res.fn}
                                                editNm={res.fn_nm}
                                                editStyle={res.fn_style}
                                                onDelete={res.fn2}
                                                deleteNm={res.fn2_nm}
                                                deleteStyle={res.fn2_style}
                                            /> */}
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

export default AdminReservation;
