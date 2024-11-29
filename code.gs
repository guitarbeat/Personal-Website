// Spreadsheet ID where the data is stored
const SPREADSHEET_ID = '1kYcFtsMQOap_52pKlTfWCYJk1O5DD66LlZ90TWCgAyA';

function doGet(e) {
  const output = handleRequest(e);
  const callback = e.parameter.callback;
  
  if (callback) {
    // Wrap the response in the JSONP callback
    return ContentService.createTextOutput(`${callback}(${JSON.stringify(output)})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleRequest(e) {
  try {
    let data = e.parameter.data ? JSON.parse(e.parameter.data) : {};
    
    // Validate tabName for actions that require it
    if (['getSheetData', 'updateSheetData'].includes(e.parameter.action) && !data.tabName) {
      throw new Error('tabName is required for this action');
    }
    
    switch(e.parameter.action) {
      case 'getSheetData':
        return getSheetData(data.tabName);
      case 'updateSheetData':
        if (data.tabName === 'NEEDS') {
          return handleNeedsUpdate(data);
        }
        if (data.tabName === 'SNAKE') {
          return handleSnakeHighscore(data);
        }
        return updateSheetData(data.tabName, data.rowIndex, data.columnName, data.value);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    return logError('handleRequest', error);
  }
}

function getSheetData(tabName) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(tabName);
  if (!sheet) {
    throw new Error(`Sheet "${tabName}" not found`);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Convert to array of objects with column headers as keys
  const formattedData = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  return {
    success: true,
    data: formattedData
  };
}

function updateSheetData(tabName, rowIndex, columnName, value) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(tabName);
  if (!sheet) {
    throw new Error(`Sheet "${tabName}" not found`);
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const columnIndex = headers.indexOf(columnName);
  
  if (columnIndex === -1) {
    throw new Error(`Column "${columnName}" not found`);
  }
  
  // Add 2 to rowIndex because: +1 for 0-based index, +1 for header row
  sheet.getRange(rowIndex + 2, columnIndex + 1).setValue(value);
  
  return {
    success: true,
    message: `Updated ${columnName} in ${tabName} at row ${rowIndex}`
  };
}

// Special handler for NEEDS sheet updates
function handleNeedsUpdate(data) {
  try {
    const sheet = validateSheet('NEEDS');
    
    // Get current data to determine next row
    const currentData = sheet.getDataRange().getValues();
    const nextRow = currentData.length;
    
    if (data.columnName === 'reset') {
      // Clear all data except headers
      if (nextRow > 1) {
        sheet.getRange(2, 1, nextRow - 1, sheet.getLastColumn()).clear();
      }
      return { success: true, message: 'Reset successful' };
    }
    
    if (data.columnName === 'snapshot') {
      const snapshot = JSON.parse(data.value);
      const headers = ['timestamp', 'userName', 'levelValues'];
      
      // Ensure headers exist
      if (currentData.length === 0) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }
      
      // Add new snapshot row
      sheet.getRange(nextRow + 1, 1, 1, 3).setValues([[
        snapshot.timestamp,
        snapshot.userName,
        JSON.stringify(snapshot.levelValues)
      ]]);
      
      return { success: true, message: 'Snapshot saved' };
    }
    
    if (data.columnName === 'levelValues') {
      const values = JSON.parse(data.value);
      const lastRow = Math.max(nextRow, 1);
      sheet.getRange(lastRow, 3).setValue(JSON.stringify(values));
      return { success: true, message: 'Level values updated' };
    }
    
    return updateSheetData('NEEDS', data.rowIndex, data.columnName, data.value);
  } catch (error) {
    return logError('handleNeedsUpdate', error);
  }
}

// Handle snake highscore submissions
function handleSnakeHighscore(data) {
  try {
    const sheet = validateSheet('SNAKE');
    const score = parseInt(data.score);
    const playerName = data.playerName.trim();
    
    if (!score || !playerName) {
      throw new Error('Invalid score or player name');
    }
    
    // Get all current scores
    const scores = sheet.getRange('A2:C').getValues()
      .filter(row => row[0] && row[1])  // Filter out empty rows
      .map(row => ({
        name: row[0],
        score: parseInt(row[1]),
        date: row[2]
      }))
      .sort((a, b) => b.score - a.score);  // Sort by score descending
    
    // Add new score
    const newScore = {
      name: playerName,
      score: score,
      date: new Date().toISOString()
    };
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    
    // Keep only top 100 scores
    const topScores = scores.slice(0, 100);
    
    // Update sheet with new scores
    sheet.getRange('A2:C' + (topScores.length + 1)).setValues(
      topScores.map(s => [s.name, s.score, s.date])
    );
    
    return {
      success: true,
      message: 'Highscore saved successfully',
      rank: topScores.findIndex(s => s.name === playerName && s.score === score) + 1,
      topScores: topScores.slice(0, 10)  // Return top 10 scores
    };
  } catch (error) {
    logError('handleSnakeHighscore', error);
    return { success: false, error: error.message };
  }
}

// Helper function to validate sheet existence
function validateSheet(tabName) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(tabName);
  if (!sheet) {
    throw new Error(`Sheet "${tabName}" not found`);
  }
  return sheet;
}

// Helper function to validate column existence
function validateColumn(sheet, columnName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const columnIndex = headers.indexOf(columnName);
  if (columnIndex === -1) {
    throw new Error(`Column "${columnName}" not found`);
  }
  return columnIndex;
}

// Helper function to log errors
function logError(action, error) {
  console.error(`Error in ${action}:`, error.message);
  return {
    success: false,
    error: error.message
  };
}