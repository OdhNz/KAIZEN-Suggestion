import { usePage } from "@inertiajs/react";
import React, { useState, useMemo, useEffect } from "react";
import {
    Button,
    Label,
    Textarea,
    FileInput,
    Rating,
    RatingStar,
    Spinner,
} from "flowbite-react";
import { useForm, Controller, get } from "react-hook-form";
import useStore from "../../../State/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { TabItem, Tabs } from "flowbite-react";
import { HiOutlineXCircle } from "react-icons/hi";
import UseSkeleton from "../../Components/UseSkeleton";

const UserReservationFormReview = (props) => {
    const { formData } = props;
    const queryClient = useQueryClient();
    const [starCnt, setStarCnt] = useState([1, 2, 3, 4, 5]);
    const [scoreReview, setScoreReview] = useState(0);
    const [preview, setPreview] = useState();
    const [formDisable, setFormDisable] = useState(false);
    const [loadPage, setLoadPage] = useState(false);
    const { onCloseForm } = props;
    const {
        rsvRepairReviewSet,
        rsvRepairFileFetch,
        rsvReviewFetch,
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
            formType: "RVW",
            formDtl: "form review",
            formAction: "I",
            score: "",
            repairLocGrp: "",
            repairGrp: "",
            repairType: "",
            repairFile: "",
        },
    });

    const rsvUserSetMutaion = useMutation({
        mutationFn: rsvRepairReviewSet,
        onSuccess: (result, variables, context) => {
            console.log(result, variables, context);
            if (result.data.status == 200) {
                reset();
                onDeletePreview();
                toast.success(result.data.message);
                queryClient.refetchQueries({ queryKey: ["rsvData"] });
                onCloseForm();
            } else {
                toast.error(result.data.message);
            }
        },
        onError: (res) => {
            console.log(res);
            toast.error(res.message + " " + res.messageDtl);
        },
    });
    const onSubmit = () => {
        setValue("formType", "RVW");
        setValue("formDtl", "user review");
        setValue("score", scoreReview);
        rsvUserSetMutaion.mutate({ ...getValues() });
    };

    const onChangeReviewFile = (res) => {
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
    const onScore = (res) => {
        if (formDisable) {
            return true;
        }
        setScoreReview(res);
    };
    const onInitImg = async () => {
        const img = await rsvRepairFileFetch({ ...formData, form_id: "RVW" });
        setPreview(img.data.data);
    };
    const initForm = async (res) => {
        const data = await rsvReviewFetch(res);
        console.log(data);
        setValue("remark", data[0]?.remark);
        setScoreReview(data[0]?.score);
        onInitImg();
        setFormDisable(!["I", "U"].includes(res.formStatus));
    };
    useEffect(() => {
        setValue("repairCd", formData.rsv_cd);
        const init = new Promise((resolve, reject) => {
            initForm(formData);
            resolve();
        });
        if (formData.status !== "S") {
            setLoadPage(true);
            initForm(formData).then(() => setLoadPage(false));
        }
    }, [formData]);
    return (
        <div className="m-auto w-full flex flex-row">
            {loadPage ? (
                <UseSkeleton />
            ) : (
                <form
                    className="flex flex-col w-full gap-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col">
                        <div className="w-1/2">
                            {/* <h2 className="font-semibold text-lg mb-4">
                            {" "}
                            Form Reservation
                        </h2> */}

                            {/* <UserReservationForm formData={dataRepair} /> */}
                        </div>
                        <div className="w-1/2"></div>
                    </div>
                    <div className="flex flex-col px-5 w-full gap-3 focus:ring-0">
                        <div className="mb-2 block">
                            <Label htmlFor="score" value="Score" />
                        </div>
                        <div className="flex flex-row gap-2">
                            <Rating size="lg">
                                {starCnt.map((res, index) => {
                                    return (
                                        <RatingStar
                                            key={"str" + index}
                                            className="cursor-pointer"
                                            onClick={() => onScore(index + 1)}
                                            filled={
                                                index + 1 <= scoreReview
                                                    ? true
                                                    : false
                                            }
                                        />
                                    );
                                })}
                            </Rating>
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
                                    <Label htmlFor="reviewFile" value="Image" />
                                </div>
                                <div className="flex flex-row gap-2">
                                    {formDisable ? null : (
                                        <FileInput
                                            accept="image/*"
                                            id="repairFile"
                                            onChange={(res) =>
                                                onChangeReviewFile(res)
                                            }
                                            className="flex-1"
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
                                        className="h-48 w-full p-3 m-auto object-cover"
                                    />
                                ) : null}
                            </div>
                            {formData.formStatus == "V" ? null : (
                                <div className="flex flex-col md:gap-6 sticky bottom-0">
                                    {rsvUserSetMutaion.isPending ? (
                                        <Button>
                                            <Spinner
                                                aria-label="Spinner button example"
                                                size="sm"
                                                light
                                            />
                                            <span className="pl-3">
                                                Loading...
                                            </span>
                                        </Button>
                                    ) : (
                                        <Button type="submit">Save</Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UserReservationFormReview;
