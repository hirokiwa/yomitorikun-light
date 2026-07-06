import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

const padDatePart = (datePart: number): string => String(datePart).padStart(2, '0');
const sitemapUrlPattern = /<url>[\s\S]*?<\/url>/g;
const lastmodPattern = /<lastmod>[^<]*<\/lastmod>/;

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = padDatePart(date.getMonth() + 1);
  const day = padDatePart(date.getDate());
  return `${year}-${month}-${day}`;
};

const replaceUrlEntryLastmod = (urlEntry: string, date: string): string =>
  urlEntry.replace(lastmodPattern, `<lastmod>${date}</lastmod>`);

export const replaceSitemapUrlLastmodDates = (sitemapXml: string, date: string): string =>
  sitemapXml.replace(sitemapUrlPattern, (urlEntry) => replaceUrlEntryLastmod(urlEntry, date));

export const updateSitemapLastmodPlugin: Plugin = {
  name: 'update-sitemap-lastmod',
  apply: 'build',
  writeBundle: (options) => {
    if (!options.dir) {
      return;
    }

    const sitemapPath = resolve(options.dir, 'sitemap.xml');
    if (!existsSync(sitemapPath)) {
      return;
    }

    const currentDate = formatDate(new Date());
    const sitemapXml = readFileSync(sitemapPath, 'utf8');
    const updatedSitemapXml = replaceSitemapUrlLastmodDates(sitemapXml, currentDate);
    writeFileSync(sitemapPath, updatedSitemapXml, 'utf8');
  },
};
