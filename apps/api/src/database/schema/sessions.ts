import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { mentorshipRequests } from './mentorship-requests';

export const sessionStatusEnum = pgEnum('session_status', [
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
]);

export const sessions = pgTable('sessions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  mentorId: text('mentor_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  menteeId: text('mentee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  requestId: text('request_id')
    .notNull()
    .unique()
    .references(() => mentorshipRequests.id, { onDelete: 'cascade' }),
  status: sessionStatusEnum('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
