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

declare const cloneRename: CloneRename;

export default cloneRename;
