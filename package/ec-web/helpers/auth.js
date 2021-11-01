import axiosClient from "../apis/clients/axiosClient";
import {
    withIronSession
} from "next-iron-session";

export const signIn = async (username, password) => {
    // Send request to login API
    const { data: { ok, errors } } = await axiosClient.post("/api/login", {
        username,
        password
    });

    const error = errors ? errors[0].extensions.exception.data.message[0].messages[0].id : null;

    if(error === "Auth.form.error.confirmed")
        return {
            success: false,
            error: "Not confirmed"
        }

    return {
        success: ok,
    }
};

export const signOut = async () => {
    const { data } = await axiosClient.get("/api/logout");
    const { success: signOutSuccessfully } = data;
    return signOutSuccessfully;
};

export const useAuth = handler => withIronSession(handler, {
    password: 'DkAi0P2Aixgs9FWo66UMV3YdmksspNrW',
    cookieName: process.env.NEXT_PUBLIC_APP_COOKIE_NAME,
    // if your localhost is served on http:// then disable the secure flag
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true
    },
});