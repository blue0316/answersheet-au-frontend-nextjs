/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@ui/form-elements/input";
import Checkbox from "@ui/form-elements/checkbox";
import FeedbackText from "@ui/form-elements/feedback";
import Button from "@ui/button";
import { hasKey } from "@utils/methods";
import { useUser } from "@contexts/user-context";
import { signIn, SignInResponse } from "next-auth/react";

interface IFormValues {
    email: string;
    password: string;
}

const LoginForm = () => {
    const router = useRouter();
    const [serverState, setServerState] = useState("");
    const { setLogin } = useUser();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormValues>({
        defaultValues: {
            email: "example@domain.com",
            password: "password",
        },
    });

    const onSubmit: SubmitHandler<IFormValues> = async (data) => {
        const result: SignInResponse | undefined = await signIn("credentials", {
            redirect: false,
            ...data,
        });
        if (result && result.ok) {
            setLogin();
            setServerState("");
            if (window?.history?.length > 2) {
                router.back();
            } else {
                router.replace("/");
            }
        } else {
            setServerState("Email or password is incorrect");
        }
    };

    return (
        <div className="tw-bg-white tw-shadow-2xs tw-shadow-heading/10 tw-w-[470px] tw-pt-7.5 tw-pb-[50px] tw-px-[50px]">
            <h3 className="tw-text-h2 tw-mb-5">Login</h3>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="tw-mb-7.5">
                    <label
                        htmlFor="email"
                        className="tw-text-heading tw-text-md"
                    >
                        Email *
                    </label>
                    <Input
                        id="email"
                        placeholder="Email"
                        bg="light"
                        feedbackText={errors?.email?.message}
                        state={hasKey(errors, "email") ? "error" : "success"}
                        showState={!!hasKey(errors, "email")}
                        {...register("email", {
                            required: "Email is required",
                        })}
                    />
                    <small>Default Email: Admin</small>
                </div>
                <div className="tw-mb-7.5">
                    <label
                        htmlFor="password"
                        className="tw-text-heading tw-text-md"
                    >
                        Password *
                    </label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        bg="light"
                        autoComplete="true"
                        feedbackText={errors?.password?.message}
                        state={hasKey(errors, "password") ? "error" : "success"}
                        showState={!!hasKey(errors, "password")}
                        {...register("password", {
                            required: "Password is required",
                        })}
                    />
                    <small>Default Password: Admin</small>
                </div>
                <Checkbox name="remember" id="remember" label="Remember me" />
                <div className="tw-flex -tw-mx-4">
                    <Button
                        type="submit"
                        className="tw-flex-1 tw-mt-7.5 tx-mx-4"
                    >
                        Log In
                    </Button>
                    <Button
                        path="/register"
                        className="tw-flex-1 tw-mt-7.5 tx-mx-4"
                    >
                        Register
                    </Button>
                </div>
                {serverState && <FeedbackText>{serverState}</FeedbackText>}
            </form>
        </div>
    );
};

export default LoginForm;
