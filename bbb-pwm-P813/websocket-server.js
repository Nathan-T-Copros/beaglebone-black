var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    port: 8080
});
var bbbPWMP813 = require("./bbb-pwm-P813");

var pwm = new bbbPWMP813();

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: ' + message);
        if (message == 'servoOff') {
            //pwm.turnOff();
            ws.send('PWM OFF');
        }
        else if (message == 'servoOn') {
            //pwm.turnOn();
            ws.send('PWM On');
        }
        else {
            pwm.setDuty(message);
        }
    });

    ws.on('close', function() {
        console.log('stopping client interval');
    });
});