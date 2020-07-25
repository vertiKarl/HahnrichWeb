module.exports = {
  name: 'test',
  execute(client, message) {
    if(message && message.author) {
      message.reply(`User ${message.author} sent message ${message.content}`)
    } else {
      return `User CONSOLE sent message ${message ? message.content : '(no message)'}`
    }
  }
}
