module.exports = {
  name: 'discord-plugin',
  color: '\u001b[38;5;63m',
  execute(Hahnrich) {
    const Discord = require('discord.js');
    const F = require('fs');
    require('dotenv').config();
    const client = new Discord.Client();
    Hahnrich.discord = new Object();
    Hahnrich.discord.commands = new Map();

    function getCommands() {
      const Files = F.readdirSync('./plugins/discord/commands').filter(file => file.endsWith('.js'))
      for(const file of Files) {
        const com = require(`./discord/commands/${file}`)
        Hahnrich.discord.commands.set(com.name, com)
      }
    }

    function self(comp) {
      return comp === client.user
    }

    function inWhitelist(user_id) {
      let whitelist = F.readFileSync('./plugins/discord/whitelist.txt').toString().split('\n')
      for(const user in whitelist) {
        if(whitelist[user] === user_id) {
          return true
        }
      }
      return false
    }

    client.on('ready', () => {
      getCommands()
      console.discord(`Logged in as ${client.user.tag}`)
      client.user.setPresence({
        activity: {
          name: 'alleshusos.de',
          type: 'STREAMING',
          url: 'https://twitch.tv/vertiKarl'
        },
        status: 'idle'
      })
      let n = 0
      let servers = [];
      client.guilds.cache.forEach(guild => {
        servers.push(guild)
      })
      console.discord(`Online on: ${servers.join(', ')}`)
    })

    client.on('message', (message) => {
      if(message.content[0] === '!' && !self(message.author) && inWhitelist(message.author.id)) {
        command = message.content.substr(1).split(' ')
      } else {
        return
      }
      console.discord(message.author.username+'#'+message.author.discriminator, 'tried to run', "'"+command.join(' ')+"'")
      switch(message.channel['type']) {
        case 'dm':
          if(typeof Hahnrich.commands.get(command[0]) !== "undefined" && !Hahnrich[command[0]]) {
            try {
              let args = command
              args.unshift(Hahnrich)
              message.reply(Hahnrich.commands.get(command[1]).execute.apply(null, args))
            } catch(e) {
              console.discord(e)
            }
          } else if(typeof Hahnrich.discord.commands.get(command[0]) !== "undefined") {
            try {
              Hahnrich.discord.commands.get(command[0]).execute(client, message)
            } catch(e) {
              console.discord(e)
            }
          } else if(Object.keys(Hahnrich).includes(command[0]) && typeof Hahnrich[command[0]].commands.get(command[1]) !== "undefined") {
            let args = command.slice(2)
            args.unshift(Hahnrich[command[0]].client)
            args.splice(2, 0, 'CONSOLE')
            message.reply(`Trying to run ${command[0]+' '+command[1]}`)
            Hahnrich[command[0]].commands.get(command[1]).execute.apply(null, args)
          } else {
            message.reply('ERROR: No command called '+command[0]+' found.')
          }
          break
        case 'default':
          if(typeof Hahnrich.commands.get(command[0]) !== "undefined" && !Hahnrich[command[0]]) {
            try {
              let args = command
              args.unshift(Hahnrich)
              message.reply(Hahnrich.commands.get(command[1]).execute.apply(null, args))
            } catch(e) {
              console.discord(e)
            }
          } else if(typeof Hahnrich.discord.commands.get(command[0]) !== "undefined") {
            try {
              Hahnrich.discord.commands.get(command[0]).execute(client, message)
            } catch(e) {
              console.discord(e)
            }
          } else if(Object.keys(Hahnrich).includes(command[0]) && typeof Hahnrich[command[0]].commands.get(command[1]) !== "undefined") {
            let args = command.slice(2)
            args.unshift(Hahnrich[command[0]].client)
            args.splice(2, 0, 'CONSOLE')
            message.reply(`Trying to run ${command[0]+' '+command[1]}`)
            Hahnrich[command[0]].commands.get(command[1]).execute.apply(null, args)
          } else {
            console.discord(message.channel)
            message.reply('ERROR: No command called '+command[0]+' found.')
          }
          break
      }
    })

    client.login(`${process.env.DISCORD_Token}`);
    return true
  }
}
