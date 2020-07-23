const http = require('http');
const F = require('fs');
class HahnrichClient {

  constructor(Port) {
    this.Port = Port
    this.commands = new Map()
  }

  init() {
    this.getCommands()
    http.createServer().listen(this.Port, () => {
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
