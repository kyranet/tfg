const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID);

const googleVerify = async( token ) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID,
    });
    const payload = ticket.getPayload();
    const { given_name, family_name, email, picture } = payload;
    return { given_name, family_name, email, picture };
}

module.exports = {
    googleVerify
}