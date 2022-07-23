### One time set up

#### Create a Google App Script Account

- If you do not have a Google App Script account
  - from browser, log into a Google account
  - visit https://script.google.com/home/usersettings
  - turn on Google Apps Script API

#### Clone from GitHub

- Fork repo and clone the fork to a local directory
- Commands to execute after you cloned

```
cd html-markdown-conversion
cd googlescripts/src
yarn
```

#### Clasp Setup

From terminal:

```
yarn global add @google/clasp
clasp login --no-localhost # prompts you to log in
```

After you have logged into clasp:

```
# You can change html-markdown-conversion to customize the project name
clasp create --title html-markdown-conversion --type standalone
clasp
```

#### Deploy Clasp Project

- In browser, find clasp tab or open https://script.google.com
- Select project you created with `clasp create` from drop down
- Deploy (upper right) => New Deploy
- Click Deploy
- Click on < > icon on left to open tab
- Click on Execute on top bar

### Modify Code

- pull code from GitHub
- make changes using your favorite editor
- from terminal:

```
cd googlescripts/src
clasp login # if not logged in
clasp push
```

**ALWAYS PUSH TO CLASP, NEVER PULL**

**DO NOT MAKE CHANGES IN BROWSER FROM SCRIPT.GOOGLE.COM UNLESS YOU ARE OKAY THAT THEY GET OVERWRITTEN ON NEXT PUSH**

If you get a message that .clasp.json does not exist, try `cp ../.clasp.json-example .clasp.json` and modify file with your project id and directory. To find your project id, open your project in script.google.com and click on the gear icon

### Execute Code from App Script web UI

**ALWAYS PUSH TO CLASP, NEVER PULL**

**DO NOT MAKE CHANGES IN BROWSER FROM SCRIPT.GOOGLE.COM UNLESS YOU ARE OKAY THAT THEY GET OVERWRITTEN ON NEXT PUSH**

- https://script.google.com
- log in if prompted
- open project created above from drop down
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
