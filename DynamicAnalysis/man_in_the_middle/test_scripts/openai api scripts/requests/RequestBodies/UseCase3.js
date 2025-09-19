import FormData from "form-data";
import fs from "fs";
import path from "path";

export const messages_fine_tuning = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "Can I visit the shop at 7AM ?" },
];

export const uploadFileReqBody = (purpose, file_path) => {
  const form = new FormData();
  const filePath = path.resolve(file_path);
  form.append("purpose", purpose);
  form.append("file", fs.createReadStream(filePath));
  return form;
};

export const createFineTuningJob = (file_id, model) => {
  return {
    training_file: `${file_id}`,
    model: `${model}`,
  };
};

export const chatCompletionReqBody = (model, messages) => {
  return {
    model: `${model}`,
    messages: messages,
  };
};
