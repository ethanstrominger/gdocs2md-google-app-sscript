### One time set up

- Fork repo
- Commands to execute

```
cd <root>
cd googlescripts
yarn global add @google/clasp
yarn
# below command opens browser for you to login to clasp as a global user
# no-localhost provides secret code in browser - otherwise, you get a localhost error
clasp login --no-localhost
cd src
clasp create --title <project-name> --type standalone
clasp push
```

**NEVER MODIFY CODE FROM BROWSER**

**ALWAYS PUSH TO CLASP, NEVER PULL**

### Modify Code

- pull code from GitHub
- make changes using your favorite editor
- from terminal:

```
cd googlescripts/src
clasp login # if not logged in
clasp push
```

If you get a message that .clasp.json does not exist, try `cp ../.clasp.json-example .clasp.json` and modify file with
your project id and directory. To find your project id, open your project in script.google.com and click on the gear icon

- execute from browser (see next section)

**NEVER MODIFY CODE FROM BROWSER**

**ALWAYS PUSH TO CLASP, NEVER PULL**

### Execute Code from App Script web UI

- https://script.google.com
- log in using same account as above
- open project created above
- click on Execute above the amain.ts file

### Deploy and run with URL

First time:

- https://script.google.com
- log in using same account as above
- open project created above
- First time:
  - Deploy
  - New Deployment
  - Enter info (optional)
  - Click Deploy
  - Click on lin
- If not first time, you have multiple choices
  - Option A: Test Deployment
    - Click on Deploy
    - Click on Test Deployment
    - Click on link (**test deployments always use the same link**)
  - Option B: New deployment with new link
    - Click on Deploy
    - Click on New Deployment
    - Enter info (optional)
    - Click on Deploy
    - Click on link (**creates a new deployment id and link**)
  - Option C: Update existing deployment, keep link
    - Click on Manage Deploy
    - Select most recent deployment and click Edit
    - Change Version to "New version"
    - Enter info (optional)
    - Click on Deploy
    - Click on link (**does not change deployment id or link of selected deployment**)
