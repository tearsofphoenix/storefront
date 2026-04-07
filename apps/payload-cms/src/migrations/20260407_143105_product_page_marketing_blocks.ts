import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_product_pages_blocks_commerce_callout_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_product_pages_blocks_comparison_table_rows_emphasis" AS ENUM('none', 'left', 'right');
  CREATE TABLE "product_pages_blocks_section_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"anchor_id" varchar NOT NULL
  );
  
  CREATE TABLE "product_pages_blocks_section_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_pages_blocks_commerce_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"supporting_text" varchar,
  	"image_position" "enum_product_pages_blocks_commerce_callout_image_position" DEFAULT 'right',
  	"show_image" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_pages_blocks_comparison_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL,
  	"left_value" varchar NOT NULL,
  	"right_value" varchar NOT NULL,
  	"emphasis" "enum_product_pages_blocks_comparison_table_rows_emphasis" DEFAULT 'none'
  );
  
  CREATE TABLE "product_pages_blocks_comparison_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"left_column_label" varchar NOT NULL,
  	"right_column_label" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_pages_blocks_quote_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"quote" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"role" varchar,
  	"avatar_id" integer,
  	"highlight" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "product_pages_blocks_hero" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "product_pages_blocks_feature_grid" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "product_pages_blocks_media_story" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "product_pages_blocks_spec_table" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "product_pages_blocks_faq" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "product_pages_blocks_cta" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_hero" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_feature_grid" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_media_story" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_spec_table" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_faq" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "landing_pages_blocks_cta" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "product_pages_blocks_section_nav_items" ADD CONSTRAINT "product_pages_blocks_section_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages_blocks_section_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_section_nav" ADD CONSTRAINT "product_pages_blocks_section_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_commerce_callout" ADD CONSTRAINT "product_pages_blocks_commerce_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_comparison_table_rows" ADD CONSTRAINT "product_pages_blocks_comparison_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages_blocks_comparison_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_comparison_table" ADD CONSTRAINT "product_pages_blocks_comparison_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_quote_showcase" ADD CONSTRAINT "product_pages_blocks_quote_showcase_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_quote_showcase" ADD CONSTRAINT "product_pages_blocks_quote_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "product_pages_blocks_section_nav_items_order_idx" ON "product_pages_blocks_section_nav_items" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_section_nav_items_parent_id_idx" ON "product_pages_blocks_section_nav_items" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_section_nav_order_idx" ON "product_pages_blocks_section_nav" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_section_nav_parent_id_idx" ON "product_pages_blocks_section_nav" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_section_nav_path_idx" ON "product_pages_blocks_section_nav" USING btree ("_path");
  CREATE INDEX "product_pages_blocks_commerce_callout_order_idx" ON "product_pages_blocks_commerce_callout" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_commerce_callout_parent_id_idx" ON "product_pages_blocks_commerce_callout" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_commerce_callout_path_idx" ON "product_pages_blocks_commerce_callout" USING btree ("_path");
  CREATE INDEX "product_pages_blocks_comparison_table_rows_order_idx" ON "product_pages_blocks_comparison_table_rows" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_comparison_table_rows_parent_id_idx" ON "product_pages_blocks_comparison_table_rows" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_comparison_table_order_idx" ON "product_pages_blocks_comparison_table" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_comparison_table_parent_id_idx" ON "product_pages_blocks_comparison_table" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_comparison_table_path_idx" ON "product_pages_blocks_comparison_table" USING btree ("_path");
  CREATE INDEX "product_pages_blocks_quote_showcase_order_idx" ON "product_pages_blocks_quote_showcase" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_quote_showcase_parent_id_idx" ON "product_pages_blocks_quote_showcase" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_quote_showcase_path_idx" ON "product_pages_blocks_quote_showcase" USING btree ("_path");
  CREATE INDEX "product_pages_blocks_quote_showcase_avatar_idx" ON "product_pages_blocks_quote_showcase" USING btree ("avatar_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "product_pages_blocks_section_nav_items" CASCADE;
  DROP TABLE "product_pages_blocks_section_nav" CASCADE;
  DROP TABLE "product_pages_blocks_commerce_callout" CASCADE;
  DROP TABLE "product_pages_blocks_comparison_table_rows" CASCADE;
  DROP TABLE "product_pages_blocks_comparison_table" CASCADE;
  DROP TABLE "product_pages_blocks_quote_showcase" CASCADE;
  ALTER TABLE "product_pages_blocks_hero" DROP COLUMN "anchor_id";
  ALTER TABLE "product_pages_blocks_feature_grid" DROP COLUMN "anchor_id";
  ALTER TABLE "product_pages_blocks_media_story" DROP COLUMN "anchor_id";
  ALTER TABLE "product_pages_blocks_spec_table" DROP COLUMN "anchor_id";
  ALTER TABLE "product_pages_blocks_faq" DROP COLUMN "anchor_id";
  ALTER TABLE "product_pages_blocks_cta" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_hero" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_feature_grid" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_media_story" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_spec_table" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_faq" DROP COLUMN "anchor_id";
  ALTER TABLE "landing_pages_blocks_cta" DROP COLUMN "anchor_id";
  DROP TYPE "public"."enum_product_pages_blocks_commerce_callout_image_position";
  DROP TYPE "public"."enum_product_pages_blocks_comparison_table_rows_emphasis";`)
}
