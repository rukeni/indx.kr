import { z } from 'zod';

export const tableSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  date: z.string(),
});

export type TableData = z.infer<typeof tableSchema>;
