import type { ForwardReference, Type } from '@nestjs/common';
import { InjectorDependencyContext } from '../injector/injector';
import { Module } from '../injector/module';
export declare const UNKNOWN_DEPENDENCIES_MESSAGE: (type: string | symbol, unknownDependencyContext: InjectorDependencyContext, module: Module) => string;
export declare const INVALID_MIDDLEWARE_MESSAGE: (text: TemplateStringsArray, name: string) => string;
export declare const UNDEFINED_FORWARDREF_MESSAGE: (scope: Type<any>[]) => string;
export declare const INVALID_MODULE_MESSAGE: (parentModule: any, index: number, scope: any[]) => string;
export declare const USING_INVALID_CLASS_AS_A_MODULE_MESSAGE: (metatypeUsedAsAModule: Type | ForwardReference, scope: any[]) => string;
export declare const UNDEFINED_MODULE_MESSAGE: (parentModule: any, index: number, scope: any[]) => string;
export declare const UNKNOWN_EXPORT_MESSAGE: (token: string | symbol, module: string) => string;
export declare const INVALID_CLASS_MESSAGE: (text: TemplateStringsArray, value: any) => string;
export declare const INVALID_CLASS_SCOPE_MESSAGE: (text: TemplateStringsArray, name: string | undefined) => string;
export declare const UNKNOWN_REQUEST_MAPPING: (metatype: Type) => string;
export declare const INVALID_MIDDLEWARE_CONFIGURATION = "An invalid middleware configuration has been passed inside the module 'configure()' method.";
export declare const UNHANDLED_RUNTIME_EXCEPTION = "Unhandled Runtime Exception.";
export declare const INVALID_EXCEPTION_FILTER = "Invalid exception filters (@UseFilters()).";
export declare const MICROSERVICES_PACKAGE_NOT_FOUND_EXCEPTION = "Unable to load @nestjs/microservices package. (Please make sure that it's already installed.)";
