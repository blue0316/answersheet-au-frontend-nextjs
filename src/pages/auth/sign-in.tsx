import Head from "next/head";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn() {
    const router = useRouter();

    const onSubmit = async (e: any) => {
        e.preventDefault();
        let target = e.target as any;
        const result: any = await signIn("credentials", {
            redirect: false,
            email: target.email.value,
            password: target.password.value,
        });
        if (result.ok) {
            router.replace("/");
            return;
        }
        alert("Credential is not valid");
    };

    return (
        <div>
            <Head>
                <title>Strapi - Next - NextAuth</title>
            </Head>
            <h1>Sign In</h1>
            <form onSubmit={onSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value="greatblueknight@gmail.com"
                />
                <label
                    style={{
                        marginTop: 10,
                    }}
                    htmlFor="password"
                >
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value="Pass1234"
                />
                <button
                    style={{
                        marginTop: 15,
                    }}
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}
