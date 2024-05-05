import axios from "axios";

export const baseURL = "https://se-mpl-b-production.up.railway.app/";

interface requestProps {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  data?: any;
  headers?: any;
}

export const request = ({ method, url, data, headers }: requestProps) => {
  return axios({
    method,
    url: baseURL + url + "/",
    data,
    headers,
  });
};
