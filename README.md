# LINKUP
https://letlinkup.lovable.app

## AI Confirmation Email Agent

An AI-powered agent that generates and sends personalized confirmation emails for LINKUP events using OpenAI and Nodemailer.

### Setup

```bash
npm install
cp .env.example .env   # then fill in your SMTP and OpenAI credentials
```

### Run

```bash
npm run build
npm start
# or for development:
npm run dev
```

### API

**POST /api/confirm** — Send a confirmation email

```json
{
  "recipientEmail": "jane@example.com",
  "recipientName": "Jane Doe",
  "eventName": "Tech Meetup 2026",
  "eventDate": "2026-04-15",
  "eventLocation": "San Francisco, CA"
}
```

### Test

```bash
npm test
```
