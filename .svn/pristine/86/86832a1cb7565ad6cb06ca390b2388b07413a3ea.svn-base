import axios from "axios";
import dayjs from "dayjs";

 const kaizenListStore = (set, get) => ({
       fetchKaizenData: async(data) => {
            const param = {status : data.status, bgnDt : data.bgnDt, endDt: data.endDt}
            const response = await  get().fetchDataAxios(axios.get(`/api/fetchKaizenListData`, {params : {...param }}));
            return response.data;
           },
      kaizenSetStatus: async(data) => {
            const formData = new FormData();
                  formData.append("loginId", get().user?.empid);
                  formData.append("_method", "post");
                  for (let key in data) {
                        formData.append(key, data[key]);
                  }
                  
            const response = await  get().fetchDataAxios(axios.post("/api/kaizenSetStatus", formData, { headers: { "Content-Type": "multipart/form-data"}}));
            return response;
            },
   });

   export default kaizenListStore

