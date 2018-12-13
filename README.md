# Insurance_Agent
Auto Insurance Chatbot project.
### Contains:
- Dialogflow exported zip file
- Mock webpage
- Firebase Cloud Functions code

## Firebase CLI Setup Instructions
### Precondition:
- Have an existing Dialogflow project
- Have npm installed `sudo apt install npm` (on linux)

### Instructions:
1. `git clone https://github.com/dialogflow/Insurance_Agent.git`
2. `cd` to the `functions` directory
3. `npm install`
4. Install the Firebase CLI by running `npm install -g firebase-tools`
5. Login with your Google account, `firebase login`
  + Web browser will open to Google confirmation page
6. Add your project to the sample with $ `firebase use <project ID>`
  + Use `firebase list` to see all current projects and project IDs associated with your account
  + **OR**
  + In Dialogflow console under **Settings** ⚙ > **General** tab > copy **Project ID**.
7. Run `firebase deploy --only functions:dialogflowFirebaseFulfillment`
8. When successfully deployed, visit the **Firebase Project Console** link > **Functions** > **Dashboard**
  + Copy the link under the events column. For example: `https://us-central1-<PROJECTID>.cloudfunctions.net/<FUNCTIONNAME>`
9. Back in Dialogflow Console > **Fulfillment** > **Enable** Webhook.
10. Paste the URL from the Firebase Console’s events column into the **URL** field > **Save**.

You have now setup a firebase cli to use your Dialogflow project and have linked your dialogflow project to your Firebase Cloud Functions

Instructions for setup expanded from https://github.com/dialogflow/fulfillment-webhook-nodejs readme

## package.json note
Whenever you update package.json you need to rerun
`npm install`
