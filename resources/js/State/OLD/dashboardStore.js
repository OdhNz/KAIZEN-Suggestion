import axios from "axios";
  
 const dashboardStore = (set, get) => ({
       rsvDsbSumFetch: async (res) => {
        const tl_date = res.tl_date;
         const { data } = await axios.get("api/rsvDsbSumFetch", {params : {
            company: get().user.company,
            login_id: get().user.empid,
            tl_date: tl_date
        }});
             return data;
       },
       rsvDsbReqFetch: async (res) => {
          const tl_date = res.tl_date;
         const { data } = await axios.get("api/rsvDsbReqFetch", {params : {
            company: get().user.company,
            login_id: get().user.empid,
            tl_date: tl_date
        }});
             return data;
       },
       rsvDsbReqBarFetch: async (res) => {
          const tl_date = res.tl_date;
         const { data } = await axios.get("api/rsvDsbReqBarFetch", {params : {
            company: get().user.company,
            login_id: get().user.empid,
            tl_date: tl_date
        }});
             return data;
       },
       rsvDsbStarPieFetch: async (res) => {
          const tl_date = res.tl_date;
         const { data } = await axios.get("api/rsvDsbStarPieFetch", {params : {
            company: get().user.company,
            login_id: get().user.empid,
            tl_date: tl_date
        }});
             return data;
       },
       rsvDsbFetchAll : async(res) => {
         const tl_date = res?.queryKey?.[1]?.tl_date;
         const params = {tl_date : tl_date}
        const data = await Promise.all([get().rsvDsbReqFetch(params), get().rsvDsbSumFetch(params), get().rsvDsbReqBarFetch(params), get().rsvDsbStarPieFetch(params)]).then((values) => {
           return {req : values[0],  sum: values[1], bar: values[2], star: values[3]}
          });
          return data;
       }
   });

   export default dashboardStore

