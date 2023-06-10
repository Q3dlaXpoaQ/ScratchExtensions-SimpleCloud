(function (Scratch) {
    let Server;
    let messageNum = 0;
    let username = null;
    let Message_List;
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
                    Message_List = str.data
                    messageNum++
                }
            }

        }
        sendMessage({
            MESSAGE
        }) {
            if (username != null) {
                Server.send(JSON.stringify({'name': username,'val': String(MESSAGE)}))
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
            const self=this
            if (Server.readyState==3||Server.readyState==0){
                self.isRunning=false

            }
            else{
                self.isRunning=true
            }
            console.log(Server.readyState)
            return String(self.isRunning)

        }
        Return_message_Num() {
            return messageNum;
        }
        Return_username() {
            return username;
        }
        closeSocket() {
            const self = this;
            if (this.isRunning) {
                if (username != null) {
                    Server.send(JSON.stringify({'name': username,'val': 'disconnect'}))
                }
                Server.close();
                self.isRunning = false;
                Message_List=''
            }
        }

    }

    Scratch.extensions.register(new SimpleCloud());
})(Scratch);