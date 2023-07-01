(function (Scratch) {
    let Server;
    let messageNum = 0;
    let username = null;
    var Message_List;
    var GlobalVar;
    class SimpleCloud {
        constructor() {
            this.isRunning = false
        }
        getInfo() {
            return {
                id: 'Q3dlaXpoaQ',
                name: '简单联机',
                color1: '#8608fc',
                blocks: [{
                        opcode: 'connect',
                        blockType: 'command',
                        text: '连接到[IP]',
                        arguments: {
                            IP: {
                                type: 'string',
                                defaultValue: 'wss://clvtpd-qnmsta-1206.preview.myide.io'
                            }
                        }
                    },
                    {
                        opcode: 'closeSocket',
                        blockType: 'command',
                        text: '断开连接'
                    },
                    {
                        opcode: 'sendMessage',
                        blockType: 'command',
                        text: '发送[MESSAGE]到服务器',
                        arguments: {
                            MESSAGE: {
                                type: 'string',
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'SetGlobalVar',
                        blockType: 'command',
                        text: '将全局变量设为[Var]',
                        arguments: {
                            Var: {
                                type: 'string',
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'setID',
                        blockType: 'command',
                        text: '将用户名设置为[ID]',
                        arguments: {
                            ID: {
                                type: 'string',
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'Return_receive',
                        blockType: 'reporter',
                        text: '接收到的信息',

                    },
                    {
                        opcode: 'Return_GVar',
                        blockType: 'reporter',
                        text: '全局云变量',

                    },
                    {
                        opcode: 'Return_Server_List',
                        blockType: 'reporter',
                        text: '服务器列表',

                    },

                    {
                        opcode: 'Return_username',
                        blockType: 'reporter',
                        text: '用户名',

                    },
                    {
                        opcode: 'Return_message_Num',
                        blockType: 'reporter',
                        text: '共收到的数据量',

                    },
                    {
                        opcode: 'Return_isConnect',
                        blockType: 'Boolean',
                        text: '是否连接到服务器?',

                    },
                ],
            };
        }

        async connect({
            IP
        }) {
            const self = this;
            if (!self.isRunning) {
                Server = new WebSocket(String(IP))
                Server.onopen = function () {
                    self.isRunning = true
                };
                Server.onmessage = function (str) {
                    let temp_json = JSON.parse(str.data)
                    if (temp_json instanceof Array) {
                        Message_List = JSON.stringify(temp_json)
                        messageNum++
                    }
                    else if (temp_json instanceof Object) {
                        delete temp_json['cmd']
                        GlobalVar = JSON.stringify(temp_json['var'])
                    }
                }
            }

        }
        sendMessage({
            MESSAGE
        }) {
            if (username != null) {
                let tempjson = {
                    'name': username,
                    'val': {}
                }
                tempjson['val'] = JSON.parse(MESSAGE)
                Server.send(JSON.stringify(tempjson))
            }
        }

        SetGlobalVar({
            Var
        }) {
            if (username != null) {
                let temp_json = {
                    'cmd': 'GVar',
                    'var': JSON.parse(Var)
                }
                Server.send(JSON.stringify(temp_json))
            }
        }
        setID({
            ID
        }) {
            username = String(ID)
        }


        Return_receive() {
            return Message_List;
        }
        Return_isConnect() {
            const self = this
            if (Server.readyState == 1) {
                self.isRunning = true

            } else {
                self.isRunning = false
                username = null
            }
            return String(self.isRunning)

        }
        Return_message_Num() {
            return messageNum;
        }
        Return_username() {
            return username;
        }
        Return_GVar() {
            return GlobalVar;
        }
        Return_Server_List() {
            return "{wss://clvtpd-qnmsta-1206.preview.myide.io,\
            wss://b4b72ea4-1206-app.lightly.teamcode.com?port=1206&dcsId=b4b72ea4&token=B1zgKRFqRIW7N5ZL7FvZJA}"
        }
        closeSocket() {
            const self = this;
            if (this.isRunning) {
                if (username != null) {
                    Server.send(JSON.stringify({
                        'name': username,
                        'val': 'disconnect'
                    }))
                }
                username = null;
                Server.close();
                self.isRunning = false;
                Message_List = ''
            }
        }
    }

    Scratch.extensions.register(new SimpleCloud());
})(Scratch);