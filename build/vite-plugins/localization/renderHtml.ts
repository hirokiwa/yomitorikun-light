import type { LocaleDefinition } from './types';
import { renderPrivacyContent } from './renderPrivacyContent';

const placeholderPattern = /\{\{([^}]+)\}\}/g;

export const renderLocalizedHtml = (
  templateHtml: string,
  localeDefinition: LocaleDefinition,
): string => {
  const localizedTemplate = templateHtml.replace(
    placeholderPattern,
    (_, placeholderName: string) => {
      const resolvedValue = localeDefinition.messages[placeholderName];

      if (typeof resolvedValue !== 'string') {
        throw new Error(`Missing localized template value: ${placeholderName}`);
      }

      return resolvedValue;
    },
  );
  const contentLocalizedTemplate =
    localeDefinition.code === 'en' && localeDefinition.pageId === 'privacy'
      ? localizedTemplate.replace(
          /<main class="main-contents">[\s\S]*?<\/main>/,
          renderPrivacyContent(localeDefinition.messages),
        )
      : localizedTemplate;
  const sourceMessages = localeDefinition.sourceMessages;

  if (!sourceMessages) {
    return contentLocalizedTemplate;
  }

  const translatedTemplate = Object.entries(sourceMessages)
    .filter(
      ([key, sourceValue]) =>
        sourceValue !== localeDefinition.messages[key] &&
        sourceValue.length > 1 &&
        /[ぁ-んァ-ン一-龯]/.test(sourceValue) &&
        typeof localeDefinition.messages[key] === 'string',
    )
    .sort(([, firstValue], [, secondValue]) => secondValue.length - firstValue.length)
    .reduce(
      (translatedHtml, [key, sourceValue]) =>
        translatedHtml.split(sourceValue).join(localeDefinition.messages[key]),
      contentLocalizedTemplate,
    );

  return translatedTemplate;
};
