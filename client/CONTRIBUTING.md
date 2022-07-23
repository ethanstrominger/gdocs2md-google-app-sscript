### One Time Setup

####

- Create/select project
  - create a Google Cloud project (https://console.cloud.google.com) or use an existing one
  - if you create a project and have more than one project, the new project will not automatically be selected. In that case, select the Project from the drop down.
- Enable APIs
  - from hamburger menu, select API & Executes on the left, and then click +Enable APIs and Services on the top
  - search for "Script", select the Apps Script API, and Enable
  - search for "Drive" and enable the Google Drive API
- Create an OAuth consent screen
  - Click on OAuth consent screen
  - Select Internal option
  - Click Create
  - Fill in all required fields on the first screen
  - Click Save and Continue to navigate to Scope screen
  - Click Save and Continue to skip this screen to navigate to the Test users screen
  - Add yourself as a test user
- Create and Download credentials
  - Click on Create Credential
  - Select OAuth client id from drop down
  - On the next screen, select Desktop App, optionally enter a name, and click Create
  - On the next screen that confirms credentials are created, download the credentials
  - Copy the credentials to /googledocs-html-converter/googlescripts/src and rename to credentials.json.
- Associate Cloud project with your Apps Script
  - from https://console.cloud.google.com with your project selected, select Overview => Dashboard
  - copy the project number
  - from https://script.google.com with your project selected, click on the Gear icon for settings
  - Click on Change project under `Google Cloud Platform (GCP) Project`and paste the project number
    ![image](https://user-images.githubusercontent.com/32078396/178491762-d5d48dab-191d-41e1-b7ff-3b3315f9d734.png)

#### Deploy App Script Project

- https://script.google.com
- Select project you created with `clasp create` from drop down
- Deploy (upper right) => New Deploy
- Select API Executable for type
- Select User accessing the web app and Anyone with Google Account for WebApp configuration
  <img width="744" alt="image" src="https://user-images.githubusercontent.com/32078396/180614343-3d361498-2e2c-49b7-8e7c-bbb2efa01a23.png">
- Optionally, enter a name
- Click Deploy

#### Configure Node

#### Configure Node

- Copy the script id of the Apps Script or of one of the deployments.
  - Click the Gear icon to view the script id. The script id for the Apps Script will always execute the most recent code (the Test deployment).
  - Click Deploy => Manage Deployments to view the Deployment ID. This can be used in place of the Script id to select a specific version of the script.
- Check if there already is a .env file in client/src directory. If none, copy .env.EXAMPLE to .env.
- Replace value for SCRIPT_ID with value you copied from the first step
- From the terminal, navigate to client/src directory
- Run

```
yarn
```

### Run Script

- Navigate to client/src directory
- Run project

```
ts-node example
```

- If you have run the script before, you should be able to skip the following steps.
- Create a token.json
  - If prompted to authorize the app, click on the displayed link or copy into a browser
  - Press Continue when prompted
  - The last screen may say "The site can't be reached". Copy the code in the link in the address bar gtom after "code=" and up to "&scope". For example, if the link says: http://localhost/?code=4/0AdQt8qjpIvtCRIxFQxH1JgKlYspdFmQN1-UTWJlLniCvsFVDn7pS6QEYadHuNhW5rdkqeA&scope=https://www.googleapis.com/auth/drive the code would be 4/0AdQt8qjpIvtCRIxFQxH1JgKlYspdFmQN1-UTWJlLniCvsFVDn7pS6QEYadHuNhW5rdkqeA&
  - Paste this code into the terminal where it says "Enter the code from that page".
  - If you get an error Login Required, run

```
ts-node example
```

again

### Run Code (after first time)
