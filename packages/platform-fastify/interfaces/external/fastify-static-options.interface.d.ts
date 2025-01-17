/// <reference types="node" />
/**
 * "fastify-static" interfaces
 * @see https://github.com/fastify/fastify-static/blob/master/types/index.d.ts
 * @publicApi
 */
import { RouteOptions, FastifyRequest } from 'fastify';
import { Stats } from 'fs';
interface ExtendedInformation {
    fileCount: number;
    totalFileCount: number;
    folderCount: number;
    totalFolderCount: number;
    totalSize: number;
    lastModified: number;
}
interface ListDir {
    href: string;
    name: string;
    stats: Stats;
    extendedInfo?: ExtendedInformation;
}
interface ListFile {
    href: string;
    name: string;
    stats: Stats;
}
interface ListRender {
    (dirs: ListDir[], files: ListFile[]): string;
}
interface ListOptions {
    format: 'json' | 'html';
    names: string[];
    render: ListRender;
    extendedFolderInfo?: boolean;
    jsonFormat?: 'names' | 'extended';
}
interface SendOptions {
    acceptRanges?: boolean;
    cacheControl?: boolean;
    dotfiles?: 'allow' | 'deny' | 'ignore';
    etag?: boolean;
    extensions?: string[];
    immutable?: boolean;
    index?: string[] | string | false;
    lastModified?: boolean;
    maxAge?: string | number;
    serveDotFiles?: boolean;
}
export interface FastifyStaticOptions extends SendOptions {
    root: string | string[];
    prefix?: string;
    prefixAvoidTrailingSlash?: boolean;
    serve?: boolean;
    decorateReply?: boolean;
    schemaHide?: boolean;
    setHeaders?: (...args: any[]) => void;
    redirect?: boolean;
    wildcard?: boolean;
    list?: boolean | ListOptions;
    allowedPath?: (pathName: string, root: string, request: FastifyRequest) => boolean;
    /**
     * @description
     * Opt-in to looking for pre-compressed files
     */
    preCompressed?: boolean;
    acceptRanges?: boolean;
    cacheControl?: boolean;
    dotfiles?: 'allow' | 'deny' | 'ignore';
    etag?: boolean;
    extensions?: string[];
    immutable?: boolean;
    index?: string[] | string | false;
    lastModified?: boolean;
    maxAge?: string | number;
    constraints?: RouteOptions['constraints'];
}
export {};
