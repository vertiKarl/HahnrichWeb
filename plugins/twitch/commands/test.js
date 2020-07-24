module.exports = {
  name: 'test',
  execute(client, channel, user, msg=null, self=null) {
    console.log(user)
    if(user['display-name']) {
      client.say(channel, `User ${user['display-name']} sent message ${msg}`)
    } else {
      client.say(channel, `User CONSOLE sent message ${msg}`)
    }
  }
}
