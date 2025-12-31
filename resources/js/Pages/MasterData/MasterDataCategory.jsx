import React, { useEffect, useState, useRef } from "react";
import useStore from "../../State/useStore";
import UseLabelHeader from "../../Components/UseLabelHeader";
import UseTableAnt from "../../Components/UseTableKaizen";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import {
    HiDocument,
    HiDocumentAdd,
    HiDocumentReport,
    HiDownload,
    HiViewGridAdd,
} from "react-icons/hi";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import {
    Button,
    DatePicker,
    Form,
    Input,
    Select,
    Upload,
    Card,
    Image,
    ColorPicker,
} from "antd";
import UseTableKaizen from "../../Components/UseTableKaizen";
import { toast } from "react-toastify";
const { TextArea } = Input;

const columns = [
    {
        title: "No",
        dataIndex: "no",
        key: "no",
        width: 30,
        render: (id, record, index) => {
            ++index;
            return index;
        },
        filter: false,
        sort: false,
        import: false,
    },
    {
        title: "Category Name",
        dataIndex: "name",
        key: "name",
        width: 100,
        import: false,
    },
    {
        title: "Category Description",
        dataIndex: "remark",
        key: "remark",
        width: 150,
        import: false,
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 30,
        import: false,
    },
];

const MasterDataCategory = () => {
    const [fileList, setFileList] = useState([]);
    const {
        fetchCategory,
        fetchDocumentDownload,
        setCategoryData,
    } = useStore();
    const [form] = Form.useForm();
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
            title: "",
            status: "A",
            kaizenDesc: "",
            kaizenImg: null,
            oldKaizenImg: null,
            newKaizenImg: null,
            kaizenImgPreview: null,
        },
    });
    const kaizenImgWatch = useWatch({
        control,
        name: "kaizenImgPreview",
    });
    const masterDataMutation = useMutation({
        mutationFn: setCategoryData,
        onSuccess: (result, variables, context) => {
            console.log(result, variables, context);
            if (result.data.status == 200) {
                reset();
                form.resetFields();
                refetchMasterData();
                setFileList([]);
                toast.success("Inser/Update Successfully!");
            } else {
                toast.error(result.data.message);
            }
        },
        onError: (res) => {
            toast.error(res.message + " " + res.messageDtl);
        },
    });
    const {
        data: masterData = [],
        isFetching: isFetchMasterData,
        refetch: refetchMasterData,
    } = useQuery({
        queryKey: ["categoryData"],
        queryFn: fetchCategory,
        enabled: false,
    });
    const onSearch = () => {
        refetchMasterData();
    };
    const onDetailMasterData = async (res) => {
        const kaizenImgRes = await fetchDocumentDownload({
            path: res.cat_file,
        });
        console.log(kaizenImgRes);
        const fileImg = new File([kaizenImgRes.data], res.cat_file, {
            type: kaizenImgRes.data.type,
        });
        const initKaizenImg = [
            {
                uid: "-1",
                name: res.cat_file,
                status: "done",
                originFileObj: fileImg,
            },
        ];
        setValue("kaizenId", res.category_id);
        setValue("title", res.name);
        setValue("kaizenDesc", res.remark);
        setValue("status", res.status);
        setValue("color", res.color);
        // setValue(
        //     "kaizenImg",
        //     kaizenImgRes.data.size == 0 ? null : initKaizenImg
        // );
        setValue("oldKaizenImg", res.cat_file);
        setFileList(kaizenImgRes.data.size == 0 ? [] : initKaizenImg);
        form.setFieldsValue({
            title: res.name,
            status: res.status,
            color: res.color,
            kaizenDesc: res.remark,
        });
    };
    const onChangeImg = (res, imgWatch, imgLabel, imgPreview) => {
        if (res.file.status == "removed") return false;
        const file = res.file;
        const preview = res.fileList;
        setFileList(preview);
        setValue(imgPreview, preview.length == 0 ? null : preview);
        setValue(imgLabel, file);
    };
    const onRemoveImg = (res, imgLabel, imgPreview) => {
        setFileList([]);
        setValue(imgLabel, null);
        setValue(imgPreview, null);
    };
    const onSubmit = () => {
        masterDataMutation.mutate({ ...getValues() });
    };

    return (
        <>
            {" "}
            <div className="flex flex-col w-full min-h-full gap-10 overflow-auto pb-4 ">
                <div className="flex flex-row justify-between items-center w-full h-max md:px-10">
                    <div className="flex items-center justify-center">
                        <span className="font-medium text-gray-500 lg:text-gray-200">
                            Master Category Kaizen
                        </span>
                    </div>
                    <div>
                        <Button
                            className="bg-emerald-700 text-white font-medium hover:!bg-emerald-600 hover:!text-white hover:!outline-white"
                            onClick={onSearch}
                        >
                            Search
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col-reverse w-full min-h-full items-center justify-center gap-4 px-10 mx-auto md:flex-row">
                    <div className="w-full mx-auto mb-auto md:w-1/2 lg:w-2/3 lg:px-10">
                        <UseTableKaizen
                            columns={[
                                ...columns,
                                {
                                    title: "Detail",
                                    dataIndex: "detail",
                                    key: "detail",
                                    width: 30,
                                    render: (id, record, index) => {
                                        return (
                                            <div
                                                className="flex flex-row items-center justify-center w-full h-full text-gray-500 cursor-pointer hover:text-emerald-600"
                                                onClick={() =>
                                                    onDetailMasterData(record)
                                                }
                                            >
                                                <HiDocument />
                                            </div>
                                        );
                                    },
                                    filter: false,
                                    sort: false,
                                    import: false,
                                    fixed: "right",
                                },
                            ]}
                            data={masterData}
                            loading={isFetchMasterData}
                            height={620}
                            width="830px"
                        />
                    </div>
                    <div className="flex w-full overflow-auto bg-white rounded-lg shadow-xl p-10 md:w-1/2 lg:w-1/3 lg:px-10 h-1000px">
                        <Form
                            form={form}
                            layout="horizontal"
                            className="flex flex-col w-full gap-2"
                            onFinish={handleSubmit(onSubmit)}
                        >
                            <div className="flex flex-col gap-3 w-full">
                                <span className="text-gray-700 text-base font-medium">
                                    Category Kaizen
                                </span>
                                <Form.Item
                                    name="title"
                                    className="mb-auto"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Title is Require!",
                                        },
                                    ]}
                                >
                                    <Input
                                        name="title"
                                        className="w-full "
                                        placeholder="Kaizen Title"
                                        size="large"
                                        value={getValues("title")}
                                        onChange={(res) =>
                                            setValue("title", res.target.value)
                                        }
                                    />
                                </Form.Item>
                            </div>
                            <div className="flex flex-row items-center justify-center w-full gap-3">
                                <div className="flex flex-col gap-3 w-1/2">
                                    <span className="text-gray-700 text-base font-medium">
                                        Status
                                    </span>
                                    <Form.Item
                                        name="status"
                                        className="mb-auto"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Status is Require!",
                                            },
                                        ]}
                                    >
                                        <Select
                                            name="status"
                                            className="w-full"
                                            options={[
                                                { value: "A", label: "Active" },
                                                {
                                                    value: "I",
                                                    label: "Inactive",
                                                },
                                            ]}
                                            onChange={(res) =>
                                                setValue("status", res)
                                            }
                                        />
                                    </Form.Item>
                                </div>
                                <div className="flex flex-col gap-3 w-1/2">
                                    <span className="text-gray-700 text-base font-medium">
                                        Color Theme
                                    </span>
                                    <Form.Item
                                        name="color"
                                        className="mb-auto"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Color is Require!",
                                            },
                                        ]}
                                    >
                                        <ColorPicker
                                            showText
                                            defaultValue="#009966"
                                            onChange={(res) =>
                                                setValue(
                                                    "color",
                                                    res.toHexString()
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full">
                                <span className="text-gray-700 text-base font-medium">
                                    Description
                                </span>
                                <Form.Item
                                    name="kaizenDesc"
                                    className="mb-auto"
                                >
                                    <TextArea
                                        name="kaizenDesc"
                                        placeholder="Add Kaizen Category Description"
                                        maxLength={300}
                                        autoSize={{ minRows: 3, maxRows: 6 }}
                                        onChange={(res) =>
                                            setValue(
                                                "kaizenDesc",
                                                res.target.value
                                            )
                                        }
                                        value={getValues("kaizenDesc")}
                                    />
                                </Form.Item>
                            </div>
                            <div className="flex flex-col flex-wrap items-start w-full gap-5">
                                <div className="flex flex-col justify-center w-full gap-3">
                                    <span className="text-gray-700 text-base font-medium">
                                        Image
                                    </span>
                                    <Form.Item
                                        name="kaizenImg"
                                        className="mb-auto"
                                        rules={[
                                            {
                                                validator: (rule, value) => {
                                                    if (
                                                        !getValues(
                                                            "oldKaizenImg"
                                                        ) &&
                                                        !value
                                                    ) {
                                                        return Promise.reject(
                                                            "Image is Required!"
                                                        );
                                                    } else {
                                                        return Promise.resolve();
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <Upload
                                            name="kaizenImg"
                                            listType="picture-card"
                                            maxCount={1}
                                            accept="image/*"
                                            fileList={[...fileList]}
                                            showUploadList={{
                                                showPreviewIcon: false,
                                            }}
                                            style={{ width: "100%" }}
                                            onChange={(res) => {
                                                onChangeImg(
                                                    res,
                                                    kaizenImgWatch,
                                                    "kaizenImg",
                                                    "kaizenImgPreview"
                                                );
                                            }}
                                            onRemove={(res) =>
                                                onRemoveImg(
                                                    res,
                                                    "kaizenImg",
                                                    "kaizenImgPreview"
                                                )
                                            }
                                            beforeUpload={() => {
                                                return false;
                                            }}
                                        >
                                            {fileList.length ? null : (
                                                <button
                                                    type="button"
                                                    className={`flex justify-center items-center w-full h-full text-gray-600 text-5xl`}
                                                >
                                                    <HiDocumentAdd />
                                                </button>
                                            )}
                                        </Upload>
                                    </Form.Item>
                                </div>
                                <div className="w-full">
                                    <Button
                                        type="submit"
                                        htmlType="submit"
                                        className="text-white text-lg w-full bg-emerald-600 hover:!bg-emerald-800"
                                        size="large"
                                    >
                                        KIRIM
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MasterDataCategory;
