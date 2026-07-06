import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { LocaleCode, LocaleDefinition, LocaleMessages, PageId } from './types';

const localeDirectoryPath = path.resolve(process.cwd(), 'src/i18n');
const localeCodes: LocaleCode[] = ['ja', 'en'];

const localeFilePaths = {
  common: { ja: 'common/ja.json', en: 'common/en.json' },
  home: { ja: 'pages/home/ja.json', en: 'pages/home/en.json' },
  contact: { ja: 'pages/contact/ja.json', en: 'pages/contact/en.json' },
  privacy: { ja: 'pages/privacy/ja.json', en: 'pages/privacy/en.json' },
  notFound: { ja: 'pages/notFound/ja.json', en: 'pages/notFound/en.json' },
} as const satisfies Record<PageId | 'common', Record<LocaleCode, string>>;

const localizedPages = [
  {
    pageId: 'home',
    templatePath: 'index.html',
    locales: {
      ja: { pagePath: '/', outputPath: 'index.html' },
      en: { pagePath: '/en/', outputPath: 'en/index.html' },
    },
  },
  {
    pageId: 'contact',
    templatePath: 'contact.html',
    locales: {
      ja: { pagePath: '/contact/', outputPath: 'contact.html' },
      en: { pagePath: '/en/contact/', outputPath: 'en/contact.html' },
    },
  },
  {
    pageId: 'privacy',
    templatePath: 'privacy.html',
    locales: {
      ja: { pagePath: '/privacy/', outputPath: 'privacy.html' },
      en: { pagePath: '/en/privacy/', outputPath: 'en/privacy.html' },
    },
  },
  {
    pageId: 'notFound',
    templatePath: '404.html',
    locales: {
      ja: { pagePath: '/404/', outputPath: '404.html' },
      en: { pagePath: '/en/404/', outputPath: 'en/404.html' },
    },
  },
] as const satisfies ReadonlyArray<{
  pageId: PageId;
  templatePath: string;
  locales: Record<LocaleCode, { pagePath: string; outputPath: string }>;
}>;

const mergeLocaleMessages = (
  commonMessages: LocaleMessages,
  pageMessages: LocaleMessages,
): LocaleMessages => ({ ...commonMessages, ...pageMessages });

const getUniqueMessageCharacters = (messages: LocaleMessages): string =>
  [...new Set(Object.values(messages).join('').replace(/\s/g, ''))].join('');

const createGoogleFontsStylesheetUrl = (messages: LocaleMessages): string => {
  const characters = encodeURIComponent(getUniqueMessageCharacters(messages));
  return `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@450&amp;display=swap&amp;text=${characters}`;
};

const addGoogleFontsStylesheetUrl = (messages: LocaleMessages): LocaleMessages => ({
  ...messages,
  'fonts.stylesheetUrl': createGoogleFontsStylesheetUrl(messages),
});

const readLocaleMessages = async (
  messageScope: keyof typeof localeFilePaths,
  localeCode: LocaleCode,
): Promise<LocaleMessages> => {
  const localeFilePath = path.join(localeDirectoryPath, localeFilePaths[messageScope][localeCode]);
  return JSON.parse(await readFile(localeFilePath, 'utf8')) as LocaleMessages;
};

export const loadLocaleDefinitions = async (): Promise<LocaleDefinition[]> => {
  const commonEntries = await Promise.all(
    localeCodes.map(
      async (localeCode) => [localeCode, await readLocaleMessages('common', localeCode)] as const,
    ),
  );
  const commonMessages = Object.fromEntries(commonEntries) as Record<LocaleCode, LocaleMessages>;

  return Promise.all(
    localizedPages.flatMap((page) =>
      localeCodes.map(async (localeCode) => {
        const pageMessages = await readLocaleMessages(page.pageId, localeCode);
        const mergedMessages = mergeLocaleMessages(commonMessages[localeCode], pageMessages);
        const sourceMessages =
          localeCode === 'en'
            ? mergeLocaleMessages(commonMessages.ja, await readLocaleMessages(page.pageId, 'ja'))
            : undefined;
        return {
          code: localeCode,
          htmlLang: localeCode,
          outputPath: page.locales[localeCode].outputPath,
          pagePath: page.locales[localeCode].pagePath,
          pageId: page.pageId,
          templatePath: page.templatePath,
          messages: addGoogleFontsStylesheetUrl(mergedMessages),
          sourceMessages,
        };
      }),
    ),
  );
};
