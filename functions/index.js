// Dialogflow fulfillment getting started guide:
// https://dialogflow.com/docs/how-tos/getting-started-fulfillment

'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Text, Card, Image, Suggestion, Payload } = require('dialogflow-fulfillment');


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
admin.initializeApp();
const db = admin.firestore();

const theHartfordAARPLogo_URL = 'https://s0.hfdstatic.com/sites/the_hartford/img/aarp_pl_logo.svg'
const autoInsuranceProgram = 'https://www.thehartford.com/car-insurance/aarp'

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add(`Hello! Welcome to The Hartford Insurance Chatbot`);
    agent.add(new Card({
      title: 'AARP | The Hartford',
      imageUrl: theHartfordAARPLogo_URL,
      buttonText: 'Learn more about the Auto Insurance Program',
      buttonUrl: autoInsuranceProgram
    })
    );
    agent.add(`I can help you manage your auto insurance policy, what would you like me to do?`);
    agent.add(new Suggestion(`Add Driver`));
    agent.add(new Suggestion(`Add vehicle`));
    agent.add(new Suggestion(`Change address`));
  }


  function fallback(agent) {
    agent.add(`I didn't understand- CLOUD FUNCTION`);
    agent.add(`I'm sorry, can you try again?- CLOUD FUNCTION`);
  }

  function addDriver(agent) {
    agent.add('Current Parameters');
    agent.add(`TEST: "${JSON.stringify(agent.parameters)}"`);
    
    var firstName = agent.parameters.First_Name;

    if (firstName === '') {
      agent.add(`Sure Thing! we can add a driver to your policy.`);
      agent.add("What is the new drivers first and last name?")
      agent.add('--Going to name prompt!--');
      agent.setContext({
        name: 'ad_name',
        lifespan: 1,
        parameters: agent.parameters
      });
    } else {
      agent.add(`Sure Thing! we can add "${firstName}" to your policy.`);
      agent.add(`What is "${firstName}"s last name?`)
      agent.add('--Going to the last name prompt!--');
      agent.setContext({
        name: 'ad_last-name',
        lifespan: 1,
        parameters: agent.parameters
      });
    }
  }

  function promptName(agent) {
    agent.add('Current Parameters');
    agent.add(`TEST: "${JSON.stringify(agent.parameters)}"`);

    var firstName = agent.parameters.First_Name;  
    
    agent.add(`What is "${firstName}"s Date of Birth?`);
    agent.setContext({
      name: 'ad_date-of-birth',
      lifespan: 1,
      parameters: agent.parameters
    });
  }

  function promptLastName(agent) {
    agent.add('Current Parameters');
    agent.add(`TEST: "${JSON.stringify(agent.parameters)}"`);

    agent.add(`What is "${firstName}"s Date of Birth?`);
    agent.setContext({
      name: 'DateOfBirth',
      lifespan: 1,
      parameters: agent.parameters
    });
  }

  function promptDOB(agent) {
    agent.add('Current Parameters');
    agent.add(`TEST: "${JSON.stringify(agent.parameters)}"`);

    agent.add(`Congrats you beat reached the end!... GO DO MORE WORK`);
  }
  
  function promptConfirmation(agent) {
	agent.add('Current Parameters');
	agent.add(` "${First_Name}, "${Last_Name}", who lives at "${address}", was born on "${birthday}, and has been driving "${duration}?"`);
  
	agent.setContext({
		name: 'dataConfirmation'
		lifespan: 1,
		parameters: agent.parameters
	});
  }

  //entities: name, place, date, duration.

  /*---Sample set context---
    agent.setContext({
      name: 'temperature',
      lifespan: 1,
      parameters:{temperature: temperature, unit: unit}
    });
  */

  /*---Sample Firestore transaction---
    // Value stored is a JSON OBJECT {entry: "<value of database entry>"}
    // Set the path for the firestore db transaction
    const dialogflowAgentRef = db.collection('accounts').doc(account)
                                .collection('drivers').doc(String(agent.parameters.License));

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

  /*---Sample Function Handler---
    function yourFunctionHandler(agent) {
      agent.add(`This message is from Dialogflow's Cloud Functions for Firebase inline editor!`);
      agent.add(new Card({
          title: `Title: this is a card title`,
          imageUrl: 'https://dialogflow.com/images/api_home_laptop.svg',
          text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
          buttonText: 'This is a button',
          buttonUrl: 'https://docs.dialogflow.com/'
        })
      );
      agent.add(new Suggestion(`Quick Reply`));
      agent.add(new Suggestion(`Suggestion`));
      agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    }
  */

  /*---Sample Google assistant intent handler---
    // Uncomment and edit to make your own Google Assistant intent handler
    // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    // below to get this function to be run when a Dialogflow intent is matched
    function googleAssistantHandler(agent) {
      let conv = agent.conv(); // Get Actions on Google library conv instance
      conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
      agent.add(conv); // Add Actions on Google library responses to your agent's response
    }
  */

  let intentMap = new Map();
  // Run the proper function handler based on the matched Dialogflow intent name
  // intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('TR Add Driver', addDriver);
  intentMap.set('Name', promptName);
  intentMap.set('LastName', promptLastName);
  intentMap.set('DateOfBirth', promptDOB);
  intentMap.set('Relation', promptConfirmation);

  agent.handleRequest(intentMap);
});