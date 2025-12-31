import axios from "axios";
  
 const listRsvDomStore = (set, get) => ({
       rsvListRsvDomFetch: async (res) => {
         const bgn = res.queryKey?.[1].bgn;
         const end = res.queryKey?.[1].end;
         const { data } = await axios.get("api/rsvListRsvDomFetch", {params : {
            company: get().user.company,
            login_id: get().user.empid,
            repair_type: 'DOM',
            bgn: bgn,
            end: end
        }});
             return data;
       },
   });

   export default listRsvDomStore

