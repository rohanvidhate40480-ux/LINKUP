import nodemailer, { Transporter } from "nodemailer";
import { config } from "../config";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor(transporter?: Transporter) {
    this.transporter =
      transporter ??
      nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.port === 465,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.pass,
        },
      });
  }

  async sendEmail(options: EmailOptions): Promise<{ messageId: string }> {
    const info = await this.transporter.sendMail({
      from: config.emailFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return { messageId: info.messageId };
  }
}
