import assert from 'node:assert/strict';
import cloneRename from 'clone-rename';

function camelCase(key) {
  return key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

test('imports the legacy default function from the package name', () => {
  assert.equal(typeof cloneRename, 'function');
});

test('renames object keys inside arrays by default', () => {
  const input = [
    {
      id: '001',
      name: 'apple'
    },
    {
      id: '002',
      name: 'banana'
    }
  ];

  const result = cloneRename(input, {
    id: 'goodsID',
    name: 'goodsName'
  });

  assert.deepEqual(result, [
    {
      goodsID: '001',
      goodsName: 'apple'
    },
    {
      goodsID: '002',
      goodsName: 'banana'
    }
  ]);
  assert.notEqual(result, input);
  assert.notEqual(result[0], input[0]);
  assert.notEqual(result[1], input[1]);
});

test('deep copies and deep renames object keys by default', () => {
  const project = { name: 'JavaScript' };
  const input = {
    name: 'PsChina',
    age: '25',
    like: [project]
  };

  const result = cloneRename(input, {
    name: 'babel'
  });

  assert.deepEqual(result, {
    babel: 'PsChina',
    age: '25',
    like: [{ babel: 'JavaScript' }]
  });
  assert.notEqual(result, input);
  assert.notEqual(result.like, input.like);
  assert.notEqual(result.like[0], project);
});

test('deepCopy false only renames the current object layer and preserves nested references', () => {
  const project = { name: 'JavaScript' };
  const input = {
    name: 'PsChina',
    age: '25',
    like: [project]
  };

  const result = cloneRename(
    input,
    {
      name: 'babel'
    },
    {
      deepCopy: false
    }
  );

  assert.deepEqual(result, {
    babel: 'PsChina',
    age: '25',
    like: [{ name: 'JavaScript' }]
  });
  assert.notEqual(result, input);
  assert.equal(result.like, input.like);
  assert.equal(result.like[0], project);
});

test('deepRename false deep copies nested values without renaming nested keys', () => {
  const project = { name: 'JavaScript' };
  const input = {
    name: 'PsChina',
    age: '25',
    like: [project]
  };

  const result = cloneRename(
    input,
    {
      name: 'babel'
    },
    {
      deepRename: false
    }
  );

  assert.deepEqual(result, {
    babel: 'PsChina',
    age: '25',
    like: [{ name: 'JavaScript' }]
  });
  assert.notEqual(result, input);
  assert.notEqual(result.like, input.like);
  assert.notEqual(result.like[0], project);
});

test('clones Date instances', () => {
  const input = new Date('2018-04-11T14:30:14.000Z');

  const result = cloneRename(input);

  assert.ok(result instanceof Date);
  assert.equal(result.getTime(), input.getTime());
  assert.notEqual(result, input);
});

test('clones functions when the root input is a function', () => {
  function sum(a, b) {
    return a + b;
  }

  const result = cloneRename(sum);

  assert.equal(result(1, 2), 3);
  assert.notEqual(result, sum);
});

test('clones RegExp instances inside objects', () => {
  const input = {
    reg: /[0-9]/g
  };

  const result = cloneRename(input);

  assert.ok(result.reg instanceof RegExp);
  assert.equal(result.reg.source, input.reg.source);
  assert.equal(result.reg.flags, input.reg.flags);
  assert.notEqual(result.reg, input.reg);
});

test('returns primitive values unchanged', () => {
  assert.equal(cloneRename('clone-rename'), 'clone-rename');
  assert.equal(cloneRename(12), 12);
  assert.equal(cloneRename(true), true);
});

test('filterKey keeps keys unchanged when no filter matches', () => {
  assert.equal(cloneRename.filterKey('name', { id: 'goodsID' }), 'name');
});

test('supports path-based key maps through the legacy filter argument', () => {
  const data = {
    id: 'root-001',
    user: {
      id: 'user-001',
      profile: {
        name: 'Ada Lovelace',
        age: 28
      }
    },
    order: {
      id: 'order-001'
    }
  };

  const result = cloneRename(data, {
    'user.id': 'user.userId',
    'user.profile.name': 'user.profile.displayName'
  });

  assert.deepEqual(result, {
    id: 'root-001',
    user: {
      userId: 'user-001',
      profile: {
        displayName: 'Ada Lovelace',
        age: 28
      }
    },
    order: {
      id: 'order-001'
    }
  });
  assert.notEqual(result, data);
  assert.notEqual(result.user, data.user);
  assert.notEqual(result.user.profile, data.user.profile);
});

test('supports function-based key maps with context through the legacy filter argument', () => {
  const seenPaths = [];
  const data = {
    user: {
      id: 'user-001',
      first_name: 'Ada',
      profile: {
        display_name: 'Ada Lovelace',
        avatar_url: 'https://example.com/ada.png'
      }
    },
    page_info: {
      current_page: 1,
      page_size: 20
    }
  };

  const result = cloneRename(data, (key, context) => {
    seenPaths.push(context.path);

    if (context.path === 'user.id') {
      return 'userId';
    }

    if (key.includes('_')) {
      return camelCase(key);
    }

    return key;
  });

  assert.deepEqual(result, {
    user: {
      userId: 'user-001',
      firstName: 'Ada',
      profile: {
        displayName: 'Ada Lovelace',
        avatarUrl: 'https://example.com/ada.png'
      }
    },
    pageInfo: {
      currentPage: 1,
      pageSize: 20
    }
  });
  assert.ok(seenPaths.includes('user.id'));
  assert.ok(seenPaths.includes('user.profile.display_name'));
  assert.ok(seenPaths.includes('page_info.current_page'));
});

test('null input returns null', () => {
  const result = cloneRename(null);
  assert.equal(result, null);
});

test('null input with filter returns null', () => {
  const result = cloneRename(null, { a: 'b' });
  assert.equal(result, null);
});

test('undefined input returns undefined', () => {
  const result = cloneRename(undefined);
  assert.equal(result, undefined);
});

test('empty object returns a new empty object', () => {
  const input = {};
  const result = cloneRename(input);
  assert.deepEqual(result, {});
  assert.notEqual(result, input);
});

test('empty array returns a new empty array', () => {
  const input = [];
  const result = cloneRename(input);
  assert.deepEqual(result, []);
  assert.notEqual(result, input);
});

test('preserves null property values during deep copy', () => {
  const input = { a: null, b: { c: null } };
  const result = cloneRename(input, { a: 'x' });
  assert.deepEqual(result, { x: null, b: { c: null } });
  assert.notEqual(result, input);
});

test('handles deeply nested objects', () => {
  let input = { value: 'leaf' };
  for (let i = 0; i < 20; i++) {
    input = { nested: input };
  }

  const result = cloneRename(input, { nested: 'child' });

  let cursor = result;
  for (let i = 0; i < 20; i++) {
    assert.ok(cursor.hasOwnProperty('child'));
    cursor = cursor.child;
  }
  assert.equal(cursor.value, 'leaf');
});

test('filterKey returns key unchanged when filter is undefined', () => {
  assert.equal(cloneRename.filterKey('name', undefined), 'name');
});

test('filterKey returns key unchanged when filter is an empty object', () => {
  assert.equal(cloneRename.filterKey('name', {}), 'name');
});

test('deepRename false does not rename nested keys but still deep copies', () => {
  const nested = { innerKey: 'value' };
  const input = { outerKey: nested };

  const result = cloneRename(
    input,
    { outerKey: 'renamed', innerKey: 'renamedInner' },
    { deepRename: false }
  );

  assert.deepEqual(result, { renamed: { innerKey: 'value' } });
  assert.notEqual(result.renamed, nested);
});
