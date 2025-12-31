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
import { HiLockClosed, HiUserGroup } from "react-icons/hi";

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
const MasterRepairmentGroup = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState();
    const [repairGrpValue, setRepairGrpValue] = useState();
    const [activeTab, setActiveTab] = useState(0);
    const {
        user,
        delMasterRprm,
        masterRprmGrpInsert,
        fetchMasterRprm,
        fetchMasterRprmGrp,
    } = useStore();
    const columnsData = useMemo(() => [...groupColums], []);
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
            formType: "RGRP",
            formDtl: "Master Repair Group",
            formAction: "I",
            status: "A",
            groupId: "GR3",
            newGrp: false,
        },
    });

    const {
        data: dataRepairGrp = [],
        isFetching: isFetchRepairGrp,
        refetch: refetchdataRepairGrp,
    } = useQuery({
        queryKey: ["dataRepairGrp"],
        queryFn: fetchMasterRprmGrp,
        enabled: false,
    });
    const {
        data: dataRepair = [],
        isFetching: isFetchRepair,
        refetch: refetchdataRepair,
    } = useQuery({
        queryKey: ["dataRepair"],
        queryFn: fetchMasterRprm,
        enabled: false,
    });

    const setRprmMutation = useMutation({
        mutationFn: masterRprmGrpInsert,
        onSuccess: (result, variables, context) => {
            onResetForm();
            refetchdataRepair();
            toast.success(result.data.message);
        },
    });

    const deleteMasterRprm = useMutation({
        mutationFn: delMasterRprm,
        onSuccess: (result, variables, context) => {
            refetchdataRepair();
            toast.error(result.data.message);
        },
    });
    const onSelectFilter = (data, value) => {
        const res = data.filter((item) => item.value == value);
        return res[0];
    };

    const onDetail = (res) => {
        onChangeRepairGrp(onSelectFilter(dataRepairGrp, res.master_cd));
        setValue("status", res.status);
        setValue("masterNm", res.master_nm);
        setValue("masterCd", res.master_cd);
        setValue("groupType", res.group_type);
    };
    const toggleModal = (data, setData) => {
        setData(!data);
    };

    const onDeleteConfirm = (res) => {
        setDeleteModalData(res);
        toggleModal(deleteModal, setDeleteModal);
    };
    const onResetForm = () => {
        reset();
        setRepairGrpValue([]);
    };
    const onDeleteSubmit = (res) => {
        const data = {
            ...res,
            login_id: user.empid,
        };
        !deleteMasterRprm.isPending && deleteMasterRprm.mutate({ data });
    };
    const onChangeRepairGrp = (res) => {
        setValue("newGrp", res?.__isNew__ ? true : false);
        setValue("groupCd", res.value);
        setValue("groupNm", res.label);
        setRepairGrpValue(res);
    };
    const onFilterData = (item, value) => {
        const data = [...item];
        const a = data.filter((res) => res.group_id == value);
        return a;
    };

    const onSubmit = (data) => {
        setRprmMutation.mutate({ ...getValues() });
    };
    return (
        <div className="flex flex-col w-full bg-transparent ">
            <UseModalConfirm
                modalStatus={deleteModal}
                toggleModal={() => toggleModal(deleteModal, setDeleteModal)}
                onSubmit={() => onDeleteSubmit(deleteModalData)}
                size={"xl"}
            />

            <div className="flex flex-col w-full h-full overflow-auto">
                <div className="flex flex-row w-full gap-3 mt-1">
                    <div className="w-1/3">
                        <Card>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex flex-col px-10  w-full gap-3 focus:ring-0">
                                    <div className="grid md:grid-cols-1 md:gap-6">
                                        <div className="">
                                            <div className="mb-2 block">
                                                <Label
                                                    htmlFor="groupType"
                                                    value="Type"
                                                />
                                            </div>
                                            <Select
                                                id="groupType"
                                                required
                                                {...register("groupType")}
                                            >
                                                <option value={"DOM"}>
                                                    Dormitory
                                                </option>
                                                <option value={"GEN"}>
                                                    General
                                                </option>
                                            </Select>
                                        </div>
                                        <div className="flex w-full flex-col gap-0">
                                            <div className="">
                                                <div className="mb-2 block">
                                                    <Label
                                                        htmlFor="repairGrp"
                                                        value="Repairment Group"
                                                    />
                                                </div>
                                                <Textarea
                                                    required
                                                    {...register("masterNm")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:gap-3 sticky mt-3 justify-end">
                                        <Button
                                            onClick={() => onResetForm()}
                                            color={"success"}
                                        >
                                            New
                                        </Button>
                                        <Button type="submit">Save</Button>
                                    </div>
                                </div>
                            </form>
                        </Card>
                    </div>
                    <div className="w-2/3 flex-1">
                        <Card>
                            <UseTable
                                onDetail={onDetail}
                                onDelete={onDeleteConfirm}
                                deleteNm="Delete"
                                data={onFilterData(
                                    dataRepair,
                                    repairCd[activeTab]
                                )}
                                columns={columnsData}
                                style={"overflow-auto h-[450px]"}
                                isLoading={isFetchRepair}
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterRepairmentGroup;
