module.exports = {
  name: 'test',
  execute(Hahnrich, client, channel, user, msg=null, self=null) {
    console.log(user)
    if(user['display-name']) {
      client.say(channel, `User ${user['display-name']} sent message ${msg}`)
    } else {
      client.say(user, `User CONSOLE sent message ${msg}`)
    }
  }
}
