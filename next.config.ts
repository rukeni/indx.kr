import createMDX from '@next/mdx';
import withBundleAnalyzer from '@next/bundle-analyzer';

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// 번들 분석기 설정
const analyzeBundles = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

// 여러 플러그인 함께 적용
export default analyzeBundles(withMDX(nextConfig));
