var controller 	= require('./controllers/chatController.js');

exports.route = function(app) {
	
	// 메인페이지 이동
	app.get('/', controller.list);
	
	// 로그인 페이지 이동
	app.get('/member/login', function(req, res) { res.render('login'); });
	
	// 로그인 처리
	app.post('/member/login', controller.login);
	
	// 로그아웃 처리
	app.get('/member/logout', controller.logout);

	// 회원가입 페이지 이동
	app.get('/member/signUp', controller.goSignUp);
	
	// 회원가입 처리
	app.post('/member/signUp', controller.signUp);

	// 친구찾기 팝업 띄우기
	app.get('/friend/search', function(req, res) { res.render('searchFriend'); });
	
	// 친구찾기
	app.post('/friend/search', controller.searchFriend);
	
	// 친구추가
	app.get('/friend/add', controller.addFriend);
	
	// 친구삭제
	app.get('/friend/delete', controller.deleteFriend);
	
	// 메시지 저장
	app.get('/message/save', controller.saveMsg);
	
	// 메시지 보기
	app.get('/message/view/:type', controller.viewMsg);
	
};