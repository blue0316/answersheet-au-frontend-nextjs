import axios from "axios";

const instance = axios.create({
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    baseURL: "https://answersheet-au-strapi-backend.herokuapp.com",
});
export const linstance = axios.create({
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    baseURL: process.env.NEXT_PUBLIC_URL,
});

export default instance;
