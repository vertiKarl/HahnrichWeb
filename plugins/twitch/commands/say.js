module.exports = {
  name: 'say',
  execute(Hahnrich, client, channel, user, msg) {
    if(channel) {
      if(channel === "CONSOLE") {
        let n = 0
        resp = ''
        while(n < arguments.length) {
          if(n > 2 && n !== arguments.length-1) {
            resp += String(arguments[n]) + ' '
          } else if (n === arguments.length-1) {
            resp += String(arguments[n])
          }
          n++;
        }
        client.say(user, resp)
        return true
      } else {
        client.error(channel, user, 'no_permission')
      }
    } else {
      return "ERROR: no channel specified"
    }
  }
}
