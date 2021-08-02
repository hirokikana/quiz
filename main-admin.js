
Vue.component('answer-list', {
    props: ['answer'],
    template: '<div><img v-bind:src=answer.canvas width="700" height="400" style="background-color: #214fe9; margin: 0px"></canvas><h2 class="text-center text-light" style="background-color: #214fe9; width: 700px; margin-top: -10px">{{ answer.name }}</h2></div>'
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
                var hoge = JSON.parse(event.data);
                console.log(hoge);
                self.addanswer({name: hoge['name'], canvas: hoge['answer']})
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


