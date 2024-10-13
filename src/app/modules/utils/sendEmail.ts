import nodemailer from 'nodemailer'
import config from '../../config'


export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'development', // true for port 465, false for other ports
    auth: {
      user: 'sabilar15-3609@diu.edu.bd',
      pass: 'rwcw ewph spdo gigc',
    },
  })

  const info = await transporter.sendMail({
    from: 'sabilar15-3609@diu.edu.bd',
    to,
    subject: 'Reset your password this link will expire in 10 minutes', // Subject line
    text: '', // plain text body
    html,
  })
  console.log('Message sent: %s', info.messageId)
}