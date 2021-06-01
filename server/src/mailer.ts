import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: "CorderService",
    pass: "w(C_AT8@$2tpMwce",
  },
});

export const mailActivationCode = async (toWho: string, id: string) => {
  await transporter.sendMail({
    from: '"Corder Service" <corderservice@gmail.com>',
    to: toWho,
    subject: "Corder - verification",
    text: "Your activation code is: " + id,
  });
};

export const changeEmailCode = async (toWho: string, code: string) => {
  await transporter.sendMail({
    from: '"Corder Service" <corderservice@gmail.com>',
    to: toWho,
    subject: "Corder - change email",
    text: "Your reset code is: " + code,
  });
};

export const changePasswordCode = async (toWho: string, code: string) => {
  await transporter.sendMail({
    from: '"Corder Service" <corderservice@gmail.com>',
    to: toWho,
    subject: "Corder - change email",
    text: "Your confirmation code is: " + code,
  });
};
