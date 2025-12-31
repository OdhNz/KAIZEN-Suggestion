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
    Tabs,
    TabItem,
} from "flowbite-react";
import { useForm, Controller } from "react-hook-form";
import useStore from "../../State/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    HiLockClosed,
    HiMap,
    HiOfficeBuilding,
    HiPencil,
    HiUserGroup,
} from "react-icons/hi";
import MasterLocationGroup from "./MasterLocationGroup";
import MasterLocationData from "./MasterLocationData";

const MasterLocation = () => {
    const { masterRprmLocationFetch, fetchMasterRprmGrp } = useStore();
    const {
        reset,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            formType: "RPR",
            formDtl: "Master Repair",
            formAction: "I",
            masterId: "GR1",
            newGrp: false,
        },
    });

    const {
        data: dataRepairGrp = [],
        isFetching: isFetchLocationGrp,
        refetch: refetchdataLocationGrp,
    } = useQuery({
        queryKey: ["dataLocationGrp"],
        queryFn: (res) => fetchMasterRprmGrp(getValues()),
        enabled: true,
    });
    const {
        data: dataMasterLocation = [],
        isFetching: isFetchMasterLocation,
        refetch: refetchMasterLocation,
    } = useQuery({
        queryKey: ["dataMasterLocation"],
        queryFn: masterRprmLocationFetch,
        enabled: true,
    });

    const onSearch = async () => {
        refetchMasterLocation();
    };

    const onChangeTab = (res) => {
        reset();
    };

    const tabItems = useMemo(
        () => [
            {
                title: "Location Group",
                icon: HiMap,
                status: "GR`",
                component: <MasterLocationGroup />,
            },
            {
                title: "Location",
                icon: HiOfficeBuilding,
                status: "GR2",
                component: <MasterLocationData />,
            },
        ],
        []
    );
    return (
        <div className="flex flex-col p-2 w-full bg-transparent ">
            <Card className="w-full h-fit">
                <div className="flex flex-col w-full h-full">
                    <div className="flex flex-row align-bottom">
                        <h2 className="text-3xl font-medium text-zinc-600 ">
                            MASTER DATA LOCATION
                        </h2>
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
            <Card className="w-full h-[730px] mt-4">
                <div className="flex flex-col w-full h-full">
                    <Tabs
                        aria-label="Tabs with underline"
                        variant="underline"
                        className="p-0"
                        onActiveTabChange={(tab) => onChangeTab(tab)}
                    >
                        {tabItems.map((res, i) => {
                            return (
                                <TabItem
                                    active
                                    title={res.title}
                                    icon={res.icon}
                                    key={"tab" + i}
                                    className="p-0"
                                >
                                    {res.component}
                                </TabItem>
                            );
                        })}
                    </Tabs>
                </div>
            </Card>
        </div>
    );
};

export default MasterLocation;
