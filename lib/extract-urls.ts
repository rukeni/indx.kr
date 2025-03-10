/**
 * URL을 추출하고 정제하는 유틸리티 함수
 */

/**
 * 기본 URL 정규표현식 패턴
 * HTTP/HTTPS URL을 감지합니다.
 */
const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

/**
 * URL을 정제하는 함수
 * URL 끝에 있는 괄호나 특수문자를 제거합니다.
 */
function cleanUrl(url: string): string {
  // 마크다운 링크 형식에서 URL 끝에 붙은 괄호 제거
  let cleanedUrl = url;

  // 끝에 있는 괄호, 쉼표, 세미콜론, 따옴표 등 제거
  const invalidEndChars = [',', ';', ')', ']', '}', '"', "'", '`'];

  // 끝에서부터 유효하지 않은 문자가 있는지 확인하고 제거
  while (
    cleanedUrl.length > 0 &&
    invalidEndChars.includes(cleanedUrl[cleanedUrl.length - 1])
  ) {
    cleanedUrl = cleanedUrl.slice(0, -1);
  }

  return cleanedUrl;
}

/**
 * 텍스트에서 모든 URL을 추출하는 함수
 * @param text 분석할 텍스트
 * @returns 추출된 URL 배열 (중복 제거 및 정제됨)
 */
export function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX);

  if (!matches) return [];

  // URL 정제 및 중복 제거
  const cleanedUrls = matches.map(cleanUrl);

  return Array.from(new Set(cleanedUrls));
}

/**
 * 마크다운 텍스트에서 URL을 추출하는 함수
 * 마크다운 링크 형식 [텍스트](URL)에서 URL만 추출합니다.
 */
export function extractUrlsFromMarkdown(markdown: string): string[] {
  // 마크다운 링크 패턴: [텍스트](URL)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const urls: string[] = [];

  // 마크다운 링크에서 URL 추출
  let match;

  while ((match = markdownLinkRegex.exec(markdown)) !== null) {
    if (match[2] && match[2].startsWith('http')) {
      urls.push(cleanUrl(match[2]));
    }
  }

  // 일반 URL도 추출
  const plainUrls = extractUrls(markdown);

  // 모든 URL 합치기 및 중복 제거
  return Array.from(new Set([...urls, ...plainUrls]));
}
