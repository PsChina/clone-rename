import cloneRename, {
  type CloneRenameOptions,
  type RenameContext,
  type RenameFilter,
  type RenameFunction,
  type RenameMap
} from 'clone-rename';

const keyMap: RenameMap = {
  id: 'goodsID',
  'user.id': 'user.userId'
};

const filter: RenameFilter = keyMap;

const options: CloneRenameOptions = {
  deepCopy: true,
  deepRename: true
};

const result = cloneRename(
  {
    user: {
      id: 1,
      first_name: 'Ada'
    }
  },
  filter,
  options
);

const renameByFunction: RenameFunction = (key: string, context: RenameContext): string => {
  const path: string = context.path;
  const parentPath: string = context.parentPath;
  const depth: number = context.depth;
  const value: any = context.value;

  if (path === 'user.id') return 'userId';
  if (parentPath === 'user' && depth === 1 && value !== undefined) return key;

  return key.includes('_') ? key.replace(/_([a-z])/g, (_, char) => char.toUpperCase()) : key;
};

cloneRename(result, renameByFunction);

const newKey: string = cloneRename.filterKey('id', filter, {
  key: 'id',
  path: 'user.id',
  parentPath: 'user',
  depth: 1,
  value: 1
});

newKey.toUpperCase();
