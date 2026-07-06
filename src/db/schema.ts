import { pgTable, text, timestamp, boolean, integer, uuid, jsonb } from 'drizzle-orm/pg-core';

// 1. Table profiles
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  username: text('username'),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  website: text('website'),
});

// 2. Table audio_history
export const audioHistory = pgTable('audio_history', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  audioId: text('audio_id').notNull(),
  listenedAt: timestamp('listened_at', { withTimezone: true }).defaultNow(),
  duration: integer('duration'),
});

// 3. Table favorites
export const favorites = pgTable('favorites', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  itemId: text('item_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 4. Table reading_progress
export const readingProgress = pgTable('reading_progress', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  bookId: text('book_id').notNull(),
  chapterId: text('chapter_id'),
  progress: integer('progress').default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 5. Table user_settings
export const userSettings = pgTable('user_settings', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  theme: text('theme').default('light'),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  preferences: jsonb('preferences'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});