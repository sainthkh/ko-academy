const server = require('./src').default
const port = process.env.PORT ? process.env.PORT: 5000

server.listen(port, "localhost", function() {
  console.log(server.name +' listening at '+ server.url);
});