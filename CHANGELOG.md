# Changelog

## Unreleased

### Docs

- README (EN + CN): path-based key map examples use the short right-hand form (`'user.id': 'userId'`) instead of the symmetric long form. Added an explicit note that only the last segment of the right-hand side is used and that renaming happens in place — `cloneRename` does not move fields across the tree.

### Tests

- Pin the path-map right-hand-side contract: `{ 'user.id': 'userId' }`, `{ 'user.id': 'user.userId' }`, and `{ 'user.id': 'account.userId' }` all produce the same result. Contract pinned in `test-dist.mjs`, `test-esm.mjs`, `test-cjs.cjs`, and the comprehensive `clone-rename.test.mjs`.

No runtime behavior changes.
