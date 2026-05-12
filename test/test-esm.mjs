import assert from 'node:assert/strict';

const cloneRenameModule = await import('../release/clone-rename.mjs');
const cloneRename = cloneRenameModule.default;

function test(name, fn) {
  try {
    fn();
    console.log(`ok - [esm] ${name}`);
  } catch (error) {
    console.error(`not ok - [esm] ${name}`);
    throw error;
  }
}

test('exports a function', () => {
  if (typeof cloneRename !== 'function') {
    throw new Error(`Expected function, got ${typeof cloneRename}`);
  }
});

test('exports filterKey method', () => {
  if (typeof cloneRename.filterKey !== 'function') {
    throw new Error('filterKey is not a function');
  }
});

test('renames object keys', () => {
  const result = cloneRename({ id: '001' }, { id: 'goodsID' });
  assert.deepEqual(result, { goodsID: '001' });
});

test('deep copies by default', () => {
  const obj = { a: 1 };
  const result = cloneRename(obj);
  assert.notEqual(result, obj);
});

test('handles null input', () => {
  assert.equal(cloneRename(null), null);
});

test('handles arrays of objects', () => {
  const result = cloneRename(
    [{ id: '001' }, { id: '002' }],
    { id: 'goodsID' }
  );
  assert.deepEqual(result, [{ goodsID: '001' }, { goodsID: '002' }]);
});

test('path-based key maps work for nested objects', () => {
  const result = cloneRename(
    { user: { id: 'u1' } },
    { 'user.id': 'user.userId' }
  );
  assert.deepEqual(result, { user: { userId: 'u1' } });
});

test('path map right-hand side: only the leaf is used (rename in place, no move)', () => {
  const data = { user: { id: 'u1' } };
  const short = cloneRename(data, { 'user.id': 'userId' });
  const long = cloneRename(data, { 'user.id': 'user.userId' });
  const bogus = cloneRename(data, { 'user.id': 'account.userId' });

  assert.deepEqual(short, { user: { userId: 'u1' } });
  assert.deepEqual(short, long);
  assert.deepEqual(short, bogus);
  assert.equal(bogus.account, undefined);
});

test('function-based key maps work', () => {
  const result = cloneRename(
    { first_name: 'Ada' },
    (key) => key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
  );
  assert.deepEqual(result, { firstName: 'Ada' });
});

test('clones Date instances', () => {
  const d = new Date();
  const result = cloneRename(d);
  assert.ok(result instanceof Date);
  assert.equal(result.getTime(), d.getTime());
  assert.notEqual(result, d);
});

test('clones RegExp inside objects', () => {
  const r = /test/gi;
  const result = cloneRename({ r }).r;
  assert.ok(result instanceof RegExp);
  assert.equal(result.source, 'test');
  assert.notEqual(result, r);
});

test('deepCopy false preserves nested references', () => {
  const nested = { a: 1 };
  const result = cloneRename({ n: nested }, { n: 'x' }, { deepCopy: false });
  assert.equal(result.x, nested);
});

test('deepRename false does not rename nested keys', () => {
  const result = cloneRename(
    { outer: { inner: 'v' } },
    { outer: 'renamed', inner: 'gone' },
    { deepRename: false }
  );
  assert.deepEqual(result, { renamed: { inner: 'v' } });
});
