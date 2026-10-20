const express = require("express");
const client = require("@prometheus-io/client");

const app = express();
const PORT = 8000;

// default metrics: CPU, memory, event loop lag, GC stats, etc.
client.collectDefaultMetrics();

// custom metrics: number of requests received(with labels for method and status code)
const requestCount = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "path", "statusCode"]
});
// middleware to count requests
app.use((req, res, next) => {
    res.on("finish", () => {
        requestCount.inc({
            method: req.method,
            path: req.path,
            statusCode: res.statusCode
        });
    });
    next();
});

// endpoint to expose metrics
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
});

// create express app
app.get("/server", (req, res) => {
    console.log("Received request");
    res.send("Hello World!");
});

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle SIGTERM
process.on("SIGTERM", () => {
    console.log("\nSIGTERM received!");

    server.close(() => {
        console.log("HTTP server closed.");
        console.log("Cleanup complete.");
        process.exit(0);
    });
});