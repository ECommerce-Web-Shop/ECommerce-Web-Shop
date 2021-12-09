import withIronSession from "../../../helpers/customWithIronSession";

function handler(req, res, session) {
    req.session.destroy();
    return res.json({
        success: true
    });
}

export default withIronSession(handler);