Vue.component('answer-area', {
    data: function () {
        return {
            canvas: null,
            context: null,
            isDrag: false
        };
    },
    mounted(){
        this.canvas = document.querySelector('#myCanvas')
        this.context = this.canvas.getContext('2d')
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.lineWidth = 5;
        this.context.strokeStyle = '#FFF';
        this.context.beginPath();
        this.context.fillStyle = '#214fe9';
        this.context.fillRect(0,0, 1024, 768);
    },
    methods: {

      // 描画
      draw :function(e) {
        var x = e.layerX
        var y = e.layerY
   
        if(!this.isDrag) {
          return;
        }
   
        this.context.lineTo(x, y);
        this.context.stroke();
      },
      // 描画開始（mousedown）
      dragStart:function(e) {
        var x = e.layerX
        var y = e.layerY
   
        this.context.beginPath();
        this.context.lineTo(x, y);
        this.context.stroke();
     
        this.isDrag = true;
      },
      // 描画終了（mouseup, mouseout）
      dragEnd: function() {
        this.context.closePath();
        this.isDrag = false;
        },
    },

    template: '<div id="canvas-area"><canvas id="myCanvas" class="m-0" width="1024px" height="768px"  @mousedown="dragStart" @mouseup="dragEnd" @mouseout="dragEnd" @mousemove="draw"></canvas></div>'
});



var websocket;
var app = new Vue({
    el: '#app',
    data: {
      message: '',
      name: '',
      debugmessages: [],
    },
  methods:{

    adddebug: function(msg) {
      self = this;
      var message = new Date().toISOString() + " " + msg;
      self.debugmessages.unshift(message);
    },
        submit: function() {
            data = {
                action: 'submitAnswer',
                name: this.name,
                answer: document.querySelector('#myCanvas').toDataURL(),
            }
            websocket.send(JSON.stringify(data));
            self.adddebug(data);
            self.message = '回答を送信しました';

        },
        clear: function(e) {
            context = document.querySelector('#myCanvas').getContext('2d');
            context.beginPath();
            context.fillStyle = '#214fe9';
            context.fillRect(0,0, 700, 400);
        },
        connect : function() {
            self = this;
            var websocketurl = document.querySelector('#websocketurl').value;
            websocket = new WebSocket(websocketurl);
            websocket.onopen = function(event) {
                self.adddebug('######### WebSocket opened');
                self.name = document.querySelector('#answerer-name').value;
                self.message = '接続が完了しました';
            };
    
            websocket.onmessage = function(event) {
                var data = JSON.parse(event.data);
                self.adddebug(data);
                self.message = data.msg;
            };
    
            websocket.onerror = function(event) {
                self.adddebug(event);
            };
    
            websocket.onclose = function(event) {
                self.adddebug(event);
                self.adddebug('######### WebSocket closed');
                self.message = '切断しました';
            }
        },
        disconnect : function() {
            websocket.close();
        },

    }

})


