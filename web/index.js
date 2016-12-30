const app = require('./server')
const port = process.env.PORT || 4000

app.default.listen(port, function (err) {
  if (err) {
    throw err
  }

  console.log(`server is listening on ${port}...`)
})