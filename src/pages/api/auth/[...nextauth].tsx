import NextAuth from "next-auth";

// Import providers
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

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
    ],
    database: process.env.NEXT_PUBLIC_DATABASE_URL,
    session: {
        jwt: true,
    },
    callbacks: {
        session: async (session: any, user: any) => {
            session.jwt = user.jwt;
            session.id = user.id;
            return Promise.resolve(session);
        },
        jwt: async (token: any, user: any, account: any) => {
            const isSignIn = user ? true : false;
            if (isSignIn) {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/${account.provider}/callback?access_token=${account?.accessToken}`
                );
                const data = await response.json();
                token.jwt = data.jwt;
                token.id = data.user.id;
            }
            return Promise.resolve(token);
        },
    },
};

const Auth = (req: any, res: any) => NextAuth(req, res, options);

export default Auth;
