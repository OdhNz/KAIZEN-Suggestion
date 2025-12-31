import axios from "axios";
  
 const materRepairmentStore = (set, get) => ({
       fetchMasterRprm: async (res) => {
         const { data } = await axios.get("api/fetchMasterRprm", {params : {
            company: get().user.company
        }});
             return data;
       },
       masterRprmLocationFetch: async (res) => {
         const { data } = await axios.get("api/masterRprmLocationFetch", {params : {
            company: get().user.company
        }});
             return data;
       },
       fetchMasterRprmGrp: async (res) => {
         const { data } = await axios.get("api/fetchMasterRprmGrp", {params : {
            company: get().user.company,
            masterId : res.masterId
        }});
        console.log(res)
             return data;
       },
       masterRprmGrpInsert: async (data) => {
        const formData = new FormData();
        formData.append("_method", "post");
        formData.append("company", get().user.company);
        formData.append("login_id", get().user.empid);
        // formData.append("file", data.docFile[0]);
        for (let key in data) {
            formData.append(key, data[key]);
        }
        const response = await axios
            .post("api/masterRprmGrpInsert", formData, { headers: { "Content-Type": "multipart/form-data", }});
            return response;
         
       },
       setMasterRprm: async (data) => {
        const formData = new FormData();
        formData.append("_method", "post");
        formData.append("company", get().user.company);
        formData.append("login_id", get().user.empid);
        // formData.append("file", data.docFile[0]);
        for (let key in data) {
            formData.append(key, data[key]);
        }
        const response = await axios
            .post("api/setMasterRprm", formData, { headers: { "Content-Type": "multipart/form-data", }});
            return response;
         
       },
       delMasterRprm: async (data) => {
        const res = await axios({ method: 'post', url: "api/deleteMasterRprm", data:  {...data.data} });
        return res
       },
   });

   export default materRepairmentStore

