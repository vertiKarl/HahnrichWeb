module.exports = {
  name: 'ad',
  execute(Hahnrich, client, channel, user=null, msg=null, self=null) {
    if(channel && channel !== 'CONSOLE') {
      if(!msg || !msg[1] || !Number.isInteger(msg[1])) {
        msg = []
        msg[1] = 30
      }
      channel = channel.replace('#', '')
      client.commercial(channel, msg[1]).catch(e => {
        client.action(channel, `Couldn't start adbreak for channel ${channel}`)
        return false
      })
    } else if(channel && channel === 'CONSOLE') {
      if(!msg || !Number.isInteger(msg)) {
        msg = 30
      }
      client.commercial(user, msg).catch(e => {
        console.twitch(`Couldn't start adbreak for channel ${user}`)
        return false
      })
    } else {
      return "ERROR: no channel specified"
    }
  }
}
