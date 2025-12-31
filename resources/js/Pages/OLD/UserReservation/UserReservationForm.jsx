import { usePage } from "@inertiajs/react";
import React, { useState, useMemo, useEffect } from "react";
import {
    Button,
    Card,
    Label,
    TextInput,
    Datepicker,
    Textarea,
    FileInput,
    Spinner,
} from "flowbite-react";
import { useForm, Controller, get } from "react-hook-form";
import Select from "react-select";
import useStore from "../../State/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { HiOutlineXCircle } from "react-icons/hi";
import UseSkeleton from "../../Components/UseSkeleton";

const UserReservationForm = (props) => {
    const { formData } = props;
    const [dataRepair, setDataRepair] = useState([]);
    const [dataRepairLoc, setDataRepairLoc] = useState([]);
    const [dataRepairGroup, setDataRepairGroup] = useState([]);
    const [formStatus, setFormStatus] = useState("I");
    const [selectRepairGrp, setSelectRepairGrp] = useState();
    const [selectRepair, setSelectRepair] = useState();
    const [selectRepairLocGrp, setSelectRepairLocGrp] = useState();
    const [selectRepairLoc, setSelectRepairLoc] = useState();
    const [selectRepairDt, setSelectRepairDt] = useState();
    const [preview, setPreview] = useState();
    const [loadPage, setLoadPage] = useState(false);
    const [formDisable, setFormDisable] = useState(false);
    const { onCloseForm } = props;
    const queryClient = useQueryClient();
    const {
        rsvLocationFetch,
        rsvRepairGrpFetch,
        rsvRepairFetch,
        rsvRepairSet,
        rsvRepairFileFetch,
        rsvLocationGrpFetch,
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
            formType: "RSV",
            formDtl: "User Reservation",
            formAction: "I",
            status: "N",
            repairCd: "",
            repairLoc: "",
            repairLocGrp: "",
            repairGrp: "",
            repairType: "",
            repairFile: "",
        },
    });
    const {
        data: dataRepairGrp = [],
        isFetching: isFetchRepairGrp,
        refetch: refetchRepairGrp,
    } = useQuery({
        queryKey: ["dataRepairGrp"],
        queryFn: rsvRepairGrpFetch,
        enabled: false,
    });

    const {
        data: dataLocationGrp = [],
        isFetching: isFetchLocationGrp,
        refetch: refetchdataLocationGrp,
    } = useQuery({
        queryKey: ["dataLocationGrp"],
        queryFn: rsvLocationGrpFetch,
        enabled: false,
    });
    const {
        data: dataLocation = [],
        isFetching: isFetchLocation,
        refetch: refetchdataLocation,
    } = useQuery({
        queryKey: ["dataLocation"],
        queryFn: rsvLocationFetch,
        enabled: false,
    });
    const {
        data: dataRepairType = [],
        isFetching: isFetchRepair,
        refetch: refetchRepair,
    } = useQuery({
        queryKey: ["dataRepairType"],
        queryFn: rsvRepairFetch,
        enabled: true,
    });
    const {
        data: dataRepairFile = [],
        isFetching: isFetchRepairFile,
        refetch: refetchRepairFile,
    } = useQuery({
        queryKey: ["dataRepairFile"],
        queryFn: rsvRepairFileFetch,
        enabled: false,
    });

    const rsvUserSetMutaion = useMutation({
        mutationFn: rsvRepairSet,
        onSuccess: async (result, variables, context) => {
            console.log(result, variables, context);
            if (result.data.status == 200) {
                reset();
                onDeletePreview();
                toast.success(result.data.message);
                await queryClient
                    .refetchQueries({
                        queryKey: ["rsvData"],
                        refetchType: "all",
                    })
                    .then((res) => console.log(res));
                onCloseForm();
            } else {
                toast.error(result.data.message);
            }
        },
        onError: (res) => {
            toast.error(res.message + " " + res.messageDtl);
        },
    });
    const onSubmit = () => {
        setValue("formType", "RSV");
        setValue("formDtl", "user reservation");
        setValue("status", "N");
        rsvUserSetMutaion.mutate({ ...getValues() });
    };
    const onFormatDate = (date) => {
        return [
            date.getFullYear(),
            ("0" + (date.getMonth() + 1)).slice(-2),
            ("0" + date.getDate()).slice(-2),
        ].join("-");
    };
    const onChangeDate = (res) => {
        const date = onFormatDate(res);
        setSelectRepairDt(date);
        setValue("repairDt", res);
    };
    const onChangeRepairGrp = (res) => {
        setSelectRepairGrp(res);
        setSelectRepair(null);
        const data = dataRepairType.filter(
            (item) => item.group_id == res.value
        );
        setDataRepair(data);
        setValue("repairGrp", res.value);
    };
    const onChangeRepairType = (res) => {
        setSelectRepair(res);
        setValue("repairType", res.value);
    };
    const onChangeRepairLocGrp = (res) => {
        setSelectRepairLocGrp(res);
        setSelectRepairLoc(null);
        setDataRepairGroup(null);
        const data = dataLocation.filter((item) => item.group_id == res.value);
        const repairGrp = dataRepairGrp.filter((item) => item.type == res.type);
        setDataRepairLoc(data);
        setDataRepairGroup(repairGrp);
        setValue("repairLocGrp", res.value);
    };
    const onChangeRepairLoc = (res) => {
        setSelectRepairLoc(res);
        setValue("repairLoc", res.value);
    };
    const onChangeRepairFile = (res) => {
        URL.revokeObjectURL(preview);
        const file = res.target.files[0];
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setValue("repairFile", file);
    };
    const onDeletePreview = () => {
        URL.revokeObjectURL(preview);
        setPreview();
        reset({ ...getValues(), repairFile: null });
        document.getElementById("repairFile").value = "";
    };
    const onFormData = (item, value) => {
        const data = [...item];
        const a = data.filter((res) => res.value == value);
        return a;
    };
    const onInitImg = async (res) => {
        const img = await rsvRepairFileFetch({ ...res, form_id: "RSV" });
        setPreview(img.data.data);
    };
    const initForm = (data1, data2, data3, data4) => {
        if (formData) {
            setValue("repairCd", formData.rsv_cd);
            setValue("formAction", formData.formStatus);
            setValue("repairLoc", formData.loc_id);
            setValue("repairLocGrp", formData.loc_grp_id);
            setValue("repairGrp", formData.repair_grp_id);
            setValue("repairType", formData.repair_id);
            setValue("remark", formData.remark);
            setFormStatus(formData.formStatus);
            setSelectRepairLocGrp(onFormData(data4, formData.loc_grp_id));
            setSelectRepairLoc(onFormData(data1, formData.loc_id));
            setSelectRepairGrp(onFormData(data2, formData.repair_grp_id));
            setSelectRepair(onFormData(data3, formData.repair_id));
            setSelectRepairDt(onFormatDate(new Date(formData.tl_date)));
            setFormDisable(!["I", "U"].includes(formData.formStatus));
            onInitImg(formData);
        } else {
            setSelectRepairDt(onFormatDate(new Date()));
        }
    };
    useEffect(() => {
        setLoadPage(true);
        Promise.all([
            refetchRepairGrp(),
            refetchdataLocation(),
            refetchRepair(),
            refetchdataLocationGrp(),
        ])
            .then((values) => {
                initForm(
                    values[1].data,
                    values[0].data,
                    values[2].data,
                    values[3].data
                );
            })
            .then(() => setLoadPage(false));
    }, [formData]);
    const customStyles = {
        valueContainer: (provided, state) => ({
            ...provided,
            height: "auto",
        }),
        indicatorSeparator: (state) => ({
            display: "none",
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: "auto",
            overflow: "auto",
            textOverflow: "",
            whiteSpace: "pre-wrap",
        }),
        singleValue: (provided) => ({
            ...provided,
            whiteSpace: "pre-wrap",
        }),
    };
    useEffect(() => {
        console.log(rsvUserSetMutaion.status);
    }, [rsvUserSetMutaion]);
    return (
        <div className="m-auto w-full flex flex-row">
            {loadPage ? (
                <UseSkeleton />
            ) : (
                <form
                    className="flex flex-row w-full gap-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col mx-5 w-full gap-3 focus:ring-0">
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-col gap-0 w-full">
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="repairDt"
                                        value="Repair Date"
                                    />
                                </div>
                                <Datepicker
                                    value={selectRepairDt}
                                    onSelectedDateChanged={(res) =>
                                        onChangeDate(res)
                                    }
                                    disabled={formDisable}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-1">
                            <div className="flex flex-col gap-0 w-1/2">
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="repairLocGrp"
                                        value="Location Group"
                                    />
                                </div>
                                <Select
                                    isClearable={true}
                                    isSearchable={true}
                                    options={dataLocationGrp}
                                    value={selectRepairLocGrp}
                                    name="repairLocGrp"
                                    required
                                    isDisabled={formDisable}
                                    onChange={(res) =>
                                        onChangeRepairLocGrp(res)
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-0 w-1/2">
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="repairLoc"
                                        value="Location"
                                    />
                                </div>
                                <Select
                                    isClearable={true}
                                    isSearchable={true}
                                    options={dataRepairLoc}
                                    value={selectRepairLoc}
                                    name="repairLoc"
                                    required
                                    isDisabled={formDisable}
                                    onChange={(res) => onChangeRepairLoc(res)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-col gap-0 w-2/5">
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="RepairGrp"
                                        value="Repair Group"
                                    />
                                </div>
                                <Select
                                    isClearable={true}
                                    isSearchable={true}
                                    options={dataRepairGroup}
                                    classNamePrefix="select"
                                    name="RepairGrp"
                                    id="RepairGrp"
                                    value={selectRepairGrp}
                                    required
                                    isDisabled={formDisable}
                                    onChange={(res) => onChangeRepairGrp(res)}
                                />
                            </div>
                            <div className="flex flex-col gap-0 w-3/5 h-max">
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="repairType"
                                        value="Repair Type"
                                    />
                                </div>
                                <Select
                                    className="min-h-max"
                                    styles={customStyles}
                                    isSearchable={true}
                                    options={dataRepair}
                                    value={selectRepair}
                                    classNamePrefix="select"
                                    name="repairType"
                                    id="repairType"
                                    required
                                    isDisabled={formDisable}
                                    onChange={(res) => onChangeRepairType(res)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:gap-6">
                            <div className="">
                                <div className="mb-2 block">
                                    <Label htmlFor="remark" value="Remark" />
                                </div>
                                <Textarea
                                    id="remark"
                                    rows={4}
                                    {...register("remark")}
                                    disabled={formDisable}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:gap-6">
                            <div className="">
                                <div className="mb-2 block">
                                    <Label htmlFor="repairFile" value="Image" />
                                </div>
                                <div className="flex flex-row gap-2">
                                    {formData ? null : (
                                        <FileInput
                                            accept="image/*"
                                            id="repairFile"
                                            onChange={(res) =>
                                                onChangeRepairFile(res)
                                            }
                                            className="flex-1"
                                            disabled={formData ? true : false}
                                        />
                                    )}
                                    {preview && !formData ? (
                                        <HiOutlineXCircle
                                            onClick={onDeletePreview}
                                            className="text-3xl text-center align-middle cursor-pointer m-auto hover:text-red-600"
                                        />
                                    ) : null}
                                </div>

                                {preview ? (
                                    <img
                                        src={preview}
                                        className="w-full p-3 m-auto object-cover"
                                    />
                                ) : null}
                            </div>
                        </div>
                        {formStatus == "V" ? null : (
                            <div className="flex flex-col md:gap-6 sticky bottom-0">
                                {rsvUserSetMutaion.isPending ? (
                                    <Button>
                                        <Spinner
                                            aria-label="Spinner button example"
                                            size="sm"
                                            light
                                        />
                                        <span className="pl-3">Loading...</span>
                                    </Button>
                                ) : (
                                    <Button type="submit">Save </Button>
                                )}
                            </div>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default UserReservationForm;
