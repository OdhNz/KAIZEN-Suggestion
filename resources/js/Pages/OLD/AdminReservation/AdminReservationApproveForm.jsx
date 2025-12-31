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
import UseSkeleton from "../../Components/UseSkeleton";

const AdminReservationApproveForm = (props) => {
    const { formData } = props;
    const [formStatus, setFormStatus] = useState("I");
    const [selectPics, setSelectPics] = useState([]);
    const [selectBgnDt, setSelectBgnDt] = useState();
    const [selectEndDt, setSelectEndDt] = useState();
    const [loadPage, setLoadPage] = useState(false);
    const [formDisable, setFormDisable] = useState(false);
    const { onCloseForm } = props;
    const {
        rsvAdminAprSet,
        rsvAdminRsvDetailFetch,
        rsvAdminPicFetch,
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
            formType: "DTL",
            formDtl: "form detail",
            formAction: "I",
            status: "P",
            pic: "",
            bgnDt: undefined,
            endDt: undefined,
            remark: "",
        },
    });

    const {
        data: dataPics = [],
        isFetching: isFetchPic,
        refetch: refetchPic,
    } = useQuery({
        queryKey: ["dataPic"],
        queryFn: rsvAdminPicFetch,
        enabled: false,
    });

    const rsvAdminAprMutation = useMutation({
        mutationFn: rsvAdminAprSet,
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
        setValue("formType", "PRG");
        setValue("formDtl", "reservation progress");
        setValue("status", "P");
        rsvAdminAprMutation.mutate({ ...getValues() });
    };
    const onFormatDate = (date) => {
        return [
            date.getFullYear(),
            ("0" + (date.getMonth() + 1)).slice(-2),
            ("0" + date.getDate()).slice(-2),
        ].join("-");
    };
    const onChangeDate = (dateNm, setDate, res) => {
        const date = onFormatDate(res);
        setDate(date);
        setValue(dateNm, res);
    };
    const onChangePICs = (res) => {
        setSelectPics([...res]);
        setValue("pic", [...res]);
    };
    const onFormData = (item, value) => {
        const data = [...item];
        const a = [
            ...data.filter((res) => {
                if (value.some((val) => res.value == val.empid)) return res;
            }),
        ];
        return a;
    };
    const initForm = async () => {
        const { data: pic } = await refetchPic();
        const data = await rsvAdminRsvDetailFetch(formData);
        console.log(data);
        setValue("remark", data.detail[0].remark_dtl);
        setSelectBgnDt(onFormatDate(new Date(data.detail[0].bgn_dt)));
        setSelectEndDt(onFormatDate(new Date(data.detail[0].end_dt)));
        setSelectPics(onFormData(pic, data.pic));
        setFormDisable(!["I", "U"].includes(formData.formStatus));
    };
    useEffect(() => {
        setValue("repairCd", formData.rsv_cd);
        setValue("formAction", formData.formStatus);
        setFormStatus(formData.formStatus);
        setSelectBgnDt(onFormatDate(new Date()));
        setSelectEndDt(onFormatDate(new Date()));
        if (formData.status !== "N") {
            setLoadPage(true);
            initForm().then(() => setLoadPage(false));
        } else if (dataPics) {
            refetchPic();
        }
    }, [formData]);
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
                            <div className="flex flex-col gap-0 w-1/2">
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="startDt"
                                        value="Start Date"
                                    />
                                </div>
                                <Datepicker
                                    value={selectBgnDt}
                                    onSelectedDateChanged={(res) =>
                                        onChangeDate(
                                            "bgnDt",
                                            setSelectBgnDt,
                                            res
                                        )
                                    }
                                    disabled={formDisable}
                                />
                            </div>
                            <div className="flex flex-col gap-0 w-1/2">
                                <div className="mb-2 block">
                                    <Label htmlFor="endDt" value="End Date" />
                                </div>
                                <Datepicker
                                    value={selectEndDt}
                                    onSelectedDateChanged={(res) =>
                                        onChangeDate(
                                            "endDt",
                                            setSelectEndDt,
                                            res
                                        )
                                    }
                                    disabled={formDisable}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-col gap-0 w-full">
                                <div className="mb-2 block">
                                    <Label htmlFor="rsvPic" value="PIC" />
                                </div>
                                <Select
                                    isClearable={true}
                                    isSearchable={true}
                                    options={dataPics}
                                    classNamePrefix="select"
                                    name="rsvPic"
                                    id="rsvPic"
                                    value={selectPics}
                                    required
                                    isMulti
                                    isDisabled={formDisable}
                                    onChange={(res) => onChangePICs(res)}
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

export default AdminReservationApproveForm;
