import React from "react";
import { getSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Session } from "next-auth";
import { GetServerSideProps } from "next";

type PropsType = {
    session: Session;
};

const TestPage = ({ session }: PropsType) => {
    const signInButtonNode = () => {
        if (session) {
            return false;
        }

        return (
            <div>
                <Link href="/api/auth/signin">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            signIn();
                        }}
                    >
                        Sign In
                    </button>
                </Link>
            </div>
        );
    };

    const signOutButtonNode = () => {
        if (!session) {
            return false;
        }

        return (
            <div>
                <Link href="/api/auth/signout">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            signOut();
                        }}
                    >
                        Sign Out
                    </button>
                </Link>
            </div>
        );
    };

    if (!session) {
        return (
            <div className="hero">
                <div className="navbar">
                    {signOutButtonNode()}
                    {signInButtonNode()}
                </div>
                <div className="text">
                    You aren't authorized to view this page
                </div>
            </div>
        );
    }

    return (
        <div className="hero">
            <Head>
                <title>Index Page</title>
            </Head>
            <div className="navbar">
                {signOutButtonNode()}
                {signInButtonNode()}
            </div>
            <div className="text">Hello world</div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });
    return {
        props: {
            session,
        },
    };
};

export default TestPage;
