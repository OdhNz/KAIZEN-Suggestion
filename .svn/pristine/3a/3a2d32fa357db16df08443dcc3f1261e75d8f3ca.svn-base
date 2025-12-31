import React, { useEffect, useRef, useState } from "react";
import { HiDocumentAdd, HiDocumentRemove, HiUpload } from "react-icons/hi";
import useStore from "../../State/useStore";
import UseLabelHeader from "../../Components/UseLabelHeader";
import UseModal from "../../Components/UseModal";
import CreatableSelect from "react-select/creatable";
import dayjs from "dayjs";
import {
    Button,
    DatePicker,
    Form,
    Input,
    Select,
    Spin,
    Tag,
    Upload,
} from "antd";
import { useForm, useWatch } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Loading from "../../Components/Loading";
const { TextArea } = Input;
const selectStyle = {
    placeholder: (provided, state) => ({
        ...provided,
        color: "#cccccc",
    }),
};
const createOption = (label) => ({
    label,
    value: label,
});

const KaizenForm = () => {
    const {
        kaizenFormSet,
        path,
        fetchCategoryForm,
        kaizenGetEmpno,
        fetchKaizenLocation,
    } = useStore();
    const { id } = useParams();
    const [inputValue, setInputValue] = useState("");
    const [modalSuccess, setModalSuccess] = useState(false);
    const [supportId, setSupportId] = useState([]);
    const [supportIdVal, setSupportIdVal] = useState();
    const [kaizenCategory, setKaizeCategory] = useState({});
    const [bgnDt, setBgnDt] = useState(null);
    const [endDt, setEndDt] = useState(null);
    const [kaizenLoc, setKaizenLoc] = useState([]);
    const [filePreview, setFilePreview] = useState([]);
    const [formColor, setFormColor] = useState("#009966");
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    let empidTimeout = null;
    const supportIdRef = useRef(null);
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
            kaizenId: kaizenCategory?.category_id,
            kaizenNm: kaizenCategory?.name,
            title: "",
            empno: "",
            empName: "",
            empDept: "",
            loc: "",
            bgnDt: dayjs().format("YYYY-MM-DD"),
            endDt: dayjs().format("YYYY-MM-DD"),
            bgnDtVal: null,
            endDtVal: null,
            beforeText: "",
            afterText: "",
            beforeImgNm: "",
            afterImgNm: "",
            afterImgPreview: [],
            beforeImgPreview: [],
            filePreview: [],
            beforeImg: null,
            afterImg: null,
            file: null,
        },
    });
    const { data: kaizenCategoryData = [], isFetching, refetch } = useQuery({
        queryKey: ["category"],
        queryFn: async () => {
            return await fetchCategoryForm();
        },
        enabled: false,
    });
    const kaizenFormMutate = useMutation({
        mutationFn: kaizenFormSet,
        onMutate: () => {
            setIsLoading(true);
        },
        onSuccess: (result, variables, context) => {
            console.log(result, variables, context);
            if (result.data.status == 200) {
                reset();
                form.resetFields();
                setInputValue("");
                setSupportId([]);
                setBgnDt(null);
                setEndDt(null);
                setFilePreview(null);
                setModalSuccess(true);
            } else {
                toast.error(result.data.message);
            }
        },
        onError: (res) => {
            toast.error(res.message + " " + res.messageDtl);
        },
        onSettled: (data, error, variables, context) => {
            setIsLoading(false);
        },
    });

    const watchBefImg = useWatch({
        control,
        name: "beforeImg",
    });
    const watchAftImg = useWatch({
        control,
        name: "afterImg",
    });
    const handleSupporId = (res) => {
        if (supportIdVal && !supportId.includes(supportIdVal)) {
            setSupportId([...supportId, supportIdVal]);
            setValue("supportId", JSON.stringify([...supportId, supportIdVal]));
        }
        form.resetFields(["supportId"]);
        setTimeout(() => {
            res == "blur" ? null : supportIdRef.current?.focus();
        }, 0);
    };
    const handleClose = (removedTag) => {
        const newTags = [...supportId.filter((tag) => tag != removedTag)];
        setSupportId([...newTags]);
    };
    const onChangeText = (res, label) => {
        setValue(label, res.target.value);
    };
    const onChangeEmpid = (res, label) => {
        setValue(label, res.target.value);
        clearTimeout(empidTimeout);
        empidTimeout = setTimeout(() => {
            onGetEmpid(res.target.value);
        }, 2000);
    };
    const onGetEmpid = async (res) => {
        const item = await kaizenGetEmpno(res);
        if (item.status != 200 || !item.data[0]) {
            setValue("empno", "");
            return;
        }
        setValue("company", item.data[0].company);
        setValue("empName", item.data[0].name);
        setValue("empDept", item.data[0].dept);
    };
    const onChangeImg = (res, imgWatch, imgLabel, imgPreview) => {
        const file = res.file;
        const preview = res.fileList;
        setValue(imgPreview, [...preview]);
        imgWatch ? null : setValue(imgLabel, file);
    };
    const onChangeFile = (res, fileName, filePreview) => {
        const file = res.file;
        const preview = res.fileList;
        filePreview([...preview]);
        setValue(fileName, file);
    };
    const onRemoveImg = (res, imgLabel, imgPreview) => {
        setValue(imgPreview, null);
        setValue(imgLabel, null);
    };
    const onChangeDatePicker = (res, dtVal, dtLabel) => {
        const dt = dayjs(res).format("YYYY-MM-DD");
        dtVal(res);
        setValue(dtLabel, dt);
    };
    const onCheckForm = (rule, value, item, message) => {
        if (value != item || !value) {
            return Promise.reject(message);
        } else {
            return Promise.resolve();
        }
    };
    const onSubmit = () => {
        setIsLoading(true);
        kaizenFormMutate.mutate({ ...getValues() });

        console.log(getValues());
    };
    const onToggle = (toggle, setToggle) => {
        setToggle(!toggle);
    };
    const onChangeKaizenLoc = (res) => {
        setValue("loc", res);
    };
    const setCategory = async () => {
        const category =
            kaizenCategoryData.length > 0
                ? kaizenCategoryData
                : await refetch().then((res) => {
                      return res.data;
                  });
        const data = category.filter((res) => res.category_id == id);
        setValue("kaizenId", data[0].category_id);
        setValue("kaizenNm", data[0].name);
        data[0].color ? setFormColor(data[0].color) : setFormColor("#009966");
        setKaizeCategory(...data);
    };
    const setLocation = async () => {
        const dataLoc = await fetchKaizenLocation();
        setKaizenLoc(dataLoc.data);
    };
    useEffect(() => {
        setCategory();
        setLocation();
    }, [modalSuccess]);
    return (
        <>
            <UseModal
                modalStatus={modalSuccess}
                toggleModal={() => onToggle(modalSuccess, setModalSuccess)}
                modalName={"Selamat 📢 !!!"}
                size={"6xl"}
            >
                <p className="text-slate-600 text-sm">
                    Kaizen Kamu berhasil dikirim! Team Lean akan segera mereview
                    Kaizen kamu dan akan menghubungi lebih lanjut.
                    <br />
                    <br />
                    Terimakasih.
                </p>
            </UseModal>
            <Spin spinning={isLoading}>
                <div className="w-full h-full flex flex-col justify-center items-center overflow-auto">
                    <div className="w-full h-full flex flex-col justify-start flex-nowrap lg:justify-center lg:flex-row  lg:items-center lg:max-w-[1100px]">
                        <div className="max-w-full lg:px-5">
                            <UseLabelHeader
                                title="TT KAIZEN"
                                label="SUGGESTION"
                                desc={kaizenCategory?.name}
                                color={formColor}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 w-full h-full m-auto pb-16 md:pb-0 lg:px-6 lg:gap-2 lg:h-max lg:max-w-[800px]">
                            <div className="ml-auto">
                                <Link to={`${path}/`}>
                                    {" "}
                                    <Button size="large" danger>
                                        Back
                                    </Button>
                                </Link>
                            </div>
                            <Form
                                form={form}
                                onFinish={handleSubmit(onSubmit)}
                                layout="horizontal"
                                className="flex flex-col w-full gap-2"
                            >
                                <div className="flex flex-col gap-1 w-full">
                                    <span className="text-gray-700 text-base font-medium">
                                        Judul Kaizen
                                    </span>
                                    <Form.Item
                                        name="title"
                                        className="mb-auto"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Wajib mengisi judul Kaizen!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            name="title"
                                            className="w-full "
                                            placeholder="Judul Kaizen"
                                            size="large"
                                            onChange={(res) =>
                                                setValue(
                                                    "title",
                                                    res.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    <span className="text-gray-700 text-base font-medium">
                                        ID Pembuat Ide
                                    </span>
                                    <Form.Item
                                        name="empno"
                                        className="mb-auto"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Wajib mengisi ID Pembuat!",
                                            },
                                            {
                                                validator: (rule, value) => {
                                                    return onCheckForm(
                                                        rule,
                                                        value,
                                                        getValues("empno"),
                                                        "Id Pembuat Tidak ditemukan, coba periksa kembali!"
                                                    );
                                                },
                                            },
                                        ]}
                                    >
                                        <Input
                                            name="empno"
                                            className="w-full "
                                            placeholder="Contoh TT*"
                                            size="large"
                                            onChange={(res) =>
                                                onChangeEmpid(res, "empno")
                                            }
                                        />
                                    </Form.Item>
                                </div>

                                <div className="flex flex-row w-full gap-4">
                                    <div className="flex flex-col gap-1 w-1/2">
                                        <span className="text-gray-700 text-base font-medium">
                                            Tanggal Mulai
                                        </span>
                                        <DatePicker
                                            name="bgnDt"
                                            value={bgnDt}
                                            maxDate={endDt}
                                            size="large"
                                            placeholder="Mulai"
                                            onChange={(res) =>
                                                onChangeDatePicker(
                                                    res,
                                                    setBgnDt,
                                                    "bgnDt"
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 w-1/2">
                                        <span className="text-gray-700 text-base font-medium">
                                            Tanggal Selesai
                                        </span>
                                        <DatePicker
                                            name="endDt"
                                            value={endDt}
                                            minDate={bgnDt}
                                            size="large"
                                            placeholder="Selesai"
                                            onChange={(res) =>
                                                onChangeDatePicker(
                                                    res,
                                                    setEndDt,
                                                    "endDt"
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 mb-2">
                                    <span className="text-gray-700 text-base font-medium">
                                        ID Tim Pendukung
                                    </span>
                                    <div className="flex flex-row flex-wrap w-full gap-1 mb-2">
                                        {supportId.map((tag, index) => {
                                            return (
                                                <Tag
                                                    key={"tag" + index}
                                                    closable={true}
                                                    color={formColor}
                                                    style={{
                                                        userSelect: "none",
                                                    }}
                                                    onClose={() =>
                                                        handleClose(tag)
                                                    }
                                                >
                                                    <span>{tag}</span>
                                                </Tag>
                                            );
                                        })}
                                    </div>
                                    <Form.Item
                                        name="supportId"
                                        className="mb-auto"
                                    >
                                        <Input
                                            name="supportId"
                                            className="w-full "
                                            placeholder="Tim ID Pendukung"
                                            size="large"
                                            ref={supportIdRef}
                                            onBlur={(res) =>
                                                handleSupporId("blur")
                                            }
                                            onPressEnter={handleSupporId}
                                            onKeyDown={(res) =>
                                                res.keyCode == 32
                                                    ? handleSupporId()
                                                    : null
                                            }
                                            onChange={(res) =>
                                                setSupportIdVal(
                                                    res.target.value
                                                )
                                            }
                                        />
                                    </Form.Item>
                                    {/* <CreatableSelect
                                    name="supportId"
                                    components={{ DropdownIndicator: null }}
                                    inputValue={inputValue}
                                    isClearable
                                    isMulti
                                    menuIsOpen={false}
                                    onChange={(newValue) =>
                                        setSupportId(newValue)
                                    }
                                    onInputChange={(newValue) =>
                                        setInputValue(newValue.toUpperCase())
                                    }
                                    onKeyDown={handleKeyDown}
                                    placeholder="Masukan ID Pendukung"
                                    value={supportId}
                                    styles={selectStyle}
                                /> */}
                                </div>
                                <div className="flex flex-col mb-2">
                                    <span className="text-gray-700 text-base font-medium mb-1">
                                        Lokasi
                                    </span>
                                    <Form.Item
                                        name="loc"
                                        className="mb-auto"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Wajib Mengisi Lokasi Kaizen!",
                                            },
                                        ]}
                                    >
                                        <Select
                                            options={kaizenLoc}
                                            name="kaizenLoc"
                                            placeholder="Masukan Lokasi"
                                            size="large"
                                            required
                                            onChange={(res) =>
                                                onChangeKaizenLoc(res)
                                            }
                                        />
                                    </Form.Item>
                                </div>
                                <div className="flex flex-col flex-wrap items-start w-full gap-5 md:flex-row md:gap-1">
                                    <div className="flex flex-col justify-center w-full md:w-[calc(50%-2px)]">
                                        <span className="text-center bg-slate-600 text-white">
                                            SEBELUM
                                        </span>

                                        <Upload
                                            name="beforeImg"
                                            listType="picture-card"
                                            maxCount={1}
                                            accept="image/*"
                                            fileList={getValues(
                                                "beforeImgPreview"
                                            )}
                                            showUploadList={{
                                                showPreviewIcon: false,
                                            }}
                                            style={{ width: "100%" }}
                                            onChange={(res) => {
                                                onChangeImg(
                                                    res,
                                                    watchBefImg,
                                                    "beforeImg",
                                                    "beforeImgPreview"
                                                );
                                            }}
                                            onRemove={(res) =>
                                                onRemoveImg(
                                                    res,
                                                    "beforeImg",
                                                    "beforeImgPreview"
                                                )
                                            }
                                            beforeUpload={() => {
                                                return false;
                                            }}
                                        >
                                            {watchBefImg ? null : (
                                                <button
                                                    type="button"
                                                    style={{
                                                        backgroundColor: formColor,
                                                    }}
                                                    className={`flex justify-center items-center w-full h-full text-white text-5xl`}
                                                >
                                                    <HiDocumentRemove />
                                                </button>
                                            )}
                                        </Upload>
                                        <Form.Item
                                            name="beforeText"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Wajib Upload Foto dan menjelaskan Kondisi Sebelumnya!",
                                                },
                                                {
                                                    validator: (
                                                        rule,
                                                        value
                                                    ) => {
                                                        return onCheckForm(
                                                            rule,
                                                            getValues(
                                                                "beforeImg"
                                                            ),
                                                            getValues(
                                                                "beforeImg"
                                                            ),
                                                            "Wajib Upload Foto dan menjelaskan Kondisi Sebelumnya!"
                                                        );
                                                    },
                                                },
                                            ]}
                                        >
                                            <TextArea
                                                name="beforeText"
                                                placeholder="Jelaskan kondisi sebelumnya"
                                                maxLength={300}
                                                autoSize
                                                onChange={(res) =>
                                                    onChangeText(
                                                        res,
                                                        "beforeText"
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="flex flex-col justify-center w-full md:w-[calc(50%-2px)]">
                                        <span className="text-center bg-slate-600 text-white font-semibold">
                                            SETELAH
                                        </span>

                                        <Upload
                                            name="afterImg"
                                            listType="picture-card"
                                            maxCount={1}
                                            accept="image/*"
                                            fileList={getValues(
                                                "afterImgPreview"
                                            )}
                                            showUploadList={{
                                                showPreviewIcon: false,
                                            }}
                                            style={{ width: "100%" }}
                                            onChange={(res) => {
                                                onChangeImg(
                                                    res,
                                                    watchAftImg,
                                                    "afterImg",
                                                    "afterImgPreview"
                                                );
                                            }}
                                            onRemove={(res) =>
                                                onRemoveImg(
                                                    res,
                                                    "afterImg",
                                                    "afterImgPreview"
                                                )
                                            }
                                            beforeUpload={() => {
                                                return false;
                                            }}
                                        >
                                            {watchAftImg ? null : (
                                                <button
                                                    type="button"
                                                    style={{
                                                        backgroundColor: formColor,
                                                    }}
                                                    className={`flex justify-center items-center w-full h-full  text-white text-5xl`}
                                                >
                                                    <HiDocumentAdd />
                                                </button>
                                            )}
                                        </Upload>
                                        <Form.Item
                                            name="afterText"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Wajib Upload Foto dan menjelaskan Kondisi Setelahnya!",
                                                },
                                                {
                                                    validator: (
                                                        rule,
                                                        value
                                                    ) => {
                                                        return onCheckForm(
                                                            rule,
                                                            getValues(
                                                                "afterImg"
                                                            ),
                                                            getValues(
                                                                "afterImg"
                                                            ),
                                                            "Wajib Upload Foto dan menjelaskan Kondisi Setelahnya!"
                                                        );
                                                    },
                                                },
                                            ]}
                                        >
                                            <TextArea
                                                name="afterText"
                                                placeholder="Jelaskan kondisi setelahnya"
                                                maxLength={300}
                                                autoSize
                                                onChange={(res) =>
                                                    onChangeText(
                                                        res,
                                                        "afterText"
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="flex flex-col justify-center w-full gap-1 mt-2 ">
                                        <span className="text-gray-700 text-base font-medium">
                                            Dokumen Pendukung
                                        </span>
                                        <Upload
                                            name="file"
                                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx, .zip,.rar,application/zip,application/x-zip-compressed,application/vnd.rar"
                                            maxCount={1}
                                            fileList={filePreview}
                                            showUploadList={{
                                                showPreviewIcon: false,
                                            }}
                                            style={{ width: "100%" }}
                                            onChange={(res) => {
                                                onChangeFile(
                                                    res,
                                                    "file",
                                                    setFilePreview
                                                );
                                            }}
                                            beforeUpload={() => {
                                                return false;
                                            }}
                                        >
                                            <Button className="w-full bg-white">
                                                <HiDocumentAdd /> Upload Dokumen
                                            </Button>
                                        </Upload>
                                    </div>
                                    <div className="w-full mt-10">
                                        <Button
                                            style={{
                                                backgroundColor: formColor,
                                            }}
                                            htmlType="submit"
                                            type="submit"
                                            className="text-white text-lg w-full hover:!bg-emerald-800"
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
            </Spin>
        </>
    );
};

export default KaizenForm;
