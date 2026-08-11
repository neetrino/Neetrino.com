export type NewMessageNotificationPayload = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  projectType: string;
  projectGoal: string;
  budget: string;
  timeline: string;
  createdAt: Date;
  source?: string;
};

export type OrderPaidNotificationItem = {
  name: string;
  quantity: number;
  unitAmountAmd?: number;
};

export type OrderPaidNotificationPayload = {
  orderId: string;
  orderNumber: string;
  amountAmd: number;
  currency: string;
  provider: string;
  paidAt: Date;
  items: OrderPaidNotificationItem[];
};

export type TelegramInlineKeyboard = {
  inline_keyboard: Array<Array<{ text: string; url: string }>>;
};

export type BuiltTelegramNotification = {
  text: string;
  replyMarkup: TelegramInlineKeyboard | null;
};

export type TelegramSendResult =
  | { ok: true; chatId: string }
  | { ok: false; chatId: string; statusCode?: number; errorMessage: string };

export type TelegramDeliverySummary = {
  messageId: string;
  total: number;
  sent: number;
  failed: number;
};
