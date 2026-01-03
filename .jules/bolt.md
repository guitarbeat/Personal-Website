## 2025-02-23 - Canvas Component Testing
**Learning:** Canvas components in JSDOM require explicit mocking of `getContext` and imports of `jest-dom` for matchers, plus context wrapping if they use providers.
**Action:** Always check test setup (wrappers, mocks, imports) when optimizing visual components.
