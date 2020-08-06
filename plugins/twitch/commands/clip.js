const request = require('request')
const F = require('fs')
const dhl = require('postman-request')
require('dotenv').config();
module.exports = {
  name: 'clip',
  execute(Hahnrich, client, channel, user=null, msg=null, self=null) {
    let token_obj = Hahnrich.twitch.functions.read_token()
    if(Hahnrich.twitch.functions.token_valid(token_obj)) {
      let promise = new Promise(function(resolve, reject) {

      })
      if(msg[1]) {
        promise = new Promise(function(resolve, reject) {
          let user_options = {
                          'method': 'GET',
                          'url': `https://api.twitch.tv/helix/users?login=${msg[1].toLowerCase()}`,
                          'headers': {
                            'Authorization': `Bearer ${token_obj.access_token}`,
                            'Client-ID': process.env.TWITCH_ClientID
                          }
                        };
          request(user_options, function (error, response) {
            if (error) reject(error);
            const resp = JSON.parse(response.body).data[0];
            resolve(resp.id)
        })

        })
      } else {
        promise = new Promise(function(resolve, reject) {
          let user_options = {
                          'method': 'GET',
                          'url': `https://api.twitch.tv/helix/users?login=${channel.replace('#', '')}`,
                          'headers': {
                            'Authorization': `Bearer ${token_obj.access_token}`,
                            'Client-ID': process.env.TWITCH_ClientID
                          }
                        };
          request(user_options, function (error, response) {
            if (error) reject(error);
            const resp = JSON.parse(response.body).data[0];
            resolve(resp.id)
          })
        })
      }
      promise.then(broadcaster_id => {
        let clip_link = 'https://clips.twitch.tv/'
        let options = {
                        'method': 'POST',
                        'url': `https://api.twitch.tv/helix/clips?broadcaster_id=${broadcaster_id}`,
                        'headers': {
                          'Authorization': `Bearer ${token_obj.access_token}`,
                          'Client-ID': process.env.TWITCH_ClientID
                        }
                      };
        request(options, function (error, response) {
          if (error) throw new Error(error);
          if(JSON.parse(response.body).data) {
            const resp = JSON.parse(response.body).data[0];
            clip_link += resp.id
            client.action(channel, `Created clip: ${clip_link}`)
          } else {
            client.action(channel, `Error creating clip for channel with id ${broadcaster_id}, check if channel is online.`)
          }
        });
      }).catch(e => {
        console.error(e)
      })
    } else {
      console.debug('invalid token, refreshing...')
      Hahnrich.twitch.functions.refresh_token(token_obj, () => {
        token_obj = Hahnrich.twitch.functions.read_token()
        let promise = new Promise(function(resolve, reject) {

        })
        if(msg[1]) {
          promise = new Promise(function(resolve, reject) {
            let user_options = {
                            'method': 'GET',
                            'url': `https://api.twitch.tv/helix/users?login=${msg[1].toLowerCase()}`,
                            'headers': {
                              'Authorization': `Bearer ${token_obj.access_token}`,
                              'Client-ID': process.env.TWITCH_ClientID
                            }
                          };
            request(user_options, function (error, response) {
              if (error) reject(error);
              const resp = JSON.parse(response.body).data[0];
              resolve(resp.id)
          })

          })
        } else {
          promise = new Promise(function(resolve, reject) {
            let user_options = {
                            'method': 'GET',
                            'url': `https://api.twitch.tv/helix/users?login=${channel.replace('#', '')}`,
                            'headers': {
                              'Authorization': `Bearer ${token_obj.access_token}`,
                              'Client-ID': process.env.TWITCH_ClientID
                            }
                          };
            request(user_options, function (error, response) {
              if (error) reject(error);
              const resp = JSON.parse(response.body).data[0];
              resolve(resp.id)
            })
          })
        }
        promise.then(broadcaster_id => {
          let clip_link = 'https://clips.twitch.tv/'
          let options = {
                          'method': 'POST',
                          'url': `https://api.twitch.tv/helix/clips?broadcaster_id=${broadcaster_id}`,
                          'headers': {
                            'Authorization': `Bearer ${token_obj.access_token}`,
                            'Client-ID': process.env.TWITCH_ClientID
                          }
                        };
          request(options, function (error, response) {
            if (error) throw new Error(error);
            if(JSON.parse(response.body).data) {
              const resp = JSON.parse(response.body).data[0];
              clip_link += resp.id
              client.action(channel, `Created clip: ${clip_link}`)
            } else {
              client.action(channel, `Error creating clip for channel with id ${broadcaster_id}, check if channel is online.`)
            }
          });
        }).catch(e => {
          console.error(e)
        })
      })
    }
  }
}
