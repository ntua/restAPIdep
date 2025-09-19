import FormData from "form-data";
import fs from "fs";
import path from "path";

export const uploadFileReqBody = (purpose, file_path) => {
  const form = new FormData();
  const filePath = path.resolve(file_path);
  form.append("purpose", purpose);
  form.append("file", fs.createReadStream(filePath));
  return form;
};

export const createBatchReqBody = (file_id) => {
  return {
    input_file_id: `${file_id}`,
    endpoint: "/v1/chat/completions",
    completion_window: "24h",
  };
};
