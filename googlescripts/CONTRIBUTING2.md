### One time set up

#### Create a Google App Script Account

- If you do not have a Google App Script account
  - from browser, log into a Google account
  - visit https:/script.google.com/home/usersettings
  - turn on Google Apps Script API

#### Clone from GitHub

- Fork repo and clone the fork to a local directory
- From terminal

```
cd googledocs-html-converter
cd googlescripts
yarn
```

#### Clasp Setup

- From terminal:

```
clasp login --no-localhost # prompts you to log in
```

- If the script displays a URL and asks you to enter a code:
  - Click on the URL or paste into a browser
  - Click Allow when prompted for permissions
  - Copy the authorization code from the browser, paste into the terminal, and press enter.
  - Confirm you see a message "Authorization successful"

(Note: You can change project name googledocs-html-converter if desired, this is your personal project) After you have logged into clasp:

```
cd src
clasp create --title googledocs-html-converter --type standalone
clasp push
```

### Modify Code

- pull code from GitHub
- make changes using your favorite editor
- from terminal:

```
cd googlescripts/src
clasp login      # if not logged in
../autopush.sh    # this automates the pushing.  To manually push, do clasp push
```

**ALWAYS PUSH TO CLASP, NEVER PULL**

**DO NOT MAKE CHANGES IN BROWSER FROM SCRIPT.GOOGLE.COM UNLESS YOU ARE OKAY THAT THEY GET OVERWRITTEN ON NEXT PUSH**

If you get a message that .clasp.json does not exist, try `cp ../.clasp.json-example .clasp.json` and modify file with your project id and directory. To find your project id, open your project in script.google.com and click on the gear icon

### Execute Code from App Script web UI

**ALWAYS PUSH TO CLASP, NEVER PULL**

**DO NOT MAKE CHANGES IN BROWSER FROM SCRIPT.GOOGLE.COM UNLESS YOU ARE OKAY THAT THEY GET OVERWRITTEN ON NEXT PUSH**

- https://script.google.com
- log in if prompted
- select the project you just created from the list
- to execute from code panel:
  - Go to code panel by clicking on the < > button on the left side
  - click on Execute above the amain.ts file
- to execute from URL
  - Option A: Test Deployment
    - Click on Deploy (upper right)
    - Click on Test Deployment
    - Click on link (**test deployments always use the same link**)
  - Option B: New deployment with new link
    - Click on Deploy (upper right)
    - Click on New Deployment
    - Enter info (optional)
    - Click on Deploy
    - Click on link (**creates a new deployment id and link**)
  - Option C: Update existing deployment, keep link
    - Click on Deploy (upper right)
    - Click on Manage Deploy
    - Select most recent deployment and click Edit
    - Change Version to "New version"
    - Enter info (optional)
    - Click on Deploy
    - Click on link (**does not change deployment id or link of selected deployment**)
