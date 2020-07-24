const HahnrichClient = require('./Hahnrich.js');
const shell = process.openStdin();

const Client = new HahnrichClient(6969)
Client.init()

shell.addListener("data", function(d) {
  const data = d.toString().trim().split(' ')
  if(typeof Client.commands.get(data[0]) !== "undefined") {
    try {
      console.log(Client.commands.get(data[0]).execute(data))
    } catch(e) {
      console.log(e)
    }
  } else {
    console.log('ERROR: No command called '+data+' found.')
  }
})
