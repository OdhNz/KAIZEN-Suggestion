import axios from "axios";
  
 const masterPicStore = (set, get) => ({
       fetchPic: async (res) => {
         const { data } = await axios.get("api/fetchUserPic", {params : {
            company: get().user.company
        }});
             return data;
       },
        fetchEmp: async (res) => {
         const { data } = await axios.get("api/fetchUserEmp", {params : {
            company: get().user.company
        }});
             return data;
       },
       addPic: async (res) => {
        return axios({ method: 'post', url: "api/setUserPic", data:  {...res.data} });
       },
       delPic: async (res) => {
        return axios({ method: 'post', url: "api/deleteUserPic", data:  {...res.data} });
       },
   });

   export default masterPicStore

