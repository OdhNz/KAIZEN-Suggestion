import axios from "axios";
import dayjs from "dayjs";

 const kaizenFormStore = (set, get) => ({
       kaizenFormSet: async(data) => {
            const formData = new FormData();
                  formData.append("_method", "post");
                  for (let key in data) {
                        formData.append(key, data[key]);
                  }
                  
            const response = await  get().fetchDataAxios(axios.post("/api/setKaizenForm", formData, { headers: { "Content-Type": "multipart/form-data"}}));
            return response;
                  },
      kaizenGetEmpno: async (res) => {
            const param = {empno : res.toUpperCase()}
            const response = await  get().fetchDataAxios(axios.get("/api/getEmpno", {params : {...param }}));
            return response;
       },
       fetchCategoryForm: async (res) => {
            const param = {id : res}
            const response = await  get().fetchDataAxios(axios.get("/api/fetchCategoryForm", {params : {...param }}));
            return response.data;
       },
   });

   export default kaizenFormStore

