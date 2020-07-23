const HahnrichClient = require('./Hahnrich.js');
const shell = process.openStdin();

const Client = new HahnrichClient(6969)
Client.init()

shell.addListener("data", function(d) {
  const data = d.toString().trim()
  if(typeof Client.commands.get(data) !== "undefined") {
    try {
      console.log(Client.commands.get(data).execute())
    } catch(e) {
      console.log(e)
    }
  } else {
    console.log('ERROR: No command called '+data+' found.')
  }
})
