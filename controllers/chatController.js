var Member = require('../models/member.js');
var Friend = require('../models/friend.js');
var Chat   = require('../models/chat.js');

// 메인 페이지로 갈 때 주소 표시줄

exports.list = function(req, res) {
	if(req.session.userId == null) {
		res.render('login');
	} else {
		Friend.find({id: req.session.userId}, function(err, friends) {
			res.render('chat', {friendList: friends, id: req.session.userId});
		}); 
	}
};

exports.login = function(req, res) {
	Member.count({id: req.body.id, pass: req.body.pass}, function(err, members) {
		if(members == 1) {
			req.session.userId = req.body.id;
			Friend.find({id: req.body.id}, function(err, friends) {
				res.render('chat', {friendList: friends, id: req.session.userId});
			}); 
		} else {
			res.render('login', {result: 'false'});
		}
	});
};

exports.logout = function(req, res) {
	req.session.destroy();
	res.render('login');
};

exports.goSignUp = function(req, res) {
	// ID 중복체크
	if(req.query.id != null) {
		Member.count({id: req.query.id}).exec(function(err, members){
			res.json({result: members});
		});
	} else {
		res.render('signUp');
	}
};

exports.signUp = function(req, res) {
	new Member({
		id: req.body.id,
		pass: req.body.pass,
		gender: req.body.gender
	}).save();
			
	res.json({site: '/member/login'});
};

exports.searchFriend = function(req, res) {
	Member.find({id: new RegExp(req.body.keyword)}).sort({id: 1}).exec(function(err, members) {
		res.json({memberList: members});	
	}); 
};

exports.addFriend = function(req, res) {
	new Friend({
		id: req.session.userId,
		friendId: req.query.friendId,		
		friendGender: req.query.friendGender		
	}).save();
	
	res.json({result: null});
};

exports.deleteFriend = function(req, res) {
	Friend.remove({id: req.session.userId, friendId : req.query.friendId}, function() {
		res.json({result: null});
	});
};

exports.saveMsg = function(req, res) {
	new Chat({
		from: req.session.userId,
		to: req.query.to,
		content: req.query.content
	}).save();
	
	res.json({result: null});
};

exports.viewMsg = function(req, res) {
	if(req.params.type == 'send') {
		Chat.find({from: req.session.userId}).sort({createDate: -1}).exec(function(err, chats) {
			res.render('viewMsg', {sendMsgList: chats, type: 'send'});			
		});
	} else {
		Chat.find({to: req.session.userId}).sort({createDate: -1}).exec(function(err, chats) {
			res.render('viewMsg', {receiveMsgList: chats, type: 'receive'});			
		});
	}
};