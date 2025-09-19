const https = require("https");
const axios = require("axios");
const fs = require("fs");
const Request = require("../models/Requests");
const FormData = require("form-data");
const { inferType } = require("@jsonhero/json-infer-types");

const agent = new https.Agent({ rejectUnauthorized: false });

const formatDomain = (domain) => {
  if (!(domain.startsWith("http_") || domain.startsWith("https_")))
    throw new Error("Invalid URL, should start with http_ or https_.");
  domain = domain.replace(/(http_)|(https_)/g, (match) => {
    if (match === "http_") return "http://";
    else if (match === "https_") return "https://";
  });
  return domain.replace(/_/g, ".");
};

const makeRequest = async (target, method, originalHeaders, body, files) => {
  try {
    let headers = {};
    for (let key of Object.keys(originalHeaders)) {
      if (!["host", "content-length", "transfer-encoding", "connection", "if-none-match", "if-modified-since"].includes(key.toLowerCase())) {        
        headers[key] = originalHeaders[key];
      }
    }
    let options = { method, headers, httpsAgent: agent };

    if (files) {
      const form = new FormData();
      // Add JSON fields to the form
      for (const key in body) {
        form.append(key, body[key], {
          contentType: "application/json",
        });
      }

      // Add the files to the form
      files.forEach((file) =>
        form.append(file.fieldname, fs.createReadStream(file.path), {
          filename: file.originalname,
        })
      );

      options.data = form;
    } else {
      if (Object.keys(body).length !== 0) options.data = body;
    }
    console.log(`Ready to make the request ${method} ${target}`);
    return await axios(target, options);
  } catch {
    (error) => {
      console.log(`ERROR while trying to make the request ${method} ${target}`);
    };
  }
};

function constructSchema(obj) {
  if (typeof obj !== "object" || obj === null) {
    // Base case: if obj is not an object, return its inferred type
    return inferType(obj);
  }

  // If obj is an object, iterate over its properties
  const schema = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Recursively construct schema for nested properties
      schema[key] = constructSchema(obj[key]);
    }
  }
  return schema;
}

const saveRequest = async (ip, method, url, tag, endpoint, headers, body, query, paramsArr, responseStatus, data) => {
  const requestSchema = constructSchema(data);
  const request = new Request({ip, method, url, endpoint, headers, body, query, params: paramsArr, response: { responseStatus, requestSchema }, tag,});
  return await request.save();
};

exports.mim = async (req, res) => {
  const { ip, headers, method, query, files } = req;
  let body = req.body;
  const queryString = new URLSearchParams(query).toString();
  let params = req.params[0];
  let paramsArr = params.split("/");
  let domain = req.params.domain;
  let tag = req.params.tag;

  try {
    domain = formatDomain(domain);
    console.log(
      "Request Info: \n",
      `ip: ${ip}, tag: ${tag}, domain: ${domain}, params: ${params}, files: ${files}:`
    );
    const target = `${domain}/${params}${queryString ? `?${queryString}` : ""}`;
    console.log(`Before ${method} request to : ${target}...`);
    const response = await makeRequest(target, method, headers, body, files);
    const { status: responseStatus, data } = response;
    console.log(`Request ${method} ${target} was made successfully`);
    if (files) files.forEach((file) => (body[file.fieldname] = file));
    const bodySchema = constructSchema(body);
    console.log(`Ready to save request info for ${method} ${target}`)
    await saveRequest(ip, method, domain, tag, params, headers, bodySchema, query, paramsArr, responseStatus, data);
    console.log(`saveRequest was successfull for ${method} ${target}`)
    return res.status(responseStatus).json(data);
  } catch (e) {
    console.log(e.message);
    return res
      .status(500)
      .json({ message: e.message || "Internal server error." });
  }
};
