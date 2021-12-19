import { userApi } from "../../../apis";
import withIronSession from "../../../helpers/customWithIronSession";

async function handler(req, res) {
    if (req.method !== "POST")
        return res.json({
            message: "This API only works with POST method",
            ok: false,
        });

    try {
        const { username, password } = req.body;
        const response = await userApi.login(username, password, {
            useAxiosClient: false,
        });

        const {data, errors} = response;

        if (data?.login?.jwt) {
            req.session.set("user", {
                jwt: data.login.jwt,
                username: data.login.user.username,
                email: data.login.user.email,
            });

            await req.session.save();
            return res.json({
                message: "Logged in successfully",
                ok: true,
            });
        }
        return res.json({
            message: "Wrong password or username!",
            errors,
            ok: false,
        });
    } catch {
        return res.json({
            message:
                "Some errors happen while logging. May be wrong username or password",
            ok: false,
        });
    }
}

export default withIronSession(handler);
