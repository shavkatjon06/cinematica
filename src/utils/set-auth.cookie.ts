import { Response } from "express";

const setAuthCookie = (res: Response, token: string) => {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
};

export default setAuthCookie