// Users = new Mongo.Collection("userAccounts");
Router.route("/chatPage");
if (Meteor.isClient) {
  //var localFriends=Friends;
	Meteor.startup(function() {

            /*$( "#signUpButton" ).click(function(event, temp) {

            	// event. e.stopPropogation();
 			 	var array=Users.find({"email":$("#signUpEmail").val()}).fetch().length;
            	if (array!==0) {
            		event.preventDefault();
            	}
            	else {
            		Users.insert({ email: $("#signUpEmail").val(),password: $(".signUpPassword").val(), createdAt: new Date() });
            		alert("congratulations,You are signed In");

            	}

            });*/
            /*$("#loginButton").click(function(event,temp) {
            	var array=Users.find({"email":$("#loginEmail").val(),"password":$("#loginPassword").val()}).fetch().length;
            	if(array===0) {
            		alert("sorry,your email and password combination doesn't match");
            		event.preventDefault();
            	}

            });*/
	});
	Template.hey.helpers({
		userName: function() {
			return Session.get("userMail");//String(LoggedInUser.findOne({},{email:1, _id:0})["email"]);
		}
	});
	Template.chatMessages.helpers({
		chatMessages: function() {
			/*console.log("you are here", Session.get("userMail"), $("#chatFriend").text(), Messages.findOne({$or:
			[
          {email1: Session.get("userMail"), email2: Session.get("friendMail")},
          {email1: Session.get("friendMail"), email2: Session.get("userMail")}
			]
		}));*/
			setTimeout(function() {
				var elem = document.getElementById("chatWindow");
				elem.scrollTop = elem.scrollHeight;
        //alert("inside timeout");
			}, 500);
			return JSON.parse(Messages.findOne({
				$or: [
          {email1: Session.get("userMail"), email2: Session.get("friendMail")},
          {email1: Session.get("friendMail"), email2: Session.get("userMail")}
				]
			}).chats) || [];
		}
	});
	Template.friendNames.helpers({
		friendNames: function() {
			if (typeof Friends.find({
				email: Session.get("userMail")
			}).fetch()[0] === "undefined") {
				var array = [];
				var temp = {};//new Object();
				temp.email = "No friends yet";
				array.push(temp);
				//console.log(Session.get("userMail"));
				return array;
			}
			else {
      //console.log("you are in else");
      //console.log(Session.get("userMail"));
				return JSON.parse(Friends.find({email: Session.get("userMail")}).fetch()[0].friends);
			}
		}
	});
  /*Template.friendNames.events({
     "click span.emailId": function(event,temp) {
    console.log($(event.target).text());
  }
  });*/
	Template.hey.events({
		"click #signOutButton": function(event, temp) {
		//LoggedInUser.remove({});
			Session.set("userMail", null);
			Router.go("/");
		},
		"keyup .messageInput": function(e) {
			if (e.which === 13) {
				$("#sendMessage").click();
			}
		},
		"click span.emailId": function(event, temp) {
			var chatFriend = $(event.target).text();
			$("#chatWindow").addClass("chatClass");
			//console.log($(event.target).text());
			//alert(chatFriend);
			//$("#chatWindow").append("<input type='text' size=75 class='messageInput' placeholder='type your message here'>");
			//$("#chatWindow").append("<input type='button' value='Send' id='sendMessage'>");
			//$("<li id='chatFriend'><b>chat With:"+chatFriend+"</b></li>").insertBefore("#loggedInUser");;
			//alert(chatFriend);
			$("#messageBar").css("display", "block");
			$("#chatFriend").text(chatFriend);
			Session.set("friendMail", chatFriend);
		},
		"click #sendMessage": function(event, temp) {
			//alert($("#chatFriend").text());
			if (Messages.find({
				$or: [{
					email1: Session.get("userMail"), email2: Session.get("friendMail")}, {
						email1: Session.get("friendMail"), email2: Session.get("userMail")}
					]
			}).fetch().length === 0) {
				var array = [];
				var ob = {};
				ob.email = Session.get("userMail");
				ob.createdAt = new Date();
				ob.message = $(".messageInput").val();
				$(".messageInput").val("");
				array.push(ob);
				Messages.insert({email1: Session.get("userMail"), email2: Session.get("friendMail"), chats: JSON.stringify(array)});
			}
      else {
				var chatArray = JSON.parse(Messages.find({
					$or: [{
						email1: Session.get("userMail"), email2: Session.get("friendMail")}, {
							email1: Session.get("friendMail"), email2: Session.get("userMail")}
						]
				}).fetch()[0]["chats"]);
				var ob = {};
				ob.email = Session.get("userMail");
				ob.createdAt = new Date();
				ob.message = $(".messageInput").val();
				$(".messageInput").val("");
				chatArray.push(ob);
				chatArrayCursor = Messages.find({$or: [{
					email1: Session.get("userMail"), email2: Session.get("friendMail")}, {
						email1: Session.get("friendMail"), email2: Session.get("userMail")}
					]
				}).fetch()[0];
				Messages.update({_id: chatArrayCursor._id}, {$set: {chats: JSON.stringify(chatArray)}});
			}
		},
		"click #searchButton": function(event, temp) {
			var array = Users.find({
				"email": $("#searchText").val()}).fetch().length;
			$("#chatWindow").css("display", "none");
			$("#friendDialogue").css("display", "block");
			$("#friendDialogue").append("<a href='#'><img src='close.png' alt='close' id='closeDialogue'></a>");
			if (array === 0) {
				$("#friendDialogue").append("<h4>Sorry No friends found with this id</h4>");
			}
			else {
				$("#friendDialogue").append("<h4>Click on Add to make the user your friend</h4>");
				$("#friendDialogue").append("<b>" + $("#searchText").val() + "</b><br>");
				$("#friendDialogue").append("<input type='button' id='addFriend' value='Add'>");
			}
		},
		"click #closeDialogue": function(event, temp) {
			$("#friendDialogue").html("");
			$("#friendDialogue").css("display", "none");
			$("#chatWindow").css("display", "block");
			$("#searchText").val("");
		},
		"click #addFriend": function(event, temp) {
			$("#friendDialogue").html("");
			$("#friendDialogue").css("display", "none");
			$("#chatWindow").css("display", "block");
			friendMail = $("#searchText").val();
			var userMail = Session.get("userMail");
			//var length=Friends.find({friendMail:{$exists:true}}).fetch().length;
			friendList = Friends.findOne({"email": userMail});
			if (typeof friendList === "undefined") {
				var array = [];
				var friendObject = {};
				//console.log(userMail);
				friendObject.email = $("#searchText").val();
				array.push(friendObject);
				//console.log(array);
				Friends.insert({email: userMail, friends: JSON.stringify(array)});
				//Friends.insert({Session.get("userMail"):$("#searchText").val()});
			}
			else {
				var array = JSON.parse(friendList["friends"]);
				var friendName = $("#searchText").val();
				var flag = 0;
				for (var i = 0; i < array.length; i ++ ) {
					//alert(array[i]["email"]);
					//console.log(friendName);
					if (friendName === array[i].email) {
						alert("You are already friends with " + friendName);
						flag = 1;
						break;
					}
				}
				if (flag === 0) {
					var friendObject = {};
					friendObject.email = $("#searchText").val();
					array.push(friendObject);
					Friends.update({_id: friendList._id}, {$set: {"friends": JSON.stringify(array)}});
				}
			}
			$("#searchText").val("");
		}
	});
	Template.demo.events({
		//validates the loging userId and userPassword
		"click #loginButton": function(event, temp) {
			var array = Users.find({"email": $("#loginEmail").val(), "password": $("#loginPassword").val()}).fetch().length;
			if (array === 0) {
				alert("sorry,your email and password combination doesn't match");
				event.preventDefault();
			}
			else {
				//console.log(event);
				Session.set("userMail", $("#loginEmail").val());
				//LoggedInUser.insert({"email":$("#loginEmail").val()});
				Router.go("login");
			}
		},
		"blur #cspass": function() {
			if ($("#spass").val() !== $("#cspass").val()) {
				alert("passwords don't match");
				$("#spass").val("");
				$("#cspass").val("");
				$("#spass").focus();
			}
		},
		"click #signUpButton": function(event, temp) {
			if ($("#fname").val() === "" || $("#sname").val() === "" || $("#signUpEmail").val() === "" || $("#signUpPassword").val() === "" || $("#spass").val() === "" || $("cspass").val() === "") {
				alert("Please fill In the required fields");
			}
			else {
				var array = Users.find({"email": $("#signUpEmail").val()}).fetch().length;
				if (array !== 0) {
					alert("The email is already taken,try logging In");
					event.preventDefault();
				}
				else {
					Users.insert({ email: $("#signUpEmail").val(), password: $(".signUpPassword").val(), createdAt: new Date() });
					alert("congratulations,You are signed In");
					Session.set("userMail", $("#signUpEmail").val());
					Router.go("login");
				}
			}
		}
	});
}
if (Meteor.isServer) {
	Meteor.startup(function() {
		// code to run on server at startup
	});
}
