declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  interface PWAOptions {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    runtimeCaching?: Array<{
      urlPattern: RegExp;
      handler: string;
      options?: {
        cacheName?: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
        };
        networkTimeoutSeconds?: number;
        backgroundSync?: {
          name: string;
          options?: {
            maxRetentionTime?: number;
          };
        };
        cacheableResponse?: {
          statuses: number[];
          headers: Record<string, string>;
        };
        fetchOptions?: Record<string, any>;
        matchOptions?: Record<string, any>;
      };
    }>;
    buildExcludes?: Array<string | RegExp>;
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
    fallbacks?: {
      document?: string;
      image?: string;
      font?: string;
      audio?: string;
      video?: string;
    };
  }

  export default function withPWA(
    options?: PWAOptions,
  ): (nextConfig: NextConfig) => NextConfig;
}
