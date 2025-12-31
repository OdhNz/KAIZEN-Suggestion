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
import { HiX } from "react-icons/hi";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import UseTable from "../Components/useTable";
import UseModal from "../Components/UseModal";
import useStore from "../State/useStore";

const MasterData = () => {
    const [data, setData] = useState([]);
    const [addModalStatus, setAddModalStatus] = useState(false);
    const [docTagsLs, setDocTagsLs] = useState([]);

    const state = useStore();
    const onSearch = async () => {
        await axios
            .get("api/fetchClassMasterData")
            .then(function (response) {
                setData(response.data);
            })
            .catch(function (response) {
                console.log(response);
            });
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: "company",
                cell: (info) => info.getValue(),
                footer: (props) => props.column.id,
                header: () => <span>Company</span>,
            },
            {
                accessorFn: (row) => row.code_class_id,
                id: "code_class_id",
                cell: (info) => info.getValue(),
                header: () => <span>Class Code</span>,
                footer: (props) => props.column.id,
            },
            {
                accessorKey: "descr",
                header: () => "Remark",
                footer: (props) => props.column.id,
            },
            {
                accessorKey: "eff_status",
                header: "Status",
                footer: (props) => props.column.id,
            },
        ],
        []
    );
    const onAdd = () => {
        toggleModal(addModalStatus, setAddModalStatus);
    };

    const onDetail = (item) => {
        console.log(item);
    };
    const onDelete = (item) => {
        console.log(item);
    };
    const toggleModal = (data, setData) => {
        setData(!data);
    };
    const {
        control,
        register,
        getValues,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            let tags = getValues("docTags");
            setDocTagsLs((data) => [...data, tags]);
            setValue("docTags", "");
        }
    };

    const removeTags = (item) => {
        setDocTagsLs((data) => data.filter((_, i) => i !== item));
    };

    const onSubmit = async (data) => {
        console.log(data);
        // const formData = new FormData();
        // formData.append("_method", "post");
        // formData.append("file", data.docFile[0]);
        // formData.append(
        //     "docDt",
        //     data.docDate == undefined
        //         ? new Date().toLocaleDateString("id-ID")
        //         : data.docDate.toLocaleDateString("id-ID")
        // );
        // formData.append("tags", JSON.stringify(docTagsLs));
        // for (let key in data) {
        //     formData.append(key, data[key]);
        // }
        // await axios
        //     .post("api/savedocument", formData, {
        //         headers: {
        //             "Content-Type": "multipart/form-data",
        //         },
        //     })
        //     .then(function (response) {
        //         console.log(response);
        //         props.setSubmit(false);
        //     })
        //     .catch(function (response) {
        //         console.log(response);
        //         props.setSubmit(false);
        //     });
    };
    const onDownload = async (data) => {
        const formData = new FormData();
        formData.append("_method", "post");
        formData.append("file", data.docFile[0]);
        for (let key in data) {
            formData.append(key, data[key]);
        }
        await axios
            .post("api/getdocument", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: "blob",
            })
            .then((response) => {
                if (response.data.size > 0) {
                    const url = window.URL.createObjectURL(
                        new Blob([response.data])
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "file.pdf");
                    document.body.appendChild(link);
                    link.click();
                } else {
                    console.log("FIle tidak ditemukan");
                }
            });
    };
    useEffect(() => {
        console.log(state.modal);
    }, [state.modal]);

    return (
        <div className="flex flex-col p-2 w-full bg-transparent ">
            <UseModal
                modalStatus={addModalStatus}
                toggleModal={() =>
                    toggleModal(addModalStatus, setAddModalStatus)
                }
            >
                <div className="m-auto w-full flex flex-row">
                    <form
                        className="flex flex-row w-full gap-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-col mx-5 w-full gap-3 focus:ring-0">
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="flex w-full flex-col gap-0">
                                    <div className="mb-2 block">
                                        <Label
                                            htmlFor="classCode"
                                            value="Class Code"
                                        />
                                    </div>
                                    <TextInput
                                        name="classCode"
                                        type="text"
                                        sizing="md"
                                        required
                                        {...register("classCode")}
                                    />
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
                                        <option value={"A"}>Active</option>
                                        <option value={"I"}>Inactive</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex flex-col md:gap-6">
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
                            </div>
                            <div className="flex flex-col md:gap-6 sticky bottom-0">
                                <Button type="submit">Save</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </UseModal>
            <Card className="w-full h-fit">
                <div className="flex flex-col w-full h-full">
                    <div className="flex flex-row align-bottom">
                        <div>
                            <div className="mb-1 block">
                                <Label htmlFor="company" value="Company" />
                            </div>
                            <TextInput
                                id="company"
                                type="text"
                                placeholder="TT"
                                required
                                shadow
                            />
                        </div>
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
            <Card className="w-full h-fit mt-4">
                <div className="flex flex-col w-full h-fit overflow-auto">
                    <Button
                        className="ml-auto mt-auto h-10"
                        onClick={() => onAdd()}
                    >
                        Add
                    </Button>
                    <UseTable
                        onDetail={onDetail}
                        onDelete={onDelete}
                        data={data}
                        columns={columns}
                        style={"overflow-auto h-52"}
                    />{" "}
                    {/* <MyTable
                        {...{
                            data,
                            columns,
                        }}
                    /> */}
                </div>
            </Card>
        </div>
    );
};

export default MasterData;
