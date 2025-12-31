import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { Button, Label, Spinner, Textarea } from "flowbite-react";
import { useForm, Controller, get } from "react-hook-form";
import useStore from "../../../State/useStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const AdminReservationRejectForm = (props) => {
    const { formData } = props;
    const [formStatus, setFormStatus] = useState("I");
    const [formDisable, setFormDisable] = useState(false);
    const { onCloseForm } = props;
    const { rsvAdminRejectSet } = useStore();
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
            formDtl: "admin detail reservation",
            formAction: "I",
            status: "R",
            remark: "",
        },
    });

    const rsvAdminAprMutation = useMutation({
        mutationFn: rsvAdminRejectSet,
        onSuccess: (result, variables, context) => {
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
    const initForm = async () => {
        const { data } = await refetchRsvDetail();
        setValue("remark", data.detail[0].remark_dtl);
        onInitImg(formData);
        setFormDisable(!["I", "U"].includes(formData.formStatus));
    };
    useEffect(() => {
        setValue("repairCd", formData.rsv_cd);
        setValue("formAction", formData.formStatus);
        setFormStatus(formData.formStatus);
        if (formData.status != "N") {
            initForm();
        }
    }, [formData]);
    return (
        <div className="m-auto w-full flex flex-row">
            <form
                className="flex flex-row w-full gap-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col mx-5 w-full gap-3 focus:ring-0">
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
        </div>
    );
};

export default AdminReservationRejectForm;
