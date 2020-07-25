const HahnrichClient = require('./Hahnrich.js');
const shell = process.openStdin();
let last_commands = []

const Client = new HahnrichClient(6969)
Client.init()

shell.addListener("data", function(d) {
  const data = d.toString().trim().split(' ')
  if(data[0] === 'clear' || data[0] === 'cls') {
    console.clear()
  } else if(typeof Client.commands.get(data[0]) !== "undefined" && !Client[data[0]]) {
    try {
      let args = data
      args.unshift(Client)
      let command = Client.commands.get(data[1]).execute.apply(null, args)
      if(command && !command.toString().includes('ERROR')) {
        console.log(command)
      } else {
        console.error(command)
      }
    } catch(e) {
      console.log(e)
    }
  } else if(Object.keys(Client).includes(data[0]) && typeof Client[data[0]].commands.get(data[1]) !== "undefined") {
    let args = data.slice(2)
    args.unshift(Client[data[0]].client)
    args.splice(2, 0, 'CONSOLE')
    let plugin = Client[data[0]].commands.get(data[1]).execute.apply(null, args)
    if(plugin) {
      console.log(`'${data.join(' ')}'`, 'succeded!')
    } else {
      console.error('ERROR: Failed starting', `'${data.join(' ')}'`)
    }
    //console.log(Client[data[0]].commands.get(data[1]).execute.apply(null, args))
  } else {
    console.log('ERROR: No command called '+data.join(' ')+' found.')
  }
  last_commands.push(data.join(' '))
})
