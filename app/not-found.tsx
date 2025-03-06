import type { JSX } from 'react';

import Link from 'next/link';

export default function NotFound(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="mt-5">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
