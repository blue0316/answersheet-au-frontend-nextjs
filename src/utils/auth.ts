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
    const userExistence = await instance
        .post("/api/auth-check", {
            email: data.email,
        })
        .then((res) => {
            console.log(res);
            return res.data;
        })
        .catch((error) => {
            console.error(error);
        });

    if (userExistence && !userExistence.status) {
        const res = await instance
            .post<SignInResponse>("/api/auth/local/register", data)
            .then((response) => {
                sendEmail();
                localStorage.setItem("AUTH_EMAIL", data.email);
                router.push("/confirm-email");
                window.alert("Successfully registered.");
                return response.data;
            })
            .catch(async (error) => {
                console.error(error);
            });
        return res;
    } else {
        window.alert("This email is already existed.");
        return null;
    }
};

export const confirmEmail = async (email: string) => {
    const res = await instance
        .post("/api/auth/send-email-confirmation", {
            email,
        })
        .then((response) => {
            window.alert("Success email confirmation.");
            localStorage.removeItem("AUTH_EMAIL");
            return response.data;
        })
        .catch((error) => {
            window.alert("Email confirmation failed.");
            console.error(error);
        });
    return res;
};
