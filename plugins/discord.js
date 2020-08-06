module.exports = {
  name: 'discord-plugin',
  color: '\u001b[38;5;63m',
  execute(Hahnrich) {
    const Discord = require('discord.js');
    const F = require('fs');
    const dhl = require('postman-request');
    require('dotenv').config();
    const client = new Discord.Client();
    const settings = JSON.parse(F.readFileSync('plugins/discord/settings.json'))
    Hahnrich.discord = new Object();
    Hahnrich.discord.commands = new Map();
    Hahnrich.discord.now_playing = new Map();
    Hahnrich.discord.client = client;
    Hahnrich.discord.settings = settings;

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
        command = message.content.substr(1).toLowerCase().split(' ')
      } else if(!self(message.author) && inWhitelist(message.author.id)) {
        let att = message.attachments.first()
        let att_split = att ? att.name.split('.') : undefined
        if(att && att_split && att_split[att_split.length-1] === 'mp3') {
          message.reply('trying to download...')
          dhl.get(message.attachments.first().url)
          .on('error', (err) => {
            message.reply(err)
          })
          .pipe(F.createWriteStream(`plugins/discord/songs/${message.attachments.first().name}`))
            .on('finish', () => {
              Hahnrich.discord.commands.get('join').execute(Hahnrich, client, message, 'dm').then(con => {
                const disp = con.play(`plugins/discord/songs/${message.attachments.first().name}`)
                disp.on('finish', () => {
                  require('./discord/mediaplayer.js')(Hahnrich, con, null, true)
                })
              })
            })
        } else {
          return
          message.reply('Invalid format! (Please use .mp3 files)')
        }
        return
      } else {
        return
      }
      console.discord(message.author.username+'#'+message.author.discriminator, 'tried to run', "'"+command.join(' ')+"'")
      switch(message.channel['type']) {
        case 'dm':

          if(typeof Hahnrich.discord.commands.get(command[0]) !== "undefined") {
            try {
              Hahnrich.discord.commands.get(command[0]).execute(Hahnrich, client, message, 'dm')
            } catch(e) {
              console.discord(e)
            }
          } else if(typeof Hahnrich.commands.get(command[0]) !== "undefined" && !Hahnrich[command[0]]) {
            try {
              let args = command
              args.unshift(Hahnrich)
              message.reply(Hahnrich.commands.get(command[1]).execute.apply(null, args))
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
        default:
          if(typeof Hahnrich.discord.commands.get(command[0]) !== "undefined") {
            try {
              Hahnrich.discord.commands.get(command[0]).execute(Hahnrich, client, message, 'server')
            } catch(e) {
              console.discord(e)
            }
          } else if(typeof Hahnrich.commands.get(command[0]) !== "undefined" && !Hahnrich[command[0]]) {
            try {
              let args = command
              args.unshift(Hahnrich)
              message.reply(Hahnrich.commands.get(command[1]).execute.apply(null, args))
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
