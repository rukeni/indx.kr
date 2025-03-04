import type { JSX } from 'react';
import type { ImageProps } from 'next/image';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const nebulaTheme = {
  plain: {
    color: '#a4b1cd',
    backgroundColor: '#1b1e2b',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#6e7a94' },
    },
    {
      types: ['punctuation'],
      style: { color: '#a4b1cd' },
    },
    {
      types: ['property', 'tag', 'constant', 'symbol', 'deleted'],
      style: { color: '#ff7edb' },
    },
    {
      types: ['boolean', 'number'],
      style: { color: '#ffb86c' },
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: { color: '#72f1b8' },
    },
    {
      types: ['operator', 'entity', 'url', 'variable'],
      style: { color: '#ff7edb' },
    },
    {
      types: ['atrule', 'attr-value', 'function', 'class-name'],
      style: { color: '#36f9f6' },
    },
    {
      types: ['keyword'],
      style: { color: '#fede5d' },
    },
    {
      types: ['regex', 'important'],
      style: { color: '#ff7edb' },
    },
  ],
};

const Pre = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <pre className="overflow-auto p-4 rounded-lg bg-[#1b1e2b]">{children}</pre>
);

// 코드 하이라이팅 컴포넌트를 동적으로 임포트
const DynamicHighlight = dynamic(
  () => import('prism-react-renderer').then((mod) => mod.Highlight),
  {
    loading: () => (
      <div className="bg-[#1b1e2b] p-4 rounded-lg animate-pulse h-24"></div>
    ),
    ssr: true,
  },
);

interface CodeProps {
  children: string;
  className?: string;
}

const Code = ({ children, className }: CodeProps): JSX.Element => {
  const language = className ? className.replace('language-', '') : '';

  if (!className) {
    return (
      <code className="bg-[#2a2e3f] text-[#a4b1cd] rounded px-1">
        {children}
      </code>
    );
  }

  return (
    <DynamicHighlight code={children} language={language} theme={nebulaTheme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre>
          <code
            className={className}
            style={{ ...style, backgroundColor: 'transparent' }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </code>
        </Pre>
      )}
    </DynamicHighlight>
  );
};

export const MDXComponents = {
  pre: Pre,
  code: Code,
  Image: (props: ImageProps): JSX.Element => (
    <Image
      {...props}
      alt={props.alt || ''}
      className="rounded-lg"
      loading="lazy"
    />
  ),
  a: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }): JSX.Element => {
    if (href.startsWith('http')) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className="text-primary hover:underline">
        {children}
      </Link>
    );
  },
  h1: ({ children }: { children: React.ReactNode }): JSX.Element => {
    const id =
      typeof children === 'string'
        ? children
            .toLowerCase()
            .replace(/[^\w\s가-힣]/g, '')
            .replace(/\s+/g, '-')
        : '';

    return (
      <h1 id={id} className="scroll-mt-20">
        {children}
      </h1>
    );
  },
  h2: ({ children }: { children: React.ReactNode }): JSX.Element => {
    const id =
      typeof children === 'string'
        ? children
            .toLowerCase()
            .replace(/[^\w\s가-힣]/g, '')
            .replace(/\s+/g, '-')
        : '';

    return (
      <h2 id={id} className="scroll-mt-20">
        {children}
      </h2>
    );
  },
  h3: ({ children }: { children: React.ReactNode }): JSX.Element => {
    const id =
      typeof children === 'string'
        ? children
            .toLowerCase()
            .replace(/[^\w\s가-힣]/g, '')
            .replace(/\s+/g, '-')
        : '';

    return (
      <h3 id={id} className="scroll-mt-20">
        {children}
      </h3>
    );
  },
  h4: ({ children }: { children: React.ReactNode }): JSX.Element => {
    const id =
      typeof children === 'string'
        ? children
            .toLowerCase()
            .replace(/[^\w\s가-힣]/g, '')
            .replace(/\s+/g, '-')
        : '';

    return (
      <h4 id={id} className="scroll-mt-20">
        {children}
      </h4>
    );
  },
  h5: ({ children }: { children: React.ReactNode }): JSX.Element => {
    const id =
      typeof children === 'string'
        ? children
            .toLowerCase()
            .replace(/[^\w\s가-힣]/g, '')
            .replace(/\s+/g, '-')
        : '';

    return (
      <h5 id={id} className="scroll-mt-20">
        {children}
      </h5>
    );
  },
  h6: ({ children }: { children: React.ReactNode }): JSX.Element => {
    const id =
      typeof children === 'string'
        ? children
            .toLowerCase()
            .replace(/[^\w\s가-힣]/g, '')
            .replace(/\s+/g, '-')
        : '';

    return (
      <h6 id={id} className="scroll-mt-20">
        {children}
      </h6>
    );
  },
};
