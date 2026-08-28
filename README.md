# StockingRateCalculator

RanchAssist™ Stocking Rate Calculator
README_SETUP.txt
Version 1.0.0
Tool ID: stocking-rate-calculator

============================================================
1. WHAT THIS PROJECT INCLUDES
============================================================

This package contains a complete Google Apps Script web app and a standalone HTML version.

Files:
- Code.gs.txt
- Index.html.txt
- appsscript.json.txt
- Standalone_Stocking_Rate_Calculator.html.txt
- README_SETUP.txt

The app estimates:
- Supported head count
- Grazing days for an entered herd
- Acres required
- Acres per head
- Available forage
- Daily forage demand per head
- Daily herd forage demand
- Total grazing-period forage demand
- Animal units (AU)
- Animal-unit-month (AUM) equivalents
- Supply-vs-demand capacity

It also includes:
- Base / Conservative / Aggressive user-controlled scenarios
- Live calculations
- Question modes
- Calculation Details / formulas
- CSV export
- PDF via print dialog
- Print
- Copy Summary
- Email sharing
- RanchAssist .ra project Save / Open / Duplicate
- sessionStorage recovery
- Clear Session
- Unsaved-change status
- Responsive desktop/tablet/mobile UI
- Print-optimized output

No account or database is required.

============================================================
2. IMPORTANT CALCULATION MODEL
============================================================

The calculator intentionally uses user-entered planning assumptions rather
than claiming a universal stocking rate.

FORAGE

Forage production is normalized to pounds of dry matter per acre.

Total forage produced:
  usable acres × forage production lb DM/acre

Effective availability factor:
  utilization
  × harvest efficiency
  × (1 - residual/reserve)
  × (1 - drought buffer)

Available forage:
  total forage produced × effective availability factor

This means utilization, harvest efficiency, reserve, and drought buffer are
separate user-controlled planning factors. Users should adjust them to match
their own management system and local guidance.

LIVESTOCK DEMAND

Daily dry matter demand per head:
  average live weight × daily DMI % body weight

Herd daily demand:
  daily demand per head × head count

Total grazing-period demand:
  herd daily demand × duration in days

SUPPORTED HEAD

Supported head:
  available forage ÷ (daily demand per head × duration)

The displayed supported-head result is rounded DOWN to a whole animal.

GRAZING DAYS

Grazing days:
  available forage ÷ herd daily demand

ACRES REQUIRED

Available forage per acre:
  forage production lb DM/acre × effective availability factor

Acres required:
  total grazing-period demand ÷ available forage per acre

ANIMAL UNITS

Automatic AU equivalent per head:
  average live weight ÷ base AU weight

Default base AU weight is an editable example value of 1,000 lb.

The user can override AU equivalent directly.

Total AU:
  AU equivalent per head × head count

AUM equivalent:
  total AU × duration days ÷ days per AUM

Default days per AUM is an editable example value of 30.4 days.

AU/AUM are shown as planning equivalents. Forage demand remains driven by the
user-entered live weight and dry matter intake percentage.

============================================================
3. GOOGLE APPS SCRIPT INSTALLATION
============================================================

1. Create a new Google Apps Script project.

2. Create or replace the following project files:

   Code.gs
   - Copy the contents of Code.gs.txt into Code.gs.

   Index.html
   - Create an HTML file named Index.
   - Copy the contents of Index.html.txt into Index.html.

   appsscript.json
   - Enable "Show appsscript.json manifest file in editor" in Project Settings
     if necessary.
   - Replace the manifest with the contents of appsscript.json.txt.

3. Save the project.

4. Deploy:
   - Click Deploy
   - Select New deployment
   - Type: Web app
   - Execute as: Me / user deploying
   - Who has access: Anyone (or the access level appropriate for your site)
   - Deploy

5. Authorize the project when prompted.
   Email sharing uses Apps Script MailApp and therefore requires the normal
   Apps Script email authorization for the deployment owner.

6. Open the deployment URL and verify the calculator loads.

7. If embedding in Google Sites:
   - Use the deployed web app URL.
   - The supplied Code.gs uses XFrameOptionsMode.ALLOWALL so it can be embedded
     where the Apps Script deployment and browser policy permit it.

============================================================
4. SCRIPT PROPERTIES / API CONFIGURATION
============================================================

Required Script Properties:
- None.

Optional Script Properties:
- None.

Server-only secrets:
- None.

External APIs:
- None.

Mapbox:
- Not used by this calculator.

The user is never asked for an API key, token, or developer credential.

============================================================
5. EMAIL SHARING
============================================================

In the Apps Script deployment:
- User enters only the destination email address and optional message.
- Browser sends the prepared summary to the server-side function:
  shareStockingRateSummary(payload)
- Apps Script MailApp sends the email.
- No SMTP or third-party email API credential is required.
- The app does not permanently store the recipient or project data.

In the standalone HTML version:
- If google.script.run is unavailable, the Share action uses a mailto: link and
  opens the user's configured email application.

============================================================
6. RANCHASSIST .ra PROJECT FILES
============================================================

The app implements RanchAssist Project File format 1.0.

Save Project creates:
  <Project_Name>.ra

The .ra file includes:
- raFile sentinel
- formatVersion
- tool ID
- tool name
- tool version
- project UUID
- project name
- createdAt
- updatedAt
- active scenario
- question mode
- all three scenario inputs
- assumptions
- notes
- preferences
- RanchAssist metadata

No API keys, auth tokens, cookies, or executable code are included.

