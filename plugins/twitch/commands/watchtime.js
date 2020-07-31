const F = require('fs')
module.exports = {
  name: 'watchtime',
  execute(Hahnrich, client, channel, user, msg=null, self=null) {
    let users = JSON.parse(F.readFileSync('plugins/twitch/users.json'))
    for(u in users[channel]) {
      if(users[channel][u].name === user.username) {
        let time = users[channel][u].watchtime/3600000
        time = time.toFixed(2)
        client.action(channel, `${user.username} has spent ${time.toString()} hours here!`)
        return `${user.username} has spent ${time.toString()} hours here!`
      }
    }
    client.action(channel, `${user.username} you have not been here for long enough!`)
    return false
  }
}
