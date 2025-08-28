PRAGMA foreign_keys=OFF;--> statement-breakpoint
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
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_pages`("id", "user_id", "title", "slug", "description", "content", "theme_id", "meta_title", "meta_description", "favicon", "status", "is_public", "password", "analytics_enabled", "created_at", "updated_at", "published_at") SELECT "id", "user_id", "title", "slug", "description", "content", "theme_id", "meta_title", "meta_description", "favicon", "status", "is_public", "password", "analytics_enabled", "created_at", "updated_at", "published_at" FROM `pages`;--> statement-breakpoint
DROP TABLE `pages`;--> statement-breakpoint
ALTER TABLE `__new_pages` RENAME TO `pages`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_unique` ON `pages` (`slug`);--> statement-breakpoint
CREATE INDEX `pages_slug_idx` ON `pages` (`slug`);--> statement-breakpoint
CREATE INDEX `pages_user_id_idx` ON `pages` (`user_id`);