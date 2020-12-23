class Chat{
	constructor(roomKey,user,friend,containerId,database){
		this.user = user;
		this.id = roomKey;
		this.friend = friend;
		this.database = database;
		this.builChat(containerId);
		this.setEvents();
	}
	builChat(container){
		$.tmpl($("#hidden-template"),{id: this.id, nombre: this.friend}).appendTo('#'+container);
		this.ref = this.database.ref("/messages/"+this.id);
	}
	setEvents(){
		$("#"+this.id).find("form").on("submit",(ev)=>{
			ev.preventDefault();
			var msg = $(ev.target).find(".message-content").val();
			this.send(msg);
			return false;
			msg.empty();
		});
		this.ref.on("child_added",(data)=> this.addMsg(data));
	}
	addMsg(data){
		var mensaje = data.val();

		if (mensaje.name == this.user) {
			var html = ` 
			      <p class="me">${mensaje.msg}</p>
		    	`;
		}else{
			var html = ` 
				      <p class="them"><b>${mensaje.name} dice:</b> ${mensaje.msg}</p>
			    	`;
		}
		
		var $li = $("<li>").html(html);
		$("#"+this.id).find(".messages").append($li);
	}
	send(msg){
		this.ref.push({
			name: this.user,
			msg:msg,
			roomId:this.id
		});
	}
}