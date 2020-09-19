const F = require('fs')
module.exports = {
  name: 'random',
  execute(Hahnrich, client, message, method) {
    let state
    let found = false
    let files = F.readdirSync('plugins/discord/songs')
    client.voice.connections.forEach(con => {
      if(!found && con.channel.members.get(message.author.id))
        found = true
        state = con
    })
    if(!state) {
      Hahnrich.discord.commands.get('join').execute(Hahnrich, client, message, method).then(jstate => {
        let choice = files[Math.floor(Math.random() * files.length)]
        Hahnrich.discord.now_playing.set(jstate.channel.guild.id, choice)
        let dispatcher = jstate.play(`plugins/discord/songs/${choice}`)
        dispatcher.on('finish', () => {
          require('../mediaplayer.js')(Hahnrich, jstate, `plugins/discord/songs/${choice}`)
        })
      })
    } else {
      let choice = files[Math.floor(Math.random() * files.length)]
      let dispatcher = state.play(`plugins/discord/songs/${choice}`)
      Hahnrich.discord.now_playing.set(state.channel.guild.id, choice)
      dispatcher.on('finish', () => {
        require('../mediaplayer.js')(Hahnrich, state, `plugins/discord/songs/${choice}`)
      })
    }
  }
}
