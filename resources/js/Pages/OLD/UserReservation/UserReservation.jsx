import { usePage } from "@inertiajs/react";
import React, { useState, useMemo, useEffect } from "react";
import { Button, Card } from "flowbite-react";
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
import UserReservationForm from "./UserReservationForm";
import UserReservationFormReview from "./UserReservationFormReview";
import { toast } from "react-toastify";
import AdminReservationApproveForm from "../AdminReservation/AdminReservationApproveForm";
import UseLabelHeader from "../../Components/UseLabelHeader";
import AdminReservationCompleteForm from "../AdminReservation/AdminReservationCompleteForm";

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

const UserReservation = () => {
    const [formData, setFormData] = useState([]);
    const [formDetailData, setFormDetailData] = useState([]);
    const [newReservationModal, setNewReservationModal] = useState(false);
    const [rsvDetailModal, setRsvDetailModal] = useState(false);
    const [rsvCompleteModal, setRsvCompleteModal] = useState(false);
    const [rsvReviewModal, setRsvReviewModal] = useState(false);
    const { rsvUserFetch, rsvRepairStatusSet } = useStore();
    const {
        data: rsvData = [],
        isFetching: isFetchRsvData,
        refetch: refetchRsvData,
    } = useQuery({
        queryKey: ["rsvData"],
        queryFn: rsvUserFetch,
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
            toast.error(res.message + " " + res.messageDtl);
        },
    });
    const onSearch = () => {
        refetchRsvData();
    };

    const dataRsv = (status) => {
        return rsvData.filter((item) => item.status?.includes(status));
    };
    const toggleModal = (data, setData) => {
        setData(!data);
    };
    const onClose = (toggleModal) => {
        refetchRsvData();
        toggleModal;
    };
    const onNewRsv = () => {
        setFormData();
        toggleModal(newReservationModal, setNewReservationModal);
    };
    const onNewDetail = (res) => {
        setFormData({ ...res, formStatus: "V" });
        toggleModal(newReservationModal, setNewReservationModal);
    };
    const onDetail = (res) => {
        setFormData({ ...res, formStatus: "V" });
        toggleModal(rsvDetailModal, setRsvDetailModal);
    };
    const onReview = (res) => {
        setFormData({ ...res, formStatus: "I", form_id: "RVW" });
        setFormDetailData({ ...res, formStatus: "V" });
        toggleModal(rsvReviewModal, setRsvReviewModal);
    };
    const onComplete = (res) => {
        rsvStatusSetMutaion.mutate({ ...res, status: "C" });
    };
    const onCompleteDtl = (res) => {
        setFormDetailData({ ...res, formStatus: "V" });
        toggleModal(rsvCompleteModal, setRsvCompleteModal);
    };
    const onAppeal = (res) => {
        const data = { ...res, formStatus: "U" };
        setFormData(data);
        toggleModal(newReservationModal, setNewReservationModal);
    };
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
            {!newReservationModal ? null : (
                <UseModal
                    modalStatus={newReservationModal}
                    toggleModal={() =>
                        toggleModal(newReservationModal, setNewReservationModal)
                    }
                    modalName={"Form Reservation"}
                    size={"xl"}
                >
                    <div className="flex flex-row flex-wrap ">
                        <div className="w-full">
                            <UserReservationForm
                                onCloseForm={() =>
                                    onClose(
                                        toggleModal(
                                            newReservationModal,
                                            setNewReservationModal
                                        )
                                    )
                                }
                                formData={formData}
                            ></UserReservationForm>
                        </div>
                    </div>
                </UseModal>
            )}
            {!rsvDetailModal ? null : (
                <UseModal
                    modalStatus={rsvDetailModal}
                    toggleModal={() =>
                        toggleModal(rsvDetailModal, setRsvDetailModal)
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
                                            rsvDetailModal,
                                            setRsvDetailModal
                                        )
                                    )
                                }
                                formData={formData}
                            ></UserReservationForm>
                        </div>
                        <div className="w-full md:w-1/2">
                            <UseLabelHeader label="Detail Reservation" />
                            <AdminReservationApproveForm
                                onCloseForm={() =>
                                    onClose(
                                        toggleModal(
                                            rsvDetailModal,
                                            setRsvDetailModal
                                        )
                                    )
                                }
                                formData={formData}
                            />
                        </div>
                    </div>
                </UseModal>
            )}
            {!rsvReviewModal ? null : (
                <UseModal
                    modalStatus={rsvReviewModal}
                    toggleModal={() =>
                        toggleModal(rsvReviewModal, setRsvReviewModal)
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
                                            rsvReviewModal,
                                            setRsvReviewModal
                                        )
                                    )
                                }
                                formData={formDetailData}
                            ></UserReservationForm>
                            <UseLabelHeader label="Detail Reservation" />
                            <AdminReservationApproveForm
                                onCloseForm={() =>
                                    onClose(
                                        toggleModal(
                                            rsvReviewModal,
                                            setRsvReviewModal
                                        )
                                    )
                                }
                                formData={formDetailData}
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <UseLabelHeader label="Complete Reservation" />
                            <AdminReservationCompleteForm
                                onCloseForm={() =>
                                    onClose(
                                        toggleModal(
                                            rsvReviewModal,
                                            setRsvReviewModal
                                        )
                                    )
                                }
                                formData={{ ...formDetailData, form_id: "DTL" }}
                            />
                            <UseLabelHeader label="Form Review Reservation" />
                            <UserReservationFormReview
                                onCloseForm={() =>
                                    onClose(
                                        toggleModal(
                                            rsvReviewModal,
                                            setRsvReviewModal
                                        )
                                    )
                                }
                                formData={{ ...formData, form_id: "RVW" }}
                            />
                        </div>
                    </div>
                </UseModal>
            )}
            {!rsvCompleteModal ? null : (
                <UseModal
                    modalStatus={rsvCompleteModal}
                    toggleModal={() =>
                        toggleModal(rsvCompleteModal, setRsvCompleteModal)
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
                                formData={formDetailData}
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
                                formData={formDetailData}
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
                                formData={{ ...formDetailData, form_id: "DTL" }}
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
                                formData={{ ...formDetailData, form_id: "RVW" }}
                            />
                        </div>
                    </div>
                </UseModal>
            )}
            <Card className="w-full h-fit">
                <div className="flex flex-col w-full h-full">
                    <div className="flex flex-row align-bottom">
                        <h2 className="text-3xl font-medium text-zinc-600">
                            FORM RESERVATION
                        </h2>
                        <div className="flex flex-row gap-3 ml-auto mt-auto h-10">
                            <Button
                                className="ml-auto mt-auto h-10"
                                onClick={() => onNewRsv()}
                            >
                                New Reservation
                            </Button>
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

export default UserReservation;
