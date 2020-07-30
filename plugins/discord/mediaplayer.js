const F = require('fs')
module.exports = function mediaplayer(Hahnrich, connection=null, file=null, skip=false) {
  if(connection && !skip) {
    Hahnrich.discord.now_playing.set(connection.channel.guild.id, null)
    if(Hahnrich.discord.settings.repeat) {
      const disp = connection.play(file)
      disp.on('finish', () => {
        mediaplayer(Hahnrich, connection, file)
      })
    } else if(Hahnrich.discord.settings.shuffle) {
      let files = F.readdirSync('plugins/discord/songs')
      // removing current song from selection
      let split = file.split('/')
      name = split[split.length-1]
      files.splice(files.indexOf(name), 1)
      // because you dont want to listen to the same song twice while using shuffle lol
      let selection = Math.floor(Math.random() * files.length)
      console.debug(files, selection, files[selection], name)
      const disp = connection.play(`plugins/discord/songs/${files[selection]}`)
      Hahnrich.discord.now_playing.set(connection.channel.guild.id, files[selection])
      disp.on('finish', () => {
        mediaplayer(Hahnrich, connection, `plugins/discord/songs/${files[selection]}`)
      })
    } else {
      connection.disconnect()
    }
  } else if(connection && skip) {
    let files = F.readdirSync('plugins/discord/songs')
    let selection = files[Math.floor(Math.random() * files.length)]
    mediaplayer(Hahnrich, connection, `plugins/discord/songs/${selection}`)
  }
}
