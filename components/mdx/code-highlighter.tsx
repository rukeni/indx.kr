'use client';

import type { Language } from 'prism-react-renderer';

import React from 'react';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-kotlin';
import { Highlight, Prism, type PrismTheme } from 'prism-react-renderer';

// 필요한 경우 추가 언어 지원
// 참고: https://prismjs.com/#supported-languages

// 전역 Prism 설정
if (typeof global !== 'undefined' ? global : window) {
  (typeof global !== 'undefined' ? global : window).Prism = Prism;
}

interface CodeHighlighterProps {
  code: string;
  language: string;
  theme: PrismTheme;
}

export function CodeHighlighter({
  code,
  language,
  theme,
}: CodeHighlighterProps): React.ReactElement {
  // 유효한 언어가 아닌 경우 텍스트로 대체
  const validLanguages = [
    'javascript',
    'jsx',
    'typescript',
    'tsx',
    'html',
    'css',
    'json',
    'markdown',
    'bash',
    'go',
    'kotlin',
    'ruby',
    'yaml',
    'text',
  ];
  const safeLanguage = validLanguages.includes(language)
    ? (language as Language)
    : 'text';

  return (
    <Highlight code={code} language={safeLanguage} theme={theme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className="overflow-auto p-4 rounded-lg bg-[#1b1e2b]">
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
        </pre>
      )}
    </Highlight>
  );
}
