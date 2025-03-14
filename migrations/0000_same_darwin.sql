CREATE TABLE `country` (
	`alpha_2_code` text PRIMARY KEY NOT NULL,
	`english_short_name` text NOT NULL,
	`alpha_3_code` text NOT NULL,
	`numeric` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dev_technology` (
	`developer_id` integer NOT NULL,
	`technology_id` integer NOT NULL,
	PRIMARY KEY(`developer_id`, `technology_id`),
	FOREIGN KEY (`developer_id`) REFERENCES `dope_dev`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`technology_id`) REFERENCES `technology`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `dope_dev` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`avatar` text,
	`bio` text,
	`likes` integer,
	`country_id` text NOT NULL,
	`published` integer DEFAULT 0,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`country_id`) REFERENCES `country`(`alpha_2_code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer DEFAULT (strftime('%s', 'now')),
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `technology` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text(32) NOT NULL,
	`password` text(132) NOT NULL,
	`email` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `country_english_short_name_unique` ON `country` (`english_short_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `technology_name_unique` ON `technology` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);