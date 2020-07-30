module.exports = {
  name: 'skip',
  execute(Hahnrich, client, message, method) {
    switch(method) {
      case 'dm':
        return
      case 'server':
        let user = message.guild.members.cache.get(message.author.id)
        let found = false
        client.voice.connections.forEach(con => {
          if(!found && con.channel.guild === message.guild)
            found = true
            require('../mediaplayer.js')(Hahnrich, con, null, true)
        })
        break
      default:
        message.reply("Couldn't find user in voice channel!")
    }
  }
}
