module.exports = {
  name: 'test',
  execute(client, channel, user, msg, self) {
    console.log(user)
    client.say(channel, `User ${user['display-name']} sent message ${msg}`)
  }
}
