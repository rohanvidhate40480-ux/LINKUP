import { Router, Request, Response } from "express";
import { ConfirmationEmailAgent, ConfirmationDetails } from "../agents/confirmationEmailAgent";

const router = Router();
const agent = new ConfirmationEmailAgent();

/**
 * POST /api/confirm
 * Send a confirmation email using the AI agent.
 *
 * Body: { recipientEmail, recipientName, eventName, eventDate, eventLocation }
 */
router.post("/confirm", async (req: Request, res: Response): Promise<void> => {
  const { recipientEmail, recipientName, eventName, eventDate, eventLocation } =
    req.body as Partial<ConfirmationDetails>;

  if (!recipientEmail || !recipientName || !eventName || !eventDate || !eventLocation) {
    res.status(400).json({
      error: "Missing required fields: recipientEmail, recipientName, eventName, eventDate, eventLocation",
    });
    return;
  }

  try {
    const result = await agent.sendConfirmation({
      recipientEmail,
      recipientName,
      eventName,
      eventDate,
      eventLocation,
    });

    res.status(200).json({
      message: "Confirmation email sent successfully",
      messageId: result.messageId,
      subject: result.subject,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Failed to send confirmation email:", message);
    res.status(500).json({ error: "Failed to send confirmation email" });
  }
});

export default router;
