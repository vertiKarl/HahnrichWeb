module.exports = {
  name: 'help',
  help: 'try help [command] to get more infos about a command!',
  execute(Hahnrich, ...msg) {
    console.log(msg)
    if(typeof msg[1] === "undefined") {
      let commands = Hahnrich.commands
      for(plugin of Array.from(Hahnrich.plugins.keys())) {
        console.log(`Hahnrich[${plugin.replace('-plugin', '')}]`)
        if(typeof Hahnrich[plugin.replace('-plugin', '')] !== "undefined") {
          commands.set(String(plugin.replace('-plugin', '')), Hahnrich[plugin.replace('-plugin', '')].commands)
        }
      }
      return Array.from(commands.keys()).join(', ')
    } else {
      let commands = Hahnrich.commands
      for(plugin of Array.from(Hahnrich.plugins.keys())) {
        console.log(`Hahnrich[${plugin.replace('-plugin', '')}]`)
        if(typeof Hahnrich[plugin.replace('-plugin', '')] !== "undefined") {
          commands.set(String(plugin.replace('-plugin', '')), Hahnrich[plugin.replace('-plugin', '')].commands)
        }
      }
      if(Array.from(commands.keys()).includes(msg[1]) && commands.get(msg[1]) && commands.get(msg[1]).help) {
        return commands.get(msg[1]).help
      } else if(Array.from(Hahnrich.plugins.keys()).includes(`${msg[1]}-plugin`)) {
        return 'ERROR: This plugin does not provide help, please contact the author!'
      } else {
        return `ERROR: Hahnrich does not provide help for command: ${msg[1]}`
      }
    }
  }
}
