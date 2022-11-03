import { useEffect, useState } from "react";
import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import SEO from "@components/seo/page-seo";
import Layout from "@layout/layout-01";
import Breadcrumb from "@components/breadcrumb";
import Spinner from "@ui/spinner";
import { useUser } from "@contexts/user-context";
import { useMount } from "@hooks";
import Button from "@components/ui/button";
import { confirmEmail } from "@utils/auth";

type PageProps = NextPage & {
    Layout: typeof Layout;
};

const ConfirmEmail: PageProps = () => {
    const [email, setEmail] = useState("");
    const mounted = useMount();
    const { isLoggedIn } = useUser();
    const router = useRouter();

    useEffect(() => {
        const tmp = localStorage.getItem("AUTH_EMAIL") as string;
        const tmp1 = localStorage.getItem("EmailConfirmStatus");
        const emailConfirmStatus =
            tmp1 !== null ? (JSON.parse(tmp1) as boolean) : false;
        if (!emailConfirmStatus) router.push("/");
        if (tmp && tmp.includes("@")) {
            setEmail(tmp);
        } else {
            setEmail("");
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            void router.push("/profile");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, router]);

    if (!mounted) return null;

    if (!isLoggedIn) {
        return (
            <>
                <SEO title="ConfirmEmail" />
                <Breadcrumb
                    pages={[{ path: "/", label: "home" }]}
                    currentPage="ConfirmEmail"
                    showTitle={false}
                />
                <div className="tw-container tw-flex tw-justify-center tw-pb-15 md:tw-pb-20 lg:tw-pb-[100px] tw-items-start">
                    <div className="tw-bg-white tw-shadow-2xs tw-shadow-heading/10 tw-w-[470px] tw-pt-7.5 tw-pb-[50px] tw-px-[50px]">
                        <h3>
                            You’re almost done! We sent an activation mail to{" "}
                            <u>
                                <i>{email}</i>
                            </u>
                            . Please follow the instructions in the mail to
                            activate your account.
                            <br />
                            <br />
                            If it doesn’t arrive, check your spam folder.
                        </h3>
                        <Button
                            disabled={email === ""}
                            onClick={() => confirmEmail(email)}
                            fullwidth
                            className="block tw-mt-5"
                        >
                            Resend Email
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="tw-fixed tw-bg-light-100 tw-top-0 tw-z-50 tw-w-screen tw-h-screen tw-flex tw-justify-center tw-items-center">
            <Spinner />
        </div>
    );
};

ConfirmEmail.Layout = Layout;

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
            layout: {
                headerShadow: true,
                headerFluid: false,
                footerMode: "light",
            },
        },
    };
};

export default ConfirmEmail;
