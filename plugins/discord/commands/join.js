module.exports = {
  name: 'join',
  execute(Hahnrich, client, message, method) {
    let st
    switch(method) {
      case 'dm':
        let found = false
        client.guilds.cache.forEach(guild => {
          let user = guild.members.cache.get(message.author.id)
          if(user && !found && user.voice.channel) {
            found = true
            st = user.voice.channel.join()
          }
        })
        if(st) {
          st.then(con => {
            con.play('plugins/discord/welcome.mp3')
          })

          return new Promise(resolve => {
            setTimeout(() => resolve(st), 3000)
          })
        }
        break
      case 'server':
        let user = message.guild.members.cache.get(message.author.id)
        if(!st) {
          st = user.voice.channel.join()
        }
        if(st) {
          st.then(con => {
            con.play('plugins/discord/welcome.mp3')
          })

          return new Promise(resolve => {
            setTimeout(() => resolve(st), 5000)
          })
        }
        break
      default:
        message.reply("Couldn't find user in voice channel!")
    }
  }
}
