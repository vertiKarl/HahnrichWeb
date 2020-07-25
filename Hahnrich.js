const http = require('http');
const F = require('fs');
const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const app = express();
class HahnrichClient {

  constructor(Port) {
    this.Port = Port
    this.name = 'Hahnrich'
    this.commands = new Map()
    this.plugins = new Map()
  }

  init() {
    // fancy console log
    let cl = console.log
    console.log = function() {
      let time = new Date()
      let log = [`\u001b[1m\u001b[42;1m\u001b[38;5;231mS\x1b[0m [${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`, `[\x1b[36m${'Hahnrich'}\x1b[0m]`]
      for(let arg in arguments) {
        log.push(arguments[arg])
      }
      cl.apply( console, log)
    }
    // fancy console error
    let ce = console.error
    console.error = function() {
      let time = new Date()
      let error = [`\u001b[1m\u001b[41;1m\u001b[38;5;231mE\x1b[0m [${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`, `[\x1b[36m${'Hahnrich'}\x1b[0m]`]
      for(let arg in arguments) {
        error.push(arguments[arg])
      }
      ce.apply( console, error)
    }
    // fancy console debug
    let cd = console.debug
    console.debug = function() {
      let time = new Date()
      let debug = [`\u001b[1m\u001b[41;1m\u001b[38;5;231mDEBUG\x1b[0m [${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`, `[\x1b[36m${'Hahnrich'}\x1b[0m]`]
      for(let arg in arguments) {
        debug.push(arguments[arg])
      }
      ce.apply( console, debug)
    }
    // Loading commands and plugins from their respective folders
    this.getCommands()
    this.getPlugins()
    // Plugin loop
    for(const [key, plugin] of this.plugins.entries()) {
      // Setting up fancy console.log for plugins
      let PurePlugin = plugin.name.replace('-plugin', '')
      console[PurePlugin] = function() {
        let time = new Date()
        if(!plugin.color) {
          plugin.color = '\x1b[36m'
        }
        let log = [`\u001b[1m\u001b[42;1m\u001b[38;5;231mS\x1b[0m [${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`, `[${plugin.color}${plugin.name}\x1b[0m]`]
        for(let arg in arguments) {
          log.push(arguments[arg])
        }
        cl.apply(console, log)
      }
      // Setting up fancy console.error for plugins
      console[`${PurePlugin}error`] = function() {
        let time = new Date()
        if(!plugin.color) {
          plugin.color = '\x1b[36m'
        }
        let log = [`\u001b[1m\u001b[41;1m\u001b[38;5;231mE\x1b[0m [${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`, `[${plugin.color}${plugin.name}\x1b[0m]`]
        for(let arg in arguments) {
          log.push(arguments[arg])
        }
        cl.apply(console, log)
      }
      // Starting plugins
      HahnrichClient[plugin.name] = plugin.execute(this)
      if(HahnrichClient[plugin.name]) {
        console.log(plugin.name, 'started!')
      } else {
        console.error('ERROR: Failed starting', plugin.name)
      }
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
