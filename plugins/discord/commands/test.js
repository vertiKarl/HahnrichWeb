module.exports = {
  name: 'test',
  execute(client, message) {
    if(message.author) {
      message.reply(`User ${message.author} sent message ${message.content}`)
    } else {
      message.reply(`User CONSOLE sent message ${message.content}`)
    }
  }
}
