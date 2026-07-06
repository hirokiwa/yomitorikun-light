import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Connect, Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { loadLocaleDefinitions } from './locales';
import { renderLocalizedHtml } from './renderHtml';
import type { LocaleDefinition } from './types';

export const normalizeRequestPath = (requestUrl: string): string => {
  const pathname = new URL(requestUrl, 'http://localhost').pathname || '/';
  return pathname.endsWith('/') || pathname.endsWith('.html') ? pathname : `${pathname}/`;
};

export const resolveLocaleDefinition = (
  localeDefinitions: LocaleDefinition[],
  requestPath: string,
): LocaleDefinition | undefined => localeDefinitions.find(
  (localeDefinition) => localeDefinition.pagePath === requestPath,
);

const getRequestLocale = (requestPath: string): 'ja' | 'en' => (
  requestPath.startsWith('/en/') ? 'en' : 'ja'
);

const createLocalizedPageMiddleware = (
  server: ViteDevServer,
  localeDefinitionsPromise: Promise<LocaleDefinition[]>,
): Connect.NextHandleFunction => async (
  request: IncomingMessage,
  response: ServerResponse,
  next: Connect.NextFunction,
) => {
  const requestPath = normalizeRequestPath(request.url ?? '/');
  const localeDefinition = resolveLocaleDefinition(await localeDefinitionsPromise, requestPath);

  if (!localeDefinition) {
    const acceptsHtml = request.headers.accept?.includes('text/html') ?? false;
    const requestLocale = getRequestLocale(requestPath);
    const notFoundDefinition = (await localeDefinitionsPromise).find(
      ({ code, pageId }) => pageId === 'notFound' && code === requestLocale,
    );

    if (request.method === 'GET' && acceptsHtml && notFoundDefinition) {
      const templateHtml = await readFile(
        path.resolve(process.cwd(), notFoundDefinition.templatePath),
        'utf8',
      );
      const localizedHtml = renderLocalizedHtml(templateHtml, notFoundDefinition);
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(await server.transformIndexHtml(requestPath, localizedHtml));
      return;
    }

    next();
    return;
  }

  const templateHtml = await readFile(path.resolve(process.cwd(), localeDefinition.templatePath), 'utf8');
  const localizedHtml = renderLocalizedHtml(templateHtml, localeDefinition);
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.end(await server.transformIndexHtml(requestPath, localizedHtml));
};

export const createLocalizedHtmlPlugin = (): Plugin => {
  const localeDefinitionsPromise = loadLocaleDefinitions();
  const resolvedConfigState: { config?: ResolvedConfig } = {};

  return {
    name: 'localized-html-pages',
    configResolved: (config) => {
      resolvedConfigState.config = config;
    },
    configureServer: (server) => {
      server.middlewares.use(createLocalizedPageMiddleware(server, localeDefinitionsPromise));
    },
    transformIndexHtml: {
      order: 'pre',
      handler: async (html, context) => {
        if (!context.server) {
          return html;
        }

        const localeDefinitions = await localeDefinitionsPromise;
        const localeDefinition = resolveLocaleDefinition(
          localeDefinitions,
          normalizeRequestPath(context.path),
        );
        return localeDefinition ? renderLocalizedHtml(html, localeDefinition) : html;
      },
    },
    closeBundle: async () => {
      const localeDefinitions = await localeDefinitionsPromise;
      const outDirectoryPath = resolvedConfigState.config
        ? path.resolve(resolvedConfigState.config.root, resolvedConfigState.config.build.outDir)
        : path.resolve(process.cwd(), 'dist');
      const templatePaths = [...new Set(localeDefinitions.map(({ templatePath }) => templatePath))];
      const templateEntries = await Promise.all(templatePaths.map(async (templatePath) =>
        [templatePath, await readFile(path.join(outDirectoryPath, templatePath), 'utf8')] as const));
      const templates = new Map(templateEntries);

      await Promise.all(localeDefinitions.map(async (localeDefinition) => {
        const templateHtml = templates.get(localeDefinition.templatePath);
        if (!templateHtml) {
          throw new Error(`Built template HTML was not found: ${localeDefinition.templatePath}`);
        }

        const outputHtmlPath = path.join(outDirectoryPath, localeDefinition.outputPath);
        await mkdir(path.dirname(outputHtmlPath), { recursive: true });
        await writeFile(outputHtmlPath, renderLocalizedHtml(templateHtml, localeDefinition));
      }));
    },
  };
};
