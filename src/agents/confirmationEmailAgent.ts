import OpenAI from "openai";
import { config } from "../config";
import { EmailService } from "../services/emailService";

export interface ConfirmationDetails {
  recipientEmail: string;
  recipientName: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
}

export class ConfirmationEmailAgent {
  private openai: OpenAI;
  private emailService: EmailService;

  constructor(openai?: OpenAI, emailService?: EmailService) {
    this.openai =
      openai ?? new OpenAI({ apiKey: config.openaiApiKey });
    this.emailService = emailService ?? new EmailService();
  }

  async generateEmailContent(
    details: ConfirmationDetails
  ): Promise<{ subject: string; html: string }> {
    const prompt = `Generate a professional confirmation email for a LINKUP event.
Details:
- Recipient name: ${details.recipientName}
- Event name: ${details.eventName}
- Event date: ${details.eventDate}
- Event location: ${details.eventLocation}

Respond in valid JSON with two fields:
- "subject": a short email subject line
- "body": the email body in HTML format (use <p>, <strong>, <ul>/<li> tags for structure)

The tone should be friendly, professional, and concise. Include a thank you message.`;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an email assistant for LINKUP, an event platform. You generate well-formatted confirmation emails. Always respond with valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("AI agent returned empty response");
    }

    const parsed = JSON.parse(content) as { subject: string; body: string };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">LINKUP</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          ${parsed.body}
        </div>
        <div style="padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>This is an automated confirmation from LINKUP.</p>
        </div>
      </div>`;

    return { subject: parsed.subject, html };
  }

  async sendConfirmation(
    details: ConfirmationDetails
  ): Promise<{ messageId: string; subject: string }> {
    const { subject, html } = await this.generateEmailContent(details);

    const result = await this.emailService.sendEmail({
      to: details.recipientEmail,
      subject,
      html,
    });

    return { messageId: result.messageId, subject };
  }
}
