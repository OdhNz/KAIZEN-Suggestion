import React, { useState } from "react";
import { Button, Card, Label, Select, Textarea } from "flowbite-react";
import { useForm } from "react-hook-form";
import UseModalConfirm from "../../Components/UseModalConfirm";
import useStore from "../../State/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import { HiDocument } from "react-icons/hi";
import UseTableAnt from "../../Components/UseTableAnt";

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
const masterId = ["GR1", "GR2"];
const MasterLocationData = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState();
    const [repairGrpValue, setRepairGrpValue] = useState();
    const [activeTab, setActiveTab] = useState(1);
    const {
        user,
        delMasterRprm,
        setMasterRprm,
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
            formType: "RPR",
            formDtl: "Master Repair",
            formAction: "I",
            status: "A",
            groupId: "GR2",
            newGrp: false,
        },
    });

    const {
        data: masterLocationGrp = [],
        isFetching: isFetchRepairGrp,
        refetch: refetchdataLocationGrp,
    } = useQuery({
        queryKey: ["dataLocationGrp"],
        queryFn: () => fetchMasterRprmGrp({ masterId: "GR1" }),
        enabled: false,
    });
    const {
        data: dataMasterLocation = [],
        isFetching: isFetchMasterLocation,
        refetch: refetchdataMaster,
    } = useQuery({
        queryKey: ["dataMasterLocation"],
        queryFn: masterRprmLocationFetch,
        enabled: false,
    });

    const setRprmMutation = useMutation({
        mutationFn: setMasterRprm,
        onSuccess: (result, variables, context) => {
            onResetForm();
            refetchdataLocationGrp();
            refetchdataMaster();
            toast.success(result.data.message);
        },
        onError: (res) => {
            console.log(res);
        },
    });

    const deleteMasterRprm = useMutation({
        mutationFn: delMasterRprm,
        onSuccess: (result, variables, context) => {
            refetchdataMaster();
            refetchdataLocationGrp();
            toast.error(result.data.message);
        },
    });
    const onSelectFilter = (data, value) => {
        const res = data.filter((item) => item.value == value);
        return res[0];
    };

    const onDetail = (res) => {
        onChangeRepairGrp(onSelectFilter(masterLocationGrp, res.group_cd));
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
        console.log(res);
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
            title: "Location Group",
            dataIndex: "group_nm",
            key: "group_nm",
            width: 20,
            filter: true,
            sort: false,
        },
        {
            title: "Type",
            dataIndex: "group_type_nm",
            key: "group_type_nm",
            width: 20,
            hidden: false,
            filter: true,
            sort: false,
        },
        {
            title: "Location Name",
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
    const locationColumn = columnsAnt;
    const columnsData = activeTab == 0 ? groupColums : locationColumn;
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
                                                        value="Location Group"
                                                    />
                                                </div>
                                                <CreatableSelect
                                                    required
                                                    options={masterLocationGrp}
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
                                                value="Location Name"
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
                                isLoading={isFetchMasterLocation}
                            /> */}
                            <UseTableAnt
                                columns={[...columnsData]}
                                loading={isFetchMasterLocation}
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

export default MasterLocationData;
