module.exports = {
  name: 'help',
  execute(Hahnrich, client, channel, user, msg=null, self=null) {
    if(user['display-name']) {
      let message = []
      for(let c of Hahnrich.twitch.commands) {
        message.push(c[1].name)
      }
      client.action(channel, `${message.join(', ')}`)
    }
  }
}
