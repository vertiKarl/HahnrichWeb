const F = require('fs')
module.exports = {
  name: 'repeat',
  execute(Hahnrich, client, message, method) {
    switch(method) {
      case 'dm':
        return
      case 'server':
        let user = message.guild.members.cache.get(message.author.id)
        let found = false
        client.voice.connections.forEach(con => {
          if(!found && con.channel.guild === message.guild) {
            Hahnrich.discord.settings.repeat = !Hahnrich.discord.settings.repeat
            status = Hahnrich.discord.settings.repeat ? 'on' : 'off'
            message.reply(`Repeating is now: ${status}`)
            F.writeFileSync('plugins/discord/settings.json', JSON.stringify(Hahnrich.discord.settings, null, 4))
          }
        })
        break
      default:
        message.reply("Couldn't find user in voice channel!")
    }
  }
}
