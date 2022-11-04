import NextAuth, { User } from "next-auth";

// Import providers
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

import { signIn } from "@utils/auth";

const options: any = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Sign in with Email",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req): Promise<User & { jwt: string }> {
                console.log(req);
                /**
                 * This function is used to define if the user is authenticated or not.
                 * If authenticated, the function should return an object contains the user data.
                 * If not, the function should return `null`.
                 */
                if (credentials == null) return null;
                /**
                 * credentials is defined in the config above.
                 * We can expect it contains two properties: `email` and `password`
                 */
                try {
                    const { user, jwt } = await signIn({
                        email: credentials.email,
                        password: credentials.password,
                    });
                    return { ...user, jwt };
                } catch (error) {
                    // Sign In/Up Fail
                    console.error(error);
                    return null;
                }
            },
        }),
    ],
    database: process.env.NEXT_PUBLIC_DATABASE_URL,
    session: {
        jwt: true,
    },
    callbacks: {
        session: async ({ session, token }: any) => {
            session.id = token.id;
            session.jwt = token.jwt;
            return Promise.resolve(session);
        },
        jwt: async ({ token, user }: any) => {
            const isSignIn = user ? true : false;
            if (isSignIn) {
                // const response = await fetch(
                //     `${process.env.NEXT_PUBLIC_API_URL}/auth/${account.provider}/callback?access_token=${account?.accessToken}`
                // );
                // const data = await response.json();
                token.id = user.id;
                token.jwt = user.jwt;
                token.name = user.username;
                token.email = user.email;
            }
            return Promise.resolve(token);
        },
    },
};

const Auth = (req: any, res: any) => NextAuth(req, res, options);

export default Auth;
