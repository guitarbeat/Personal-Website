export const GOOGLE_SHEETS_CONFIG = {
  apiKey: process.env.REACT_APP_GOOGLE_SHEETS_API_KEY,
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  spreadsheetId: process.env.REACT_APP_GOOGLE_SHEETS_DOC_ID,
  dataLoading: {
    component: () => null,
  },
};

export const NAV_ITEMS = {
  About: "/#about",
  Projects: "/#projects",
  Work: "/#work",
  Tools: "/#tools",
};
