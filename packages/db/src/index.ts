// Main export file - re-exports everything needed
// For server-side database operations, use ./client

// Export types
export type {
  TAccount,
  TNewUser,
  TSession,
  TUser,
  TUserAuditLog,
  TUserPreferences,
  TUserRole,
  TVerification,
} from "./schema/auth.schema";

// Export drizzle utilities
export * from "drizzle-orm";

// Export schema tables
export {
  Accounts,
  EmailVerificationTokens,
  PasswordResetTokens,
  Sessions,
  TwoFactorTokens,
  UserAuditLog,
  UserPreferences,
  userRoles,
  Users,
  Verifications,
} from "./schema/auth.schema";

import { drizzle } from 'drizzle-orm/neon-http';

// Re-export from schema
import {
    Accounts, EmailVerificationTokens, PasswordResetTokens, Sessions, TwoFactorTokens, UserAuditLog,
    UserPreferences, userRoles, Users, Verifications
} from './schema/auth.schema';

// Export schema object
export const schema = {
  Accounts,
  EmailVerificationTokens,
  PasswordResetTokens,
  Sessions,
  TwoFactorTokens,
  UserAuditLog,
  UserPreferences,
  userRoles,
  Users,
  Verifications,
};

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  return url;
};

export const db = drizzle(getDatabaseUrl(), { schema });
