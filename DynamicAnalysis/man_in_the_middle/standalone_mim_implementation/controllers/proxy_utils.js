const Request = require("../models/Requests");
const fs = require("fs");

const formatDomain = (domain) => {
  if (!(domain.startsWith("http_") || domain.startsWith("https_")))
    throw new Error("Invalid URL, should start with http_ or https_.");
  domain = domain.replace(/(http_)|(https_)/g, (match) => {
    if (match === "http_") return "http://";
    else if (match === "https_") return "https://";
  });
  return domain.replace(/_/g, ".");
};
exports.export_calls = async (req, res) => {
  try {
    const domain = formatDomain(req.params.domain);
    var requests = await Request.find({ url: domain });
    requests = requests.map((req) => {
      req._id = "";
      return req;
    });
    fs.writeFileSync(
      "/app/downloads/requests.json",
      JSON.stringify(requests, null, 2)
    );
    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json("Failed to export documents");
  }
};

exports.delete_logs = async (req, res) => {
  try {
    const domain = formatDomain(req.params.domain);
    await Request.deleteMany({ url: domain });
    return res
      .status(200)
      .json({ message: `The documents for ${domain} were deleted successfully` });
  } catch (error) {
    return res.status(500).json({ message: `Failed to delete the documents for ${domain}` });
  }
};
