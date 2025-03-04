import type { JSX } from 'react';

import { z } from 'zod';

import { getAllPosts } from '@internal/lib/blog';
import { columns } from '@/components/table-view/columns';
import { tableSchema } from '@/components/table-view/schema';
import { DataTable } from '@/components/table-view/data-table';

async function getPostsAsTableData(): Promise<z.infer<typeof tableSchema>[]> {
  const posts = await getAllPosts();

  return z.array(tableSchema).parse(
    posts.map((post) => ({
      id: post.slug,
      title: post.title,
      description: post.description,
      category: post.category,
      slug: post.slug,
      koreanSlug: post.koreanSlug,
      date: post.date,
      tags: post.tags || [],
      readingTime: post.readingTime || 5,
      series: post.series || undefined,
    })),
  );
}

export default async function Home(): Promise<JSX.Element> {
  const posts = await getPostsAsTableData();

  return (
    <main className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-1">인덱스 블로그</h1>
      <p className="text-muted-foreground mb-2">
        다양한 생각들을 최대한 단순화하여 이해하기 쉽게 기록합니다.
      </p>
      <p className="text-sm text-muted-foreground mb-6 italic">
        단순함이 궁극의 정교함이다
      </p>
      <DataTable columns={columns} data={posts} />
    </main>
  );
}
