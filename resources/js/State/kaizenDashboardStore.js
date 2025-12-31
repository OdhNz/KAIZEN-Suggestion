import axios from "axios";
import dayjs from "dayjs";

 const kaizenDashboardStore = (set, get) => ({
       fetchDashboardKaizen: async(data) => {
            const param = {tl_date : data.tlDate}
            const response = await get().fetchDataAxios(axios.get(`/api/fetchDashboardKaizen`, {params : {...param }}));
            return response.data;
           },
   });

   export default kaizenDashboardStore

