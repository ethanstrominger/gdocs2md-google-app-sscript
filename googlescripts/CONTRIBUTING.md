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

### Execute Code from Browser

- https://script.google.com
- log in using same account as above
- open project created above
- click on Execute above the amain.ts file

```

```
