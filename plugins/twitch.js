module.exports = {
  name: 'twitch-plugin',
  execute(Hahnrich) {
    // dependencies
    const request = require('request');
    const F = require('fs');
    const tmi = require('tmi.js');
    require('dotenv').config();
    Hahnrich.twitch = new Map();
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
        F.writeFileSync('twitch_tokens.json', JSON.stringify(resp, null, 4));
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
        F.writeFileSync('twitch_tokens.json', JSON.stringify(resp, null, 4));
      });
    }
    function getCommands() {
      const Files = F.readdirSync('./plugins/twitch').filter(file => file.endsWith('.js'))
      for(const file of Files) {
        const com = require(`./twitch/${file}`)
        Hahnrich.twitch.set(com.name, com)
      }
    }
    function token_valid(token_obj) {
      return (token_obj.time + token_obj.expires_in) > new Date().getTime()
    }
    function read_token() {
      return JSON.parse(F.readFileSync('twitch_tokens.json'))
    }
    function bot(username, password) {
      console.log('testlog')
      // otherwise run twitch client
      let channels = []
      const channels_file = F.readFileSync('./channels.txt').toString().split('\n')
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
      client.on('message', (channel, user, msg, self) => {
        if(msg[0] === '!') {
          msg = msg.substr(1).split(' ')
        } else {
          return
        }
        if(typeof Hahnrich.commands.get(msg[0]) !== "undefined") {
          try {
            client.say(channel, Hahnrich.commands.get(msg[0]).execute(msg))
          } catch(e) {
            console.log(e)
          }
        } else if(typeof Hahnrich.twitch.get(msg[0]) !== "undefined") {
          try {
            Hahnrich.twitch.get(msg[0]).execute(client, channel, user, msg, self)
          } catch(e) {
            console.log(e)
          }
        } else {
          client.say(channel, 'ERROR: No command called '+msg[0]+' found.')
        }
      })
      client.on('connected', () => {
        console.log('Connected to Twitch!')
      })
      client.connect()
    }
    // if we dont have a code specified, tell the user to set a code in .env
    if(!process.env.TWITCH_Code) {
      get_user_code()
    } else {
      // if he does have a code specified
      try {
        // try to read the previous tokens
        let token_obj = JSON.parse(F.readFileSync('twitch_tokens.json'))
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
