import { useEffect } from "react";
import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import SEO from "@components/seo/page-seo";
import Layout from "@layout/layout-01";
import Breadcrumb from "@components/breadcrumb";
import Spinner from "@ui/spinner";
import { useUser } from "@contexts/user-context";
import { useMount } from "@hooks";

type PageProps = NextPage & {
    Layout: typeof Layout;
};

const EmailConfirmed: PageProps = () => {
    const mounted = useMount();
    const { isLoggedIn } = useUser();
    const router = useRouter();

    useEffect(() => {
        localStorage.setItem("EmailConfirmStatus", "false");
        setTimeout(() => {
            router.push("/login");
        }, 2000);
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
                <SEO title="EmailConfirmed" />
                <Breadcrumb
                    pages={[{ path: "/", label: "home" }]}
                    currentPage="EmailConfirmed"
                    showTitle={false}
                />
                <div className="tw-container tw-flex tw-justify-center tw-pb-15 md:tw-pb-20 lg:tw-pb-[100px] tw-items-start">
                    <div className="tw-bg-white tw-shadow-2xs tw-shadow-heading/10 tw-w-[470px] tw-pt-7.5 tw-pb-[50px] tw-px-[50px]">
                        <h3>You are successfully registered.</h3>
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

EmailConfirmed.Layout = Layout;

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

export default EmailConfirmed;
