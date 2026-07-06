// Post-build: keep a single /llms.txt containing the full docs.
// starlight-llms-txt always emits llms.txt (index) + llms-small.txt +
// llms-full.txt with no option to disable the variants, so we replace
// the index with the full content and drop the extras.
import { copyFile, rm } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);

await copyFile(new URL('llms-full.txt', dist), new URL('llms.txt', dist));
await rm(new URL('llms-full.txt', dist));
await rm(new URL('llms-small.txt', dist));
await rm(new URL('_llms-txt/', dist), { recursive: true, force: true });

console.log('llms: consolidated to a single llms.txt (full content)');
