const Discord = require('discord.js')
module.exports = {
  name: 'settings',
  execute(Hahnrich, client, message, method) {
    switch(method) {
      case 'dm':
        return
      case 'server':
        let embed = new Discord.MessageEmbed()
        .setColor('#d10202')
        .setTitle('Current Settings:')
        .setURL('https://zap-hosting.com/de/shop/donation/b46e5e7b07106dad59febaf3b66fd5e5/')
        .setAuthor('HahnrichJS', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/cb/cb9a41873f2065b8010afa7584803d283dd7e6ad_full.jpg', 'https://alleshusos.de')
        .setFooter('If you want to support this bot, click on the header!')
        for(let setting in Hahnrich.discord.settings) {
          embed.addField(`${setting}`, `${Hahnrich.discord.settings[setting]}`)
        }
        message.reply(embed)
        break
      default:
        message.reply("Couldn't find user in voice channel!")
    }
  }
}
