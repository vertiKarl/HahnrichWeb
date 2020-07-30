const Discord = require('discord.js')
const meta = require('music-metadata')
module.exports = {
  name: 'np',
  execute(Hahnrich, client, message, ...method) {
    if(message === 'CONSOLE') {
      let connection
      let length
      let lengthformat
      let streamtimeformat
      Hahnrich.discord.client.voice.connections.forEach(con => {
          if(con.channel.guild.name.toLowerCase() === method[0].toLowerCase()) {
              connection = con
              let current_streamTime = {
                            total: parseInt((connection.dispatcher.streamTime/1000).toFixed(0)),
                            after: parseInt((connection.dispatcher.streamTime/1000).toFixed(0)),
                            minutes: 0,
                            seconds: 0
                          }
                          current_streamTime.minutes = Math.floor(current_streamTime.after / 60)
                          current_streamTime.after = Math.floor(current_streamTime.after - (current_streamTime.minutes * 60) )
                          current_streamTime.seconds = current_streamTime.after
              meta.parseFile(`plugins/discord/songs/${Hahnrich.discord.now_playing.get(con.channel.guild.id)}`).then((data) => {
                          length = {
                            total: parseInt(data.format.duration),
                            after: parseInt(data.format.duration),
                            minutes: 0,
                            seconds: 0
                          }
                          length.minutes = Math.floor(length.after / 60)
                          length.after = Math.floor(length.after - (length.minutes * 60) )
                          length.seconds = length.after
              if(length.seconds > 10) {
                lengthformat = `${length.minutes}:${length.seconds}`
              } else {
                lengthformat = `${length.minutes}:0${length.seconds}`
              }
              if(current_streamTime.seconds > 10) {
                streamtimeformat = `${current_streamTime.minutes}:${current_streamTime.seconds}`
              } else {
                streamtimeformat = `${current_streamTime.minutes}:0${current_streamTime.seconds}`
              }
              console.discord(`${Hahnrich.discord.now_playing.get(con.channel.guild.id)}`, `${streamtimeformat}/${lengthformat}`)
              return true
            })
          } else {
            console.discord(`Currently not playing anything on ${method[0]}`)
          }
      })
    }
    if(message.guild && Hahnrich.discord.now_playing.get(message.guild.id)) {
      let connection
      let length
      let lengthformat
      let streamtimeformat
      client.voice.connections.forEach(con => {
        if(con.channel.members.get(message.author.id))
          connection = con
      })
      let current_streamTime = {
                    total: parseInt((connection.dispatcher.streamTime/1000).toFixed(0)),
                    after: parseInt((connection.dispatcher.streamTime/1000).toFixed(0)),
                    minutes: 0,
                    seconds: 0
                  }
                  current_streamTime.minutes = Math.floor(current_streamTime.after / 60)
                  current_streamTime.after = Math.floor(current_streamTime.after - (current_streamTime.minutes * 60) )
                  current_streamTime.seconds = current_streamTime.after
      meta.parseFile(`plugins/discord/songs/${Hahnrich.discord.now_playing.get(message.guild.id)}`).then((data) => {
                  length = {
                    total: parseInt(data.format.duration),
                    after: parseInt(data.format.duration),
                    minutes: 0,
                    seconds: 0
                  }
                  length.minutes = Math.floor(length.after / 60)
                  length.after = Math.floor(length.after - (length.minutes * 60) )
                  length.seconds = length.after
      if(length.seconds > 10) {
        lengthformat = `${length.minutes}:${length.seconds}`
      } else {
        lengthformat = `${length.minutes}:0${length.seconds}`
      }
      if(current_streamTime.seconds > 10) {
        streamtimeformat = `${current_streamTime.minutes}:${current_streamTime.seconds}`
      } else {
        streamtimeformat = `${current_streamTime.minutes}:0${current_streamTime.seconds}`
      }
      let embed = new Discord.MessageEmbed()
        .setColor('#d10202')
        .setTitle('Now Playing:')
        .setURL('https://zap-hosting.com/de/shop/donation/b46e5e7b07106dad59febaf3b66fd5e5/')
        .setAuthor('HahnrichJS', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/cb/cb9a41873f2065b8010afa7584803d283dd7e6ad_full.jpg', 'https://alleshusos.de')
        .setFooter('If you want to support this bot, click on the header!')
        .addField(`${Hahnrich.discord.now_playing.get(message.guild.id)}`, `${streamtimeformat}/${lengthformat}`)
      message.reply(embed)
      })
    } else {
      let connection
      let length
      let lengthformat
      let streamtimeformat
      client.voice.connections.forEach(con => {
        if(!Hahnrich.discord.now_playing.get(con.channel.guild.id)) {
          return false
        }
        if(con.channel.guild.name.toLowerCase() === message.content.split(' ')[1].toLowerCase()) {
            connection = con
            let current_streamTime = {
                          total: parseInt((connection.dispatcher.streamTime/1000).toFixed(0)),
                          after: parseInt((connection.dispatcher.streamTime/1000).toFixed(0)),
                          minutes: 0,
                          seconds: 0
                        }
                        current_streamTime.minutes = Math.floor(current_streamTime.after / 60)
                        current_streamTime.after = Math.floor(current_streamTime.after - (current_streamTime.minutes * 60) )
                        current_streamTime.seconds = current_streamTime.after
            meta.parseFile(`plugins/discord/songs/${Hahnrich.discord.now_playing.get(con.channel.guild.id)}`).then((data) => {
                        length = {
                          total: parseInt(data.format.duration),
                          after: parseInt(data.format.duration),
                          minutes: 0,
                          seconds: 0
                        }
                        length.minutes = Math.floor(length.after / 60)
                        length.after = Math.floor(length.after - (length.minutes * 60) )
                        length.seconds = length.after
            if(length.seconds > 10) {
              lengthformat = `${length.minutes}:${length.seconds}`
            } else {
              lengthformat = `${length.minutes}:0${length.seconds}`
            }
            if(current_streamTime.seconds > 10) {
              streamtimeformat = `${current_streamTime.minutes}:${current_streamTime.seconds}`
            } else {
              streamtimeformat = `${current_streamTime.minutes}:0${current_streamTime.seconds}`
            }
            let embed = new Discord.MessageEmbed()
              .setColor('#d10202')
              .setTitle('Now Playing:')
              .setURL('https://zap-hosting.com/de/shop/donation/b46e5e7b07106dad59febaf3b66fd5e5/')
              .setAuthor('HahnrichJS', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/cb/cb9a41873f2065b8010afa7584803d283dd7e6ad_full.jpg', 'https://alleshusos.de')
              .setFooter('If you want to support this bot, click on the header!')
              .addField(`${Hahnrich.discord.now_playing.get(con.channel.guild.id)}`, `${streamtimeformat}/${lengthformat}`)
            message.reply(embed)
          })
        } else {
          message.reply(`Currently not playing anything on ${message.content.split(' ')[1]}`)
        }
      })
    }
  }
}
