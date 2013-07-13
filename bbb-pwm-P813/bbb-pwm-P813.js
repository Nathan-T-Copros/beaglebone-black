var fs = require('fs');
var Q = require('q');
var exec = require('child_process').exec;

var bbbPWMP813 = (function () {

    function bbbPWMP813() {
        console.log('contructor bbbPWMP813.....');
        this.configurePath();
    }

    bbbPWMP813.PWM_PATH = '/sys/devices/ocp.2/pwm_test_P8_13.10/';
    bbbPWMP813.RUN_PATH = bbbPWMP813.PWM_PATH + 'run';
    bbbPWMP813.DUTY_PATH = bbbPWMP813.PWM_PATH + 'duty';
    bbbPWMP813.PERIOD_PATH = bbbPWMP813.PWM_PATH + 'period';
    bbbPWMP813.PERIOD = 5000000;

    bbbPWMP813.prototype.execCommand = function (command) {
        var deferred = Q.defer();
        exec(command, function (error) {
            if (error) {
                deferred.reject(error);
            }
            else {
                console.log('execCommand success: ' + command);
                deferred.resolve();
            }
        });
        return deferred.promise;
    };

    bbbPWMP813.prototype.writeFile = function (file, content) {
        var deferred = Q.defer();
        fs.writeFile(file, content, function (error) {
            if (error) {
                deferred.reject(error);
            }
            else {
                console.log('writeFile complete: ' + file);
                deferred.resolve();
            }
        });
        return deferred.promise;
    };

    bbbPWMP813.prototype.setDuty = function (duty) {
        try {
            fs.writeFileSync(bbbPWMP813.DUTY_PATH, Math.floor(Number(duty) * 1000));
        }
        catch (e) {
            console.log('setDuty error: ' + e);
        }
    };

    bbbPWMP813.prototype.turnOff = function(){
        this.writeFile(bbbPWMP813.RUN_PATH, '0');
    };

    bbbPWMP813.prototype.turnOn = function(){
        this.writeFile(bbbPWMP813.RUN_PATH, '1');
    };

    bbbPWMP813.prototype.configurePath = function () {
        var _this = this;
        this.execCommand('chmod 666 ' + bbbPWMP813.DUTY_PATH).then(function () {
            console.log('set permissions period_path...');
            return _this.execCommand('chmod 666 ' + bbbPWMP813.PERIOD_PATH);
        }).then(function () {
                console.log('set permissions period_path run_path...');
                return _this.execCommand('chmod 666 ' + bbbPWMP813.RUN_PATH);
            }).then(function () {
                console.log('set run...');
                return _this.writeFile(bbbPWMP813.RUN_PATH, '1');
            }).then(function () {
                console.log('set period...');
                return _this.writeFile(bbbPWMP813.PERIOD_PATH, bbbPWMP813.PERIOD);
            }).then(function () {
                console.log('initialized PWM P8 13......');
            }, _this.errorHandler).done();
    };

    bbbPWMP813.errorHandler = function (error) {
        console.log('Error: ' + error.message);
    };

    return bbbPWMP813;
})();

module.exports = bbbPWMP813;