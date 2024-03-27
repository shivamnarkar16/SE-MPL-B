import axios from "axios";
import { baseURL } from "./lib/Request";
let refresh = false;
axios.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    console.log(error);
    if (
      // error.response.status === 401 ||
      (error.name === "AxiosErrorr" && !refresh)
    ) {
      refresh = true;
      console.log(localStorage.getItem("refresh_token"));
      const response = await axios.post(
        baseURL + "token/refresh/",
        { refresh: localStorage.getItem("refresh_token") },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        axios.defaults.headers.common["Authorization"] = `Bearer 
       ${response.data["access"]}`;
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        return axios(error.config);
      }
    }
    refresh = false;
    return error;
  }
);
