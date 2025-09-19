import FormData from "form-data";
import fs from "fs";
import path from "path";

export const messages = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "Who won the world series in 2020?" },
  {
    role: "assistant",
    content: "The Los Angeles Dodgers won the World Series in 2020.",
  },
  { role: "user", content: "Where was it played?" },
];

export const chatCompletionReqBody = (model, messages) => {
  return {
    model: `${model}`,
    messages: messages,
  };
};

export const chatCompletionWithFuncReqBody = (model) => {
  return {
    model: `${model}`,
    messages: [
      {
        role: "user",
        content: "What is the weather in San Francisco?",
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "get_current_weather",
          description: "Get the current weather",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g. San Francisco, CA",
              },
              format: {
                type: "string",
                enum: ["celsius", "fahrenheit"],
                description:
                  "The temperature unit to use. Infer this from the users location.",
              },
            },
            required: ["location"],
          },
        },
      },
    ],
    tool_choice: "required",
  };
};

export const createEmbeddingOfFAQReqBody = (inputStringAnswer) => {
  return {
    input: `${inputStringAnswer}`,
    model: "text-embedding-3-small",
  };
};

export const generateImageReqBody = () => {
  return {
    model: "dall-e-3",
    prompt: "A cute baby sea otter",
    n: 1,
    size: "1024x1024",
  };
};

export const createImageEditOrVariationReqBody = (
  prompt,
  n,
  size,
  image_path
) => {
  const form = new FormData();
  const imagePath = path.resolve(image_path);
  form.append("image", fs.createReadStream(imagePath));
  if (prompt) form.append("prompt", prompt);
  form.append("n", n);
  form.append("size", size);
  return form;
};

export const moderationsReqBody = () => {
  return {
    input: "I want to kill them.",
  };
};
