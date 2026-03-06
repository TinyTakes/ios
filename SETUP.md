# TinyTakes Feedback Website - Setup Guide

## 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it **TinyTakes Beta Feedback**
3. In Row 1, add these column headers:
   - A: `Timestamp`
   - B: `Name`
   - C: `Email`
   - D: `Device`
   - E: `App Version`
   - F: `Bug Report`
   - G: `Feature Request`
   - H: `General Feedback`
   - I: `Screenshot`

## 2. Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code and paste the following:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var screenshotUrl = '';
    if (data.screenshot && data.screenshot.length > 0) {
      screenshotUrl = saveScreenshot(data.screenshot, data.screenshotName || 'screenshot.png');
    }

    sheet.appendRow([
      new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.device || '',
      data.appVersion || '',
      data.bugReport || '',
      data.featureRequest || '',
      data.generalFeedback || '',
      screenshotUrl
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveScreenshot(base64Data, fileName) {
  try {
    // Remove the data URL prefix (e.g., "data:image/png;base64,")
    var parts = base64Data.split(',');
    var contentType = parts[0].match(/:(.*?);/)[1];
    var decoded = Utilities.base64Decode(parts[1]);
    var blob = Utilities.newBlob(decoded, contentType, fileName);

    var folder = getOrCreateFolder('TinyTakes Feedback Screenshots');
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return file.getUrl();
  } catch (error) {
    return 'Upload failed: ' + error.toString();
  }
}

function getOrCreateFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}
```

3. Click **Save** (Ctrl/Cmd + S)
4. Name the project **TinyTakes Feedback Handler**

## 3. Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Set the following:
   - **Description:** TinyTakes Feedback
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. **Authorize** when prompted (review permissions and allow)
6. Copy the **Web app URL** - it will look like:
   `https://script.google.com/macros/s/XXXXXXXXX/exec`

## 4. Configure the Website

1. Open `script.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the URL you copied:
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/XXXXXXXXX/exec';
   ```
3. Save the file

## 5. Test It

1. Open `index.html` in your browser
2. Fill out the form and submit
3. Check your Google Sheet - a new row should appear with the feedback

## 6. Deploy the Website

### Option A: GitHub Pages
1. Go to your repo settings on GitHub
2. Under **Pages**, set source to **Deploy from a branch**
3. Select the `main` branch and `/ (root)` folder
4. Your site will be live at `https://yourusername.github.io/tinytakes-website/`

### Option B: Netlify
1. Go to [Netlify](https://netlify.com) and sign in
2. Drag and drop your project folder, or connect your GitHub repo
3. Site will be deployed automatically

### Option C: Vercel
1. Go to [Vercel](https://vercel.com) and sign in
2. Import your GitHub repo
3. Deploy with default settings

## Troubleshooting

- **Form submits but no data in sheet:** Make sure the Apps Script is deployed as a web app with "Anyone" access
- **Authorization error:** Re-deploy the Apps Script and re-authorize
- **Screenshot not uploading:** Ensure the file is under 5MB and is an image format
- **CORS errors in console:** The form uses `no-cors` mode, so these can be safely ignored. If submissions aren't working, check the Apps Script URL is correct
