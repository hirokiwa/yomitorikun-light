export type LocaleCode = 'ja' | 'en';

export type PageId = 'home' | 'contact' | 'privacy' | 'notFound';

export type LocaleMessages = Record<string, string>;

export type LocaleDefinition = {
  code: LocaleCode;
  htmlLang: LocaleCode;
  outputPath: string;
  pagePath: string;
  pageId: PageId;
  templatePath: string;
  messages: LocaleMessages;
  sourceMessages?: LocaleMessages;
};
