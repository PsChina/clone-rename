/**
 * @Author: shanshan.pan
 * @Date: 2018-04-11 14:30:14
 * @Last Modified by: shanshan.pan
 * @Last Modified time: 2018-12-08 08:50:46
 */
export interface CloneRenameOptions {
    deepCopy?: boolean;
    deepRename?: boolean;
}
export interface RenameContext {
    key: string;
    path: string;
    parentPath: string;
    depth: number;
    value: any;
}
export type RenameMap = Record<string, string>;
export type RenameFunction = (key: string, context: RenameContext) => string;
export type RenameFilter = RenameMap | RenameFunction;
export interface CloneRename {
    <T>(input: T, filter?: RenameFilter, options?: CloneRenameOptions): T;
    filterKey(key: string, filter?: RenameFilter, context?: RenameContext): string;
}
/**
 * @param input Prepare the object to be cloned.
 * @param filter The key to change the name.
 * @param options Whether deep rename or deep copy.
 * @return The cloned value with renamed keys.
 */
declare const cloneRename: CloneRename;
export default cloneRename;
