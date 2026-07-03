import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// 一覧サムネイル（横長切り抜き）で切り抜く位置。縦長写真で被写体が下にある場合は 'south' など
			heroImagePosition: z.string().optional(),
			heroImageLarge: z.boolean().optional(),
			heroImageCaption: z.string().optional(),
			displayTitle: z.string().optional(),
			draft: z.boolean().optional().default(false),
			tags: z.array(z.string()).optional().default([]),
		}),
});

export const collections = { blog };
