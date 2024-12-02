import axios from "axios";
import useAuthStore from "./store/AuthStore";
import { RUN_API } from "@env";

export const apiClient = axios.create({
  baseURL: "https://k11c207.p.ssafy.io/maon",
  // baseURL: "http://localhost:8765/maon",
});
export const runClient = axios.create({
  baseURL: RUN_API,
  headers: {
    "Content-Type": "application/json",
  },
});
