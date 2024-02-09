import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const technology = sqliteTable('technology', {
	id: text('id').primaryKey(),
	name: text('name').unique().notNull(),
});
export const insert_technology_schema =
	createInsertSchema(technology);
export const select_technology_schema =
	createSelectSchema(technology);
