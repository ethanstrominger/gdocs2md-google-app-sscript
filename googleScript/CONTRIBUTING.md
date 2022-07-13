### One time set up

- Fork repo
- Commands to execute

```
cd <root>
cd googlescript
yarn global add @google/clasp
yarn
# below command opens browser for you to login to clasp as a global user
# no-localhost provides secret code in browser - otherwise, you get a localhost error
clasp login --no-localhost
cd src
clasp create --title <project-name> --type standalone
clasp push
```

**ALWAYS PUSH TO CLASP, NEVER PULL**

- follow instructions for executing the app script from the browser

### Execute Code from Browser

- https://script.google.com
- log in using same account as above
- open project created above
- click on Execute above the amain.ts file

### Modify Code

- pull code from GitHub
- make changes using your favorite editor
- clasp push
- execute from browser (see previous section)

**ALWAYS PUSH TO CLASP, NEVER PULL**
