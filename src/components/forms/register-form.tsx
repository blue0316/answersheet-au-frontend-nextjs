import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import Input from "@ui/form-elements/input";
import Button from "@ui/button";
import { hasKey } from "@utils/methods";
import { register as signUp } from "@utils/auth";
import { useUser } from "@contexts/user-context";
import Checkbox from "@components/ui/form-elements/checkbox";

interface IFormValues {
    email: string;
    reg_firstname: string;
    reg_lastname: string;
    reg_password: string;
    confirmPassword: string;
}

const RegisterForm = () => {
    const router = useRouter();
    const [policy, setPolicy] = useState(false);
    const { sendEmail } = useUser();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<IFormValues>();
    const passwordRegex =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;

    const onSubmit: SubmitHandler<IFormValues> = async (data) => {
        // eslint-disable-next-line no-console
        await signUp(
            {
                email: data.email,
                username: data.reg_firstname + " " + data.reg_lastname,
                password: data.reg_password,
            },
            router,
            sendEmail
        );
    };

    const checkPolicy = () => {
        setPolicy(!policy);
    };

    return (
        <div className="tw-px-[50px] tw-w-[470px]">
            <h3 className="tw-text-h2 tw-mb-5">Register</h3>
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
                        placeholder="email"
                        bg="light"
                        feedbackText={errors?.email?.message}
                        state={hasKey(errors, "email") ? "error" : "success"}
                        showState={!!hasKey(errors, "email")}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "invalid email address",
                            },
                        })}
                    />
                </div>
                <div className="tw-flex tw-mx--2">
                    <div className="tw-flex-basis-1/2 tw-px-2 tw-mb-7.5">
                        <label
                            htmlFor="reg_firstname"
                            className="tw-text-heading tw-text-md"
                        >
                            First Name *
                        </label>
                        <Input
                            id="reg_firstname"
                            placeholder="Username"
                            bg="light"
                            feedbackText={errors?.reg_firstname?.message}
                            state={
                                hasKey(errors, "reg_firstname")
                                    ? "error"
                                    : "success"
                            }
                            showState={!!hasKey(errors, "reg_firstname")}
                            {...register("reg_firstname", {
                                required: "Frist name is required",
                            })}
                        />
                    </div>
                    <div className="tw-flex-basis-1/2 tw-px-2 tw-mb-7.5">
                        <label
                            htmlFor="reg_lastname"
                            className="tw-text-heading tw-text-md"
                        >
                            Second Name *
                        </label>
                        <Input
                            id="reg_lastname"
                            placeholder="Username"
                            bg="light"
                            feedbackText={errors?.reg_lastname?.message}
                            state={
                                hasKey(errors, "reg_lastname")
                                    ? "error"
                                    : "success"
                            }
                            showState={!!hasKey(errors, "reg_lastname")}
                            {...register("reg_lastname", {
                                required: "Last name is required",
                            })}
                        />
                    </div>
                </div>
                <div className="tw-mb-7.5">
                    <label
                        htmlFor="reg_password"
                        className="tw-text-heading tw-text-md"
                    >
                        Password *
                    </label>
                    <Input
                        id="reg_password"
                        type="password"
                        placeholder="Password"
                        bg="light"
                        autoComplete="true"
                        feedbackText={errors?.reg_password?.message}
                        state={
                            hasKey(errors, "reg_password") ? "error" : "success"
                        }
                        showState={!!hasKey(errors, "reg_password")}
                        {...register("reg_password", {
                            required: "Password is required",
                            validate: (value) =>
                                value.match(passwordRegex) !== null ||
                                "The password must contain one capital letter, one small letter, one number and one special letter.",
                        })}
                    />
                </div>
                <div className="tw-mb-7.5">
                    <label
                        htmlFor="confirmPassword"
                        className="tw-text-heading tw-text-md"
                    >
                        Password *
                    </label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        bg="light"
                        autoComplete="true"
                        feedbackText={errors?.confirmPassword?.message}
                        state={
                            hasKey(errors, "confirmPassword")
                                ? "error"
                                : "success"
                        }
                        showState={!!hasKey(errors, "confirmPassword")}
                        {...register("confirmPassword", {
                            required: "Confirm Password is required",
                            validate: (value) =>
                                value === getValues("reg_password") ||
                                "The passwords do not match",
                        })}
                    />
                </div>
                <Checkbox
                    name="policy"
                    id="policy"
                    label="I accept the Terms and Conditions and Privacy Policy."
                    onClick={checkPolicy}
                />

                <Button
                    disabled={!policy}
                    type="submit"
                    fullwidth
                    className="tw-mt-7.5"
                >
                    Register
                </Button>
            </form>
        </div>
    );
};

export default RegisterForm;
