const Discord = require('discord.js')
module.exports = {
  name: 'help',
  help: 'shows help text',
  execute(Hahnrich, client, message) {
    if(message === 'CONSOLE') {
      let help = new Map()
      let coms = Array.from(Hahnrich.discord.commands.keys())
      for(let n in coms) {
        let current_command = Hahnrich.discord.commands.get(coms[n])
        help.set(current_command.name, current_command.help)
      }
      console.discord('Type "help discord [command]" to get more infos!')
      return help
    } else {
      let content = message.content.toLowerCase().split(' ')
      let dis_coms = Array.from(Hahnrich.discord.commands.keys())
      let plugins = Array.from(Hahnrich.plugins.keys())
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
      let coms = Array.from(commands.keys())
      if(content[1] === 'global') {
        let embed = new Discord.MessageEmbed()
          .setColor('#d10202')
          .setTitle('List of Global-Commands:')
          .setURL('https://zap-hosting.com/de/shop/donation/b46e5e7b07106dad59febaf3b66fd5e5/')
          .setAuthor('HahnrichJS', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/cb/cb9a41873f2065b8010afa7584803d283dd7e6ad_full.jpg', 'https://alleshusos.de')
          .setFooter('If you want to support this bot, click on the "List of Commands" header!')
        for(n of Hahnrich.commands) {
          let current_command = n[1]
          embed.addField(`${current_command.name.charAt(0).toUpperCase()+current_command.name.slice(1)}`, `${current_command.help}`, true)
        }
        let plugins = []
        for(plugin of Array.from(Hahnrich.plugins.keys())) {
          if(typeof Hahnrich[plugin.replace('-plugin', '')] !== "undefined") {
              plugins.push(String(plugin.replace('-plugin', '')))
          }
        }
        embed.addField('Plugins:', plugins.join(', '), true)
        message.reply(embed)
      } else if (dis_coms.includes(content[1])) {
        message.reply(commands.get(content[1]).help)
      } else if (!(plugins).includes(content[1]+'-plugin') && coms.includes(content[1])) {
        message.reply(commands.get(content[1]))
      } else if ((plugins).includes(content[1]+'-plugin') && commands.get(content[1]).get('help')) {
        //console.debug(commands.get(content[1]))//.get('help').execute(Hahnrich, null, 'CONSOLE'))
        let help = commands.get(content[1]).get('help').execute(Hahnrich, null, 'CONSOLE')
        let embed = new Discord.MessageEmbed()
          .setColor('#d10202')
          .setTitle(`List of ${content[1]}-Commands:`)
          .setURL('https://zap-hosting.com/de/shop/donation/b46e5e7b07106dad59febaf3b66fd5e5/')
          .setAuthor('HahnrichJS', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/cb/cb9a41873f2065b8010afa7584803d283dd7e6ad_full.jpg', 'https://alleshusos.de')
          .setFooter('If you want to support this bot, click on the "List of Commands" header!')
        for(let n of help) {
          let current_command = n
          console.debug(n)
          embed.addField(`${current_command[0].charAt(0).toUpperCase()+current_command[0].slice(1)}`, `${current_command[1]}`, true)
        }
        message.reply(embed)
      } else if((plugins).includes(content[1]+'-plugin')) {
        message.reply(`ERROR: ${content[1]}-plugin does not provide help, please contact the author!\nIf you are the author, simply add a help command that returns help for user CONSOLE`)
      // } else if(isPlugin(msg[1]) && hasPluginHelp(msg[1], msg[2]) && !inPluginCommands(msg[1], msg[2])) {
      //   return `ERROR: No ${msg[1]}-command found named ${msg[2]}`
      // } else if(isPlugin(msg[1])) {
      //   return `ERROR: ${msg[1]}-plugin does not provide help, please contact the author!\nIf you are the author, simply add a help command that returns help for user CONSOLE`
      } else {
        let embed = new Discord.MessageEmbed()
          .setColor('#d10202')
          .setTitle('List of Discord-Commands:')
          .setURL('https://zap-hosting.com/de/shop/donation/b46e5e7b07106dad59febaf3b66fd5e5/')
          .setAuthor('HahnrichJS', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/cb/cb9a41873f2065b8010afa7584803d283dd7e6ad_full.jpg', 'https://alleshusos.de')
          .setFooter('If you want to support this bot, click on the "List of Commands" header!')
        for(let n of dis_coms) {
          let current_command = Hahnrich.discord.commands.get(n)
          embed.addField(`${current_command.name.charAt(0).toUpperCase()+current_command.name.slice(1)}`, `${current_command.help}`, true)
        }
        embed.addField('Help global', 'shows global hahnrich commands')
        message.reply(embed)
      }
    }
  }
}
