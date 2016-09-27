angular.module('stor-log', [])
    .controller('index', function ($scope, storeLog) {

        for (var i = 0; i <100; i++) {
            var string = 'Add to this,' + i + "," + (i + 2) + "," + (i + 8);
            storeLog.addNew(string);
        }
    })
    .service('storeLog', function($http){
        var object = {
            msgString: [],
            size: 0,
            fileName: "log_" + Date.now() + ".csv"
        };
        this.addNew = function (msgString) {
            object.msgString.push(msgString);
            object.size++;
            if (object.size >= 20) {
                // now it's time  to save this
                this.saveToLogFile(object.msgString, object.fileName);
                object.msgString = [], object.size = 0;
            }
        };
        this.saveToLogFile = function (msg, file) {
            // join the array using \n
            var reqBody = {
                msgString: msg.join("\n"),
                fileName: file
            };
            $http({
                method: 'POST',
                url: 'http://localhost:3003/savelog',
                data: JSON.stringify(reqBody)
            })
            .then(function () {
                console.log('Saved...')
            })
        };
        this.clearObject = function () {
            object.msgString = [], object.size = 0;
        };
        function lengthInUtf8Bytes(s) {
            return encodeURI(s).split(/%..|./).length
            // var m = encodeURIComponent(str).match(/%[89ABab]/g);
            // return str.length + (m ? m.length : 0);
        }
    });