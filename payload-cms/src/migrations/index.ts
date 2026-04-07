import * as migration_20260407_132405_init from './20260407_132405_init';

export const migrations = [
  {
    up: migration_20260407_132405_init.up,
    down: migration_20260407_132405_init.down,
    name: '20260407_132405_init'
  },
];
