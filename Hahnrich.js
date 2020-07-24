const http = require('http');
const F = require('fs');
const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const app = express();
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
      HahnrichClient[plugin.name] = plugin.execute(this)
      console.log(plugin.name+': '+HahnrichClient[plugin.name])
    }
    // WebSocketServer
    const wsServer = new WebSocket.Server({ port: 8080 });
    wsServer.on("connection", (ws) => {
      ws.on('message', (msg) => {
        msg = msg.split(' ')
        console.log(this.commands.get(msg[0]))
        // check if vanilla hahnrich command
        if(typeof this.commands.get(msg[0]) !== "undefined" && !this[msg[0]]) {
          try {
            console.log(msg)
            let args = msg
            args.unshift(this)
            console.log(msg)
            ws.send(this.commands.get(msg[1]).execute.apply(null, args))
            //ws.send(this.commands.get(msg[0]).execute(this, msg))
          } catch(e) {
            console.log(e)
          }
        // check if plugin command
        } else if(Object.keys(this).includes(msg[0]) && typeof this[msg[0]].commands.get(msg[1]) !== "undefined") {
          let args = msg.slice(2)
          args.unshift(this[msg[0]].client)
          args.splice(2, 0, 'CONSOLE')
          this[msg[0]].commands.get(msg[1]).execute.apply(null, args)
          ws.send(`Trying to run ${msg[0]+' '+msg[1]}`)
        } else {
          ws.send('ERROR: No command called '+msg[0]+' found.')
        }
      })
    })
    // HTTPServer
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '/express/index.html'))
    })
    app.use(express.static(path.join(__dirname, 'express')))
    let httpServer = http.createServer(app)
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
