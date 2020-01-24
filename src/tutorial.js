const { WebClient } = require('@slack/web-api')
const { createMessageAdapter } = require('@slack/interactive-messages')
const slackSigningSecret = process.env.SLACK_SIGNIN_SECRET;
const slackInteractions = createMessageAdapter(slackSigningSecret)


slackInteractions.action({type: 'ask_cover'}, (payload, respond) => {
    console.log('payload', payload)
    respond({text: 'Thanks for your submission'})
})



const web = new WebClient(process.env.SLACK_TOKEN);
const currentTime = new Date().toTimeString();

const port = process.env.port;

(async () => {
    const server = await slackInteractions.start(port)
    console.log(`Listening for events on port ${server.address().port}`)
})();