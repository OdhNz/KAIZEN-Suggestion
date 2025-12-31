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
const MasterRepairmentType = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState();
    const [repairGrpValue, setRepairGrpValue] = useState();
    const [activeTab, setActiveTab] = useState(1);
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
            formAction: "I",
            status: "A",
            groupId: "GR4",
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
        mutationFn: setMasterRprm,
        onSuccess: (result, variables, context) => {
            console.log(result, variables, context);
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
        onChangeRepairGrp(onSelectFilter(dataRepairGrp, res.group_cd));
        setValue("status", res.status);
        setValue("repairNm", res.master_nm);
        setValue("repairCd", res.master_cd);
        setValue("groupCd", res.group_type);
    };
    const toggleModal = (data, setData) => {
        setData(!data);
    };

    const onDeleteConfirm = (res) => {
        setDeleteModalData(res);
        toggleModal(deleteModal, setDeleteModal);
    };
    const onDeleteSubmit = (res) => {
        const data = {
            ...res,
            login_id: user.empid,
        };
        !deleteMasterRprm.isPending && deleteMasterRprm.mutate({ data });
    };
    const onChangeRepairGrp = (res) => {
        console.log(res);
        setValue("newGrp", res?.__isNew__ ? true : false);
        setValue("repairGrp", res.value);
        setValue("groupCd", res.group_type);
        setRepairGrpValue(res);
    };
    const onFilterData = (item, value) => {
        const data = [...item];
        const a = data.filter((res) => res.group_id == value);
        return a;
    };
    const onResetForm = () => {
        reset();
        setRepairGrpValue([]);
    };
    const onSubmit = (data) => {
        console.log(getValues());
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
                                    <div className="grid md:grid-cols-2 md:gap-6">
                                        <div className="flex w-full flex-col gap-0">
                                            <div className="">
                                                <div className="mb-2 block">
                                                    <Label
                                                        htmlFor="repairGrp"
                                                        value="Repairment Group"
                                                    />
                                                </div>
                                                <CreatableSelect
                                                    required
                                                    options={dataRepairGrp}
                                                    value={repairGrpValue}
                                                    onChange={(res) =>
                                                        onChangeRepairGrp(res)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="mb-2 block">
                                                <Label
                                                    htmlFor="groupCd"
                                                    value="Type"
                                                />
                                            </div>
                                            <Select
                                                id="groupCd"
                                                required
                                                disabled
                                                {...register("groupCd")}
                                            >
                                                <option value={"DOM"}>
                                                    Dormitory
                                                </option>
                                                <option value={"GEN"}>
                                                    General
                                                </option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="repairNm"
                                                value="Repairment Name"
                                            />
                                        </div>
                                        <Textarea
                                            name="repairNm"
                                            type="text"
                                            sizing="md"
                                            required
                                            {...register("repairNm")}
                                        />
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

export default MasterRepairmentType;
