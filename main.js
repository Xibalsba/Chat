;(function(){

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBqdFsfJ4UjKMnFeKK1TJH9sPdtp2lLvnA",
    authDomain: "chat-1-1-2bfea.firebaseapp.com",
    databaseURL: "https://chat-1-1-2bfea.firebaseio.com",
    projectId: "chat-1-1-2bfea",
    storageBucket: "chat-1-1-2bfea.appspot.com",
    messagingSenderId: "1068742413108"
  };
  firebase.initializeApp(config);

  var db = firebase.database();
  var btnLogin = document.getElementById("login");
  var btnLogout = document.getElementById("logout");
  var user = null;
  var usuariosConectados = null;
  var conectadoKey = "";
  var userKey = "";
  var displayName = "";
  var displayNameFriend = "";
  var rooms;

  btnLogin.addEventListener("click",googleLogin);
  btnLogout.addEventListener("click",googleLogout);
  // iniciar sesion
  function googleLogin(){

  	var provider = new firebase.auth.GoogleAuthProvider();
  	firebase.auth().signInWithPopup(provider).then(function(result) {
	  var user = result.user;

	  $(".login").fadeOut();
	  $(".logout").show();
	  $("#app").show();
	  initApp(user);
	}).catch(function(error) {
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  var email = error.email;
	  var credential = error.credential;
	});
  }
  function initApp(user){
    usuariosConectados = db.ref("/connected");
  	rooms = db.ref("/rooms");

  	login(user.uid,user.displayName || user.email);


  	usuariosConectados.on("child_added",addUser);
    usuariosConectados.on("child_removed",removeUser);

  	rooms.on("child_added",newRoom);
  }

  function login(uid,name){
  	var conectado = usuariosConectados.push({
  		uid:uid,
  		name:name
  	})

  	conectadoKey = conectado.key;
    userKey = uid;
    displayName = name;
  }
  function unlogin(){
  	db.ref("/connected/"+conectadoKey).remove();
  }
  function addUser(data){

  	var $li = $("<li>").addClass("collection-item")
  					   .html(data.val().name)
  					   .attr("id",data.val().uid)
  					   .appendTo('#users');

    $li.on("click",function(){
      var friend_id = $(this).attr("id");
      
      if (userKey == friend_id) return;

      var room = rooms.push({
        creator: userKey,
        friend:friend_id 
      });
    });

    displayNameFriend = data.val().name;
  }
  function removeUser(data){
  	$("#"+data.val().uid).slideUp("fast",function(){
  		$(this).remove();
  	});
  }
  function newRoom(data){
    if (data.val().friend == userKey){
      new Chat(data.key,displayName,displayNameFriend,"chat",db);
    }
    if (data.val().creator == userKey) {
      new Chat(data.key,displayName,displayNameFriend,"chat",db);
    }
  }
  function googleLogout(){
  	firebase.auth().signOut().then(function() {
	  $(".login").show();
	  $("#app").fadeOut();
	  $(".logout").fadeOut();
	  console.log("Se ha cerrado la sesión");
	  unlogin();
	}).catch(function(error) {
	});
  }
})()