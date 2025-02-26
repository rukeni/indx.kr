import { z } from 'zod';

export const tableSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  slug: z.string(),
  koreanSlug: z.string().optional(),
  date: z.string(),
  tags: z.array(z.string()).optional(),
  readingTime: z.number().optional(),
  series: z.string().optional().nullable(),
});

export type TableData = z.infer<typeof tableSchema>;
