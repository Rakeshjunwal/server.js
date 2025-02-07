const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const app = express()
const port = 3000

app.use(bodyParser.json())

let latestData = {}
let pendingCommand = null

app.post("/api/update", (req, res) => {
  latestData = req.body
  console.log("Received data:", latestData)

  const response = { status: "ok" }
  if (pendingCommand) {
    response.command = pendingCommand
    pendingCommand = null
  }

  res.json(response)
})

app.get("/api/data", (req, res) => {
  res.json(latestData)
})

app.post("/api/command", (req, res) => {
  const { command } = req.body
  if (command === "ON" || command === "OFF") {
    pendingCommand = command
    res.json({ status: "Command set" })
  } else {
    res.status(400).json({ error: "Invalid command" })
  }
})

app.get("/master", (req, res) => {
  res.sendFile(path.join(__dirname, "master.html"))
})

app.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "user.html"))
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

