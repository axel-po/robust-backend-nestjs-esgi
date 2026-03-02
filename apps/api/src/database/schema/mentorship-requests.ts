import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

export const requestStatusEnum = pgEnum('request_status', [
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'CANCELLED',
]);

export const mentorshipRequests = pgTable('mentorship_requests', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  mentorId: text('mentor_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  menteeId: text('mentee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  status: requestStatusEnum('status').notNull().default('PENDING'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type MentorshipRequest = typeof mentorshipRequests.$inferSelect;
export type NewMentorshipRequest = typeof mentorshipRequests.$inferInsert;
