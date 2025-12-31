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
        accessorFn: (row) => row.empid,
        id: "empid",
        cell: (info) => info.getValue(),
        header: () => <span>Empid</span>,
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "name",
        header: () => "Name",
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "dept_nm",
        header: "Dept",
        footer: (props) => props.column.id,
    },
    {
        accessorKey: "phone",
        header: "Phone",
        footer: (props) => props.column.id,
    },
];

const MasterPic = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState();
    const { user, fetchPic, fetchEmp, addPic, delPic } = useStore();
    const columnsData = useMemo(() => [...columnData], []);
    const queryClient = useQueryClient();

    const {
        data: dataPic = [],
        isFetching: isFetchPic,
        refetch: refetchPic,
    } = useQuery({
        queryKey: ["dataPic"],
        queryFn: fetchPic,
        enabled: false,
    });
    const {
        data: dataEmpPic = [],
        isFetching: isFetchPicEmp,
        refetch: refetchPicEmp,
    } = useQuery({
        queryKey: ["dataEmpPic"],
        queryFn: fetchEmp,
        enabled: false,
    });

    const setPic = useMutation({
        mutationFn: addPic,
        onSuccess: (result, variables, context) => {
            queryClient.setQueryData(["dataPic"], (oldData) => {
                return [...oldData, variables.data];
            });
            queryClient.setQueryData(["dataEmpPic"], (oldData) => {
                oldData = oldData.filter(
                    (item) => item.empid != variables.data.empid
                );
                return [...oldData];
            });
            toast.success("Data added successfully!");
        },
    });

    const deletePic = useMutation({
        mutationFn: delPic,
        onSuccess: (result, variables, context) => {
            queryClient.setQueryData(["dataEmpPic"], (oldData) => {
                return [...oldData, variables.data];
            });
            queryClient.setQueryData(["dataPic"], (oldData) => {
                oldData = oldData.filter(
                    (item) => item.empid != variables.data.empid
                );
                return [...oldData];
            });
            toast.error("Data successfully deleted!");
        },
    });

    const onSearch = async () => {
        Promise.all([refetchPic(), refetchPicEmp()]).then((values) => {
            console.log(values);
        });
    };

    const toggleModal = (data, setData) => {
        setData(!data);
    };

    const onSetPic = (res) => {
        const data = {
            ...res,
            login_id: user.empid,
        };
        !setPic.isPending && setPic.mutate({ data });
    };
    const onDeleteConfirm = (res) => {
        console.log(res);
        setDeleteModalData(res);
        toggleModal(deleteModal, setDeleteModal);
    };
    const onDeleteSubmit = (res) => {
        const data = {
            ...res,
            login_id: user.empid,
        };
        !deletePic.isPending && deletePic.mutate({ data });
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
                            onClick={onSearch}
                        >
                            Search
                        </Button>
                    </div>
                </div>
            </Card>
            <Card className="w-full h-[730px] mt-4">
                <div className="flex flex-col w-full h-fit overflow-auto">
                    <div className="flex flex-row gap-3 mt-1">
                        <div className="w-1/2 flex-1">
                            <Card>
                                <h3 className="text-sm font-bold px-6">
                                    Tabel GA Reservation PIC
                                </h3>
                                <UseTable
                                    onDelete={onDeleteConfirm}
                                    data={dataPic}
                                    columns={columnsData}
                                    style={"overflow-auto h-[500px]"}
                                    isLoading={isFetchPic}
                                />
                            </Card>
                        </div>
                        <div className="w-1/2 flex-1">
                            <Card>
                                <h3 className="text-sm font-bold px-6">
                                    Tabel Employees
                                </h3>
                                <UseTable
                                    onEdit={onSetPic}
                                    editNm="Set PIC"
                                    data={dataEmpPic}
                                    columns={columnsData}
                                    style={"overflow-auto h-[500px]"}
                                    isLoading={isFetchPicEmp}
                                    isFilter={true}
                                />
                            </Card>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MasterPic;
