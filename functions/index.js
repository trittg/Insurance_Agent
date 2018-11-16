// Dialogflow fulfillment getting started guide:
// https://dialogflow.com/docs/how-tos/getting-started-fulfillment

'use strict';

const functions = require('firebase-functions');
const admin             = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
admin.initializeApp();
const db = admin.firestore();

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome (agent) {
    agent.add(`Welcome to my agent!- CLOUD FUNCTION`);
  }

  function fallback (agent) {
    agent.add(`I didn't understand- CLOUD FUNCTION`);
    agent.add(`I'm sorry, can you try again?- CLOUD FUNCTION`);
  }

  function addDriver(agent) {
    // Access a specific parameter from the agent
    // agent.parameters.parametername
    var firstName = agent.parameters.first-name;
    // Set the path for the firestore db transaction
    // const dialogflowAgentRef = db.collection('accounts').doc(account)
    //                            .collection('drivers').doc(String(agent.parameters.License));

    agent.add(`Trying to add "${firstName}" `);
    //Try to update the database with document {entry: "<value of database entry>"}
    /*
    return db.runTransaction(transaction => {
        transaction.set(dialogflowAgentRef, agent.parameters);
        return Promise.resolve('Write complete');
    }).then(doc => {
        agent.add(`Added "${driverName}", with license# "${driverLic}", to the Firestore database.`);
        return
    }).catch(err => {
        console.log(`Error writing to Firestore: ${err}`);
        agent.add(`Failed to write "${driverName}" to the Firestore database.`);
    });
    */
}

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase inline editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://dialogflow.com/images/api_home_laptop.svg',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://docs.dialogflow.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  // intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('AddDriver2.0', addDriver);
  agent.handleRequest(intentMap);
});