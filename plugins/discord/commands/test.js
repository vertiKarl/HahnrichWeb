module.exports = {
  name: 'test',
  execute(Hahnrich, client, message, ...c) {
    if(message[0] !== 'CONSOLE' && message.author) {
      message.reply(`User ${message.author} sent message ${message.content}`)
    } else {
      return `User CONSOLE sent message ${c ? c.join(' ') : '(no message)'}`
    }
  }
}
