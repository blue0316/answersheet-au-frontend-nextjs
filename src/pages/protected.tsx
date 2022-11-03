import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";

export default function Protected() {
    return (
        <div>
            <Head>
                <title>Strapi - Next - NextAuth</title>
            </Head>
            <h1>Protected Page</h1>
            <Link href="/">
                <button>Back to home page</button>
            </Link>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    // Check if session exists or not, if not, redirect
    if (!session) {
        return {
            redirect: {
                destination: "/auth/not-authenticated",
                permanent: false,
            },
        };
    }
    return {
        props: {
            currentUser: session.user,
        },
    };
};
