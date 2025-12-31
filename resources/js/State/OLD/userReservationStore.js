import axios from "axios";
  
 const userReservationState = (set, get) => ({
       rsvUserFetch: async (res) => {
         const { data } = await axios.get("api/rsvUserFetch", {params : {
            company: get().user.company,
            login_id: get().user.empid
        }});
             return data;
       },
       rsvRepairFileFetch: async (res) => {
         const data = await axios.get("api/rsvRepairFileFetch", {params : {
            company: get().user.company,
            file_cd: res.rsv_cd,
            form_id : res.form_id
        }});
             return data;
       },
       rsvReviewFetch: async (res) => {
         const { data } = await axios.get("api/rsvReviewFetch", {params : {
            company: get().user.company,
            login_id: get().user.empid,
            repairCd: res.rsv_cd
        }});
             return data; 
       },
       rsvLocationGrpFetch: async (res) => {
        const link = "api/rsvLocationGrpFetch";
        const params = {
                    params : {
                                company: get().user.company
                            }
                        }
            const data = await get().localData("locationGrp", link, params)
            return data
       },
       rsvLocationFetch: async (res) => {
        const link = "api/rsvLocationFetch";
        const params = {
                    params : {
                                company: get().user.company
                            }
                        }
            const data = await get().localData("location", link, params)
            return data
       },
       rsvRepairGrpFetch: async (res) => {
        const link = "api/rsvRepairGrpFetch";
        const params = {
            params : {
                        company: get().user.company
                    }
                }
        const data = await get().localData("repairgrp", link, params)
        return data
       },
       rsvRepairFetch: async (res) => {
        const link = "api/rsvRepairFetch";
        const params = {
            params : {
                        company: get().user.company
                    }
                }
        const data = await get().localData("repairtype", link, params)
        return data
       },
       rsvRepairSet: async (data) => {
        const formData = new FormData();
        formData.append("_method", "post");
        formData.append("company", get().user.company);
        formData.append("login_id", get().user.empid);
        data.repairFile &&  formData.append("file", data.repairFile);
        formData.append( "tl_date", data.repairDt == undefined
                ? new Date().toLocaleDateString("id-ID")
                : data.repairDt.toLocaleDateString("id-ID")
        );
        for (let key in data) {
            formData.append(key, data[key]);
        }
        const response = await axios
            .post("api/rsvRepairSet", formData, { headers: { "Content-Type": "multipart/form-data", }});
            return response;
         
       },
        rsvRepairReviewSet: async (data) => {
        const formData = new FormData();
        formData.append("_method", "post");
        formData.append("company", get().user.company);
        formData.append("login_id", get().user.empid);
        data.repairFile &&  formData.append("file", data.repairFile);
        formData.append( "tl_date", data.reviewDt == undefined
                ? new Date().toLocaleDateString("id-ID")
                : data.reviewDt.toLocaleDateString("id-ID")
        );
        for (let key in data) {
            formData.append(key, data[key]);
        }
        const response = await axios
            .post("api/rsvRepairReviewSet", formData, { headers: { "Content-Type": "multipart/form-data", }});
            return response;
         
       },
       rsvRepairStatusSet: async (res) => {
        const data = {
            company: get().user.company,
            login_id: get().user.empid,
            file_cd: res.rsv_cd,
            ...res
        }
        const item = await axios({ method: 'post', url: "api/rsvRepairStatusSet", data:  {...data} });
        return item
       },
   });

   export default userReservationState

