import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_product_pages_blocks_hero_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_product_pages_blocks_media_story_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_product_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_product_pages_sync_status" AS ENUM('active', 'deleted');
  CREATE TYPE "public"."enum_landing_pages_blocks_hero_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_landing_pages_blocks_media_story_media_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_landing_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faq_items_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "product_pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar NOT NULL,
  	"subheadline" varchar,
  	"media_type" "enum_product_pages_blocks_hero_media_type" DEFAULT 'image',
  	"background_image_id" integer,
  	"background_video_id" integer,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_href" varchar,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_pages_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "product_pages_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_pages_blocks_media_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"media_position" "enum_product_pages_blocks_media_story_media_position" DEFAULT 'right',
  	"media_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_pages_blocks_spec_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "product_pages_blocks_spec_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "product_pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_href" varchar,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_product_pages_status" DEFAULT 'draft' NOT NULL,
  	"medusa_product_id" varchar NOT NULL,
  	"handle" varchar NOT NULL,
  	"sync_status" "enum_product_pages_sync_status" DEFAULT 'active' NOT NULL,
  	"medusa_summary_product_title" varchar,
  	"medusa_summary_subtitle" varchar,
  	"medusa_summary_thumbnail" varchar,
  	"medusa_summary_product_status" varchar,
  	"medusa_summary_collection_title" varchar,
  	"medusa_summary_tags" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar NOT NULL,
  	"subheadline" varchar,
  	"media_type" "enum_landing_pages_blocks_hero_media_type" DEFAULT 'image',
  	"background_image_id" integer,
  	"background_video_id" integer,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_href" varchar,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "landing_pages_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_media_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"media_position" "enum_landing_pages_blocks_media_story_media_position" DEFAULT 'right',
  	"media_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_spec_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_spec_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "landing_pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_href" varchar,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_landing_pages_status" DEFAULT 'draft' NOT NULL,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"category" varchar,
  	"product_handle" varchar,
  	"status" "enum_faq_items_status" DEFAULT 'published' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"product_pages_id" integer,
  	"landing_pages_id" integer,
  	"faq_items_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Panda AI Store',
  	"announcement_bar_enabled" boolean DEFAULT false,
  	"announcement_bar_text" varchar,
  	"announcement_bar_link_label" varchar,
  	"announcement_bar_link_href" varchar,
  	"default_seo_meta_title" varchar,
  	"default_seo_meta_description" varchar,
  	"default_seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_hero" ADD CONSTRAINT "product_pages_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_hero" ADD CONSTRAINT "product_pages_blocks_hero_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_hero" ADD CONSTRAINT "product_pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_feature_grid_items" ADD CONSTRAINT "product_pages_blocks_feature_grid_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_feature_grid_items" ADD CONSTRAINT "product_pages_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_feature_grid" ADD CONSTRAINT "product_pages_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_media_story" ADD CONSTRAINT "product_pages_blocks_media_story_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_media_story" ADD CONSTRAINT "product_pages_blocks_media_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_spec_table_rows" ADD CONSTRAINT "product_pages_blocks_spec_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages_blocks_spec_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_spec_table" ADD CONSTRAINT "product_pages_blocks_spec_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_faq_items" ADD CONSTRAINT "product_pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_faq" ADD CONSTRAINT "product_pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_cta" ADD CONSTRAINT "product_pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages" ADD CONSTRAINT "product_pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_hero" ADD CONSTRAINT "landing_pages_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_hero" ADD CONSTRAINT "landing_pages_blocks_hero_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_hero" ADD CONSTRAINT "landing_pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_feature_grid_items" ADD CONSTRAINT "landing_pages_blocks_feature_grid_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_feature_grid_items" ADD CONSTRAINT "landing_pages_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_feature_grid" ADD CONSTRAINT "landing_pages_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_media_story" ADD CONSTRAINT "landing_pages_blocks_media_story_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_media_story" ADD CONSTRAINT "landing_pages_blocks_media_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_spec_table_rows" ADD CONSTRAINT "landing_pages_blocks_spec_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_spec_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_spec_table" ADD CONSTRAINT "landing_pages_blocks_spec_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_faq_items" ADD CONSTRAINT "landing_pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_faq" ADD CONSTRAINT "landing_pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages_blocks_cta" ADD CONSTRAINT "landing_pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_pages" ADD CONSTRAINT "landing_pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_pages_fk" FOREIGN KEY ("product_pages_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_landing_pages_fk" FOREIGN KEY ("landing_pages_id") REFERENCES "public"."landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_items_fk" FOREIGN KEY ("faq_items_id") REFERENCES "public"."faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_seo_og_image_id_media_id_fk" FOREIGN KEY ("default_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "product_pages_blocks_hero_order_idx" ON "product_pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_hero_parent_id_idx" ON "product_pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_hero_path_idx" ON "product_pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "product_pages_blocks_hero_background_image_idx" ON "product_pages_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "product_pages_blocks_hero_background_video_idx" ON "product_pages_blocks_hero" USING btree ("background_video_id");
  CREATE INDEX "product_pages_blocks_feature_grid_items_order_idx" ON "product_pages_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_feature_grid_items_parent_id_idx" ON "product_pages_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_feature_grid_items_image_idx" ON "product_pages_blocks_feature_grid_items" USING btree ("image_id");
  CREATE INDEX "product_pages_blocks_feature_grid_order_idx" ON "product_pages_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_feature_grid_parent_id_idx" ON "product_pages_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_feature_grid_path_idx" ON "product_pages_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "product_pages_blocks_media_story_order_idx" ON "product_pages_blocks_media_story" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_media_story_parent_id_idx" ON "product_pages_blocks_media_story" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_media_story_path_idx" ON "product_pages_blocks_media_story" USING btree ("_path");
  CREATE INDEX "product_pages_blocks_media_story_media_idx" ON "product_pages_blocks_media_story" USING btree ("media_id");
  CREATE INDEX "product_pages_blocks_spec_table_rows_order_idx" ON "product_pages_blocks_spec_table_rows" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_spec_table_rows_parent_id_idx" ON "product_pages_blocks_spec_table_rows" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_spec_table_order_idx" ON "product_pages_blocks_spec_table" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_spec_table_parent_id_idx" ON "product_pages_blocks_spec_table" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_spec_table_path_idx" ON "product_pages_blocks_spec_table" USING btree ("_path");
  CREATE INDEX "product_pages_blocks_faq_items_order_idx" ON "product_pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_faq_items_parent_id_idx" ON "product_pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_faq_order_idx" ON "product_pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_faq_parent_id_idx" ON "product_pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_faq_path_idx" ON "product_pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "product_pages_blocks_cta_order_idx" ON "product_pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_cta_parent_id_idx" ON "product_pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_cta_path_idx" ON "product_pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "product_pages_slug_idx" ON "product_pages" USING btree ("slug");
  CREATE UNIQUE INDEX "product_pages_medusa_product_id_idx" ON "product_pages" USING btree ("medusa_product_id");
  CREATE UNIQUE INDEX "product_pages_handle_idx" ON "product_pages" USING btree ("handle");
  CREATE INDEX "product_pages_seo_seo_og_image_idx" ON "product_pages" USING btree ("seo_og_image_id");
  CREATE INDEX "product_pages_updated_at_idx" ON "product_pages" USING btree ("updated_at");
  CREATE INDEX "product_pages_created_at_idx" ON "product_pages" USING btree ("created_at");
  CREATE INDEX "landing_pages_blocks_hero_order_idx" ON "landing_pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_hero_parent_id_idx" ON "landing_pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_hero_path_idx" ON "landing_pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_hero_background_image_idx" ON "landing_pages_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "landing_pages_blocks_hero_background_video_idx" ON "landing_pages_blocks_hero" USING btree ("background_video_id");
  CREATE INDEX "landing_pages_blocks_feature_grid_items_order_idx" ON "landing_pages_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_feature_grid_items_parent_id_idx" ON "landing_pages_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_feature_grid_items_image_idx" ON "landing_pages_blocks_feature_grid_items" USING btree ("image_id");
  CREATE INDEX "landing_pages_blocks_feature_grid_order_idx" ON "landing_pages_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_feature_grid_parent_id_idx" ON "landing_pages_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_feature_grid_path_idx" ON "landing_pages_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_media_story_order_idx" ON "landing_pages_blocks_media_story" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_media_story_parent_id_idx" ON "landing_pages_blocks_media_story" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_media_story_path_idx" ON "landing_pages_blocks_media_story" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_media_story_media_idx" ON "landing_pages_blocks_media_story" USING btree ("media_id");
  CREATE INDEX "landing_pages_blocks_spec_table_rows_order_idx" ON "landing_pages_blocks_spec_table_rows" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_spec_table_rows_parent_id_idx" ON "landing_pages_blocks_spec_table_rows" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_spec_table_order_idx" ON "landing_pages_blocks_spec_table" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_spec_table_parent_id_idx" ON "landing_pages_blocks_spec_table" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_spec_table_path_idx" ON "landing_pages_blocks_spec_table" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_faq_items_order_idx" ON "landing_pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_faq_items_parent_id_idx" ON "landing_pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_faq_order_idx" ON "landing_pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_faq_parent_id_idx" ON "landing_pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_faq_path_idx" ON "landing_pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "landing_pages_blocks_cta_order_idx" ON "landing_pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "landing_pages_blocks_cta_parent_id_idx" ON "landing_pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "landing_pages_blocks_cta_path_idx" ON "landing_pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "landing_pages_slug_idx" ON "landing_pages" USING btree ("slug");
  CREATE INDEX "landing_pages_seo_seo_og_image_idx" ON "landing_pages" USING btree ("seo_og_image_id");
  CREATE INDEX "landing_pages_updated_at_idx" ON "landing_pages" USING btree ("updated_at");
  CREATE INDEX "landing_pages_created_at_idx" ON "landing_pages" USING btree ("created_at");
  CREATE INDEX "faq_items_product_handle_idx" ON "faq_items" USING btree ("product_handle");
  CREATE INDEX "faq_items_updated_at_idx" ON "faq_items" USING btree ("updated_at");
  CREATE INDEX "faq_items_created_at_idx" ON "faq_items" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_product_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("product_pages_id");
  CREATE INDEX "payload_locked_documents_rels_landing_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("landing_pages_id");
  CREATE INDEX "payload_locked_documents_rels_faq_items_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_items_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_default_seo_default_seo_og_image_idx" ON "site_settings" USING btree ("default_seo_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "product_pages_blocks_hero" CASCADE;
  DROP TABLE "product_pages_blocks_feature_grid_items" CASCADE;
  DROP TABLE "product_pages_blocks_feature_grid" CASCADE;
  DROP TABLE "product_pages_blocks_media_story" CASCADE;
  DROP TABLE "product_pages_blocks_spec_table_rows" CASCADE;
  DROP TABLE "product_pages_blocks_spec_table" CASCADE;
  DROP TABLE "product_pages_blocks_faq_items" CASCADE;
  DROP TABLE "product_pages_blocks_faq" CASCADE;
  DROP TABLE "product_pages_blocks_cta" CASCADE;
  DROP TABLE "product_pages" CASCADE;
  DROP TABLE "landing_pages_blocks_hero" CASCADE;
  DROP TABLE "landing_pages_blocks_feature_grid_items" CASCADE;
  DROP TABLE "landing_pages_blocks_feature_grid" CASCADE;
  DROP TABLE "landing_pages_blocks_media_story" CASCADE;
  DROP TABLE "landing_pages_blocks_spec_table_rows" CASCADE;
  DROP TABLE "landing_pages_blocks_spec_table" CASCADE;
  DROP TABLE "landing_pages_blocks_faq_items" CASCADE;
  DROP TABLE "landing_pages_blocks_faq" CASCADE;
  DROP TABLE "landing_pages_blocks_cta" CASCADE;
  DROP TABLE "landing_pages" CASCADE;
  DROP TABLE "faq_items" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_product_pages_blocks_hero_media_type";
  DROP TYPE "public"."enum_product_pages_blocks_media_story_media_position";
  DROP TYPE "public"."enum_product_pages_status";
  DROP TYPE "public"."enum_product_pages_sync_status";
  DROP TYPE "public"."enum_landing_pages_blocks_hero_media_type";
  DROP TYPE "public"."enum_landing_pages_blocks_media_story_media_position";
  DROP TYPE "public"."enum_landing_pages_status";
  DROP TYPE "public"."enum_faq_items_status";`)
}
