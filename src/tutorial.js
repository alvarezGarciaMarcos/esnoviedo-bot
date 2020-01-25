const axios = require('axios')
const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { WebClient } = require('@slack/web-api')
const { createMessageAdapter } = require('@slack/interactive-messages')
const slackSigningSecret = process.env.SLACK_SIGNIN_SECRET;
const slackInteractions = createMessageAdapter(slackSigningSecret)


const port = process.env.PORT;
const request_view = {
  trigger_id: '',
  view: {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Pedir una portada",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Ask",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "blocks": [
      {
        "type": "input",
        "element": {
          "type": "plain_text_input"
        },
        "label": {
          "type": "plain_text",
          "text": "Título del evento",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Comité que solicitala portada"
        },
        "accessory": {
          "type": "static_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Select an item",
            "emoji": true
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Lúdicas",
                "emoji": true
              },
              "value": "ludicas"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Cultura",
                "emoji": true
              },
              "value": "cultura"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Impacto Social",
                "emoji": true
              },
              "value": "impacto_social"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Viajes",
                "emoji": true
              },
              "value": "viajes"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Deportes",
                "emoji": true
              },
              "value": "deportes"
            }
          ]
        }
      },
      {
        "type": "input",
        "element": {
          "type": "datepicker",
          "initial_date": "2020-01-01",
          "placeholder": {
            "type": "plain_text",
            "text": "Deadline",
            "emoji": true
          }
        },
        "label": {
          "type": "plain_text",
          "text": "Deadline",
          "emoji": true
        }
      },
      {
        "type": "input",
        "element": {
          "type": "plain_text_input",
          "multiline": true
        },
        "label": {
          "type": "plain_text",
          "text": "Comenetarios para la persona que diseña",
          "emoji": true
        }
      },
      {
        "type": "input",
        "element": {
          "type": "datepicker",
          "initial_date": "2020-01-01",
          "placeholder": {
            "type": "plain_text",
            "text": "Select a date",
            "emoji": true
          }
        },
        "label": {
          "type": "plain_text",
          "text": "Fecha del evento",
          "emoji": true
        }
      },
      {
        "type": "input",
        "element": {
          "type": "plain_text_input"
        },
        "label": {
          "type": "plain_text",
          "text": "Hora del evento",
          "emoji": true
        }
      },
      {
        "type": "input",
        "element": {
          "type": "plain_text_input"
        },
        "label": {
          "type": "plain_text",
          "text": "Precio",
          "emoji": true
        }
      },
      {
        "type": "input",
        "element": {
          "type": "plain_text_input"
        },
        "label": {
          "type": "plain_text",
          "text": "Localización",
          "emoji": true
        }
      }
    ]
  }}
const app = express();

app.use('/', slackInteractions.requestListener());

app.use(bodyParser());

const server = createServer(app);

server.listen(port, () => {
    console.log(`Listening for events on ${server.address().port}`);
  });

slackInteractions.action({type: 'message_action'}, (payload, respond) => {
    const config = {
      headers: {Authorization: 'Bearer ' + process.env.SLACK_ACCESS_TOKEN}
    }
    request_view.trigger_id = payload.trigger_id
    const body = request_view

    /* console.log('payload', payload)
    console.log('config', config)
    console.log('body', body)
     */
    
   axios.post('https://slack.com/api/views.open', body, config)
      .then(console.log).catch(console.log)
})


