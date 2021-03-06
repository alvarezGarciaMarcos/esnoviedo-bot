var express = require("express");
var app = express();
var axios = require("axios");
const bodyParser = require("body-parser");
const request_view = {
  trigger_id: "",
  view: {
    type: "modal",
    callback_id: "cover-submission",
    title: {
      type: "plain_text",
      text: "Pedir una portada",
      emoji: true
    },
    submit: {
      type: "plain_text",
      text: "Pedir",
      emoji: true
    },
    close: {
      type: "plain_text",
      text: "Cancelar",
      emoji: true
    },
    blocks: [
      {
        type: "input",
        block_id: "title",
        element: {
          action_id: "title",
          type: "plain_text_input"
        },
        label: {
          type: "plain_text",
          text: "Título del evento",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: "comite",
        element: {
          type: "static_select",
          action_id: "comite",
          placeholder: {
            type: "plain_text",
            text: "Selecciona un comité",
            emoji: true
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "Lúdicas",
                emoji: true
              },
              value: "ludicas"
            },
            {
              text: {
                type: "plain_text",
                text: "Cultura",
                emoji: true
              },
              value: "cultura"
            },
            {
              text: {
                type: "plain_text",
                text: "Impacto Social",
                emoji: true
              },
              value: "impacto_social"
            },
            {
              text: {
                type: "plain_text",
                text: "Viajes",
                emoji: true
              },
              value: "viajes"
            },
            {
              text: {
                type: "plain_text",
                text: "Deportes",
                emoji: true
              },
              value: "deportes"
            }
          ]
        },
        label: {
          type: "plain_text",
          text: "Comité que solicita la portada",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: "dl",
        element: {
          action_id: "dl",
          type: "datepicker",
          initial_date: "2020-01-01",
          placeholder: {
            type: "plain_text",
            text: "Deadline",
            emoji: true
          }
        },
        label: {
          type: "plain_text",
          text: "Deadline",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: "comments",
        element: {
          action_id: "comments",
          type: "plain_text_input",
          multiline: true
        },
        label: {
          type: "plain_text",
          text: "Comentarios para la persona que diseña",
          emoji: true
        },
        hint: {
          type: "plain_text",
          text: "Si no hay ninguno, escribir: ' . '"
        }
      },
      {
        type: "input",
        block_id: "event-date",
        element: {
          action_id: "event-date",
          type: "datepicker",
          initial_date: "2020-01-01",
          placeholder: {
            type: "plain_text",
            text: "Select a date",
            emoji: true
          }
        },
        label: {
          type: "plain_text",
          text: "Fecha del evento",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: "mp",
        element: {
          action_id: "mp",
          type: "plain_text_input",
          multiline: true
        },
        label: {
          type: "plain_text",
          text: "MPs",
          emoji: true
        },
        hint: {
          type: "plain_text",
          text: "Escribir uno por línea"
        }
      },
      {
        type: "input",
        block_id: "price",
        element: {
          action_id: "price",
          type: "plain_text_input"
        },
        label: {
          type: "plain_text",
          text: "Precio",
          emoji: true
        },
        hint: {
          type: "plain_text",
          text: "Si no tiene precio, escribir '0'"
        }
      },
      {
        type: "input",
        block_id: "location",
        element: {
          action_id: "location",
          type: "plain_text_input"
        },
        label: {
          type: "plain_text",
          text: "Localización",
          emoji: true
        }
      }
    ]
  }
};

var port = process.env.PORT;
app.use(bodyParser());

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.post("/cover", function(req, res) {
  res.status(200).end();
  let payload = {
    username: req.body.user_name,
    trigger_id: req.body.trigger_id,
    text: req.body.text
  };

  openDialog(payload);
});

//Handles de submission of forms
app.post("/interactions", function(req, res) {
  res.status(200).end();
  const config = {
    headers: { Authorization: "Bearer " + process.env.BOT_USER_TOKEN }
  };
  let parsed_request = JSON.parse(req.body.payload);
  const event_cover = {
    title: parsed_request.view.state.values.title.title.value,
    mp: parsed_request.view.state.values.mp.mp.value,
    dl: parsed_request.view.state.values.dl.dl.selected_date,
    location: parsed_request.view.state.values.location.location.value,
    comments: parsed_request.view.state.values.comments.comments.value,
    event_date:
      parsed_request.view.state.values["event-date"]["event-date"]
        .selected_date,
    price: parsed_request.view.state.values.price.price.value,
    comite:
      parsed_request.view.state.values.comite.comite.selected_option.text.text,
    username: parsed_request.user.username
  };
  let blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Nueva portada:\n"
      }
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: "*Título:*\n"
        },
        {
          type: "mrkdwn",
          text: "*DL:*\n"
        },
        {
          type: "mrkdwn",
          text: "*MP(s):*\n"
        },
        {
          type: "mrkdwn",
          text: "*Fecha del Evento:*\n"
        },
        {
          type: "mrkdwn",
          text: "*Localización:*\n"
        },
        {
          type: "mrkdwn",
          text: "*Precio:*\n"
        },
        {
          type: "mrkdwn",
          text: "*Comité:*\n"
        },
        {
          type: "mrkdwn",
          text: "*Comentarios para quién diseña:*\n"
        }
      ]
    },
    {
      type: "divider"
    }
  ];

  blocks = populateMessage(blocks, event_cover);

  const body = {
    blocks: blocks,
    channel: "#general",
    text: "¡Nueva petición de portada!",
    as_user: true
  };

  //axios.post("https://slack.com/api/chat.postMessage", body, config);
  createDM(event_cover.username);
});

function openDialog(payload) {
  const config = {
    headers: { Authorization: "Bearer " + process.env.SLACK_ACCESS_TOKEN }
  };

  request_view.trigger_id = payload.trigger_id;
  request_view.view.blocks[0].element["initial_value"] = payload.text;
  const body = request_view;

  axios.post("https://slack.com/api/views.open", body, config);
}

function populateMessage(blocks, event_cover) {
  blocks[1].fields[0].text += event_cover.title;
  blocks[1].fields[1].text += event_cover.dl;
  blocks[1].fields[2].text += event_cover.mp;
  blocks[1].fields[3].text += event_cover.event_date;
  blocks[1].fields[4].text += event_cover.location;
  blocks[1].fields[5].text += event_cover.price;
  blocks[1].fields[6].text += event_cover.comite;
  blocks[1].fields[7].text += event_cover.comments;
  blocks[0].text.text += event_cover.username;
  return blocks;
}

function createDM(username) {
  let body = {
    users: username
  };

  console.log(body)

  const config = {
    headers: { Authorization: "Bearer " + process.env.SLACK_ACCESS_TOKEN }
  };

  axios
    .post("https://slack.com/api/conversations.open", body, config)
    .then(function(response) {
      console.log(response)
    });
}

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
