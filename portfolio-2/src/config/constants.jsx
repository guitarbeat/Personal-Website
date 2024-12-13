export const GOOGLE_SHEETS_CONFIG = {
  apiKey: process.env.REACT_APP_GOOGLE_SHEETS_API_KEY,
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
  dataLoading: {
    component: () => null // Moved CustomLoadingComponent to App.js since it depends on MagicComponent
  },
};

export const NAV_ITEMS = {
  About: "/#about",
  Projects: "/#projects",
  Work: "/#work",
};
