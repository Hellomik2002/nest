import { HttpServer } from '@nestjs/common';
import { MiddlewareConfiguration, RouteInfo } from '@nestjs/common/interfaces/middleware';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import { ApplicationConfig } from '../application-config';
import { NestContainer } from '../injector/container';
import { Injector } from '../injector/injector';
import { Module } from '../injector/module';
import { GraphInspector } from '../inspector/graph-inspector';
import { MiddlewareContainer } from './container';
export declare class MiddlewareModule<TAppOptions extends NestApplicationContextOptions = NestApplicationContextOptions> {
    private readonly routerProxy;
    private readonly exceptionFiltersCache;
    private readonly logger;
    private injector;
    private routerExceptionFilter;
    private routesMapper;
    private resolver;
    private container;
    private httpAdapter;
    private graphInspector;
    private appOptions;
    private routeInfoPathExtractor;
    register(middlewareContainer: MiddlewareContainer, container: NestContainer, config: ApplicationConfig, injector: Injector, httpAdapter: HttpServer, graphInspector: GraphInspector, options: TAppOptions): Promise<void>;
    resolveMiddleware(middlewareContainer: MiddlewareContainer, modules: Map<string, Module>): Promise<void>;
    loadConfiguration(middlewareContainer: MiddlewareContainer, moduleRef: Module, moduleKey: string): Promise<void>;
    registerMiddleware(middlewareContainer: MiddlewareContainer, applicationRef: any): Promise<void>;
    registerMiddlewareConfig(middlewareContainer: MiddlewareContainer, config: MiddlewareConfiguration, moduleKey: string, applicationRef: any): Promise<void>;
    registerRouteMiddleware(middlewareContainer: MiddlewareContainer, routeInfo: RouteInfo, config: MiddlewareConfiguration, moduleKey: string, applicationRef: any): Promise<void>;
    private bindHandler;
    private createProxy;
    private registerHandler;
    private getContextId;
}