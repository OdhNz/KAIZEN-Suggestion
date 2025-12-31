import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Main from "../Context/Main";
import { HiX } from "react-icons/hi";
import axios from "axios";
import {
    Datepicker,
    Button,
    FileInput,
    Label,
    Select,
    Textarea,
    TextInput,
} from "flowbite-react";

const DocFormCreate = (props) => {
    const [docTagsLs, setDocTagsLs] = useState([]);
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
        const formData = new FormData();
        formData.append("_method", "post");
        formData.append("file", data.docFile[0]);
        formData.append(
            "docDt",
            data.docDate == undefined
                ? new Date().toLocaleDateString("id-ID")
                : data.docDate.toLocaleDateString("id-ID")
        );
        formData.append("tags", JSON.stringify(docTagsLs));
        for (let key in data) {
            formData.append(key, data[key]);
        }
        await axios
            .post("api/savedocument", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(function (response) {
                console.log(response);
                props.setSubmit(false);
            })
            .catch(function (response) {
                console.log(response);
                props.setSubmit(false);
            });
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
        console.log(props.submit);
        props.submit && handleSubmit(onSubmit)();
    }, [props.submit]);

    useEffect(() => {
        register("docParent", { value: "" });
        register("docPath", { value: "" });
    }, []);

    return (
        <div className="m-auto w-full flex flex-row">
            <form className="flex flex-row w-full gap-4">
                <div className="flex flex-col mx-5 w-full gap-3 focus:ring-0">
                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="flex w-full flex-col gap-0">
                            <div className="mb-2 block">
                                <Label htmlFor="docNum" value="Documen Num" />
                            </div>
                            <TextInput
                                name="docNum"
                                type="text"
                                sizing="md"
                                value={"1"}
                                disabled
                                {...register("docNum")}
                            />
                        </div>
                        <div className="flex flex-col gap-0">
                            <div className="mb-2 block">
                                <Label htmlFor="version" value="Version" />
                            </div>
                            <TextInput
                                name="version"
                                type="text"
                                sizing="md"
                                value={"0"}
                                disabled
                                {...register("version")}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-0">
                        <div className="mb-2 block">
                            <Label htmlFor="docTitle" value="Document Title" />
                        </div>
                        <TextInput
                            name="docTitle"
                            type="text"
                            sizing="md"
                            {...register("docTitle")}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="">
                            <div className="mb-2 block">
                                <Label htmlFor="docCategory" value="Category" />
                            </div>
                            <Select
                                id="docCategory"
                                {...register("docCategory")}
                            >
                                <option>United States</option>
                                <option>Canada</option>
                                <option>France</option>
                                <option>Germany</option>
                            </Select>
                        </div>
                        <div className="flex  flex-col gap-0">
                            <div className="mb-2 block">
                                <Label htmlFor="docDate" value="Select Date" />
                            </div>
                            <Controller
                                control={control}
                                name="docDate"
                                render={({ field }) => (
                                    <Datepicker
                                        selected={field.value}
                                        onSelectedDateChanged={field.onChange}
                                        onChange={() => console.log(field)}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row md:gap-6">
                        <div className="w-1/2">
                            <div className="mb-2 block">
                                <Label htmlFor="docLevel" value="Level" />
                            </div>
                            <Select id="docLevel" {...register("docLevel")}>
                                <option>United States</option>
                                <option>Canada</option>
                                <option>France</option>
                                <option>Germany</option>
                            </Select>
                        </div>
                        <div className="w-1/2">
                            <div className="mb-2 block">
                                <Label htmlFor="docArea" value="Area" />
                            </div>
                            <Select id="docArea" {...register("docArea")}>
                                <option>United States</option>
                                <option>Canada</option>
                                <option>France</option>
                                <option>Germany</option>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex  flex-col gap-0">
                            <div className="mb-2 block">
                                <Label htmlFor="tags" value="Tags" />
                            </div>
                            <TextInput
                                name="tags"
                                type="text"
                                sizing="md"
                                onKeyDown={handleKeyDown}
                                {...register("docTags")}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {docTagsLs.map((item, index) => {
                                return (
                                    <Button
                                        key={`tags${index}`}
                                        size="xs"
                                        color="warning"
                                        onClick={() => {
                                            removeTags(index);
                                        }}
                                    >
                                        <HiX className="mr-2 h-5 w-5" />
                                        {item}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col md:gap-6">
                        <div className="">
                            <div className="mb-2 block">
                                <Label htmlFor="docRemark" value="Remark" />
                            </div>
                            <Textarea
                                id="docRemark"
                                rows={4}
                                {...register("docRemark")}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="">
                            <Label htmlFor="docFile" value="Upload Document" />
                        </div>
                        <FileInput
                            id="docFile"
                            name="docFile"
                            {...register("docFile")}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DocFormCreate;
