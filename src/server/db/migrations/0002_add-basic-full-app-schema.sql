CREATE TABLE `block_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_by` text,
	`type` text NOT NULL,
	`config` text NOT NULL,
	`default_props` text DEFAULT '{}' NOT NULL,
	`category` text DEFAULT 'custom' NOT NULL,
	`preview` text,
	`icon` text,
	`is_public` integer DEFAULT false NOT NULL,
	`is_system` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`usage_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `click_events` (
	`id` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`block_id` text,
	`block_type` text,
	`url` text,
	`label` text,
	`visitor_id` text,
	`session_id` text,
	`country` text,
	`city` text,
	`user_agent` text,
	`device_type` text,
	`browser` text,
	`referrer` text,
	`clicked_at` integer NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `click_events_page_id_idx` ON `click_events` (`page_id`);--> statement-breakpoint
CREATE INDEX `click_events_clicked_at_idx` ON `click_events` (`clicked_at`);--> statement-breakpoint
CREATE TABLE `page_analytics` (
	`id` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`date` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`unique_views` integer DEFAULT 0 NOT NULL,
	`total_clicks` integer DEFAULT 0 NOT NULL,
	`top_countries` text DEFAULT '[]',
	`top_cities` text DEFAULT '[]',
	`device_types` text DEFAULT '{}',
	`browsers` text DEFAULT '{}',
	`top_referrers` text DEFAULT '[]',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `page_analytics_page_id_date_idx` ON `page_analytics` (`page_id`,`date`);--> statement-breakpoint
CREATE TABLE `page_views` (
	`id` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`visitor_id` text,
	`session_id` text,
	`country` text,
	`city` text,
	`user_agent` text,
	`device_type` text,
	`browser` text,
	`referrer` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`duration` integer,
	`viewed_at` integer NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `page_views_page_id_idx` ON `page_views` (`page_id`);--> statement-breakpoint
CREATE INDEX `page_views_viewed_at_idx` ON `page_views` (`viewed_at`);--> statement-breakpoint
CREATE TABLE `pages` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`content` text DEFAULT '{}' NOT NULL,
	`theme_id` text,
	`meta_title` text,
	`meta_description` text,
	`favicon` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`is_public` integer DEFAULT true NOT NULL,
	`password` text,
	`analytics_enabled` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`published_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_unique` ON `pages` (`slug`);--> statement-breakpoint
CREATE INDEX `pages_slug_idx` ON `pages` (`slug`);--> statement-breakpoint
CREATE INDEX `pages_user_id_idx` ON `pages` (`user_id`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`plan` text NOT NULL,
	`status` text NOT NULL,
	`stripe_customer_id` text,
	`stripe_subscription_id` text,
	`current_period_start` integer,
	`current_period_end` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `themes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_by` text,
	`config` text DEFAULT '{}' NOT NULL,
	`preview` text,
	`is_public` integer DEFAULT false NOT NULL,
	`is_system` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text,
	`display_name` text,
	`avatar` text,
	`plan` text DEFAULT 'free' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
DROP TABLE `block`;--> statement-breakpoint
DROP TABLE `page`;--> statement-breakpoint
DROP TABLE `theme`;