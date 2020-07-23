const http = require('http');
const F = require('fs');
const WebSocket = require('ws');
class HahnrichClient {

  constructor(Port) {
    this.Port = Port
    this.commands = new Map()
    this.plugins = new Map()
  }

  init() {
    // Loading commands and plugins from their respective folders
    this.getCommands()
    this.getPlugins()
    // Executing plugins
    for(const [key, plugin] of this.plugins.entries()) {
      console.log(plugin.execute(this))
    }
    // WebSocketServer
    const wsServer = new WebSocket.Server({ port: 8080 });
    wsServer.on("connection", (ws) => {
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
    })
    // HTTPServer
    let httpServer = http.createServer()
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

  getPlugins() {
    const Files = F.readdirSync('./plugins').filter(file => file.endsWith('.js'))
    for(const file of Files) {
      const plug = require(`./plugins/${file}`)
      this.plugins.set(plug.name, plug)
    }
  }

}

module.exports = HahnrichClient
