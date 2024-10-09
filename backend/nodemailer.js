import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'A01027893@tec.mx',
        pass: 'spty yzcc hvds puxq'
    }
});

// Verify the transporter
transporter.verify()
    .then(() => console.log('Ready to send emails'))
    .catch((error) => console.error('Error verifying transporter', error));

// Function to send thank you email
const sendThankYouEmail = async (donorEmail, donorName, donationAmount) => {
    console.log('Sending thank you email to ' + donorEmail);

    if (!donorEmail) {
        console.error('Recipient email is not defined');
        throw new Error('Recipient email is not defined');
    }

    const mailOptions = {
        from: '"Fundación SANDERS" <A01027893@tec.mx>',
        to: donorEmail,
        subject: '¡Gracias por tu donación a la Fundación SANDERS!',
        text: `Tu contribución nos permite constuir más sistemas de recoleccion de agua en comunidades rurales. Gracias por tu generosidad.`,
        html: `
            <p>¡Hola ${donorName}!</p>
            <p>En nombre de todos los que formamos parte de la Fundación SANDERS, queremos expresarte nuestra más sincera gratitud por tu generosa donación de <strong>${donationAmount} MXN</strong>.</p>
            <p>Tu contribución nos permite seguir adelante con nuestra misión de apoyar a quienes más lo necesitan. Gracias a personas como tú, podemos continuar ofreciendo esperanza, recursos y asistencia a comunidades vulnerables.</p>
            <p>Si tienes alguna pregunta o deseas conocer más sobre cómo estamos utilizando tu donación para cambiar vidas, no dudes en ponerte en contacto con nosotros. ¡Estaremos encantados de mantenerte informado sobre los avances que estás ayudando a lograr!</p>
            <p>Una vez más, ¡gracias por tu generosidad!</p>
            <p>Con aprecio,<br>El equipo de la Fundación SANDERS</p>
            <p>Contacto</p>
            <p>Página web: <a href="https://sanders.com.mx/">https://sanders.com.mx/</a></p>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado: ' + info.response);
    } catch (error) {
        console.error('Error enviando el correo: ', error);
        throw new Error('Error enviando el correo');
    }
};

export { sendThankYouEmail };
