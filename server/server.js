const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
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