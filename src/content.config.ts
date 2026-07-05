import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				// Which Tier0 editions a page applies to. Omit on
				// edition-agnostic pages (concepts, landing).
				editions: z.array(z.enum(['edge', 'cloud', 'enterprise'])).optional(),
			}),
		}),
	}),
};
