// Helper function to get the full name of the user from users array

import { User } from "../types/authTypes";

export const findAndGetUserFullName = (
  users: User[],
  authenticatedUserId: string | undefined,
): string => {
  if (authenticatedUserId === undefined) return "";
  const targetUser = users.find((cUser) => cUser.id !== authenticatedUserId);
  return targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "";
};
