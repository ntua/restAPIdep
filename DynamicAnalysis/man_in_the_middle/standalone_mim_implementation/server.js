require('dotenv').config();
const app = require('./app');
const connectMongo = require('./utils/connectMongo');

connectMongo();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Man In the Middle running on port ${PORT}!`));