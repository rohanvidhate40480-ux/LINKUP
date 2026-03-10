import { EmailService, EmailOptions } from "../../src/services/emailService";

describe("EmailService", () => {
  it("should send an email using the transporter", async () => {
    const mockSendMail = jest.fn().mockResolvedValue({ messageId: "test-123" });
    const mockTransporter = { sendMail: mockSendMail } as any;

    const service = new EmailService(mockTransporter);

    const options: EmailOptions = {
      to: "user@example.com",
      subject: "Test Subject",
      html: "<p>Hello</p>",
    };

    const result = await service.sendEmail(options);

    expect(result.messageId).toBe("test-123");
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: "Test Subject",
        html: "<p>Hello</p>",
      })
    );
  });

  it("should propagate transporter errors", async () => {
    const mockSendMail = jest.fn().mockRejectedValue(new Error("SMTP error"));
    const mockTransporter = { sendMail: mockSendMail } as any;

    const service = new EmailService(mockTransporter);

    await expect(
      service.sendEmail({ to: "a@b.com", subject: "s", html: "h" })
    ).rejects.toThrow("SMTP error");
  });
});
