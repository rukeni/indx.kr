import type { JSX } from 'react';
import type { ImageProps } from 'next/image';

import Link from 'next/link';
import Image from 'next/image';
import { Highlight } from 'prism-react-renderer';

// 복사 버튼 컴포넌트 추가
import { CopyButton } from './ui/copy-button';

// 테마 정의
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

// 코드 블록 래퍼 컴포넌트
const Pre = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <pre className="overflow-auto p-4 rounded-lg bg-[#1b1e2b] relative">
    {children}
  </pre>
);

// 코드 컴포넌트 인터페이스
interface CodeProps {
  children: string;
  className?: string;
}

// 코드 컴포넌트 - 서버 컴포넌트로 유지
const Code = ({ children, className }: CodeProps): JSX.Element => {
  // 언어 추출
  const rawLanguage = className ? className.replace(/language-/, '') : '';

  // 인라인 코드
  if (!className) {
    return (
      <code className="bg-[#2a2e3f] text-[#a4b1cd] rounded px-1">
        {children}
      </code>
    );
  }

  // 코드 블록
  return (
    <div className="relative">
      <Highlight
        code={children}
        language={rawLanguage || 'text'}
        theme={nebulaTheme}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Pre>
            <CopyButton text={children} />
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
      </Highlight>
    </div>
  );
};

// MDX 컴포넌트 정의
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
          data-external-link="true"
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
  // MDX 콘텐츠 래퍼 - 서버 컴포넌트로 유지
  wrapper: ({
    children,
  }: {
    children: React.ReactNode;
  }): React.ReactElement => {
    return <>{children}</>;
  },
};
