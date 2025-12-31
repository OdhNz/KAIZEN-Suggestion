import axios from "axios";
import dayjs from "dayjs";

 const kaizenMasterCategory = (set, get) => ({
       fetchCategory: async(data) => {
            const param = {company : "TT"}
            const response = await  get().fetchDataAxios(axios.get("/api/fetchCategory", {params : {...param }}));
            return response.data;
           },
      setCategoryData: async(data) => {
            const formData = new FormData();
                  formData.append("_method", "post");
                  formData.append("company", get().user?.company);
                  formData.append("loginId", get().user?.empid);
                  for (let key in data) {
                        formData.append(key, data[key] ? data[key] : "");
                  }
                  
            const response = await  get().fetchDataAxios(axios.post("/api/setCategoryData", formData, { headers: { "Content-Type": "multipart/form-data"}}));
            return response;
            },
   });

   export default kaizenMasterCategory

