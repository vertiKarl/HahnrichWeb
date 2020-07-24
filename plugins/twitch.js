module.exports = {
  name: 'twitch-plugin',
  execute(Hahnrich) {
    // dependencies
    const request = require('request');
    const F = require('fs');
    const tmi = require('tmi.js');
    require('dotenv').config();
    Hahnrich.twitch = new Object();
    Hahnrich.twitch.commands = new Map();
    // three steps to get to the token we want
    function get_user_code() {
      console.log(`https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_ClientID}&redirect_uri=http://localhost&response_type=code&scope=${process.env.TWITCH_Scopes}`)
      console.log('Please visit the previous link and add your client_id to the .env file')
    }
    function get_access_token() {
      var options = {
                      'method': 'POST',
                      'url': `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_ClientID}&client_secret=${process.env.TWITCH_Secret}&code=${process.env.TWITCH_Code}&grant_type=authorization_code&redirect_uri=http://localhost`,
                      'headers': {
                      }
                    };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        resp = JSON.parse(response.body);
        resp.time = new Date().getTime();
        F.writeFileSync('./plugins/twitch/twitch_tokens.json', JSON.stringify(resp, null, 4));
      });
    }
    function refresh_token(token_obj) {
      var options = {
                      'method': 'POST',
                      'url': `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_ClientID}&client_secret=${process.env.TWITCH_Secret}&refresh_token=${token_obj.refresh_token}&grant_type=refresh_token`,
                      'headers': {
                      }
                    };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        resp = JSON.parse(response.body);
        resp.time = new Date().getTime();
        F.writeFileSync('./plugins/twitch/twitch_tokens.json', JSON.stringify(resp, null, 4));
      });
    }
    function getCommands() {
      const Files = F.readdirSync('./plugins/twitch/commands').filter(file => file.endsWith('.js'))
      for(const file of Files) {
        const com = require(`./twitch/commands/${file}`)
        Hahnrich.twitch.commands.set(com.name, com)
      }
    }
    function token_valid(token_obj) {
      return (token_obj.time + token_obj.expires_in) > new Date().getTime()
    }
    function read_token() {
      return JSON.parse(F.readFileSync('./plugins/twitch/twitch_tokens.json'))
    }
    function bot(username, password) {
      // otherwise run twitch client
      let channels = []
      const channels_file = F.readFileSync('./plugins/twitch/channels.txt').toString().split('\n')
      for(const channel in channels_file) {
        if(channels_file[channel].length !== 0) {
          channels.push(channels_file[channel])
        }
      }
      getCommands()
      const opts = {
        identity: {
          username: username,
          password: password
        },
        channels: channels
      }
      const client = new tmi.client(opts)
      // event handling
      client.on('message', (channel, user, msg, self) => {
        switch(user['message-type']) {
          case "whisper":
            if(msg[0] === '!' && !self) {
              msg = msg.substr(1).split(' ')
            } else {
              return
            }
            if(typeof Hahnrich.commands.get(msg[0]) !== "undefined" && !Hahnrich[msg[0]]) {
              try {
                let args = msg
                args.unshift(Hahnrich)
                client.whisper(user['display-name'], Hahnrich.commands.get(msg[1]).execute.apply(null, args))
              } catch(e) {
                console.log(e)
              }
            } else if(typeof Hahnrich.twitch.commands.get(msg[0]) !== "undefined") {
              try {
                Hahnrich.twitch.commands.get(msg[0]).execute(client, channel, user, msg, self)
              } catch(e) {
                console.log(e)
              }
            } else {
              client.whisper(user['display-name'], 'ERROR: No command called '+msg[0]+' found.')
            }
          default:
            if(msg[0] === '!' && !self) {
              msg = msg.substr(1).split(' ')
            } else {
              return
            }
            if(typeof Hahnrich.commands.get(msg[0]) !== "undefined" && !Hahnrich[msg[0]]) {
              try {
                let args = msg
                args.unshift(Hahnrich)
                client.action(channel, Hahnrich.commands.get(msg[1]).execute.apply(null, args))
              } catch(e) {
                console.log(e)
              }
            } else if(typeof Hahnrich.twitch.commands.get(msg[0]) !== "undefined") {
              try {
                Hahnrich.twitch.commands.get(msg[0]).execute(client, channel, user, msg, self)
              } catch(e) {
                console.log(e)
              }
            } else {
              client.action(channel, 'ERROR: No command called '+msg[0]+' found.')
            }
        }
      })
      client.on('anongiftpaidupgrade', (channel, username, userstate) => {
        console.log(username, 'is continuing the Gift Sub they got from an anonymous user on channel:', channel)
      })
      client.on('ban', (channel, username, reason, userstate) => {
        console.log(username, 'got banned on channel', channel, 'for:', reason)
      })
      client.on('cheer', (channel, userstate, message) => {
        console.log(userstate['display-name'], 'cheered', userstate.bits, 'on channel:', channel)
      })
      client.on('clearchat', (channel) => {
        console.log('Chat for channel', channel, 'got cleared')
      })
      client.on('disconnected', (reason) => {
        //console.log('Got disconnected for reason:', reason, 'trying to reconnect...')
        //bot(username, password)
      })
      client.on('emoteonly', (channel, enabled) => {
        console.log('Emote-only', enabled, 'on channel', channel)
      })
      client.on('connected', () => {
        console.log('Connected to Twitch!')
        Hahnrich.twitch.client = client
      })
      client.on('emotesets', (sets, obj) => {
        // emotesets
      })
      client.on('followersonly', (channel, enabled, length) => {
        console.log(length, 'Follower-only chat', enabled, 'on channel:', channel)
      })
      client.on('giftpaidupgrade', (channel, username, sender, userstate) => {
        console.log(username, 'is continuing the gift sub they got from', sender, 'in channel:', channel)
      })
      client.on('hosted', (channel, username, sender, userstate) => {
        console.log(channel, 'got hosted by', username, 'for', viewers, 'viewers', 'isAutohost', autohost)
      })
      client.on('hosting', (channel, target, viewers) => {
        console.log(channel, 'is now hosting', target, 'for', viewers, 'viewers')
      })
      client.on('join', (channel, target, viewers) => {
        // add to active_users array
      })
      client.on('part', (channel, username, self) => {
        // remove from active_users array
      })
      client.on('messagedeleted', (channel, username, deletdMessage, userstate) => {
        console.log('message', deletdMessage, 'deleted in channel:', channel)
      })
      client.on('mod', (channel, username) => {
        // triggers alot, might wanna leave this
      })
      client.on('notice', (channel, msgid, message) => {
        console.log('RECEIVED NOTICE:', message, 'on channel', channel)
        return `RECEIVED NOTICE: ${message}, on channel ${channel}`
      })
      client.on('raided', (channel, username, viewers) => {
        console.log(channel, 'got raided by', username, 'for', viewers, 'viewers')
      })
      client.on('resub', (channel, username, months, message, userstate, methods) => {
        if(userstate['msg-param-should-share-streak']) {
          console.log(username, 'resubbed on channel', channel, 'for', streakMonths, 'straight. Total:', months)
        } else {
          console.log(username, 'resubbed on channel', channel, 'for a total of', months)
        }
      })
      client.on('slowmode', (channel, enabled, length) => {
        console.log(length, 'Slowmode-chat', enabled, 'on channel:', channel)
      })
      client.on('subgift', (channel, username, streakMonths, recipient, methods, userstate) => {
        console.log(username, 'gifted a sub to', recipient, 'they have gifted a total of', userstate["msg-param-sender-count"], 'on this channel ('+channel+')')
      })
      client.on('submysterygift', (channel, username, numbOfSubs, methods, userstate) => {
        console.log(username, 'gifts', numbOfSubs, 'subs to chat! They have gifted a total of', userstate["msg-param-sender-count"], 'on this channel ('+channel+')')
      })
      client.on('subscribers', (channel, enabled) => {
        console.log('Sub-only chat', enabled, 'on channel:', channel)
      })
      client.on('subscription', (channel, username, method, message, userstate) => {
        console.log(username, 'subscribed with', method+'! On channel', channel)
      })
      client.on('timeout', (channel, username, reason, duration, userstate) => {
        console.log('User', username, 'got timed out for', duration+'!', 'Reason:', reason, 'Channel:', channel)
      })
      client.on('unhost', (channel, viewers) => {
        console.log(channel, 'stopped hosting for', viewers)
      })
      client.connect()
      // error handler
      client.error = function(channel, user, id) {
        const errors = {
          "no_permission": client.action(channel, `${user['display-name']}, no permission!`)
        }
        if(errors[id]) {
          errors[id]
        } else {
          console.log('ERROR: error not in errors map ('+id+')')
        }
      }
    }
    // if we dont have a code specified, tell the user to set a code in .env
    if(!process.env.TWITCH_Code) {
      get_user_code()
    } else {
      // if he does have a code specified
      try {
        // try to read the previous tokens
        let token_obj = JSON.parse(F.readFileSync('./plugins/twitch/twitch_tokens.json'))
        // if the last access_token already expired, use the refresh_token and get a new one!
        console.log(token_obj.time + token_obj.expires_in, '>', new Date().getTime(), token_valid(token_obj))
        if(token_valid(token_obj)) {
          bot('Hahnrich', token_obj.access_token)
          return 'connecting to twitch'
        } else {
          refresh_token(token_obj)
          read_token()
          if(typeof token_obj.access_token !== undefined) {
            bot('Hahnrich', token_obj.access_token)
            return 'connecting to twitch'
          } else {
            console.log('ERROR: INVALID ACCESS_TOKEN PLEASE RESTART')
          }
        }
      } catch(e) {
        // create a twitch_tokens.json file if none exists
        console.log(e)
        if(e.toString().includes('no such file or directory')) {
          get_access_token()
        }
      }
    }
  }
}
