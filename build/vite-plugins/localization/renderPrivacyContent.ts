import type { LocaleMessages } from './types';

const getMessage = (messages: LocaleMessages, key: string): string => {
  const message = messages[key];
  if (typeof message !== 'string') {
    throw new Error(`Missing privacy content value: ${key}`);
  }
  return message;
};

const renderParagraphs = (messages: LocaleMessages, keys: string[]): string =>
  keys.map((key) => `<p>${getMessage(messages, key)}</p>`).join('');

const renderList = (messages: LocaleMessages, keys: string[]): string =>
  `<ol class="privacy-policy__list">${keys
    .map((key) => `<li class="privacy-policy__list-item">${getMessage(messages, key)}</li>`)
    .join('')}</ol>`;

const renderSection = (
  messages: LocaleMessages,
  sectionNumber: number,
  content: string,
): string => `
  <section class="privacy-policy__section" aria-labelledby="heading-${sectionNumber}">
    <h2 id="heading-${sectionNumber}" class="privacy-policy__section-title">${getMessage(
      messages,
      `privacy.section${sectionNumber}.title`,
    )}</h2>
    ${content}
  </section>`;

export const renderPrivacyContent = (messages: LocaleMessages): string => `
<main class="main-contents">
  <article id="privacy-policy" aria-labelledby="page-title" class="privacy-policy__content">
    <section class="privacy-policy__header">
      <h1 id="page-title" class="privacy-policy__title">${getMessage(messages, 'privacy.title')}</h1>
      <p class="privacy-policy__intro">${getMessage(messages, 'privacy.lead')}</p>
    </section>
    ${renderSection(messages, 1, renderParagraphs(messages, ['privacy.section1.body']))}
    ${renderSection(
      messages,
      2,
      `${renderList(messages, [
        'privacy.section2.item1',
        'privacy.section2.item2',
      ])}${renderParagraphs(messages, ['privacy.section2.body'])}`,
    )}
    ${renderSection(
      messages,
      3,
      `
      <h3 class="privacy-policy__sub-title">${getMessage(messages, 'privacy.section3.subsection1.title')}</h3>
      ${renderParagraphs(messages, ['privacy.section3.subsection1.body1'])}
      <p>${getMessage(messages, 'privacy.section3.subsection1.body2Prefix')}
        <a href="${getMessage(messages, 'privacy.section3.subsection1.link1Url')}" target="_blank" rel="noopener noreferrer" class="privacy-policy__link">${getMessage(messages, 'privacy.section3.subsection1.link1Label')}</a>
        ${getMessage(messages, 'privacy.section3.subsection1.body2Middle1')}
        <a href="${getMessage(messages, 'privacy.section3.subsection1.link2Url')}" target="_blank" rel="noopener noreferrer" class="privacy-policy__link">${getMessage(messages, 'privacy.section3.subsection1.link2Label')}</a>
        ${getMessage(messages, 'privacy.section3.subsection1.body2Middle2')}
        <a href="${getMessage(messages, 'privacy.section3.subsection1.link3Url')}" target="_blank" rel="noopener noreferrer" class="privacy-policy__link">${getMessage(messages, 'privacy.section3.subsection1.link3Label')}</a>
        ${getMessage(messages, 'privacy.section3.subsection1.body2Suffix')}</p>
      <h3 class="privacy-policy__sub-title">${getMessage(messages, 'privacy.section3.subsection2.title')}</h3>
      <p>${getMessage(messages, 'privacy.section3.subsection2.bodyPrefix')}
        <a href="${getMessage(messages, 'privacy.section3.subsection2.linkUrl')}" target="_blank" rel="noopener noreferrer" class="privacy-policy__link">${getMessage(messages, 'privacy.section3.subsection2.linkLabel')}</a>
        ${getMessage(messages, 'privacy.section3.subsection2.bodySuffix')}</p>`,
    )}
    ${renderSection(
      messages,
      4,
      renderList(messages, ['privacy.section4.body1', 'privacy.section4.body2']),
    )}
    ${renderSection(
      messages,
      5,
      `
      <ol class="privacy-policy__list">
        <li class="privacy-policy__list-item">${getMessage(messages, 'privacy.section5.item1')}
          <ol class="privacy-policy__list privacy-policy__list--nested">
            <li class="privacy-policy__list-item">${getMessage(messages, 'privacy.section5.item2')}</li>
            <li class="privacy-policy__list-item">${getMessage(messages, 'privacy.section5.item3')}</li>
            <li class="privacy-policy__list-item">${getMessage(messages, 'privacy.section5.item4')}</li>
            <li class="privacy-policy__list-item">${getMessage(messages, 'privacy.section5.item5')}
              ${renderList(messages, [
                'privacy.section5.item5.1',
                'privacy.section5.item5.2',
                'privacy.section5.item5.3',
                'privacy.section5.item5.4',
                'privacy.section5.item5.5',
              ])}
            </li>
          </ol>
        </li>
        <li class="privacy-policy__list-item">${getMessage(messages, 'privacy.section5.exceptionLead')}
          ${renderList(messages, [
            'privacy.section5.exception1',
            'privacy.section5.exception2',
            'privacy.section5.exception3',
          ])}
        </li>
      </ol>`,
    )}
    ${renderSection(
      messages,
      6,
      `${renderParagraphs(messages, ['privacy.section6.body1'])}${renderList(messages, [
        'privacy.section6.item1',
        'privacy.section6.item2',
        'privacy.section6.item3',
      ])}${renderParagraphs(messages, ['privacy.section6.body2'])}`,
    )}
    ${renderSection(
      messages,
      7,
      renderList(messages, [
        'privacy.section7.body1',
        'privacy.section7.body2',
        'privacy.section7.body3',
      ]),
    )}
    ${renderSection(
      messages,
      8,
      renderList(messages, [
        'privacy.section8.body1',
        'privacy.section8.body2',
        'privacy.section8.body3',
        'privacy.section8.body4',
      ]),
    )}
    ${renderSection(
      messages,
      9,
      renderList(messages, ['privacy.section9.body1', 'privacy.section9.body2']),
    )}
    ${renderSection(
      messages,
      10,
      `
      <p>${getMessage(messages, 'privacy.section10.bodyPrefix')}${getMessage(messages, 'privacy.section10.bodySuffix')}</p>
      <address class="privacy-policy__contact">
        ${getMessage(messages, 'privacy.section10.site')}<br />
        ${getMessage(messages, 'privacy.section10.operator')}<br />
        E-mail: <a href="mailto:contact@hirokiwa.com" class="privacy-policy__link">contact@hirokiwa.com</a>
      </address>`,
    )}
  </article>
</main>`;
