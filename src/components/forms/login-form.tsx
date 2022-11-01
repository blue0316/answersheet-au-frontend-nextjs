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

interface IFormValues {
    useremail: string;
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
            useremail: "Admin",
            password: "Admin",
        },
    });

    const onSubmit: SubmitHandler<IFormValues> = (data) => {
        setLogin(data);
        setServerState("");
        if (window?.history?.length > 2) {
            router.back();
        }
        // if (data.useremail === "Admin" && data.password === "Admin") {
        // } else {
        //     setServerState("Useremail or password is incorrect");
        // }
    };

    return (
        <div className="tw-bg-white tw-shadow-2xs tw-shadow-heading/10 tw-w-[470px] tw-pt-7.5 tw-pb-[50px] tw-px-[50px]">
            <h3 className="tw-text-h2 tw-mb-5">Login</h3>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="tw-mb-7.5">
                    <label
                        htmlFor="useremail"
                        className="tw-text-heading tw-text-md"
                    >
                        Useremail *
                    </label>
                    <Input
                        id="useremail"
                        placeholder="Useremail"
                        bg="light"
                        feedbackText={errors?.useremail?.message}
                        state={
                            hasKey(errors, "useremail") ? "error" : "success"
                        }
                        showState={!!hasKey(errors, "useremail")}
                        {...register("useremail", {
                            required: "Useremail is required",
                        })}
                    />
                    <small>Default Useremail: Admin</small>
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
                <Button type="submit" fullwidth className="tw-mt-7.5">
                    Log In
                </Button>
                {serverState && <FeedbackText>{serverState}</FeedbackText>}
            </form>
        </div>
    );
};

export default LoginForm;
