const request = require('request')
const F = require('fs')
const dhl = require('postman-request')
module.exports = {
  name: 's',
  execute(Hahnrich, client, message, method) {
    let st
    switch(method) {
      case 'dm':
        return
        break
      case 'server':
        console.debug(message.author.id)
        if(message.author.id === '175642620767371265' && message.content.includes('https://clips.twitch.tv/')) {
          let token_obj = Hahnrich.twitch.functions.read_token()
          if(Hahnrich.twitch.functions.token_valid(token_obj)) {
            require('dotenv').config();
            let clip_id = message.content.split(' ')[1].replace('https://clips.twitch.tv/', '')
            var options = {
                            'method': 'GET',
                            'url': `https://api.twitch.tv/helix/clips?id=${clip_id}`,
                            'headers': {
                              'Authorization': `Bearer ${token_obj.access_token}`,
                              'Client-ID': process.env.TWITCH_ClientID
                            }
                          };
            request(options, function (error, response) {
              if (error) throw new Error(error);
              resp = JSON.parse(response.body).data[0];
              let link = resp.thumbnail_url.split('-preview')[0]+'.mp4'
              dhl.get(link).pipe(F.createWriteStream(`../alleshusos.de/private/clips/${resp.id}.mp4`)).on('finish', () => {
                F.writeFileSync(`../alleshusos.de/private/clips/${resp.id}.json`, JSON.stringify(resp, null, 4))
                message.reply(`Successfully downloaded clip "${resp.title}" from channel ${resp.broadcaster_name}.\nYou can find it here: https://alleshusos.de/private/clips/${resp.id}.mp4`)
              })
            });
          }
        } else {
          message.reply('No permission or invalid link')
        }
        break
      default:
        message.reply("Couldn't find user in voice channel!")
    }
  }
}
