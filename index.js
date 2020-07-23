const HahnrichClient = require('./Hahnrich.js');
const shell = process.openStdin();

const Client = new HahnrichClient(6969)
Client.init()

shell.addListener("data", function(d) {
  const data = d.toString().trim()
  try {
    Client.commands.get(data).execute()
  } catch(e) {
    console.log(e)
  }
})
