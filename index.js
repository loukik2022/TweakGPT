// dependencies: openai, express, body-parser, cors
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// OpenAI API key authentication
const configuration = new Configuration({
  apiKey: "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"
});
const openai = new OpenAIApi(configuration);

// Express server setup
const app = express();
app.use(bodyParser.json());
app.use(cors());

let model = "gpt-3.5-turbo", max_tokens = 50, temperature = 0.5, top_p = 0.9, userPrompt = "";

app.post("/postModel", async (req, res) => {
  if (req.body.model != undefined) {
    model = req.body.model;
  }
});

app.post("/postSlider", async (req, res) => {
  if (req.body.max_tokens != undefined) {
    max_tokens = +req.body.max_tokens;
  }
  if (req.body.temperature != undefined) {
    temperature = +req.body.temperature;
  }
  if (req.body.top_p != undefined) {
    top_p = +req.body.top_p;
  }
});

app.post("/", async (req, res) => {
  if (req.body.userPrompt != undefined) {
    userPrompt = req.body.userPrompt;
  }
  // log the variables
  // console.log(`Model: ${model}`);
  // console.log(`Max_tokens: ${max_tokens}`);
  // console.log(`Temperature: ${temperature}`);
  // console.log(`Top_p: ${top_p}`);
  // console.log(`User Prompt: ${userPrompt}`);
  // console.log("\n");

  // If userPrompt is present, make the OpenAI API call
  if (userPrompt) {
    try {
      const completion = await openai.createChatCompletion({
        model: model,
        messages: [
          {
            "role": "system",
            "content": "You are a helpful assistant."
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: max_tokens,
        temperature: temperature,
        top_p: top_p
      });

      const response = completion.data.choices[0].message.content;
      res.send({
        gpt: response
      });
    } catch (err) {
      console.error(err.response.status);
      console.error(err.response.statusText);
      res.send({
        gpt: err.response.statusText
      });
    }
  }
});

// send the array of object of models as JSON object to frontend, 
//  access each model using models.data[index].id
app.get('/models', (req, res) => {
  openai.listModels()
    .then((response) => {
      const modelsData = response.data;
      res.send(modelsData);
    })
    .catch((err) => {
      console.error(err.response.statusText);
      res.send({
        gpt: "Failed to get models, please try again later. (Network Error!)"
      });
    });
});

// Express server listening on port 3000
const port = process.env.PORT || 5174;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
