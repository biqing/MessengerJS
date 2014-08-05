window.Messenger = (function(w,jQuery){
	var prefix = '[_Project_Name]';

	var ie = w.navigator.appName !== 'Netscape';
	var parent = w.parent;
	var nv = ie ? parent.navigator : void(0);

	var Messenger = function (myName){
		if(ie)this.self = nv[myName] = new Watcher();
		this.evNames = {};
		this.data = [];
		return this;
	};

	var iePostMessage = {};
	var usePostMessage = {};
	//ie下的通信
	//监视器
	function Watcher(){
		this.targets = {};
	}
	Watcher.prototype.addListener = function(evName,callback){
		var targets = this.targets;
		targets[evName] = callback;
	};
	Watcher.prototype.emit = function(evName,msg){
		var targets = this.targets;
		targets[evName](msg);
	};
	//ie post
	iePostMessage.to = function(target,n){
		this.tName = target;
		return this;
	};
	iePostMessage.post = function(evName,msg){
		var self = this;
		var name = self.tName;
		parent['ifr'].onload = function(){
			self.target = nv[name];
			self.target.emit(evName,msg);
		}
		return this;
	};
	iePostMessage.listen = function(evName,callback){
		this.self.addListener(evName,callback);
		return this;
	};
	//post message
	usePostMessage.post = function(evName,msg){
		var self = this;
		var data = self.data;
		var tg = self.target;
		data.push({name:evName,msg:msg});
		self._onload(function(){
			tg.contentWindow.postMessage(data,tg.src);
		});
		return this;
	};
	usePostMessage.to = function(target,n){
		var self = this;
		self.tName = target;
		if(n === void(0)){
			self.target = document.querySelector('#'+self.tName);
		}else{
			self.ftf = !0;
			self.target = {contentWindow : parent.frames[n],src:'*'}
		}
		return this;
	};
	usePostMessage.listen = function(evName,callback){
		var self = this;
		var name = evName;
		var names = self.evNames;
		names[name] = callback;
		var wrap = function(event){
			var data = event.data;
			var ns = names;
			var n = name;
			data.forEach(function(v){
				var evN = v.name;
				if(n && n!==evN)return;
				var msg = v.msg;
				if(n==evN || (!n && ns[evN]))ns[evN](msg);
			});
		};
		w.onmessage = wrap;
		return this;
	};
	Messenger.prototype = ie ? iePostMessage : usePostMessage;
	Messenger.prototype._onload = function(fn){
		var self = this;
		if(self.ftf){
			fn();
		}else if(w == parent){
			self.target.onload = fn;
		}
	}
	return Messenger;
})(window,window.jQuery);
