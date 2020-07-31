module.exports = {
    name: 'settings',
    execute(Hahnrich, client, channel, user, msg=null, self=null) {
      if(channel === '#snaq__') {
          client.action(channel, 'https://pastebin.com/raw/ELWMpuTV')
        } else {
          client.action(channel, 'this channel does not provide any settings.')
        }
      }
}
