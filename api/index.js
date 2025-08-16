const serverless = require('serverless-http');
const app = require('./index.cjs'); // Import your main app file
module.exports.handler = serverless(app); // Export the handler for serverless deployment
console.log('Serverless handler is set up');