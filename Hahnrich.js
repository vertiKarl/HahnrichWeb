const http = require('http');
const F = require('fs');
const WebSocket = require('ws');
class HahnrichClient {

  constructor(Port) {
    this.Port = Port
    this.commands = new Map()
  }

  init() {
    this.getCommands()
    let httpServer = http.createServer()
    const wss = new WebSocket.Server({ port: 8080 });
    wss.on("connection", (ws) => {
      ws.on('message', (msg) => {
        if(typeof this.commands.get(msg) !== "undefined") {
          try {
            ws.send(this.commands.get(msg).execute())
          } catch(e) {
            console.log(e)
          }
        } else {
          ws.send('ERROR: No command called '+msg+' found.')
        }
      })
      ws.send('servertest')
    })
    httpServer.listen(this.Port, () => {
      console.log('http server running on http://localhost:'+this.Port)
    })
  }

  getCommands() {
    const Files = F.readdirSync('./commands').filter(file => file.endsWith('.js'))
    for(const file of Files) {
      const com = require(`./commands/${file}`)
      this.commands.set(com.name, com)
    }
  }

}

module.exports = HahnrichClient
