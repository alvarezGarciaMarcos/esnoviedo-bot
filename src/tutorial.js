const { WebClient } = require('@slack/web-api')
const { createMessageAdapter } = require('@slack/interactive-messages')
const slackSigningSecret = process.env.SLACK_SIGNIN_SECRET;
const slackInteractions = createMessageAdapter(slackSigningSecret)
const ngrok = require('ngrok')

slackInteractions.action({ type: 'message_action' }, (payload, respond) => {
    // Logs the contents of the action to the console
    console.log('payload', payload);
  
    // Send an additional message only to the user who made interacted, as an ephemeral message
        respond({ text: 'Thanks for your submission.', response_type: 'ephemeral' });
    
    // If you'd like to replace the original message, use `chat.update`.
    // Not returning any value.
  });



const web = new WebClient(process.env.SLACK_TOKEN);
const currentTime = new Date().toTimeString();

const port = process.env.port || 3000;

(async () => {
    const server = await slackInteractions.start(port)
    const url = await ngrok.connect();
    console.log(`This is the url of ngrok: ${url}`)

    console.log(`Listening for events on port ${server.address().port}`)
})();