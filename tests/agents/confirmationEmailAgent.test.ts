import { ConfirmationEmailAgent, ConfirmationDetails } from "../../src/agents/confirmationEmailAgent";

const mockDetails: ConfirmationDetails = {
  recipientEmail: "jane@example.com",
  recipientName: "Jane Doe",
  eventName: "Tech Meetup 2026",
  eventDate: "2026-04-15",
  eventLocation: "San Francisco, CA",
};

describe("ConfirmationEmailAgent", () => {
  it("should generate email content from AI response", async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              subject: "Your LINKUP Confirmation: Tech Meetup 2026",
              body: "<p>Hi Jane, you are confirmed!</p>",
            }),
          },
        },
      ],
    });

    const mockOpenAI = {
      chat: { completions: { create: mockCreate } },
    } as any;

    const mockEmailService = {
      sendEmail: jest.fn().mockResolvedValue({ messageId: "msg-456" }),
    } as any;

    const agent = new ConfirmationEmailAgent(mockOpenAI, mockEmailService);
    const result = await agent.generateEmailContent(mockDetails);

    expect(result.subject).toBe("Your LINKUP Confirmation: Tech Meetup 2026");
    expect(result.html).toContain("Hi Jane, you are confirmed!");
    expect(result.html).toContain("LINKUP");
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it("should send confirmation email end-to-end", async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              subject: "Confirmed: Tech Meetup 2026",
              body: "<p>Welcome!</p>",
            }),
          },
        },
      ],
    });

    const mockOpenAI = {
      chat: { completions: { create: mockCreate } },
    } as any;

    const mockSendEmail = jest.fn().mockResolvedValue({ messageId: "msg-789" });
    const mockEmailService = { sendEmail: mockSendEmail } as any;

    const agent = new ConfirmationEmailAgent(mockOpenAI, mockEmailService);
    const result = await agent.sendConfirmation(mockDetails);

    expect(result.messageId).toBe("msg-789");
    expect(result.subject).toBe("Confirmed: Tech Meetup 2026");
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "jane@example.com",
        subject: "Confirmed: Tech Meetup 2026",
      })
    );
  });

  it("should throw when AI returns empty response", async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      choices: [{ message: { content: null } }],
    });

    const mockOpenAI = {
      chat: { completions: { create: mockCreate } },
    } as any;

    const mockEmailService = { sendEmail: jest.fn() } as any;

    const agent = new ConfirmationEmailAgent(mockOpenAI, mockEmailService);

    await expect(agent.generateEmailContent(mockDetails)).rejects.toThrow(
      "AI agent returned empty response"
    );
  });
});
