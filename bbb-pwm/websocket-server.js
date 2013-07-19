var WebSocketServer = require('ws').Server;
var bbbPWM = require("./bbb-pwm");

// Instantiate Websocket server.
var wss = new WebSocketServer({
    port: 8080
});

// Instantiate object to control PWM device.
var pwm = new bbbPWM('/sys/devices/ocp.2/pwm_test_P8_13.10/', 5000000);

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: ' + message);
        if (message == 'servoOff') {
            pwm.turnOff();
            ws.send('PWM OFF');
        }
        else if (message == 'servoOn') {
            pwm.turnOn();
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