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
yarn global add @google/clasp
clasp login --no-localhost # prompts you to log in
```

- If the script displays a URL and asks you to enter a code:
  - Click on the URL or paste into a browser
  - Click Allow when prompted for permissions
  - Copy the authorization code from the browser, paste into the terminal, and press enter.
  - Confirm you see a message "Authorization successful"

After you have logged into clasp:

```
# You can change project name googledocs-html-converter if desired
clasp create --title googledocs-html-converter --type standalone
clasp push
```

#### Clould Set Up

- create a Google Cloud project (https://console.cloud.google.com)
  - copy the project number
- Enable App Script API is enabled
- associate the cloud project with your app script

  - from the app script page for the project, click on settings Gear icon
  - click on Change Project under `Google Cloud Platform (GCP) Project`
    ![image](https://user-images.githubusercontent.com/32078396/178492415-12da0aa5-b5dc-431e-8a2c-cb08d4405de5.png)
  - click on link to navigate to GCP project associated with this project
  - enter the project number in the dialog on the App Script screen
    ![image](https://user-images.githubusercontent.com/32078396/178491762-d5d48dab-191d-41e1-b7ff-3b3315f9d734.png)

#### Deploy Clasp Project

- In browser, find clasp tab or open https://script.google.com
- Select project you created with `clasp create` from drop down
- Deploy (upper right) => New Deploy
- Select WebApp (may not be necessary - TBD) and API Executable from 
<img width="744" alt="image" src="https://user-images.githubusercontent.com/32078396/180614343-3d361498-2e2c-49b7-8e7c-bbb2efa01a23.png">

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
