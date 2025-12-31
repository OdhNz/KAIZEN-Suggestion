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

const optionData = [
    { value: "S", label: "Success" },
    { value: "F", label: "Fail" },
];
const AdminReservationCompleteForm = (props) => {
    const { formData } = props;
    const [dataRepair, setDataRepair] = useState([]);
    const [formStatus, setFormStatus] = useState("I");
    const [selectProgStatus, setSelectProgStatus] = useState(optionData[0]);
    const [selectRepair, setSelectRepair] = useState();
    const [selectBgnDt, setSelectBgnDt] = useState();
    const [selectEndDt, setSelectEndDt] = useState();
    const [loadPage, setLoadPage] = useState(false);
    const [preview, setPreview] = useState();
    const [formDisable, setFormDisable] = useState(false);
    const { onCloseForm } = props;
    const {
        rsvLocationFetch,
        rsvRepairGrpFetch,
        rsvRepairFetch,
        rsvAdminCompleteSet,
        rsvAdminAprSet,
        rsvRepairFileFetch,
        rsvAdminRsvDetailFetch,
        rsvAdminPicFetch,
    } = useStore();
    const {
        control,
        register,
        reset,
        resetField,
        getValues,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            formType: "DTL",
            formDtl: "admin detail reservation",
            formAction: "I",
            status: "R",
            pic: "",
            bgnDt: undefined,
            endDt: undefined,
            remark: "",
        },
    });

    const {
        data: dataRsvDetail = [],
        isFetching: isFetchRsvDetail,
        refetch: refetchRsvDetail,
    } = useQuery({
        queryKey: ["dataDetail", formData],
        queryFn: rsvAdminRsvDetailFetch,
        enabled: false,
    });
    const rsvAdminAprMutation = useMutation({
        mutationFn: rsvAdminCompleteSet,
        onSuccess: (result, variables, context) => {
            console.log(result, variables, context);
            if (result.data.status == 200) {
                reset();
                toast.success(result.data.message);
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
        setValue("formType", "DTL");
        setValue("formDtl", "admin detail form");
        setValue("status", "R");
        rsvAdminAprMutation.mutate({ ...getValues() });
    };

    const onChangeProgStatus = (res) => {
        setSelectProgStatus(res);
        setValue("progStatus", res.value);
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
    const onInitImg = async (res) => {
        const img = await rsvRepairFileFetch({ ...res, form_id: "DTL" });
        setPreview(img.data.data);
    };
    const initForm = async () => {
        const data = await rsvAdminRsvDetailFetch(formData);
        setValue("remark", data.detail[0].remark_dtl);
        onInitImg(formData);
        setFormDisable(!["I", "U"].includes(formData.formStatus));
    };
    useEffect(() => {
        setValue("repairCd", formData.rsv_cd);
        setValue("formAction", formData.formStatus);
        setFormStatus(formData.formStatus);
        if (formData.status != "P") {
            setLoadPage(true);
            initForm().then(() => setLoadPage(false));
        }
    }, [formData]);
    useEffect(() => {}, [formData]);
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
                                        htmlFor="progStatus"
                                        value="Progress Status"
                                    />
                                </div>
                                <Select
                                    isClearable={true}
                                    isSearchable={false}
                                    options={optionData}
                                    classNamePrefix="select"
                                    name="progStatus"
                                    id="progStatus"
                                    value={selectProgStatus}
                                    required
                                    isDisabled={formDisable}
                                    onChange={(res) => onChangeProgStatus(res)}
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
                                    {formDisable ? null : (
                                        <FileInput
                                            accept="image/*"
                                            id="repairFile"
                                            onChange={(res) =>
                                                onChangeRepairFile(res)
                                            }
                                            className="flex-1"
                                            disabled={formDisable}
                                        />
                                    )}
                                    {preview && !formDisable ? (
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
                                {rsvAdminAprMutation.isPending ? (
                                    <Button>
                                        <Spinner
                                            aria-label="Spinner button example"
                                            size="sm"
                                            light
                                        />
                                        <span className="pl-3">Loading...</span>
                                    </Button>
                                ) : (
                                    <Button type="submit">Save</Button>
                                )}
                            </div>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default AdminReservationCompleteForm;
