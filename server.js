"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const server_url = process.env.SERVER_URL || 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(port, server_url, function () {
    console.info(`Server running on : ${server_url}:${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log('server startup error: address already in use');
    }
    else {
        console.log(err);
    }
});
//# sourceMappingURL=server.js.map