import axios from "axios";
  
 const calendarEvent = (set, get) => ({
       rsvEvent: async (res) => {
         const bgn = res.queryKey?.[1].bgn;
         const end = res.queryKey?.[1].end;
         const { data } = await axios.get("api/rsvEvent", {params : {
            company: get().user.company,
            bgn: bgn,
            end: end
        }});
             return data;
       },
        rsvById: async (res) => {
            console.log(res.rsv_cd)
         const { data } = await axios.get("api/rsvById", {params : {
            company: get().user.company,
            rsv_cd : res.rsv_cd
        }});
             return data;
       },
   });

   export default calendarEvent

