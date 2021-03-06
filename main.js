const express = require('express')
const app = express()
const port = 3001

app.use('/static', express.static('static'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/static/index.html");
})
app.listen(port, () => {
  console.log(`Example app listening at http://192.168.1.214:${port}`)
})