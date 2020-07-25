module.exports = {
  name: 'ad',
  execute(client, channel, user=null, msg=null, self=null) {
    if(channel) {
      if(!msg || !msg[1] || !Number.isInteger(msg[1])) {
        msg = []
        msg[1] = 30
      }
      channel = channel.replace('#', '')
      client.commercial(channel, msg[1]).catch(e => {
        client.action(channel, `Couldn't start adbreak for channel ${channel}`)
        return false
      })
    } else {
      return "ERROR: no channel specified"
    }
  }
}
