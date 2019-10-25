import axios from "axios";

export default baseURL => {
 return axios.create({
   baseURL: baseURL,
   timeout: 0
 });
};
