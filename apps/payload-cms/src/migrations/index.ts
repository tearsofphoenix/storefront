import * as migration_20260407_132405_init from './20260407_132405_init';
import * as migration_20260407_143105_product_page_marketing_blocks from './20260407_143105_product_page_marketing_blocks';

export const migrations = [
  {
    up: migration_20260407_132405_init.up,
    down: migration_20260407_132405_init.down,
    name: '20260407_132405_init',
  },
  {
    up: migration_20260407_143105_product_page_marketing_blocks.up,
    down: migration_20260407_143105_product_page_marketing_blocks.down,
    name: '20260407_143105_product_page_marketing_blocks'
  },
];
