import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "product_pages_blocks_benefit_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "product_pages_blocks_benefit_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_pages_blocks_stat_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "product_pages_blocks_stat_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_pages_blocks_product_shelf_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_handle" varchar NOT NULL,
  	"badge" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "product_pages_blocks_product_shelf" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_pages_blocks_bundle_grid_bundles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_handle" varchar NOT NULL,
  	"badge" varchar,
  	"highlight" varchar,
  	"description" varchar,
  	"cta_label" varchar
  );
  
  CREATE TABLE "product_pages_blocks_bundle_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_pages_blocks_faq_groups_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "product_pages_blocks_faq_groups_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "product_pages_blocks_faq_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "product_pages_blocks_benefit_strip_items" ADD CONSTRAINT "product_pages_blocks_benefit_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages_blocks_benefit_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_benefit_strip" ADD CONSTRAINT "product_pages_blocks_benefit_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_stat_strip_items" ADD CONSTRAINT "product_pages_blocks_stat_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages_blocks_stat_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_stat_strip" ADD CONSTRAINT "product_pages_blocks_stat_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_product_shelf_items" ADD CONSTRAINT "product_pages_blocks_product_shelf_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages_blocks_product_shelf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_product_shelf" ADD CONSTRAINT "product_pages_blocks_product_shelf_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_bundle_grid_bundles" ADD CONSTRAINT "product_pages_blocks_bundle_grid_bundles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages_blocks_bundle_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_bundle_grid" ADD CONSTRAINT "product_pages_blocks_bundle_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_faq_groups_groups_items" ADD CONSTRAINT "product_pages_blocks_faq_groups_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages_blocks_faq_groups_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_faq_groups_groups" ADD CONSTRAINT "product_pages_blocks_faq_groups_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages_blocks_faq_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_pages_blocks_faq_groups" ADD CONSTRAINT "product_pages_blocks_faq_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "product_pages_blocks_benefit_strip_items_order_idx" ON "product_pages_blocks_benefit_strip_items" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_benefit_strip_items_parent_id_idx" ON "product_pages_blocks_benefit_strip_items" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_benefit_strip_order_idx" ON "product_pages_blocks_benefit_strip" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_benefit_strip_parent_id_idx" ON "product_pages_blocks_benefit_strip" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_benefit_strip_path_idx" ON "product_pages_blocks_benefit_strip" USING btree ("_path");
  CREATE INDEX "product_pages_blocks_stat_strip_items_order_idx" ON "product_pages_blocks_stat_strip_items" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_stat_strip_items_parent_id_idx" ON "product_pages_blocks_stat_strip_items" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_stat_strip_order_idx" ON "product_pages_blocks_stat_strip" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_stat_strip_parent_id_idx" ON "product_pages_blocks_stat_strip" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_stat_strip_path_idx" ON "product_pages_blocks_stat_strip" USING btree ("_path");
  CREATE INDEX "product_pages_blocks_product_shelf_items_order_idx" ON "product_pages_blocks_product_shelf_items" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_product_shelf_items_parent_id_idx" ON "product_pages_blocks_product_shelf_items" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_product_shelf_order_idx" ON "product_pages_blocks_product_shelf" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_product_shelf_parent_id_idx" ON "product_pages_blocks_product_shelf" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_product_shelf_path_idx" ON "product_pages_blocks_product_shelf" USING btree ("_path");
  CREATE INDEX "product_pages_blocks_bundle_grid_bundles_order_idx" ON "product_pages_blocks_bundle_grid_bundles" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_bundle_grid_bundles_parent_id_idx" ON "product_pages_blocks_bundle_grid_bundles" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_bundle_grid_order_idx" ON "product_pages_blocks_bundle_grid" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_bundle_grid_parent_id_idx" ON "product_pages_blocks_bundle_grid" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_bundle_grid_path_idx" ON "product_pages_blocks_bundle_grid" USING btree ("_path");
  CREATE INDEX "product_pages_blocks_faq_groups_groups_items_order_idx" ON "product_pages_blocks_faq_groups_groups_items" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_faq_groups_groups_items_parent_id_idx" ON "product_pages_blocks_faq_groups_groups_items" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_faq_groups_groups_order_idx" ON "product_pages_blocks_faq_groups_groups" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_faq_groups_groups_parent_id_idx" ON "product_pages_blocks_faq_groups_groups" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_faq_groups_order_idx" ON "product_pages_blocks_faq_groups" USING btree ("_order");
  CREATE INDEX "product_pages_blocks_faq_groups_parent_id_idx" ON "product_pages_blocks_faq_groups" USING btree ("_parent_id");
  CREATE INDEX "product_pages_blocks_faq_groups_path_idx" ON "product_pages_blocks_faq_groups" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "product_pages_blocks_benefit_strip_items" CASCADE;
  DROP TABLE "product_pages_blocks_benefit_strip" CASCADE;
  DROP TABLE "product_pages_blocks_stat_strip_items" CASCADE;
  DROP TABLE "product_pages_blocks_stat_strip" CASCADE;
  DROP TABLE "product_pages_blocks_product_shelf_items" CASCADE;
  DROP TABLE "product_pages_blocks_product_shelf" CASCADE;
  DROP TABLE "product_pages_blocks_bundle_grid_bundles" CASCADE;
  DROP TABLE "product_pages_blocks_bundle_grid" CASCADE;
  DROP TABLE "product_pages_blocks_faq_groups_groups_items" CASCADE;
  DROP TABLE "product_pages_blocks_faq_groups_groups" CASCADE;
  DROP TABLE "product_pages_blocks_faq_groups" CASCADE;`)
}
