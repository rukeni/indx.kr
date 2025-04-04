import { Feed } from 'feed';

import { getAllPosts } from '@/lib/blog';

export async function GET() {
  const posts = await getAllPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indx.kr';

  const feed = new Feed({
    title: 'indx.kr',
    description: 'indx.kr 블로그의 RSS 피드',
    id: siteUrl,
    link: siteUrl,
    language: 'ko',
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, indx.kr`,
    author: {
      name: 'indx.kr',
      email: 'contact@indx.kr',
      link: siteUrl,
    },
  });

  posts.forEach((post) => {
    const url = `${siteUrl}/blog/${post.category}/${post.slug}`;

    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description,
      content: post.content,
      author: [
        {
          name: 'indx.kr',
          email: 'contact@indx.kr',
          link: siteUrl,
        },
      ],
      date: new Date(post.date),
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
