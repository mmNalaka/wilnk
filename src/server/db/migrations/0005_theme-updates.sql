PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_themes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_by` text,
	`config` text DEFAULT '{}' NOT NULL,
	`is_system` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_themes`("id", "name", "description", "created_by", "config", "is_system", "status", "created_at", "updated_at") SELECT "id", "name", "description", "created_by", "config", "is_system", "status", "created_at", "updated_at" FROM `themes`;--> statement-breakpoint
DROP TABLE `themes`;--> statement-breakpoint
ALTER TABLE `__new_themes` RENAME TO `themes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;