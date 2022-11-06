import axios from "axios";

const instance = axios.create({
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
            "https://answersheet-au-frontend-nextjs.vercel.app",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    baseURL: "https://answersheet-au-strapi-backend.herokuapp.com",
});
export const linstance = axios.create({
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
            "https://answersheet-au-frontend-nextjs.vercel.app",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    baseURL: process.env.NEXT_PUBLIC_URL,
});

export default instance;
