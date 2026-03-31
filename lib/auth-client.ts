import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL!,
    fetchOptions: {
        credentials: "include",
    },
    plugins: [
        inferAdditionalFields({
            user: {
                role: { type: "string", defaultValue: "USER", required: false },
                phone: { type: "string", required: false },
                status: { type: "string", defaultValue: "ACTIVE", required: false },
            },
        }),
    ],
});

export const { signIn, signUp, signOut, useSession, getSession, updateUser } = authClient;