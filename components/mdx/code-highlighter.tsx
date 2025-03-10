'use client';

import { Highlight, Language, Prism } from 'prism-react-renderer';

// 필요한 경우 추가 언어 지원
// 참고: https://prismjs.com/#supported-languages
(typeof global !== 'undefined' ? global : window).Prism = Prism;
require('prismjs/components/prism-kotlin');
require('prismjs/components/prism-ruby');
require('prismjs/components/prism-go');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-yaml');

interface CodeHighlighterProps {
  code: string;
  language: string;
  theme: any;
}

export function CodeHighlighter({
  code,
  language,
  theme,
}: CodeHighlighterProps) {
  // 유효한 언어가 아닌 경우 텍스트로 대체
  const safeLanguage = Object.values(Language).includes(language as Language)
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
