class NimbusRPC {
  constructor(host, port=8383) {
    this.uri = "http://"+host+":"+port.toString()+"/jsonrpc";
  }
  
  getUserlandVersion() {
      var self = this;
      var p1 = new Promise(
        function(resolve, reject) {
            self.getJSONParameter( "preprocessing", 1, null).then(
                function(response) {
                    var ret = atob(response["result"]["value"]);
                    resolve(ret);
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
                    var ret = atob(response["result"]["value"]);
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
                    var ret = atob(response["result"]["value"]);
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
                    var ret = atob(response["result"]["value"]);
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
                    var ret = atob(response["result"]["value"]);
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
                        resolve(xhr.response);
                    else
                        reject(xhr.response); 
                }
                else
                    reject(xhr.status);
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
}

export { NimbusRPC };