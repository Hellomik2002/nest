import { ArgumentMetadata } from '../index';
import { PipeTransform } from '../interfaces/features/pipe-transform.interface';
import { ErrorHttpStatusCode } from '../utils/http-error-by-code.util';
/**
 * @publicApi
 */
export interface ParseFloatPipeOptions {
    errorHttpStatusCode?: ErrorHttpStatusCode;
    exceptionFactory?: (error: string) => any;
    optional?: boolean;
}
/**
 * Defines the built-in ParseFloat Pipe
 *
 * @see [Built-in Pipes](https://docs.nestjs.com/pipes#built-in-pipes)
 *
 * @publicApi
 */
export declare class ParseFloatPipe implements PipeTransform<string> {
    protected readonly options?: ParseFloatPipeOptions;
    protected exceptionFactory: (error: string) => any;
    constructor(options?: ParseFloatPipeOptions);
    /**
     * Method that accesses and performs optional transformation on argument for
     * in-flight requests.
     *
     * @param value currently processed route argument
     * @param metadata contains metadata about the currently processed route argument
     */
    transform(value: string, metadata: ArgumentMetadata): Promise<number>;
    /**
     * @param value currently processed route argument
     * @returns `true` if `value` is a valid float number
     */
    protected isNumeric(value: string): boolean;
}
