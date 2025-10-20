# Notion CMS Migration Plan

## Objective
Migrate the personal website's content source from Google Sheets to Notion so that a single structured content hub can power the site, résumé/CV exports, and other professional materials.

## Prerequisites
- Access to the current Google Sheets document that supplies the `about`, `projects`, and `work` data.
- A Notion account with permissions to create internal integrations.
- Local development environment configured for the website repository.
- Deployment platform credentials (e.g., Netlify, Vercel) for updating environment variables.

## Phase 1: Model Content in Notion
1. **Create databases**
   - Set up three primary databases in Notion: `About Sections`, `Projects`, and `Experience`.
   - Add properties that mirror the fields consumed in the React components (e.g., title, slug, category, description, start/end dates, keywords, image URLs).
2. **Add metadata for multi-channel outputs**
   - Include boolean or select properties such as `Show on Site`, `Resume Variant`, `Tags`, or `Skills` to control which entries appear in different contexts.
   - Document any relationships (e.g., link `Projects` to `Experience` entries if needed).
3. **Populate initial content**
   - Export existing Google Sheets data and import or manually copy it into the corresponding Notion databases.
   - Verify formatting (rich text, multi-select tags, URLs) matches the desired output.

## Phase 2: Configure Notion API Access
1. **Create an internal integration**
   - Visit [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) and create a new internal integration.
   - Copy the integration secret (store as `NOTION_TOKEN`).
2. **Share databases with the integration**
   - In each database, click `Share` → `Invite`, select the integration, and grant it access.
3. **Record database IDs**
   - From the Notion URLs, capture the database IDs for each content type.
   - Store them as environment variables: `NOTION_DB_ABOUT`, `NOTION_DB_PROJECTS`, `NOTION_DB_WORK`.
4. **Update environment configuration**
   - Add the variables to `.env` locally and configure them in the deployment platform's secret store.

## Phase 3: Build the Data Fetch Pipeline
1. **Install dependencies**
   - Add the Notion SDK: `npm install @notionhq/client`.
2. **Create fetch script**
   - Add `scripts/fetch-notion-data.js` to query each database, handle pagination, and normalize properties into plain JSON.
   - Ensure the script outputs `src/data/portfolio.json` shaped as `{ about: [...], projects: [...], work: [...] }`.
   - Perform data coercion (dates, rich text, multi-select) to keep frontend logic unchanged.
3. **Integrate into build process**
   - Update `package.json` scripts:
     ```json
     "fetch-data": "node scripts/fetch-notion-data.js",
     "build": "npm run fetch-data && react-scripts build"
     ```
   - Optionally add `prestart` or `dev` scripts to refresh data during local development.
4. **Test locally**
   - Run `npm run fetch-data` and inspect `src/data/portfolio.json` for accuracy.
   - Execute `npm start` or `npm run build` to confirm the build succeeds with the new data source.

## Phase 4: Refactor the React App
1. **Remove Google Sheets dependencies**
   - Delete `GoogleSheetsProvider` usage from `src/App.js` and remove the `react-db-google-sheets` package.
   - Clean up `GOOGLE_SHEETS_CONFIG` and related environment variables.
2. **Import static data**
   - In `About`, `Projects`, and `Work` components, replace `withGoogleSheets` with direct imports:
     ```js
     import portfolioData from "../../../data/portfolio.json";
     const { about, projects, work } = portfolioData;
     ```
   - Update component logic to read from the imported arrays.
3. **Verify UI functionality**
   - Ensure filtering, timelines, and rendering behave identically using the static JSON.
   - Adjust any defensive checks if the data normalization changed field names or types.

## Phase 5: Automate Résumé and CV Generation
1. **Plan output formats**
   - Decide on target formats (PDF, Markdown, LaTeX) and tools (`react-pdf`, `md-to-pdf`, or `tectonic`).
2. **Add generation script**
   - Create `scripts/generate-resumes.js` to load `src/data/portfolio.json`, filter entries using tags (e.g., `Resume Variant`), and render the desired documents.
   - Output files to a `dist/resumes/` directory or `public/` for hosting.
3. **Integrate into workflows**
   - Optionally add an npm script (`npm run build-resumes`) and hook it into CI/CD so PDFs regenerate during deployments.

## Phase 6: Deployment & Maintenance
1. **Update CI/CD configuration**
   - Ensure deployment pipelines set the Notion environment variables and run `npm run build` (which includes data fetching).
2. **Set up update triggers**
   - Create a manual or automated process (e.g., scheduled rebuilds or Notion webhooks) to redeploy the site and regenerate résumés when content changes.
3. **Document ongoing tasks**
   - Maintain a README section describing how to update content in Notion and trigger deployments.
   - Schedule periodic reviews of database schema to accommodate new content types or fields.

## Optional Enhancements
- Add validation to the fetch script to flag missing required fields before builds succeed.
- Generate TypeScript types from the normalized data to improve editor tooling.
- Split `portfolio.json` into smaller chunks per section and lazy-load them if bundle size becomes a concern.

## Success Criteria
- Website builds without any Google Sheets dependencies and renders using Notion-sourced content.
- Résumé/CV outputs regenerate from the same dataset without manual copy/paste.
- Editing content in Notion and triggering a redeploy updates the site and documents consistently.

