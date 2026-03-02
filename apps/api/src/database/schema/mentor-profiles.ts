import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const mentorProfiles = pgTable('mentor_profiles', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  bio: text('bio').notNull().default(''),
  skills: text('skills').array().notNull().default([]),
  hourlyRate: integer('hourly_rate'),
  isAvailable: boolean('is_available').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type MentorProfile = typeof mentorProfiles.$inferSelect;
export type NewMentorProfile = typeof mentorProfiles.$inferInsert;
