## 2025-12-24 - Dependency Management in Existing Projects
**Learning:** Adding new test dependencies (like `ts-jest`) to an existing `create-react-app`/`craco` project can cause conflicts and is often unnecessary as the infrastructure already supports TypeScript testing.
**Action:** Always check existing `package.json` scripts and try running tests with the existing setup (e.g., `react-scripts test`) before adding new packages.
