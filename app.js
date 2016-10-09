var express = require('express'); 
var path 	= require('path');
var session = require('express-session');

var app = express();

app.use(session({
  secret: 'swerfcvghyhjgfds3456yutfs',
  resave: false,
  saveUninitialized: true
}));

var server  = require('http').createServer(app);
var io 		= require('socket.io').listen(server);

var port = process.env.PORT || 3000;

app.configure(function() {
  app.set('port', port);
  
  // 템플릿엔진 사용
  app.set('views', './views'); 
  app.set('view engine', 'jade');
	
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router); 
  app.use(express.static(path.join(__dirname, 'public')));
});

app.start = app.listen = app.aaa = function(){
	return server.listen.apply(server, arguments);
};

app.aaa(app.get('port'),function(){
	console.log("Server Start!!!");
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./router.js').route(app);

require('./db.js').connect();

var loginList = [];

io.sockets.on('connection', function(socket) {
	// 로그인한 사용자 리스트
	socket.on('login', function(data) {
		// 새로고침 후 socket.id 재저장
		for(var i=0 ; i<loginList.length ; i++) {
			if(loginList[i].loginId == data.loginId) {
				loginList.splice(loginList[i], 1);
			}
		}
		
        var loginInfo = new Object();
        
        loginInfo.loginId  = data.loginId;
        loginInfo.socketId = socket.id; 
        
		loginList.push(loginInfo);
		console.log(loginList);
		
		// 로그인 리스트 보내기
		io.sockets.emit('broadcastLoginList', {loginList: loginList});
    });
	
	// 로그아웃
	socket.on('logout', function(data) {
		loginList.splice(loginList[data.loginId], 1);
		console.log(loginList);
		io.sockets.emit('broadcastLoginList', {loginList: loginList});
	});
	
	// 한사람에게 메시지 보내기
	socket.on('sendMsg', function(data) {
		for(var i=0 ; i<loginList.length ; i++) {
	        if(loginList[i].loginId == data.toId) {
	        	io.to(loginList[i].socketId).emit('broadcastMsg', data);
	        	break;
            }
	    }
	});
});