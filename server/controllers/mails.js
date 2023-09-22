const { response } = require('express');
const Mail = require('./../models/mail.model');
const Newsletter = require('./../models/newsletter.model');
const nodemailer = require('nodemailer');


const getMails = async(req, res) => {
    try {
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || Number.MAX_SAFE_INTEGER;

        const filtros = JSON.parse(req.query.filtros || '{}');

        let conditions = [];

        // filtro por texto
        if(filtros.terminoBusqueda.trim() !== '') {
            let regex = new RegExp( filtros.terminoBusqueda.trim(), 'i')
            conditions.push(
                { $or: [{ type: regex }, { subject: regex }, { html: regex }, { mail_name: regex }, { mail_from: regex }, { to: regex }]}
            );
        }


        const [mails, filtradas, total] = await Promise.all([
            Mail
                .find(conditions.length ? { $and: conditions} : {})
                .sort('-createdAt')
                .skip(skip)
                .limit(limit)
                .populate('usuario', 'nombre apellidos email rol'),

            Mail.find(conditions.length ? { $and: conditions} : {}).countDocuments(),

            Mail.countDocuments(),
        ]);

        return res.status(200).json({
            ok: true,
            mails,
            filtradas: filtradas,
            total: total,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const getNewsletters = async(req, res) => {
    try {
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || Number.MAX_SAFE_INTEGER;

        const filtros = JSON.parse(req.query.filtros || '{}');

        let conditions = [];

        // filtro por texto
        if(filtros.terminoBusqueda.trim() !== '') {
            let regex = new RegExp( filtros.terminoBusqueda.trim(), 'i')
            conditions.push(
                { $or: [{ mail_to: regex }]}
            );
        }
        const [newsletters, filtradas, total] = await Promise.all([
            Newsletter
                .find(conditions.length ? { $and: conditions} : {})
                .sort('-createdAt')
                .skip(skip)
                .limit(limit),

            Newsletter.find(conditions.length ? { $and: conditions} : {}).countDocuments(),

            Newsletter.countDocuments(),
        ]);

        return res.status(200).json({
            ok: true,
            newsletters,
            filtradas: filtradas,
            total: total,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}




const crearRegistroMail = (req, res = response) => {
    try {
        const { subject, html } = req.body;

        const mail_type = 'Formulario de contacto';
        const mail_to = process.env.MAIL_FROM;

        const mailOptions = { from: `${ process.env.MAIL_NAME } <${ process.env.MAIL_FROM }>`, to: mail_to, subject, html };
        const transporter = nodemailer.createTransport({ service: process.env.MAIL_SERVICE, auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD } });


        transporter.sendMail(mailOptions, function (err, info) {

            if (err) {
                console.log(err);
                return res.status(400).json({
                    ok: false,
                    msg: err.toString(),
                });
            }

            // Formulario contacto
            const mail = new Mail;
            mail.type = mail_type;

            mail.mail_name = process.env.MAIL_FROM;
            mail.mail_from = process.env.MAIL_NAME;

            mail.subject = subject;
            mail.html = html;

            mail.to = mail_to;

            mail.usuario = req.current_user ? req.current_user.uid : null;

            mail.save();


            return res.status(200).json({
                ok: true,
                msg: info
            });
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}


const suscribirNewsletter = async(req, res = response) => {
    try {
        const { mail_to } = req.body;

        const existeEmail = await Newsletter.findOne({ mail_to });

        if(existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado',
            });
        }

        const newsletter = new Newsletter;
        newsletter.mail_to = mail_to;
        newsletter.save();

        const mail_type = 'Suscripción a newsletter';

        const subject = 'Portal ApS';
        const html = 'Te has suscrito satisfactoriamente a nuestra newsletter';

        const mailOptions = { from: `${ process.env.MAIL_NAME } <${ process.env.MAIL_FROM }>`, to: mail_to, subject, html };
        const transporter = nodemailer.createTransport({ service: process.env.MAIL_SERVICE, auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD } });

        transporter.sendMail(mailOptions, function (err, info) {

            if (err) {
                console.log(err);
                return res.status(400).json({
                    ok: false,
                    msg: err.toString(),
                });
            }

            // Suscrito a newsletter
            const mail = new Mail;
            mail.type = mail_type;

            mail.mail_name = process.env.MAIL_FROM;
            mail.mail_from = process.env.MAIL_NAME;

            mail.subject = subject;
            mail.html = html;

            mail.to = mail_to;

            mail.usuario = req.current_user ? req.current_user.uid : null;

            mail.save();

            return res.status(200).json({
                ok: true,
                msg: info
            });
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}


module.exports = {
    getMails,
    getNewsletters,
    crearRegistroMail,
    suscribirNewsletter,
}