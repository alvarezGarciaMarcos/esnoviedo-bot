const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { WebClient } = require('@slack/web-api')
const { createMessageAdapter } = require('@slack/interactive-messages')
const slackSigningSecret = process.env.SLACK_SIGNIN_SECRET;
const slackInteractions = createMessageAdapter(slackSigningSecret)

const port = process.env.PORT;

const app = express();

app.use('/', slackInteractions.requestListener());

app.use(bodyParser());

const server = createServer(app);

server.listen(port, () => {
    console.log(`Listening for events on ${server.address().port}`);
  });

slackInteractions.action({type: 'message_action'}, (payload, respond) => {
    console.log('payload', payload)
    respond({text: 'Thanks for your submission'})
})
