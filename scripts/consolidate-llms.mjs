// Post-build: keep the AI-friendly llms.txt index and preserve the generated
// small/full variants. External AI crawlers can start at /llms.txt and fetch
// /llms-full.txt only when they need the full documentation body.
import { access } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);

await Promise.all(
	['llms.txt', 'llms-small.txt', 'llms-full.txt'].map((file) => access(new URL(file, dist))),
);

console.log('llms: kept llms.txt index plus llms-small.txt and llms-full.txt');
