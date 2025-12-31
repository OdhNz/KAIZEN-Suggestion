import { usePage } from "@inertiajs/react";
import React, { useState, useMemo, useEffect } from "react";
import {
    Button,
    Card,
    Label,
    TextInput,
    Datepicker,
    Select,
    Textarea,
    FileInput,
    Tabs,
    TabItem,
} from "flowbite-react";
import { useForm, Controller } from "react-hook-form";
import UseTable from "../../Components/useTable";
import UseModalConfirm from "../../Components/UseModalConfirm";
import useStore from "../../State/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import {
    HiArchive,
    HiLockClosed,
    HiRefresh,
    HiUserGroup,
    HiViewGrid,
} from "react-icons/hi";
import MasterRepairmentType from "./MasterRepairmentType";
import MasterRepairmentGroup from "./MasterRepairmentGroup";

const repairColums = [
    {
        accessorKey: "group_nm",
        header: () => "Repairment Group",
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "group_type_nm",
        header: () => "Type",
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "master_nm",
        header: () => "Repairment Name",
        footer: (props) => props.column.id,
    },
];
const groupColums = [
    {
        accessorKey: "group_type_nm",
        header: () => "Type",
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "master_nm",
        header: () => "Group Name",
        footer: (props) => props.column.id,
    },
];
const repairCd = ["GR3", "GR4"];
const MasterRepairment = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState();
    const [repairGrpValue, setRepairGrpValue] = useState();
    const [activeTab, setActiveTab] = useState(0);
    const {
        user,
        delMasterRprm,
        setMasterRprm,
        fetchMasterRprm,
        fetchMasterRprmGrp,
    } = useStore();
    const columnsData = activeTab == 0 ? groupColums : repairColums;
    const queryClient = useQueryClient();
    const {
        control,
        register,
        reset,
        getValues,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            formType: "RPR",
            formDtl: "Master Repair",
            masterId: "GR3",
            formAction: "I",
        },
    });

    const {
        data: dataRepairGrp = [],
        isFetching: isFetchRepairGrp,
        refetch: refetchdataRepairGrp,
    } = useQuery({
        queryKey: ["dataRepairGrp"],
        queryFn: () => fetchMasterRprmGrp(getValues()),
        enabled: true,
    });
    const {
        data: dataRepair = [],
        isFetching: isFetchRepair,
        refetch: refetchdataRepair,
    } = useQuery({
        queryKey: ["dataRepair"],
        queryFn: fetchMasterRprm,
        enabled: true,
    });

    const onSearch = async () => {
        refetchdataRepair();
    };

    const onChangeTab = (res) => {
        reset();
        setActiveTab(res);
    };

    const tabItems = useMemo(
        () => [
            {
                title: "Repair Group",
                icon: HiViewGrid,
                status: "GR3",
                component: <MasterRepairmentGroup />,
            },
            {
                title: "Repair Type",
                icon: HiArchive,
                status: "GR4",
                component: <MasterRepairmentType />,
            },
        ],
        []
    );
    return (
        <div className="flex flex-col p-2 w-full bg-transparent ">
            <Card className="w-full h-fit">
                <div className="flex flex-col w-full h-full">
                    <div className="flex flex-row align-bottom">
                        <h2 className="text-3xl font-medium text-zinc-600 ">
                            MASTER DATA REPAIRMENT
                        </h2>
                        <Button
                            className="ml-auto mt-auto h-10"
                            color="success"
                            onClick={() => onSearch()}
                        >
                            Search
                        </Button>
                    </div>
                </div>
            </Card>
            <Card className="w-full h-[730px] mt-4">
                <div className="flex flex-col w-full h-full">
                    <Tabs
                        aria-label="Tabs with underline"
                        variant="underline"
                        className="p-0"
                        onActiveTabChange={(tab) => onChangeTab(tab)}
                    >
                        {tabItems.map((res, i) => {
                            return (
                                <TabItem
                                    active
                                    title={res.title}
                                    icon={res.icon}
                                    key={"tab" + i}
                                    className="p-0"
                                >
                                    {res.component}
                                </TabItem>
                            );
                        })}
                    </Tabs>
                </div>
            </Card>
        </div>
    );
};

export default MasterRepairment;
