class NimbusRPC {
    constructor(host, port=8383) {
        this.uri = "http://"+host+":"+port.toString()+"/jsonrpc";
        this.numBuffers = 5;
    }

    setRegister(addr, value) {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                var arg = {"addr": parseInt(addr), "value": parseInt(value)};
                self.setJSONParameter( "nimbusRaw", 9, [arg]).then(
                    function(response) {
                       resolve();
                    },
                    function(status) {
                        reject(status);
                    });
            });
        return p1;
    }

    getRegister(addr) {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                var arg = {"addr": parseInt(addr)};
                self.getJSONParameter( "nimbusRaw", 9, [arg]).then(
                    function(response) {
                        resolve(response["result"]);
                    },
                    function(status) {
                        reject(status);
                    });
            });
        return p1;
    }

    getLog() {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                self.getJSONParameter( "logHandler", 0, null).then(
                    function(response) {
                        resolve(response["result"]);
                    },
                    function(status) {
                        reject(status);
                    });
            });
        return p1;
    }

    setSequences(seqs) {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                self.setJSONParameter( "nimbusRaw", 10, seqs).then(
                    function(response) {
                        resolve();
                    },
                    function(status) {
                        reject(status);
                    });
            });
        return p1;
    }

    getSequences() {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                self.getJSONParameter( "nimbusRaw", 10, null).then(
                    function(response) {
                        resolve(response["result"]);
                    },
                    function(status) {
                        reject(status);
                    });
            });
        return p1;
    }

    setExposure(exposure) {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                var i;
                var exp = {"pause": 0, "exposure": parseInt(exposure)};
                var args = []
                for (i = 0; i < self.numBuffers; i++) {
                    args[i] = exp;
                }

                self.setJSONParameter( "nimbusRaw", 0, args).then(
                    function(response) {
                       resolve();
                    },
                    function(status) {
                        reject(status);
                    });
            });
        return p1;
    }

    getExposures() {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                self.getJSONParameter( "nimbusRaw", 0, null).then(
                    function(response) {
                        resolve(response["result"]);
                    },
                    function(status) {
                        reject(status);
                    });
            });
        return p1;
    }

    getUserlandVersion() {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                self.getJSONParameter( "preprocessing", 1, null).then(
                    function(response) {
                       resolve(response["result"]);
                    },
                    function(status) {
                        reject(status);
                    });
            });
        return p1;
    }

    getUnitXVector() {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                self.getJSONParameter( "nimbusRaw", 4, null).then(
                    function(response) {
                        var ret = atob(response["result"]);
                        var len = ret.length;
                        var arr = new Uint8Array( len );
                        for (var i = 0; i < len; i++) {
                            arr[i] = ret.charCodeAt(i);
                        }
                        arr = new Int16Array(arr.buffer);
                        resolve(arr);
                    },
                    function(status) {
                        reject(status);
                    });
            });
        return p1;
    }

    getUnitYVector() {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                self.getJSONParameter( "nimbusRaw", 5, null).then(
                    function(response) {
                        var ret = atob(response["result"]);
                        var len = ret.length;
                        var arr = new Uint8Array( len );
                        for (var i = 0; i < len; i++) {
                            arr[i] = ret.charCodeAt(i);
                        }
                        arr = new Int16Array(arr.buffer);
                        resolve(arr);
                    },
                    function(status) {
                        reject(status);
                    });
            });
        return p1;
    }

    getUnitZVector() {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                self.getJSONParameter( "nimbusRaw", 6, null).then(
                    function(response) {
                        var ret = atob(response["result"]);
                        var len = ret.length;
                        var arr = new Uint8Array( len );
                        for (var i = 0; i < len; i++) {
                            arr[i] = ret.charCodeAt(i);
                        }
                        arr = new Int16Array(arr.buffer);
                        resolve(arr);
                    },
                    function(status) {
                        reject(status);
                    });
            });
        return p1;
    }

    getIdent() {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                self.getJSONParameter( "nimbusRaw", 8, null).then(
                    function(response) {
                        var ret = atob(response["result"]);
                        var hexStr = "";
                        for (var i = 0; i < ret.length; i++) {
                            if (ret.charCodeAt(i) < 10)
                                hexStr += "0";
                            hexStr += ret.charCodeAt(i).toString(16).toUpperCase() + ":";
                        }
                        hexStr = hexStr.slice(0, -1);
                        resolve(hexStr);
                    },
                    function(status) {
                        reject(status);
                    });
            });
        return p1;
    }

    getJSONParameter(component, paramID, args) {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', self.uri, true);
                xhr.responseType = 'json';
                xhr.onload = function() {
                    var status = xhr.status;
                    if (status === 200)
                    {
                        if (xhr.response["result"]["success"] === 0)
                            resolve(xhr.response["result"]);
                        else
                        {
                            var status = "";
                            status = "Err: "+xhr.response["result"]["success"]+" details: "+xhr.response["result"]["details"];
                            reject(status);
                        }
                    }
                    else
                    {
                        var status = "";
                        status = "HTTP_Req status: " + xhr.status;
                        reject(status);
                    }
                };
                xhr.setRequestHeader("Content-Type", "application/json");

                if (args === null)
                    args = [null];

                var payload = JSON.stringify({method: "getParameter",
                    params: {component: component, ID: paramID, param: args},
                    jsonrpc: "2.0",
                    id: 0})

                xhr.send(payload);


            });

        return p1;
    }

    setJSONParameter(component, paramID, args) {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', self.uri, true);
                xhr.responseType = 'json';
                xhr.onload = function() {
                    var status = xhr.status;
                    if (status === 200)
                    {
                        if (xhr.response["result"]["success"] === 0)
                            resolve(xhr.response["result"]);
                        else
                            reject(xhr.response); 
                    }
                    else
                        reject(xhr.status);
                };
                xhr.setRequestHeader("Content-Type", "application/json");

                if (args === null)
                    args = [null];
                if (Array.isArray(args) === false)
                    args = [args];

                var payload = JSON.stringify({method: "setParameter",
                    params: {component: component, ID: paramID, param: args},
                    jsonrpc: "2.0",
                    id: 0})

                xhr.send(payload);


            });

        return p1;
    }

}

export { NimbusRPC };
