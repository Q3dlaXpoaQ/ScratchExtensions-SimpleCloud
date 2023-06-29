const WebSocket = require('ws');
const fs = require('fs');
const PORT = '1206'
var temp_json = ''
var people = 0
var real_json = [{ 'name': "Server" }]
const server = new WebSocket.Server({ port: PORT })
server.on('connection', function (ws) {
    people++
    console.log(people)
    ws.on('message', function (message) {
        temp_json = JSON.parse(message.toString())
        for (var i in real_json) {
            if (real_json[i]['name'] == 'Server') {
                real_json.splice(i, 1)
                real_json.push(temp_json)
            }
            else if (real_json[i]['name'] == temp_json['name']) {
                if (temp_json['val'] == 'disconnect') {
                    real_json.splice(i, 1)
                }
                else {
                    real_json[i]['val'] = temp_json['val']
                }
                break
            }
            else if (real_json[i]['name'] != temp_json['name']) {
                if (i == real_json.length - 1) {
                    real_json.push(temp_json)
                }
            }

        }

        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(real_json));
            }

        })
    })
    ws.on('close', function () {
        people--
        real_json = [{ 'name': "Server" }]
        console.log('-1')
        console.log(people)
    })
})
