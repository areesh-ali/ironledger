
import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "suspended",
  "disabled",
]);

export const users = pgTable(
  "users",
  {
    // Identity
    id: uuid("id").defaultRandom().primaryKey(),

    email: varchar("email", { length: 255 }).notNull().unique(),

    passwordHash: text("password_hash").notNull(),

    // Profile
    displayName: varchar("display_name", { length: 120 }),

    phoneNumber: varchar("phone_number", { length: 16 }),

    profileImageKey: text("profile_image_key"),

    // Verification
    emailVerifiedAt: timestamp("email_verified_at", {
      withTimezone: true,
    }),

    phoneVerifiedAt: timestamp("phone_verified_at", {
      withTimezone: true,
    }),

    // Account lifecycle
    status: userStatusEnum("status")
      .default("active")
      .notNull(),

    suspendedAt: timestamp("suspended_at", {
      withTimezone: true,
    }),

    suspendedReason: text("suspended_reason"),

    disabledAt: timestamp("disabled_at", {
      withTimezone: true,
    }),

    deletedAt: timestamp("deleted_at", {
      withTimezone: true,
    }),

    // Login security
    failedLoginAttempts: integer("failed_login_attempts")
      .default(0)
      .notNull(),

    lastFailedLoginAt: timestamp("last_failed_login_at", {
      withTimezone: true,
    }),

    loginBlockedUntil: timestamp("login_blocked_until", {
      withTimezone: true,
    }),

    passwordChangedAt: timestamp("password_changed_at", {
      withTimezone: true,
    }),

    // Activity
    lastLoginAt: timestamp("last_login_at", {
      withTimezone: true,
    }),

    lastSeenAt: timestamp("last_seen_at", {
      withTimezone: true,
    }),

    // Timestamps
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("users_email_ci_uq").on(
      sql`lower(${table.email})`,
    ),

    check(
      "users_email_format_chk",
      sql`
        length(btrim(${table.email})) > 0
        AND ${table.email} = btrim(${table.email})
      `,
    ),

    check(
      "users_failed_attempts_chk",
      sql`${table.failedLoginAttempts} >= 0`,
    ),

    check(
      "users_phone_format_chk",
      sql`
        ${table.phoneNumber} IS NULL
        OR ${table.phoneNumber} ~ '^[+][1-9][0-9]{1,14}$'
      `,
    ),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
