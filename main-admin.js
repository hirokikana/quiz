
Vue.component('answer-list', {
  props: ['answer'],
  template: '<div style="margin-left: auto; margin-right: auto; width: 1024px;"><img v-bind:src=answer.img width="1024" height="768" style="background-color: #214fe9; margin: 0px"></canvas><h2 class="text-center text-light" style="background-color: #214fe9; width: 1024px; margin-top: -10px">{{ answer.name }}</h2></div>'
});

var websocket;

var app = new Vue({
    el: '#app',
    data: {
        message: '',
        testmessage: '',
        answer_list: []
    },
    methods: {
        clear : function() {
            this.answer_list = [];
        },
        connect : function() {
            self = this;
            var websocketurl = document.querySelector('#websocketurl').value;
            websocket = new WebSocket(websocketurl);
            websocket.onopen = function(event) {
                console.log('######### WebSocket opened');
            };
    
            websocket.onmessage = function(event) {
                console.log(event.data.name);
              var data = JSON.parse(event.data);
              if(data['message'] == 'submitanswer') {
                var answer = {};
                answer['name'] = data['name'];
                var img_url = data['upload_api'] + 'img/' + data['connection_id'];
                fetch(img_url).then((response) => { return response.text()}).then((data) => {
                  answer['img'] = data;
                  self.addanswer(answer);
                }).catch((reason) => {console.log(reason);});
              }
            };
    
            websocket.onerror = function(event) {
                console.log(event);
            };
    
            websocket.onclose = function(event) {
                console.log('######### WebSocket closed')
            }
    
        },
        disconnect : function () {
            websocket.close();
        },
        addanswer : function(answer) {
            console.log(answer);
            var index = this.answer_list.findIndex((v) => v.name == answer['name']);
            if (index >= 0) {
                this.answer_list.splice(index,1);
            }
            this.answer_list.push(answer);

            console.log(document.querySelector('#' + answer.name)) ;
        }

    },
    mounted: function() {
  

    }
})


