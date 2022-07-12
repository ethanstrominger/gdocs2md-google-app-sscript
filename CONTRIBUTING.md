One time set up:

- create a GCP project with appropriate privileges
- fork this repository
- `yarn`
- create your own Google Apps Script project or ask Ethan to share his

  ```
  clasp login
  clasp create "<project title>"
  clasp push
  ```

- get the project id of your project.
  - console.cloud.google.com
  - select your project from drop down at the top
  - project id is at the top of the page
  - copy the project number
- associate the cloud project with your app script
  - from the app script page for the project, click on settings Gear icon
- `clasp run doGet`
