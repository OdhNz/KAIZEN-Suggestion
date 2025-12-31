import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { Button, Card, Label, Select, Textarea } from "flowbite-react";
import { useForm } from "react-hook-form";
import UseModalConfirm from "../../Components/UseModalConfirm";
import useStore from "../../State/useStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { HiDocument } from "react-icons/hi";
import UseTableAnt from "../../Components/UseTableAnt";

const masterId = ["GR1", "GR2"];
const MasterLocationGroup = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState();
    const [repairGrpValue, setRepairGrpValue] = useState();
    const [activeTab, setActiveTab] = useState(0);
    const {
        user,
        delMasterRprm,
        masterRprmGrpInsert,
        masterRprmLocationFetch,
        fetchMasterRprmGrp,
    } = useStore();
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
            formType: "MST",
            formDtl: "Master Data",
            formAction: "I",
            status: "A",
            groupId: "GR1",
            newGrp: false,
        },
    });

    const {
        data: dataLocationGrp = [],
        isFetching: isFetchRepairGrp,
        refetch: refetchdataLocationGrp,
    } = useQuery({
        queryKey: ["dataLocationGrp"],
        queryFn: () => fetchMasterRprmGrp({ masterId: "GR1" }),
        enabled: false,
    });
    const {
        data: dataMasterLocation = [],
        isFetching: isFetchRepair,
        refetch: refetchdataLocation,
    } = useQuery({
        queryKey: ["dataMasterLocation"],
        queryFn: masterRprmLocationFetch,
        enabled: false,
    });

    const setRprmMutation = useMutation({
        mutationFn: masterRprmGrpInsert,
        onSuccess: (result, variables, context) => {
            console.log(result, variables, context);
            onResetForm();
            refetchdataLocation();
            refetchdataLocationGrp();
            toast.success(result.data.message);
        },
    });

    const deleteMasterRprm = useMutation({
        mutationFn: delMasterRprm,
        onSuccess: (result, variables, context) => {
            refetchdataLocation();
            refetchdataLocationGrp();
            toast.error(result.data.message);
        },
    });
    const onSelectFilter = (data, value) => {
        const res = data.filter((item) => item.value == value);
        return res[0];
    };

    const onDetail = (res) => {
        onChangeRepairGrp(onSelectFilter(dataLocationGrp, res.master_cd));
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
    const columnsAnt = [
        {
            title: "No",
            dataIndex: "no",
            key: "no",
            width: 5,
            render: (id, record, index) => {
                ++index;
                return index;
            },
            filter: false,
            sort: false,
        },
        {
            title: "Detail",
            key: "operation",
            width: 10,
            render: (text, record, index) => (
                <div>
                    <span
                        className="text-gray-500 font-semibold cursor-pointer"
                        onClick={(e) => onDetail(record)}
                    >
                        <HiDocument />
                    </span>
                </div>
            ),
        },
        {
            title: "Type",
            dataIndex: "group_type_nm",
            key: "group_type_nm",
            width: 20,
            filter: true,
            sort: false,
        },
        {
            title: "Group Name",
            dataIndex: "master_nm",
            key: "master_nm",
            width: 20,
            hidden: false,
            filter: true,
            sort: false,
        },
        {
            title: "Action",
            key: "operation",
            fixed: "right",
            width: 20,
            render: (text, record, index) => (
                <div>
                    <span
                        className="text-red-800 font-semibold cursor-pointer"
                        onClick={(e) => onDeleteConfirm(record)}
                    >
                        Delete
                    </span>
                </div>
            ),
        },
    ];

    useEffect(() => {
        console.log(dataLocationGrp);
    }, [dataLocationGrp]);
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
                            {/* <UseTable
                                onDetail={onDetail}
                                onDelete={onDeleteConfirm}
                                deleteNm="Delete"
                                data={onFilterData(
                                    dataMasterLocation,
                                    masterId[activeTab]
                                )}
                                columns={columnsData}
                                style={"overflow-auto h-[450px]"}
                                isLoading={isFetchRepair}
                            /> */}
                            <UseTableAnt
                                columns={[...columnsAnt]}
                                loading={isFetchRepair}
                                data={onFilterData(
                                    dataMasterLocation,
                                    masterId[activeTab]
                                )}
                                height={440}
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterLocationGroup;
