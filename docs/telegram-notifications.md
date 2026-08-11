# Telegram notifications (multi-recipient)

Admin Messages and paid Orders fan out the same notification style to multiple
Telegram chats via environment configuration. No code change is required to add recipients.

## Environment

```env
TELEGRAM_NOTIFICATIONS_ENABLED=true
TELEGRAM_BOT_TOKEN=<SECRET>
TELEGRAM_CHAT_IDS=7910562238,-1001234567890
ADMIN_APP_URL=https://neetrino.com/admin
```

| Variable | Purpose |
|---|---|
| `TELEGRAM_NOTIFICATIONS_ENABLED` | Master switch (`true` / `false`) |
| `TELEGRAM_BOT_TOKEN` | Bot API token from BotFather (never commit / never log) |
| `TELEGRAM_CHAT_IDS` | Comma-separated chat IDs (private users and groups) |
| `ADMIN_APP_URL` | Admin base URL for **Open Message** / **Open Order** buttons |

Duplicates and blank entries in `TELEGRAM_CHAT_IDS` are removed automatically.

## Private chat rule

> Յուրաքանչյուր private Telegram recipient նախ պետք է բացի bot-ը և սեղմի `/start`։

Without that first interaction, Telegram rejects private DMs from the bot.

For groups/supergroups: add the bot to the group and grant permission to send messages.

## Events

### NEW_MESSAGE (Get a Quote)

```text
Quote / contact form submit
  → ContactMessage saved in DB
  → dispatchMessageCreatedNotification
  → Telegram fan-out
```

Deep link: `{ADMIN_APP_URL}/messages?messageId={id}`

### ORDER_PAID

```text
Arca callback verifies payment
  → claimPaymentPaidTransition (atomic NOT_PAID → PAID)
  → only on first transition: dispatchOrderPaidNotification
  → Telegram fan-out
```

Deep link: `{ADMIN_APP_URL}/orders?orderId={paymentAttempt.id}`

Duplicate Arca callbacks do not re-send Telegram (already `PAID` early-return + `updateMany` count guard).

Telegram failures never roll back a successful `PAID` status.

## Production checklist

1. Create the bot with BotFather and set `TELEGRAM_BOT_TOKEN`.
2. Open the bot as each private recipient and press `/start`.
3. Set `TELEGRAM_CHAT_IDS` to your recipient list.
4. Set `ADMIN_APP_URL` to the live admin base (for example `https://neetrino.com/admin`).
5. Set `TELEGRAM_NOTIFICATIONS_ENABLED=true`.
6. Submit a test quote and complete a test Arca payment; confirm every configured chat receives both notification types.
