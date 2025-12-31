import { Button, Card, DatePicker, Image, Select, Spin } from "antd";
import React, { useEffect, useState, useRef } from "react";
import useStore from "../../State/useStore";
import UseLabelHeader from "../../Components/UseLabelHeader";
import UseTableAnt from "../../Components/UseTableKaizen";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { HiDocumentReport, HiDownload } from "react-icons/hi";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import KaizenTableAdmin from "./KaizenTableAdmin";
import { toast } from "react-toastify";
import axios from "axios";

const KaizenList = () => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [listStatus, setListStatus] = useState("");
    const [rangeDt, setRangeDt] = useState({
        bgn: dayjs().startOf("month"),
        end: dayjs().endOf("month"),
    });
    const [befPreview, setBefPreview] = useState();
    const [aftPreview, setAftPreview] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const {
        path,
        pathFile,
        kaizenSetStatus,
        fetchKaizenData,
        fetchDocumentDownload,
    } = useStore();
    const kaizenSetStatusMutate = useMutation({
        mutationFn: kaizenSetStatus,
        onMutate: () => {
            setIsLoading(true);
        },
        onSuccess: (result, variables, context) => {
            console.log(result, variables, context);
            if (result.data.status == 200) {
                toast.success("Data has been Update!");
                refetchKaizenData();
            } else {
                toast.error(result.data.message);
            }
        },
        onError: (res) => {
            toast.error(res.message);
        },
        onSettled: (data, error, variables, context) => {
            setIsLoading(false);
        },
    });
    const {
        data: kaizenData = [],
        isFetching: isFetchKaizenData,
        refetch: refetchKaizenData,
    } = useQuery({
        queryKey: ["kaizenListData"],
        queryFn: async () => {
            const params = {
                status: listStatus,
                bgnDt: rangeDt.bgn.format("YYYYMMDD"),
                endDt: rangeDt.end.format("YYYYMMDD"),
            };
            const res = await fetchKaizenData(params);
            return res;
        },
        enabled: false,
    });
    const onSetStatus = (res, status) => {
        const param = { ...res, action: status };
        kaizenSetStatusMutate.mutate(param);
    };
    const onSearch = () => {
        refetchKaizenData();
    };

    const mimeMap = {
        "text/plain": ".txt",
        "text/html": ".html",
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "application/pdf": ".pdf",
        "application/json": ".json",
        "application/xml": ".xml",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
        "application/vnd.ms-powerpoint": ".ppt",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx"
    };

    const getMimeTypeExt = (mimeType) => mimeMap[mimeType] || "";

    const onDownloadFile = async (item) => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/fetchDocumentDownload", {
                params: { path: item.doc },
                responseType: "blob" // penting: ambil data sebagai blob
            });

            const mimeType = response.headers["content-type"]; // ambil dari header
            const ext = getMimeTypeExt(mimeType);

            saveAs(
                new Blob([response.data], { type: mimeType }), // blob dengan tipe benar
                "TTKaizenFile" + dayjs().format("YYYYMMDD") + ext
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onPreview = async (item) => {
        try {
            setIsLoading(true);
            const prevBef = await fetchDocumentDownload({
                path: item.bef_file,
            });
            const prevAft = await fetchDocumentDownload({
                path: item.aft_file,
            });

            befPreview ? URL.revokeObjectURL(befPreview) : null;
            aftPreview ? URL.revokeObjectURL(aftPreview) : null;

            setBefPreview(URL.createObjectURL(prevBef.data));
            setAftPreview(URL.createObjectURL(prevAft.data));

            setPreviewVisible(true);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };
    const onHandlePaste = (res) => {
        const text = res.clipboardData.getData("text/plain").split("\r");
        let arrData = [];
        const header = text[0].split("\t");
        text.map((arr) => {
            let obj = {};
            arr.split("\t").map((item, index) => {
                obj[header[index]] = item.replace("\n", "");
            });
            arrData = [...arrData, obj];
        });
        console.log(arrData);
    };

    const categoryFilters = kaizenData.length 
    ? [...new Set(kaizenData.map((item) => item.category_nm))].map((cat) => ({ 
        text: cat, 
        value: cat, 
    })) : [];

    const deptFilters = kaizenData.length
    ? [... new Set(kaizenData.map((item) => item.dept))].map((dept) => ({
        text: dept,
        value: dept,
    })) : [];

const columns = [
    {
        title: "No",
        dataIndex: "no",
        key: "no",
        width: 100,
        render: (id, record, index) => {
            ++index;
            return index;
        },
        filter: false,
        sort: false,
        import: false,
    },
    {
        title: "ID",
        dataIndex: "kaizen_id",
        key: "kaizen_id",
        width: 100,
        hidden: true,
        import: false,
    },
    {
        title: "ID",
        dataIndex: "kaizen_id_nm",
        key: "kaizen_id_nm",
        width: 120,
        filter: true,
        sort: false,
    },
    {
        title: "Title",
        dataIndex: "title",
        key: "title",
        width: 150,
        filter: true,
        sort: false,
    },
    {
        title: "Category ID",
        dataIndex: "category_id",
        key: "category_id",
        width: 100,
        hidden: true,
        import: false,
    },
    {
        title: "Category",
        dataIndex: "category_nm",
        key: "category_nm",
        width: 120,
        filters: categoryFilters,
        onFilter: (value, record) => record.category_nm === value,
        filterMultiple: true,
    },
    {
        title: "Location",
        dataIndex: "location_id",
        key: "location_id",
        width: 100,
        hidden: true,
        import: false,
    },
    {
        title: "Lokasi",
        key: "location_nm",
        dataIndex: "location_nm",
        width: 100,
    },
    {
        title: "Company",
        dataIndex: "company",
        key: "company",
        width: 130,
        filter: true,
        sort: true,
    },
    {
        title: "Empno",
        dataIndex: "empno",
        key: "empno",
        width: 120,
        filter: true,
        sort: false,
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 150,
        filter: true,
        sort: false,
    },
    {
        title: "Dept",
        dataIndex: "dept",
        key: "dept",
        width: 150,
        filters: deptFilters,
        onFilter: (value, record) => record.dept === value,
        filterMultiple: true,
    },
    {
        title: "Date",
        dataIndex: "tl_date",
        key: "tl_date",
        width: 120,
        filter: true,
        sort: false,
    },
    {
        title: "Bgn Date",
        dataIndex: "bgn_dt",
        key: "bgn_dt",
        width: 120,
        filter: true,
        sort: false,
    },
    {
        title: "End Date",
        dataIndex: "end_dt",
        key: "end_dt",
        width: 120,
        filter: true,
        sort: false,
    },
    {
        title: "Before",
        dataIndex: "bef_remark",
        key: "bef_remark",
        width: 300,
        filter: true,
        sort: false,
    },
    {
        title: "After",
        dataIndex: "aft_remark",
        key: "aft_remark",
        width: 300,
        filter: true,
        sort: false,
    },
    {
        title: "SUPPORTING ID",
        import: false,
        children: [
            {
                title: "Emp",
                dataIndex: "emp1",
                key: "emp1",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Name",
                dataIndex: "name1",
                key: "name1",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Dept",
                dataIndex: "dept1",
                key: "dept1",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Emp",
                dataIndex: "emp2",
                key: "emp2",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Name",
                dataIndex: "name2",
                key: "name2",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Dept",
                dataIndex: "dept2",
                key: "dept2",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Emp",
                dataIndex: "emp3",
                key: "emp3",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Name",
                dataIndex: "name3",
                key: "name3",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Dept",
                dataIndex: "dept3",
                key: "dept3",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Emp",
                dataIndex: "emp4",
                key: "emp4",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Name",
                dataIndex: "name4",
                key: "name4",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Dept",
                dataIndex: "dept4",
                key: "dept4",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Emp",
                dataIndex: "emp5",
                key: "emp5",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Name",
                dataIndex: "name5",
                key: "name5",
                width: 100,
                filter: true,
                sort: false,
            },
            {
                title: "Dept",
                dataIndex: "dept5",
                key: "dept5",
                width: 100,
                filter: true,
                sort: false,
            },
        ],
    },
];


    return (
        <>
            {" "}
            <Image.PreviewGroup
                preview={{
                    visible: previewVisible,
                    onVisibleChange: (val) => setPreviewVisible(val),
                }}
            >
                <Image className="hidden" src={befPreview} />
                <Image className="hidden" src={aftPreview} />
            </Image.PreviewGroup>
            <div className="flex flex-col min-w-full min-h-full gap-3">
                <div
                    className="flex flex-col justify-between items-start w-full h-max p-1 gap-2 md:flex-row lg:px-10"
                    onPaste={onHandlePaste}
                >
                    <div className="text-left">
                        <span className="font-medium text-gray-500 lg:text-gray-200">
                            Kaizen Administrator Report
                        </span>
                    </div>
                    <div className="flex flex-col gap-2 md:flex-row">
                        <div className="flex flex-col gap-2 md:gap-2 md:flex-row">
                            <span className="text-xs text-gray-700 font-semibold min-w-fit md:text-sm md:m-auto">
                                Status :
                            </span>
                            <Select
                                name="status"
                                className="w-full md:w-24"
                                defaultValue={""}
                                options={[
                                    { value: "", label: "All" },
                                    {
                                        value: "N",
                                        label: "New",
                                    },
                                    {
                                        value: "A",
                                        label: "Approve",
                                    },
                                    {
                                        value: "R",
                                        label: "Reject",
                                    },
                                ]}
                                onChange={(res) => setListStatus(res)}
                            />
                        </div>

                        <div className="flex flex-col gap-2 md:gap-2 md:flex-row">
                            <span className="text-xs text-gray-700 font-semibold min-w-fit md:text-sm md:m-auto">
                                Date :
                            </span>
                            <DatePicker.RangePicker
                                defaultValue={[rangeDt.bgn, rangeDt.end]}
                                onChange={(res) =>
                                    setRangeDt({ bgn: res[0], end: res[1] })
                                }
                                disabled={[false, false]}
                            />
                        </div>
                        <Button
                            className="bg-emerald-700 text-white font-medium hover:!bg-emerald-600 hover:!text-white hover:!outline-white"
                            onClick={onSearch}
                        >
                            Search
                        </Button>
                    </div>
                </div>
                <Spin spinning={isLoading}>
                    <div className="flex flex-row min-w-full min-h-full pb-16 md:pb-0">
                        <KaizenTableAdmin
                            columns={[
                                ...columns,
                                {
                                    title: "Image",
                                    key: "image",
                                    width: 100,
                                    fixed: "right",
                                    render: (id, record, index) => {
                                        return (
                                            <div
                                                className={`flex items-center justify-center ${record.bef_file ||
                                                        record.aft_file
                                                        ? "text-emerald-500"
                                                        : ""
                                                    } text-lg
                                                 hover:text-emerald-600 hover:cursor-pointer active:animate-bounce`}
                                                onClick={() =>
                                                    onPreview(record)
                                                }
                                            >
                                                <HiDocumentReport />
                                            </div>
                                        );
                                    },
                                },
                                {
                                    title: "File",
                                    key: "file",
                                    width: 100,
                                    fixed: "right",
                                    render: (id, record, index) => {
                                        return (
                                            <div
                                                className={`flex items-center justify-center  ${record.doc
                                                        ? "text-emerald-500"
                                                        : ""
                                                    } text-lg hover:text-emerald-600 hover:cursor-pointer`}
                                                onClick={() =>
                                                    onDownloadFile(record)
                                                }
                                            >
                                                <HiDownload />
                                            </div>
                                        );
                                    },
                                },
                                {
                                    title: "Action / Status",
                                    key: "action",
                                    width: 200,
                                    fixed: "right",
                                    render: (id, record, index) => {
                                        return record.status != "N" ? (
                                            <div
                                                className={`flex flex-row items-center justify-start text-sm gap-2`}
                                            >
                                                <Button
                                                    color={
                                                        record.status == "A"
                                                            ? "primary"
                                                            : "danger"
                                                    }
                                                    variant="filled"
                                                    className="cursor-default"
                                                >
                                                    {record.status_nm}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div
                                                className={`flex flex-row items-center justify-center text-sm gap-2`}
                                            >
                                                <Button
                                                    color="danger"
                                                    variant="outlined"
                                                    onClick={() =>
                                                        onSetStatus(record, "R")
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    color="primary"
                                                    variant="outlined"
                                                    onClick={() =>
                                                        onSetStatus(record, "A")
                                                    }
                                                >
                                                    Approve
                                                </Button>
                                            </div>
                                        );
                                    },
                                },
                            ]}
                            loading={isFetchKaizenData}
                            data={kaizenData}
                            height={615}
                            width="2000px"
                        />
                    </div>
                </Spin>
            </div>
        </>
    );
};

export default KaizenList;
