import { NextRequest } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';

const I18nMiddleware = createI18nMiddleware({
  locales: [ 'en', 'vi', 'de' ],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewriteDefault',
});

export function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: [ '/((?!api|_next/static|_next/image|favicon.ico).*)' ],
};
