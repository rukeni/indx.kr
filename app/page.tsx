import type { JSX } from 'react';

import { z } from 'zod';

import { getAllPosts } from '@internal/lib/blog';
import { columns } from '@/components/table-view/columns';
import OfflineDetector from '@/components/offline-detector';
import { tableSchema } from '@/components/table-view/schema';
import { DataTable } from '@/components/table-view/data-table';

async function getPostsAsTableData(): Promise<z.infer<typeof tableSchema>[]> {
  const posts = await getAllPosts();

  return z.array(tableSchema).parse(
    posts.map((post) => ({
      id: post.slug,
      title: post.title,
      status: post.metadata?.status || 'in progress',
      label: post.category || 'documentation',
      priority: post.metadata?.priority || 'medium',
      date: post.date,
    })),
  );
}

export default async function Home(): Promise<JSX.Element> {
  const tableData = await getPostsAsTableData();

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center px-4 py-8 sm:items-start">
      <OfflineDetector />
      <div className="my-16 w-full text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to indx.kr</h1>
        <p className="mb-8 text-xl text-gray-600">
          테크, 프로그래밍, 인생, 재테크, 내 의견들
        </p>
      </div>

      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">나의 글 목록들</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              제 생각과 고민들을 확인해보세요
            </p>
          </div>
        </div>
        <DataTable data={tableData} columns={columns} />
      </div>

      <div id="offline-message" className="hidden">
        <p className="mt-8 text-center text-red-500">
          오프라인 상태입니다. 네트워크 연결을 확인해주세요.
        </p>
      </div>
    </main>
  );
}
