import { Plugin } from 'rollup';
export declare type ConditionFn = (name: string) => boolean;
export declare type EnvValues = Record<string, string>;
export declare type Condition = string | ConditionFn | EnvValues;
export interface EnvOptions {
    /** Inclusion list, it includes everything by default */
    include?: string | string[];
    /** Exclusion list, it excludes nothing by default */
    exclude?: string | string[];
    /** Injection with virtual, by default auto definition relates to `include` */
    virtual?: boolean;
    /** Default env values */
    preset?: EnvValues;
}
declare function env(prefix: string, options?: EnvOptions): Plugin;
declare function env(values: EnvValues, options?: Omit<EnvOptions, 'preset'>): Plugin;
declare function env(condition: ConditionFn, options?: EnvOptions): Plugin;
export default env;
