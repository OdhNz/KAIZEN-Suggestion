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
} from "flowbite-react";
import { useForm, Controller } from "react-hook-form";
import UseTable from "../Components/useTable";
import UseModalConfirm from "../Components/UseModalConfirm";
import useStore from "../State/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const columnData = [
    {
        accessorFn: (row) => row.location_grp_nm,
        id: "location_grp_nm",
        cell: (info) => info.getValue(),
        header: () => <span>Location Grp</span>,
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "location_nm",
        header: () => "Location Name",
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "status",
        header: "Status",
        footer: (props) => props.column.id,
    },
];

const MasterLocationtest = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState();
    const {
        user,
        delMasterLocation,
        setMasterLocation,
        fetchMasterLocation,
        fetchMasterLocationGrp,
    } = useStore();
    const columnsData = useMemo(() => [...columnData], []);
    const queryClient = useQueryClient();
    const {
        control,
        register,
        reset,
        getValues,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const {
        data: dataLocationGrp = [],
        isFetching: isFetchLocationGrp,
        refetch: refetchdataLocationGrp,
    } = useQuery({
        queryKey: ["dataLocationGrp"],
        queryFn: fetchMasterLocationGrp,
    });
    const {
        data: dataLocation = [],
        isFetching: isFetchLocation,
        refetch: refetchdataLocation,
    } = useQuery({
        queryKey: ["dataLocation"],
        queryFn: fetchMasterLocation,
        enabled: false,
    });

    const setLocationMutation = useMutation({
        mutationFn: setMasterLocation,
        onSuccess: (result, variables, context) => {
            reset();
            refetchdataLocation();
            toast.success(result.data.message);
        },
    });

    const deleteMasterLocation = useMutation({
        mutationFn: delMasterLocation,
        onSuccess: (result, variables, context) => {
            queryClient.setQueryData(["dataLocation"], (oldData) => {
                oldData = oldData.filter(
                    (item) => item.location_cd != variables.data.location_cd
                );
                return [...oldData];
            });
            toast.error(result.data.data + " " + result.data.message);
        },
    });

    const onSearch = async () => {
        refetchdataLocation();
    };
    const onDetail = (res) => {
        setValue("locationGrp", res.location_grp_cd);
        setValue("status", res.status);
        setValue("locationNm", res.location_nm);
        setValue("remark", res.remark);
        setValue("locationCd", res.location_cd);
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
        !deleteMasterLocation.isPending &&
            deleteMasterLocation.mutate({ data });
    };

    const onSubmit = (data) => {
        setLocationMutation.mutate({ ...data });
    };
    return (
        <div className="flex flex-col p-2 w-full bg-transparent ">
            <UseModalConfirm
                modalStatus={deleteModal}
                toggleModal={() => toggleModal(deleteModal, setDeleteModal)}
                onSubmit={() => onDeleteSubmit(deleteModalData)}
                size={"xl"}
            />
            <Card className="w-full h-fit">
                <div className="flex flex-col w-full h-full">
                    <div className="flex flex-row align-bottom">
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
                <div className="flex flex-col w-full h-full overflow-auto">
                    <div className="flex flex-row gap-3 mt-1">
                        <div className="w-1/3">
                            <Card>
                                <h3 className="text-sm font-bold px-10">
                                    FORM MASTER LOCATION
                                </h3>
                                <form
                                    className="flex flex-row w-full gap-4 px-10"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <div className="flex flex-col mx-5 w-full gap-3 focus:ring-0">
                                        <div className="grid md:grid-cols-2 md:gap-6">
                                            <div className="flex w-full flex-col gap-0">
                                                <div className="">
                                                    <div className="mb-2 block">
                                                        <Label
                                                            htmlFor="locationGrp"
                                                            value="Location Group"
                                                        />
                                                    </div>
                                                    <Select
                                                        id="locationGrp"
                                                        required
                                                        {...register(
                                                            "locationGrp"
                                                        )}
                                                    >
                                                        <option
                                                            disabled
                                                            selected
                                                            value=""
                                                        >
                                                            select an option
                                                        </option>
                                                        {dataLocationGrp.map(
                                                            (res) => {
                                                                return (
                                                                    <option
                                                                        key={
                                                                            res.code_id
                                                                        }
                                                                        value={
                                                                            res.code_id
                                                                        }
                                                                    >
                                                                        {
                                                                            res.code_nm
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="mb-2 block">
                                                    <Label
                                                        htmlFor="status"
                                                        value="Status"
                                                    />
                                                </div>
                                                <Select
                                                    id="status"
                                                    required
                                                    {...register("status")}
                                                >
                                                    <option value={"A"}>
                                                        Active
                                                    </option>
                                                    <option value={"I"}>
                                                        Inactive
                                                    </option>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="mb-2 block">
                                                <Label
                                                    htmlFor="locationNm"
                                                    value="Location Name"
                                                />
                                            </div>
                                            <TextInput
                                                name="locationNm"
                                                type="text"
                                                sizing="md"
                                                required
                                                {...register("locationNm")}
                                            />
                                        </div>
                                        {/* <div className="flex flex-col md:gap-6">
                                            <div className="">
                                                <div className="mb-2 block">
                                                    <Label
                                                        htmlFor="remark"
                                                        value="Remark"
                                                    />
                                                </div>
                                                <Textarea
                                                    id="remark"
                                                    rows={4}
                                                    {...register("remark")}
                                                />
                                            </div>
                                        </div> */}
                                        <div className="flex flex-row md:gap-3 sticky mt-3 justify-end">
                                            <Button
                                                onClick={() => reset()}
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
                                <h3 className="text-sm font-bold px-6">
                                    Tabel Master Location
                                </h3>
                                <UseTable
                                    onDelete={onDeleteConfirm}
                                    deleteNm="Delete"
                                    onDetail={onDetail}
                                    data={dataLocation}
                                    columns={columnsData}
                                    style={"overflow-auto h-[500px]"}
                                    isLoading={isFetchLocation}
                                />
                            </Card>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MasterLocationtest;