Open Project:
- Reads the file locally in the browser
- Parses JSON
- Verifies raFile === true
- Verifies formatVersion
- Verifies tool ID matches stocking-rate-calculator
- Verifies project ID
- Verifies scenario state exists
- Restores source inputs
- Recalculates all derived values using current application logic

Duplicate Project:
- Copies the current editable state
- Creates a NEW project UUID
- Keeps the active project editable

============================================================
7. SESSION PRIVACY MODEL
============================================================

The app:
- Does not require sign-in
- Does not use a database
- Does not use localStorage
- Uses sessionStorage only for active-session resilience
- Keeps user data in the active browser session
- Lets the user explicitly save a .ra file for later continuation
- Lets the user explicitly export or share results

Clear Session:
- Clears current project state and sessionStorage
- Does not delete previously downloaded .ra, CSV, or PDF files

============================================================
8. STANDALONE HTML
============================================================

Standalone_Stocking_Rate_Calculator.html.txt contains the same self-contained
frontend.

To use it as a normal HTML file:
1. Make a copy.
2. Rename the copy:
   Stocking_Rate_Calculator.html
3. Open it in a browser or deploy it to a static host.

All calculation, scenario, .ra, session, CSV, copy, and print features work
client-side.

Email sharing falls back to the user's email application because MailApp is
only available inside Google Apps Script.

============================================================
9. PDF EXPORT
============================================================

The app uses a print-optimized report rather than a PDF library.

To save PDF:
1. Click PDF / Print.
2. In the browser print dialog select "Save as PDF".
3. Save the report.

This avoids unnecessary client libraries while preserving a clean report.

============================================================
10. DEFAULT EXAMPLE VALUES
============================================================

The app ships with editable example values for demonstration and fast setup.

These values are NOT authoritative recommendations.

Base scenario example:
- 100 usable acres
- 2,500 lb DM/acre forage production
- 50% utilization
- 80% harvest efficiency
- 10% residual/reserve
- 10% drought buffer
- 50 mature cows
- 1,200 lb average weight
- 2.5% body weight daily DMI
- 90-day grazing period
- 1,000 lb base AU weight
- 30.4 days per AUM

Conservative and Aggressive are also user-controlled examples, not forecasts.

============================================================
11. QA TEST CHECKLIST
============================================================

A. LIVE CALCULATION
[ ] Change acres and confirm all capacity metrics update.
[ ] Change forage production and confirm available forage updates.
[ ] Change utilization, harvest efficiency, reserve, and drought buffer.
[ ] Change herd count, weight, and DMI.
[ ] Switch duration between days and months.
[ ] Switch forage production between lb DM/ac and tons/ac.
[ ] Verify no NaN or Infinity is displayed.

B. QUESTION MODES
[ ] How many head can I stock?
[ ] How many grazing days?
[ ] How many acres do I need?
[ ] Compare scenarios

C. SCENARIOS
[ ] Edit Base.
[ ] Edit Conservative.
[ ] Edit Aggressive.
[ ] Confirm values remain distinct when switching.
[ ] Use Copy active to next.
[ ] Confirm comparison table updates.

D. PROJECT SAVE / REOPEN
[ ] Enter meaningful project data.
[ ] Save .ra.
[ ] Clear Session.
[ ] Open .ra.
[ ] Confirm all editable inputs restore.
[ ] Confirm calculations regenerate.

E. WRONG TOOL / INVALID FILE
[ ] Attempt to open arbitrary JSON.
[ ] Confirm "Not a RanchAssist project" error.
[ ] Attempt a .ra file from another RanchAssist tool.
[ ] Confirm wrong-tool rejection.
[ ] Truncate a .ra file and confirm safe failure.

F. REFRESH RECOVERY
[ ] Make unsaved edits.
[ ] Refresh the page.
[ ] Confirm active session returns from sessionStorage.

G. CLEAR SESSION
[ ] Save a .ra file.
[ ] Click Clear Session.
[ ] Confirm browser state resets.
[ ] Confirm downloaded .ra file remains on the device.

H. EXPORT / SHARE
[ ] Export CSV.
[ ] Open CSV and verify all three scenarios.
[ ] Use PDF / Print and inspect print layout.
[ ] Copy Summary.
[ ] Send email in Apps Script deployment.
[ ] Test standalone HTML email fallback.

I. MOBILE
[ ] Test at 320px width.
[ ] Test normal iPhone / Android width.
[ ] Test tablet.
[ ] Confirm no page-level horizontal overflow.
[ ] Confirm numeric inputs use mobile-friendly input modes.
[ ] Confirm bottom action bar is usable.

J. ACCESSIBILITY
[ ] Navigate with keyboard.
[ ] Verify visible focus states.
[ ] Verify labels are associated with inputs.
[ ] Verify status messages include text and do not rely on color alone.

============================================================
12. PRODUCTION NOTES
============================================================

- This is a planning calculator, not an agronomic guarantee.
- Keep default assumptions editable.
- Do not replace local forage measurements or professional/local guidance with
  generic defaults.
- If future external services are introduced, follow the RanchAssist API,
  Secrets & Runtime Configuration Standard:
  - Store application configuration in Script Properties.
  - Never ask ranchers for developer credentials.
  - Keep private secrets server-side.
  - Explicitly allowlist only client-safe configuration.
  - Never serialize credentials into .ra files or exports.

============================================================
13. FILE RENAMING FOR APPS SCRIPT
============================================================

The deliverables are intentionally exported as .txt.

Rename/copy as follows when installing:

Code.gs.txt
→ Code.gs

Index.html.txt
→ Index.html

appsscript.json.txt
→ appsscript.json

README_SETUP.txt
→ keep as documentation


Source mirror managed by GitScript.
