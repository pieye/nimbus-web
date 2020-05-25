import { NimbusRPC } from './nimbusRPC.js';

class NimbusStream {
    constructor(host, onNewData, port=8080, rpcPort=8383) {
        this.uri = "ws://"+host+":"+port.toString()+"/stream";
        
        this.nimbusRPC = new NimbusRPC(host, port=rpcPort);
        
        this.onNewData = onNewData;

        var self = this;
        this.getMultiMatrix().then(
            function() {
                self.ws = new WebSocket(self.uri);
                self.ws.binaryType = 'arraybuffer';
                self.ws.onmessage=self._wsNewData.bind(self);
            },
            function(status) {
                msg = "Error connecting to RPC server: " + status
                alert(msg);
        });
        
        this.reportedOnce = false;
    }
    
    getMultiMatrix() {
        var self = this;
        var p1 = new Promise(
            function(resolve, reject) {
                self.nimbusRPC.getUnitXVector()
                    .then(val => {self.xMultiMatrix=val; return self.nimbusRPC.getUnitYVector();})
                    .then(val => {self.yMultiMatrix=val; return self.nimbusRPC.getUnitZVector();})
                    .then(val => {self.zMultiMatrix=val; resolve();})
                    .catch(status => reject(status));
            });
        return p1;
    }
    
    _wsNewData(evt) {
        var headerVersion = new Float32Array(evt.data, 0, 4);
        headerVersion = headerVersion[0];
        
        if (headerVersion === 0 || headerVersion === 1 || headerVersion === 2)
        {
            var headerSize = new Float32Array(evt.data, 4, 4);
            headerSize = headerSize[0];
            var header = new Float32Array(evt.data, 0, headerSize);
            
            var numPixels = header[3] * header[4];
            
            var offset = headerSize;
            var ampl_arr = new Uint16Array(evt.data, offset, numPixels);
            offset += 2 * numPixels;
            var dist_arr = new Uint16Array(evt.data, offset, numPixels);
            offset += 2 * numPixels;
            var conf = new Uint8Array(evt.data, offset, numPixels);
            offset += numPixels;


            var x_arr = new Int16Array(numPixels);
            var y_arr = new Int16Array(numPixels);
            var z_arr = new Int16Array(numPixels);

            for (var i = 0; i < numPixels; i++) {
                var temp;
                temp = dist_arr[i] * this.xMultiMatrix[i];
                x_arr[i] = (temp >> 16);
                temp = dist_arr[i] * this.yMultiMatrix[i];
                y_arr[i] = (temp >> 16);
                temp = dist_arr[i] * this.zMultiMatrix[i];
                z_arr[i] = (temp >> 16);
            }
            
            this.onNewData(header, ampl_arr, dist_arr, conf, x_arr, y_arr, z_arr);
        }
        else
        {
            if (this.reportedOnce === false)
            {
                alert ("streaming protocol version " + headerVersion + " not supported, update the remote software");
                this.reportedOnce = true;
            }
        }
    }

}

export { NimbusStream };
