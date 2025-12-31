import axios from "axios";
  
 const adminReservationState = (set, get) => ({
       rsvAdminFetch: async (res) => {
       const bgn = res.queryKey?.[1].bgn;
       const end = res.queryKey?.[1].end;
         const { data } = await axios.get("api/rsvAdminFetch", {params : {
            company: get().user.company,
            login_id: get().user.empid,
            bgn: bgn,
            end: end
            
        }});
             return data; 
       },
       rsvAdminPicFetch: async (res) => {

        const link = "api/rsvAdminPicFetch";
        const params = {
            params : {
                        company: get().user.company,
                        login_id: get().user.empid
                    }
                }
        const data = await get().localData("picdata", link, params)
        return data
       },
        rsvAdminRsvDetailFetch: async (res) => {
         const { data } = await axios.get("api/rsvAdminRsvDetailFetch", {params : {
            company: get().user.company,
            login_id: get().user.empid,
            repair_cd: res.rsv_cd
        }});
             return data; 
       },
       rsvAdminAprSet: async (data) => {
        const formData = new FormData();
        formData.append("_method", "post");
        formData.append("company", get().user.company);
        formData.append("login_id", get().user.empid);
        formData.append("pics", JSON.stringify(data.pic));
        formData.append( "bgnDate", data.bgnDt == undefined
                ? new Date().toLocaleDateString("id-ID")
                : data.bgnDt.toLocaleDateString("id-ID")
        );
        formData.append( "endDate", data.endDt == undefined
                ? new Date().toLocaleDateString("id-ID")
                : data.endDt.toLocaleDateString("id-ID")
        );
        for (let key in data) {
            formData.append(key, data[key]);
        }
        const response = await axios
            .post("api/rsvAdminAprSet", formData, { headers: { "Content-Type": "multipart/form-data", }});
            return response;
         
       },
       rsvAdminCompleteSet: async (data) => {
        const formData = new FormData();
        formData.append("_method", "post");
        formData.append("company", get().user.company);
        formData.append("login_id", get().user.empid);
        data.repairFile &&  formData.append("file", data.repairFile);
        for (let key in data) {
            formData.append(key, data[key]);
        }
        const response = await axios
            .post("api/rsvAdminCompleteSet", formData, { headers: { "Content-Type": "multipart/form-data", }});
            return response;
         
       },
       rsvAdminRejectSet: async (data) => {
        const formData = new FormData();
        formData.append("_method", "post");
        formData.append("company", get().user.company);
        formData.append("login_id", get().user.empid);
        for (let key in data) {
            formData.append(key, data[key]);
        }
        const response = await axios
            .post("api/rsvAdminRejectSet", formData, { headers: { "Content-Type": "multipart/form-data", }});
            return response;
         
       },
   });

   export default adminReservationState

