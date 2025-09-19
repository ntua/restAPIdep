const express = require("express");
const cors = require("cors");
const multer = require("multer");

const proxy = require("./routes/proxy");
const proxy_utils = require("./routes/proxy_utils");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save uploaded files to 'uploads' directory
    cb(null, "/app/uploads/");
  },
  filename: function (req, file, cb) {
    // Use the original filename
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const app = express();
app.use(cors());

app.use(upload.any());

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes used */
app.use("/proxy/", proxy);
app.use("/proxy_utils/", proxy_utils);

app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

module.exports = app;
