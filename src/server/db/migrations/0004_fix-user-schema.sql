DROP TABLE `users`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_block_templates` (
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
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_block_templates`("id", "name", "description", "created_by", "type", "config", "default_props", "category", "preview", "icon", "is_public", "is_system", "status", "usage_count", "created_at", "updated_at") SELECT "id", "name", "description", "created_by", "type", "config", "default_props", "category", "preview", "icon", "is_public", "is_system", "status", "usage_count", "created_at", "updated_at" FROM `block_templates`;--> statement-breakpoint
DROP TABLE `block_templates`;--> statement-breakpoint
ALTER TABLE `__new_block_templates` RENAME TO `block_templates`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_pages` (
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
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_pages`("id", "user_id", "title", "slug", "description", "content", "theme_id", "meta_title", "meta_description", "favicon", "status", "is_public", "password", "analytics_enabled", "created_at", "updated_at", "published_at") SELECT "id", "user_id", "title", "slug", "description", "content", "theme_id", "meta_title", "meta_description", "favicon", "status", "is_public", "password", "analytics_enabled", "created_at", "updated_at", "published_at" FROM `pages`;--> statement-breakpoint
DROP TABLE `pages`;--> statement-breakpoint
ALTER TABLE `__new_pages` RENAME TO `pages`;--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_unique` ON `pages` (`slug`);--> statement-breakpoint
CREATE INDEX `pages_slug_idx` ON `pages` (`slug`);--> statement-breakpoint
CREATE INDEX `pages_user_id_idx` ON `pages` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_subscriptions` (
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
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_subscriptions`("id", "user_id", "plan", "status", "stripe_customer_id", "stripe_subscription_id", "current_period_start", "current_period_end", "created_at", "updated_at") SELECT "id", "user_id", "plan", "status", "stripe_customer_id", "stripe_subscription_id", "current_period_start", "current_period_end", "created_at", "updated_at" FROM `subscriptions`;--> statement-breakpoint
DROP TABLE `subscriptions`;--> statement-breakpoint
ALTER TABLE `__new_subscriptions` RENAME TO `subscriptions`;--> statement-breakpoint
CREATE TABLE `__new_themes` (
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
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_themes`("id", "name", "description", "created_by", "config", "preview", "is_public", "is_system", "status", "created_at", "updated_at") SELECT "id", "name", "description", "created_by", "config", "preview", "is_public", "is_system", "status", "created_at", "updated_at" FROM `themes`;--> statement-breakpoint
DROP TABLE `themes`;--> statement-breakpoint
ALTER TABLE `__new_themes` RENAME TO `themes`;