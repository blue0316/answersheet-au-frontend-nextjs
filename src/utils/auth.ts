import { NextRouter } from "next/router";
import instance from "./api";

type SignInResponse = {
    jwt: string;
    user: {
        id: string;
        username: string;
        email: string;
        provider: "local";
        confirmed: boolean;
        blocked: boolean;
        createdAt: string;
        updatedAt: string;
    };
};

export const signIn = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    const res = await instance.post<SignInResponse>("/api/auth/local", {
        identifier: email,
        password,
    });
    return res.data;
};

export const register = async (
    data: {
        email: string;
        username: string;
        password: string;
    },
    router: NextRouter,
    sendEmail: () => void
) => {
    const res = await instance
        .post<SignInResponse>("/api/auth/local/register", data)
        .then((response) => {
            console.log(response.data);
            sendEmail();
            localStorage.setItem("AUTH_EMAIL", data.email);
            router.push("/confirm-email");
            return response.data;
        })
        .catch(async (error) => {
            console.error(error);
        });
    console.log(res);
    return res;
};

export const confirmEmail = async (email: string) => {
    const res = await instance
        .post("/api/auth/send-email-confirmation", {
            email,
        })
        .then((response) => {
            localStorage.removeItem("AUTH_EMAIL");
            return response.data;
        })
        .catch((error) => {
            console.error(error);
        });
    console.log("confirmEmail", res);
    return res;
};
