This project consists of an eXpress server written in Node, a Node script, and an Apps Script written in a Node like language. The App Script can be
called from the eXpress Server, the command line, a batch job, or directly from the App Script UI. Code for the eXpress Server and Node script are in the client directory and code for the App Script are in the googlescript directory.

The google script directory includes a separate [CONTRIBUTING.md in googleScript directory](googleScript/CONTRIBUTING.md). See [RESOURCES.md](./RESOURCES.md) for additional information.

One time set up:

- create a GCP project with appropriate privileges
- fork this repository
- `yarn`
- create your own Google Apps Script project or ask Ethan to share his

  ```
  clasp login --no-localhost # will prompt you to login to your google account in browswer
  clasp create "<project title>"
  clasp push
  clasp setting projectId <projectid>
  ```

- get the project id of your GCP.
  - console.cloud.google.com
  - select your project from drop down at the top
  - project id is at the top of the page
  - copy the project number
  - make sure App Script API is enabled
- associate the cloud project with your app script

  - from the app script page for the project, click on settings Gear icon
  - click on Change Project under `Google Cloud Platform (GCP) Project`
    ![image](https://user-images.githubusercontent.com/32078396/178492415-12da0aa5-b5dc-431e-8a2c-cb08d4405de5.png)
  - click on link to navigate to GCP project associated with this project
  - enter the project number in the dialog on the App Script screen
    ![image](https://user-images.githubusercontent.com/32078396/178491762-d5d48dab-191d-41e1-b7ff-3b3315f9d734.png)

- `clasp run doGet` -->
