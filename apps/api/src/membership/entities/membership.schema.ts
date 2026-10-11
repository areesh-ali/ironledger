
import {
  pgTable,
  pgEnum,
  uuid,
  timestamp,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";

import { users } from "../../iam/entities/user.schema";
import { organizations } from "../../orgnization/entities/orgnization.schema";

export const membershipRoleEnum = pgEnum(
  "membership_role",
  ["owner", "manager", "operator", "viewer"],
);

export const membershipStatusEnum = pgEnum(
  "membership_status",
  ["active", "suspended", "removed"],
);

export const memberships = pgTable(
  "memberships",
  {
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    role: membershipRoleEnum("role").notNull(),

    status: membershipStatusEnum("status")
      .default("active")
      .notNull(),

    joinedAt: timestamp("joined_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    suspendedAt: timestamp("suspended_at", {
      withTimezone: true,
    }),

    removedAt: timestamp("removed_at", {
      withTimezone: true,
    }),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    primaryKey({
      name: "memberships_pkey",
      columns: [
        table.organizationId,
        table.userId,
      ],
    }),

    index("memberships_user_org_idx").on(
      table.userId,
      table.organizationId,
    ),
  ],
);

export type Membership =
  typeof memberships.$inferSelect;

export type NewMembership =
  typeof memberships.$inferInsert;
