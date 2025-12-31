import axios from "axios";
  
 const materLocationStore = (set, get) => ({
       fetchMasterLocation: async (res) => {
         const { data } = await axios.get("api/masterLocationFetch", {params : {
            company: get().user.company
        }});
             return data;
       },
       fetchMasterLocationGrp: async (res) => {
         const { data } = await axios.get("api/masterLocationGrpFetch", {params : {
            company: get().user.company
        }});
        console.log(data)
             return data;
       },
       setMasterLocation: async (data) => {
        const formData = new FormData();
        formData.append("_method", "post");
        formData.append("company", get().user.company);
        formData.append("login_id", get().user.empid);
        // formData.append("file", data.docFile[0]);
        for (let key in data) {
            console.log(key, data[key])
            formData.append(key, data[key]);
        }
        const response = await axios
            .post("api/masterLocationInsert", formData, { headers: { "Content-Type": "multipart/form-data", }});
            return response;
         
       },
       delMasterLocation: async (data) => {
        const res = await axios({ method: 'post', url: "api/masterLocationDelete", data:  {...data.data} });
        console.log(res)
        return res
       },
   });

   export default materLocationStore

