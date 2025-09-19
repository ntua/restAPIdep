import axios from "axios";
import dotenv from "dotenv";
import {
  addCommentToDiscussionReqBody,
  addCommentToPageReqBody,
  appendBlockChildren,
  archiveAPageReqBody,
  createDatabaseReqBody,
  createPage2ReqBody,
  createPage3ReqBody,
  createPageReqBody,
  createPageWithContentReqBody,
  filterADatabaseReqBody,
  queryADatabaseReqBody,
  search1ReqBody,
  search2ReqBody,
  search3ReqBody,
  sortADatabaseReqBody,
  updateBlockReqBody,
  updateDatabasePropsReqBody,
  updateDatabaseReqBody,
} from "./request_bodies.js";

dotenv.config();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printInfo(res) {
  console.log(
    `${requestCounter++}. ${res.request.method} ${
      res.config.url
    } - STATUS CODE:`,
    res.status,
    "\x1b[32m✔\x1b[0m"
  );
}

function printErrorInfo(error) {
  console.log(
    `${requestCounter++}. ${error.request.method} ${error.config.url} :`,
    error.response.data.message,
    "\x1b[31m✕\x1b[0m"
  );
}

const currentUseCase = "1";

const baseURL = `http://localhost:3003/proxy/https_api_notion_com/${currentUseCase}`;

var requestCounter = 1;

const authHeader = `Bearer ${process.env.BEARER_TOKEN}`;
const headers = {
  headers: {
    Authorization: authHeader,
    "Notion-Version": process.env.NOTION_VERSION,
  },
};

// List all users
var user_id = "";
try {
  let res = await axios.get(`${baseURL}/v1/users`, headers);
  user_id = res.data.results[0].id;
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Retrieve a user
try {
  let res = await axios.get(`${baseURL}/v1/users/${user_id}`, headers);
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Retrieve your token’s bot user
try {
  let res = await axios.get(`${baseURL}/v1/users/me`, headers);
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Create a database
var database_id = "";
try {
  let res = await axios.post(
    `${baseURL}/v1/databases`,
    createDatabaseReqBody(process.env.INITIAL_PAGE_ID),
    headers
  );
  database_id = res.data.id;
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Retrieve a database
try {
  let res = await axios.get(`${baseURL}/v1/databases/${database_id}`, headers);
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Update a database
try {
  let res = await axios.patch(
    `${baseURL}/v1/databases/${database_id}`,
    updateDatabaseReqBody(),
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Update database properties
try {
  let res = await axios.patch(
    `${baseURL}/v1/databases/${database_id}`,
    updateDatabasePropsReqBody(),
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Retrieve a database
try {
  let res = await axios.get(`${baseURL}/v1/databases/${database_id}`, headers);
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Create a page
try {
  let res = await axios.post(
    `${baseURL}/v1/pages`,
    createPageReqBody(database_id, user_id),
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Create a page with content
try {
  let res = await axios.post(
    `${baseURL}/v1/pages`,
    createPageWithContentReqBody(database_id, user_id),
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Create a page
var page_id = "";
try {
  let res = await axios.post(
    `${baseURL}/v1/pages`,
    createPage2ReqBody(database_id, user_id),
    headers
  );
  page_id = res.data.id;
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Append block children
var block_id = "";
try {
  let res = await axios.patch(
    `${baseURL}/v1/blocks/${page_id}/children`,
    appendBlockChildren(),
    headers
  );
  block_id = res.data.results[1].id;
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Update a block
try {
  let res = await axios.patch(
    `${baseURL}/v1/blocks/${block_id}`,
    updateBlockReqBody(),
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Retrieve a block
try {
  let res = await axios.get(`${baseURL}/v1/blocks/${block_id}`, headers);
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Retrieve block children
try {
  let res = await axios.get(
    `${baseURL}/v1/blocks/${page_id}/children?page_size=100`,
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Delete a block
try {
  let res = await axios.delete(`${baseURL}/v1/blocks/${block_id}`, headers);
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Create a page
var property_id = "";
try {
  let res = await axios.post(
    `${baseURL}/v1/pages`,
    createPage3ReqBody(database_id, user_id),
    headers
  );
  page_id = res.data.id;
  property_id = res.data.properties["When to visit"].id;
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Retrieve a page
try {
  let res = await axios.get(
    `${baseURL}/v1/pages/${page_id}?filter_properties=${property_id}`,
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Retrieve a page
try {
  let res = await axios.get(`${baseURL}/v1/pages/${page_id}`, headers);
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Retrieve a page property item
try {
  let res = await axios.get(
    `${baseURL}/v1/pages/${page_id}/properties/${property_id}`,
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Add comment to page
var discussion_id = "";
try {
  let res = await axios.post(
    `${baseURL}/v1/comments`,
    addCommentToPageReqBody(page_id),
    headers
  );
  discussion_id = res.data.discussion_id;
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Retrieve comments
try {
  let res = await axios.get(
    `${baseURL}/v1/comments?block_id=${page_id}&page_size=100`,
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Add comment to discussion
try {
  let res = await axios.post(
    `${baseURL}/v1/comments`,
    addCommentToDiscussionReqBody(discussion_id),
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Retrieve comments
try {
  let res = await axios.get(
    `${baseURL}/v1/comments?block_id=${page_id}&page_size=100`,
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Archive a page
try {
  let res = await axios.patch(
    `${baseURL}/v1/pages/${page_id}`,
    archiveAPageReqBody(),
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Filter a database
try {
  let res = await axios.post(
    `${baseURL}/v1/databases/${database_id}/query`,
    filterADatabaseReqBody(),
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Sort a database
try {
  let res = await axios.post(
    `${baseURL}/v1/databases/${database_id}/query`,
    sortADatabaseReqBody(),
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Query a database
try {
  let res = await axios.post(
    `${baseURL}/v1/databases/${database_id}/query`,
    queryADatabaseReqBody(),
    headers
  );
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Search
try {
  let res = await axios.post(`${baseURL}/v1/search`, search1ReqBody(), headers);
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Search
try {
  let res = await axios.post(`${baseURL}/v1/search`, search2ReqBody(), headers);
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}

await sleep(1000);

// Search
try {
  let res = await axios.post(`${baseURL}/v1/search`, search3ReqBody(), headers);
  printInfo(res);
} catch (error) {
  printErrorInfo(error);
}
