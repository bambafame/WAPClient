import axios from "axios";

const api = axios.create({
  baseURL: "https://product-review-server-cw39.onrender.com",
});

export default api;
