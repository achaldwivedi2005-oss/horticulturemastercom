/** Visitors without an account can send this many messages to the AI assistant before being asked to log in. */
export const GUEST_MESSAGE_LIMIT = 3;

/** Count the user's own messages in a chat history. */
export function countUserMessages(messages: { role: string }[]) {
  return messages.filter((m) => m.role === "user").length;
}

/** True when a visitor without an account has used up their free messages. */
export function guestLimitReached(messages: { role: string }[]) {
  return countUserMessages(messages) > GUEST_MESSAGE_LIMIT;
}
