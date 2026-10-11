
import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  timestamp,
  check,
  index,
} from "drizzle-orm/pg-core";

import { users } from "../../iam/entities/user.schema";

export const organizationStatusEnum = pgEnum(
  "organization_status",
  ["active", "suspended", "closed"],
);

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 180 }).notNull(),

    slug: varchar("slug", { length: 100 })
      .notNull()
      .unique("organizations_slug_uq"),

    description: text("description"),

    // Business configuration
    defaultCurrency: varchar("default_currency", {
      length: 3,
    })
      .default("USD")
      .notNull(),

    timezone: varchar("timezone", { length: 64 })
      .default("UTC")
      .notNull(),

    logoObjectKey: text("logo_object_key"),

    // Organization lifecycle
    status: organizationStatusEnum("status")
      .default("active")
      .notNull(),

    suspendedAt: timestamp("suspended_at", {
      withTimezone: true,
    }),

    suspendedReason: text("suspended_reason"),

    closedAt: timestamp("closed_at", {
      withTimezone: true,
    }),

    // Creator: not necessarily the current owner
    createdByUserId: uuid("created_by_user_id")
      .references(() => users.id, {
        onDelete: "set null",
      }),

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
    index("organizations_creator_idx").on(
      table.createdByUserId,
    ),

    check(
      "organizations_name_chk",
      sql`length(btrim(${table.name})) > 0`,
    ),

    check(
      "organizations_slug_chk",
      sql`${table.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`,
    ),

    check(
      "organizations_currency_chk",
      sql`${table.defaultCurrency} ~ '^[A-Z]{3}$'`,
    ),
  ],
);

export type Organization =
  typeof organizations.$inferSelect;

export type NewOrganization =
  typeof organizations.$inferInsert;
