const axios = require('axios')
const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { WebClient } = require('@slack/web-api')
const { createMessageAdapter } = require('@slack/interactive-messages')
const slackSigningSecret = process.env.SLACK_SIGNIN_SECRET;
const slackInteractions = createMessageAdapter(slackSigningSecret)


const port = process.env.PORT;
const view = {
  trigger_id: "156772938.1827394",
  view: {
    type: "modal",
    callback_id: "modal-identifier",
    title: {
      type: "plain_text",
      text: "Just a modal"
    },
    blocks: [
      {
        type: "section",
        block_id: "section-identifier",
        text: {
          type: "mrkdwn",
          text: "*Welcome* to ~my~ Block Kit _modal_!"
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Just a button"
          },
          action_id: "button-identifier"
        }
      }
    ]
  }
}
const app = express();

app.use('/', slackInteractions.requestListener());

app.use(bodyParser());

const server = createServer(app);

server.listen(port, () => {
    console.log(`Listening for events on ${server.address().port}`);
  });

slackInteractions.action({type: 'message_action'}, (payload, respond) => {
    const config = {
      headers: {Authorization: `Bearer ${process.env.SLACK_ACCESS_TOKEN}`}
    }
    view.trigger_id = payload.trigger_id
    const body = view

    console.log('payload', payload)
    axios.post('https://slack.com/api/views.open', body, config)
      .then(console.log).catch(console.log)

})


