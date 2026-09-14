import { relations, sql } from 'drizzle-orm';
import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const shortLink = mysqlTable('short_link', {
  id: int().primaryKey().autoincrement(),
  url: varchar({ length: 255 }).notNull(),
  shortCode: varchar("short_code",{ length: 20 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(), 
  userId: int("user_id").notNull().references(() => usersTable.id),
});


export const sessionsTable = mysqlTable("sessions", {
  id: int().autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => usersTable.id, {onDelete: "cascade"}),
  valid: boolean().default(true).notNull(),
  userAgent: text("user_agent"),
  ip: varchar({length: 255}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(), 

});

export const verifyEmailTokensTable = mysqlTable("is_email_valid", {
  id: int().autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => usersTable.id, {onDelete: "cascade"}),
  token: varchar({length: 8}).notNull(),
  expiresAt: timestamp("expires_at").default(sql`(CURRENT_TIMESTAMP + INTERVAL 1 DAY)`)
  .notNull(),
   createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const passwordResetTokensTable = mysqlTable("password_reset_tokens", {
id: int("id").autoincrement().primaryKey(),
userId: int("user_id")
.notNull()
.references(() => usersTable.id, { onDelete: "cascade" })
.unique(),
tokenHash: text("token_hash").notNull(),
expiresAt: timestamp("expires_at")
.default(sql`(CURRENT_TIMESTAMP + INTERVAL 1 HOUR)`)
.notNull(),
createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const oauthAccountsTable = mysqlTable("oauth_accounts", {
id: int("id").autoincrement().primaryKey(),
userId: int("user_id")
.notNull()
.references(() => usersTable.id, { onDelete: "cascade" }),
provider: mysqlEnum("provider", ["google", "github"]).notNull(),
providerAccountId: varchar("provider_account_id", { length: 255 })
.notNull()
.unique(),
createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const usersTable = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  name: varchar({length: 225}).notNull(),
  email: varchar({length: 225}).notNull().unique(),
  password: varchar({length: 255}),
  avatarUrl: text("avatar_url"),
  isEmailValid: boolean("is_email_valid").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(), 
});


// here we relate both tables.......
export const usersRelation = relations(usersTable, ({many}) => ({
  shortlink: many(shortLink),
  session: many(sessionsTable),
}));

// here we define a short link belongs to a user.........
export const shortLinksRelation = relations(shortLink, ({one}) => ({
  user: one(usersTable, {
    fields: [shortLink.userId],   //foreign Key
    references: [usersTable.id],
  })
}))

// here we also define the sessionTable relations.......

export const sessionsRelation = relations(sessionsTable, ({one}) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId], ////foreign Key
    references: [usersTable.id],
  })
}));