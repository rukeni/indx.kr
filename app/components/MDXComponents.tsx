import { Highlight } from 'prism-react-renderer';

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

const Pre = ({ children }: { children: React.ReactNode }) => (
  <pre className="overflow-auto p-4 rounded-lg bg-[#1b1e2b]">{children}</pre>
);

const Code = (props: any) => {
  const { children, className } = props;
  const language = className ? className.replace('language-', '') : '';

  if (!className) {
    return (
      <code className="bg-[#2a2e3f] text-[#a4b1cd] rounded px-1">
        {children}
      </code>
    );
  }

  return (
    <Highlight
      code={children as string}
      language={language as string}
      theme={nebulaTheme}
    >
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
    </Highlight>
  );
};

export const MDXComponents = {
  pre: Pre,
  code: Code,
};
