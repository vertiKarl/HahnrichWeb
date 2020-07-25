module.exports = {
  name: 'help',
  help: 'try help [command] to get more infos about a command!',
  execute(Hahnrich, ...msg) {
    if(typeof msg[1] === "undefined") {
      let commands = new Map()
      let array = Array.from(Hahnrich.commands.keys())
      for(com of array) {
        commands.set(Hahnrich.commands.get(com).name, Hahnrich.commands.get(com).help)
      }
      for(plugin of Array.from(Hahnrich.plugins.keys())) {
        if(typeof Hahnrich[plugin.replace('-plugin', '')] !== "undefined") {
          commands.set(String(plugin.replace('-plugin', '')), Hahnrich[plugin.replace('-plugin', '')].commands)
        }
      }
      return Array.from(commands.keys()).join(', ')
    } else {
      let commands = new Map()
      let array = Array.from(Hahnrich.commands.keys())
      for(com of array) {
        commands.set(Hahnrich.commands.get(com).name, Hahnrich.commands.get(com).help)
      }
      for(plugin of Array.from(Hahnrich.plugins.keys())) {
        if(typeof Hahnrich[plugin.replace('-plugin', '')] !== "undefined") {
          commands.set(String(plugin.replace('-plugin', '')), Hahnrich[plugin.replace('-plugin', '')].commands)
        }
      }
      function isPlugin(check) {
        return commands.get(check) instanceof Map //.includes(`${check}-plugin`)
      }
      function inCommands(check) {
        return Array.from(commands.keys()).includes(check) && typeof commands.get(check) !== "undefined"
      }
      function hasArgs(check) {
        return typeof check !== "undefined"
      }
      function inPluginCommands(plugin, check) {
        return Boolean(commands.get(plugin).get(check))
      }
      function hasPluginHelp(plugin) {
        return Boolean(commands.get(plugin).get('help'))
      }
      console.debug(isPlugin(msg[1]))
      // if Hahnrich command, return Hahnrich.command.help
      if(inCommands(msg[1]) && !isPlugin(msg[1]) && !hasArgs(msg[2]) && commands.get(msg[1]).help) {
        return commands.get(msg[1]).help
      // if Plugin, return Hahnrich.plugin.commands.help
      } else if(isPlugin(msg[1]) && !hasArgs(msg[2]) && hasPluginHelp(msg[1], msg[2])) {
        return commands.get(msg[1]).get('help').execute(Hahnrich, null, 'CONSOLE')
      // if Plugin-command, return Hahnrich.plugin.commands.command.help
      } else if(isPlugin(msg[1]) && hasArgs(msg[2]) && inPluginCommands(msg[1], msg[2])) {
        return commands.get(msg[1]).get(msg[2]).help
      } else if(isPlugin(msg[1]) && hasPluginHelp(msg[1], msg[2]) && !inPluginCommands(msg[1], msg[2])) {
        return `ERROR: No ${msg[1]}-command found named ${msg[2]}`
      } else if(isPlugin(msg[1])) {
        return `ERROR: ${msg[1]}-plugin does not provide help, please contact the author!\nIf you are the author, simply add a help command that returns help for user CONSOLE`
      } else {
        return `ERROR: Hahnrich does not provide help for command: ${msg[1]}`
      }
    }
  }
}
