var fs = require('fs');
var Q = require('q');
var exec = require('child_process').exec;

var bbbPWM = (function () {

    function bbbPWM(pwmPath, period) {
        bbbPWM.PERIOD = period;
        bbbPWM.RUN_PATH = pwmPath + 'run';
        bbbPWM.DUTY_PATH = pwmPath + 'duty';
        bbbPWM.PERIOD_PATH = pwmPath + 'period';
        this.configureDevice();
    }

    bbbPWM.prototype.execCommand = function (command) {
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

    bbbPWM.prototype.writeFile = function (file, content) {
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

    bbbPWM.prototype.setDuty = function (duty) {
        try {
            fs.writeFile(bbbPWM.DUTY_PATH, Math.floor(Number(duty) * 1000));
        }
        catch (e) {
            console.log('setDuty error: ' + e);
        }
    };

    bbbPWM.prototype.turnOff = function(){
        this.writeFile(bbbPWM.RUN_PATH, '0');
    };

    bbbPWM.prototype.turnOn = function(){
        this.writeFile(bbbPWM.RUN_PATH, '1');
    };

    bbbPWM.prototype.configureDevice = function () {
        var _this = this;
        this.execCommand('chmod 666 ' + bbbPWM.DUTY_PATH).then(function () {
            console.log('set permissions period_path...');
            return _this.execCommand('chmod 666 ' + bbbPWM.PERIOD_PATH);
        }).then(function () {
                console.log('set permissions run_path...');
                return _this.execCommand('chmod 666 ' + bbbPWM.RUN_PATH);
            }).then(function () {
                console.log('set run...');
                return _this.writeFile(bbbPWM.RUN_PATH, '1');
            }).then(function () {
                console.log('set period...');
                return _this.writeFile(bbbPWM.PERIOD_PATH, bbbPWM.PERIOD);
            }).then(function () {
                console.log('initialized PWM P8 13......');
            }, _this.errorHandler).done();
    };

    bbbPWM.errorHandler = function (error) {
        console.log('Error: ' + error.message);
    };

    return bbbPWM;
})();

module.exports = bbbPWM;