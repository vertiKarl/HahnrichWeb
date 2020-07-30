module.exports = {
  name: 'id',
  execute(Hahnrich, client, message, ...c) {
    if(message[0] !== 'CONSOLE' && message.author) {
      message.reply(`Your ID is: ${message.author.id}`)
    }
  }
}
