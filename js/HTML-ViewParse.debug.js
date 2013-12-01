// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
'use strict';
var global = global || this /*strict model use "global" else than "this"*/ ;

var doc = document,
	_isIE = !global.dispatchEvent, //!+"\v1",
	shadowBody = doc.createElement("body"),
	shadowDIV = doc.createElement("div"),
	_placeholder = function(prefix) {
		return prefix || "@" + Math.random().toString(36).substring(2)
	},
	_booleanFalseRegExp = /false|undefined|null|NaN/,
	$NULL = null,
	$UNDEFINED,
	$TRUE = !$UNDEFINED,
	$FALSE = !$TRUE,
	$ = {
		id: 9,
		uidAvator: Math.random().toString(36).substring(2),
		hashCode: function(obj, prefix) {
			var uidAvator = (prefix || "") + $.uidAvator,
				codeID;
			if (!(codeID = obj[uidAvator])) {
				codeID = obj[uidAvator] = uidAvator + $.uid();
			}
			return codeID;
		},
		noop: function noop() {},
		valueOf: function(Obj) {
			if (Obj) {
				Obj = Obj.valueOf()
			}
			return Obj
		},
		uid: function() {
			return this.id = this.id + 1;
		},
		isString: function(str) {
			var start = str.charAt(0);
			return (start === str.charAt(str.length - 1)) && "\'\"".indexOf(start) !== -1;
		},
		trim: function(str) {
			str = str.replace(/^\s\s*/, '')
			var ws = /\s/,
				i = str.length;
			while (ws.test(str.charAt(--i)));
			return str.slice(0, i + 1);
		},
		p: function(arr, item) { //push
			var len = arr.length
			arr[len] = item;
			return len;
		},
		us: function(arr, item) { //unshift
			arr.splice(0, 0, item);
		},
		un: function(array) { //unique
			var a = array;
			for (var i = 0; i < a.length; ++i) {
				for (var j = i + 1; j < a.length; ++j) {
					if (a[i] === a[j])
						a.splice(j--, 1);
				}
			}
			return a;
		},
		s: function(likeArr) { //slice
			var array;
			if (typeof likeArr === "string") {
				return likeArr.split('');
			}
			try {
				array = Array.prototype.slice.call(likeArr, 0); //non-IE and IE9+
			} catch (ex) {
				array = [];
				for (var i = 0, len = likeArr.length; i < len; i++) {
					array.push(likeArr[i]);
				}
			}
			return array;
		},
		sp: Array.prototype.splice,
		pI: function(arr, item) { //pushByID
			arr[item.id] = item;
			return item;
		},
		lI: function(arr) { //lastItem
			return arr[arr.length - 1];
		},
		iA: function(arr, afterItem, item) { //insertAfter
			for (var i = 0; i < arr.length; i += 1) {
				if (arr[i] === afterItem) {
					arr.splice(i + 1, 0, item);
					break;
				}
			}
			return i;
		},
		iO: function(arr, item) { //indexOf
			for (var i = 0,len = arr.length; i < len; i += 1) {
				if (arr[i] === item) {
					return i;
				}
			}
			return -1;
		},
		fI: function(obj, callback) { //forIn
			for (var i in obj) {
				callback(obj[i], i, obj);
			}
		},
		ftE: function(arr, callback, index) { //fastEach
			for (var i = index || 0, len = arr.length; i < len; i += 1) {
				callback(arr[i], i);
			}
		},
		fE: function(arr, callback, i) { //forEach
			if (arr) {
				arr = $.s(arr);
				// return this._each($.s(arr), callback, i)
				for (i = i || 0; i < arr.length; i += 1) {
					if (callback(arr[i], i, arr) === $FALSE) break;
				}
			}
		},
		rm: function(arr, item) {
			var index = $.iO(arr, item);
			arr.splice(index, 1);
			return arr;
		},
		// b: function(fun,scope){//Function.prototype.bind
		// 	return function() {
		// 		return fun.apply(scope, _s.call(arguments));
		// 	}
		// },
		c: function(proto) { //quitter than Object.create , use same memory
			_Object_create_noop.prototype = proto;
			return new _Object_create_noop;
		},
		D: { //DOM
			C: function(info) { //Comment
				return document.createComment(info)
			},
			iB: function(parentNode, insertNode, beforNode) { //insertBefore
				// try{
				parentNode.insertBefore(insertNode, beforNode || $NULL);
				// }catch(e){}
			},
			ap: function(parentNode, node) { //append
				parentNode.appendChild(node);
			},
			cl: function(node, deep) { //clone,do not need detached clone
				return node.cloneNode(deep);
			},
			rC: function(parentNode, node) { //removeChild
				parentNode.removeChild(node)
			},
			re: function(parentNode, new_node, old_node) { //replace
				try {
					parentNode.replaceChild(new_node, old_node);
				} catch (e) {}
			},
			rm: _isIE ? function() {
				//@大城小胖 http://fins.iteye.com/blog/172263
				var d = doc.createElement("div");
				return function(n) {
					if (n && n.tagName != 'BODY') {
						d.appendChild(n);
						d.innerHTML = '';
					}
				}
			}() : function(n) {
				if (n && n.parentNode && n.tagName != 'BODY') {
					delete n.parentNode.removeChild(n);
				}
			}
		}
	},
	_Object_create_noop = function proto() {},
	_traversal = function(node, callback) {
		for (var i = 0, child_node, childNodes = node.childNodes; child_node = childNodes[i]; i += 1) {
			var result = callback(child_node, i, node);
			if (child_node.nodeType === 1 && result !== $FALSE) {
				_traversal(child_node, callback);
			}
		}
	};

function ArraySet() {
	var self = this;
	self.keys = [];
	self.store = {};
	return self;
};
ArraySet.prototype = {
	set: function(key, value) {
		var self = this,
			keys = self.keys,
			store = self.store;
		key = String(key);
		if (!(key in store)) {
			$.p(keys, key)
		}
		store[key] = value;
	},
	get: function(key) {
		return this.store[key];
	},
	forIn: function(callback) { //forEach ==> forIn
		var self = this,
			store = self.store;
		return $.ftE(self.keys, function(key, index) {
			callback(store[key], key, store);
		})
	},
	has: function(key) {
		return key in this.store;
	}
};

function Try(tryFun, scope, errorCallback) {
	errorCallback = errorCallback || function(e) {
		if (console) {
			console.error(e)
		} else {
			throw e
		};
	};
	return function() {
		var result;
		try {
			result = tryFun.apply(scope, arguments /*$.s(arguments)*/ );
		} catch (e) {
			errorCallback(e);
		}
		return result;
	}
};
var _event_cache = {},
	_box,
	_fixEvent = function(e) { //@Rybylouvre
		// if (!e.target) {console.log(e)};
		e.target || (e.target = e.srcElement);
		e.which || (e.which = e.charCode || e.keyCode); //e.charCode != $NULL ? e.charCode : e.keyCode;
		e.preventDefault || (e.preventDefault = function() { //for ie
			e.returnValue = $FALSE
		});
		e.stopPropagation || (e.stopPropagation = function() { //for ie
			e.cancelBubble = $TRUE
		});
	},
	_fixMouseEvent = function(event) {
		_fixEvent(event);
		if (!_box && _isIE) {
			_box = event.target.ownerDocument || doc;
			_box = "BackCompat" === _box.compatMode ? _box.body : _box.documentElement;
		}
		event.pageX || (event.pageX = event.clientX + ~~_box.scrollLeft - ~~_box.clientLeft);
		event.pageY || (event.pageY = event.clientY + ~~_box.scrollTop - ~~_box.clientTop);
	},
	__lowestDelta, __lowestDeltaXY,
	_extendEventRouter = function(e, _extend) {
		if (e.__proto__) {
			var result = (_extendEventRouter = function(e, _extend) {
				var _e = {};
				$.fI(_extend, function(value, key) {
					_e[key] = value;
				})
				_e.__proto__ = e;
				return _e;
			})(e, _extend);
		} else {
			// try {// 	delete e.type; // 	e.type = e._eventName; // } catch (e) {// 	_e = $.c(e) // 	_e.type = "leftclick"// }
			if (_isIE) {
				result = (_extendEventRouter = function(e, _extend) {
					var _e;
					_e = $.c(e)
					$.fI(_extend, function(value, key) {
						_e[key] = value;
					})
					return _e;
				})(e, _extend);
			} else {
				result = (_extendEventRouter = function(e, _extend) {
					$.fI(_extend, function(value, key) {
						delete e[key];
						e[key] = value;
					})
					return e;
				})(e, _extend);
			}
		}
		return result;
	},
	// _extendEventRouter_proto = function(e, _extend) {
	// 	var _e = {};
	// 	$.fI(_extend, function(value, key) {
	// 		_e[key] = value;
	// 	})
	// 	_e.__proto__ = e;
	// 	return _e;
	// },
	// _extendEventRouter_ie = function(e, _extend) {
	// 	var _e;
	// 	_e = $.c(e)
	// 	$.fI(_extend, function(value, key) {
	// 		_e[key] = value;
	// 	})
	// 	return _e;
	// },
	// _extendEventRouter_old = function(e, _extend) {
	// 	$.fI(_extend, function(value, key) {
	// 		delete e[key];
	// 		e[key] = value;
	// 	})
	// 	return e;
	// },
	_registerEventBase = function(Element, eventName, eventFun, elementHash) {
		var result = {
			name: eventName,
			fn: eventFun
		};
		var _fn = result.fn = (function(fixEvent) {
			return function(e) {
				fixEvent(e);
				var _e = e;
				e._extend && (_e = _extendEventRouter(e, e._extend));
				var result = eventFun.call(Element, _e);
				(result === $FALSE) && (e.preventDefault() || e.stopPropagation());
				return result;
			}
		}(_isIE ? (/mouse|click|contextmenu/.test(eventName) ? _fixMouseEvent : _fixEvent) : $.noop));

		if (eventName === "input" && !("oninput" in doc)) {
			(function() {
				result.name = ["keypress", /*"focus", */ "blur", "keyup", "paste", "propertychange", "cut"]
				var _fixPropertychangeLock,
					_deleteOrChienseInput,
					_oldValue = Element.value,
					_TI;
				// delete Element.value;
				result.fn = function(e) { // @Gaubee github/blog/issues/44
					var result;
					if (e.type === "keyup") { //keyup // 3
						if (_deleteOrChienseInput) {
							_deleteOrChienseInput = $FALSE;
							_oldValue = Element.value;
							e._extend = {
								type: "input"
							}
							result = _fn(e);
						}
					} else if (e.type === "propertychange") { // 2
						if (_fixPropertychangeLock) {
							_fixPropertychangeLock = $FALSE;
							e._extend = {
								type: "input"
							}
							result = _fn(e);
						} else if ((e.keyCode === 8 /*backspace*/ || e.keyCode === 46 /*delete*/ ) || _oldValue !== Element.value) { //delete or chinese input
							_deleteOrChienseInput = $TRUE;
						}
					} else if (e.type === "blur") {
						Element.fireEvent("onkeyup")
						// clearInterval(_TI);
					} else { //paste cut keypress  // 1
						_fixPropertychangeLock = $TRUE;
						_deleteOrChienseInput = $FALSE;
					}
				}
				// function(b){"keydown"===b.type?8!==b.keyCode&&46!==b.keyCode||f===a.value||(f=a.value,z=G):"propertychange"===b.type?z&&(z=H,g(b)):z=G}
			}());
		} else if (/contextmenu|rclick|rightclick/.test(eventName) && _isIE) {
			(function() {
				result.name = ["mousedown", "contextmenu"];
				var _result;
				result.fn = function(e) {
					if (e.type === "contextmenu") {
						return _result;
					} else {
						if (e.button === 2) {
							e._extend = {
								type: "contextmenu"
							}
							_result = _fn(e)
						};
					}
				}
			}());
		} else if (/mouseenter|mouseleave/.test(eventName) && !_isIE) {
			(function() {
				result.name = eventName[5] === "e" ? "mouseover" : "mouseout";
				result.fn = function(e) {
					var topNode = e.relatedTarget,
						self = this;
					/*compareDocumentPosition
						0 self == topNode ===> 
						1 self in deffriend Document with topNode
						2 topNode befor self
						4 self befor topNode
						8 topNode contains self
						16 self contains topNode  ==>  
						32 Brower private*/
					if (!topNode || (topNode !== self && !(self.compareDocumentPosition(topNode) & 16))) { //@Rubylouvre
						e._extend = {
							type: eventName
						}
						return _fn(e);
					}
					/*else{
						return _fixMouseEnterAndLeave;//stop run 
					}*/
				}
			}())
		} else if (eventName === "lclick" || eventName === "leftclick") {
			(function() {
				result.name = "mousedown"
				result.fn = _isIE ? function(e) {
					if (e.button === 1) {
						e._extend = {
							type: "leftclick"
						}
						return _fn(e);
					}
				} : function(e) {
					if (e.button === 0) {
						e._extend = {
							type: "leftclick"
						}
						return _fn(e);
					}
				}
			}());
		} else if (eventName === "wclick" || eventName === "wheelclick") {
			(function() {
				result.name = "mousedown"
				result.fn = _isIE ? function(e) {
					if (e.button === 4) {
						e._extend = {
							type: "wheelclick"
						}
						return _fn(e);
					}
				} : function(e) {
					if (e.button === 1) {
						e._extend = {
							type: "wheelclick"
						}
						return _fn(e);
					}
				}
			}());
		} else if (eventName === "mousewheel") {
			//@brandonaaron:jquery-mousewheel MIT License
			(function() {
				result.name = "onwheel" in doc || doc.documentMode >= 9 ? "wheel" : ["mousewheel", "DomMouseScroll", "MozMousePiexlScroll"];
				result.fn = function(e) {
					var delta = 0, //增量
						deltaX = 0,
						deltaY = 0,
						absDelta = 0,
						absDeltaXY = 0,
						fn;

					// Old school scrollwheel delta
					if (e.wheelDelta /*px or undefined*/ ) {
						delta = e.wheelDelta;
					}
					if (e.detail /*0 or px*/ ) {
						delta = e.detail * -1;
					}
					// At a minimum, setup the deltaY to be delta
					deltaY = delta;

					// Firefox < 17 related to DOMMouseScroll event
					if (e.axis !== $UNDEFINED && e.axis === e.HORIZONTAL_AXIS) {
						deltaY = 0;
						deltaX = delta * -1;
					}

					// New school wheel delta (wheel event)
					if (e.deltaY) {
						deltaY = e.deltaY * -1;
						delta = deltaY;
					}
					if (e.deltaX) {
						deltaX = e.deltaX;
						delta = deltaX * -1;
					}
					// Webkit
					if (e.wheelDeltaY !== $UNDEFINED) {
						deltaY = e.wheelDeltaY;
					}
					if (e.wheelDeltaX !== $UNDEFINED) {
						deltaX = e.wheelDeltaX * -1;
					}

					// Look for lowest delta to normalize the delta values
					absDelta = Math.abs(delta);
					if (!__lowestDelta || absDelta < __lowestDelta) {
						__lowestDelta = absDelta;
					}
					absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
					if (!__lowestDeltaXY || absDeltaXY < __lowestDeltaXY) {
						__lowestDeltaXY = absDeltaXY;
					}

					// Get a whole value for the deltas
					fn = delta > 0 ? 'floor' : 'ceil';
					delta = Math[fn](delta / __lowestDelta);
					deltaX = Math[fn](deltaX / __lowestDeltaXY);
					deltaY = Math[fn](deltaY / __lowestDeltaXY);
					e._extend = {
						type: 'mousewheel',
						wheelDelta: delta,
						wheelDeltaX: deltaX,
						wheelDeltaY: deltaY
					}
					_fn(e)
				}
			}());
		}
		_event_cache[elementHash + $.hashCode(eventFun)] = result;
		return result;
	},
	_addEventListener = function(Element, eventName, eventFun, elementHash) {
		var eventConfig = _registerEventBase(Element, eventName, eventFun, elementHash)
		if (typeof eventConfig.name === "string") {
			Element.addEventListener(eventConfig.name, eventConfig.fn, $FALSE);
		} else {
			$.ftE(eventConfig.name, function(eventName) {
				Element.addEventListener(eventName, eventConfig.fn, $FALSE);
			})
		}
	},
	_removeEventListener = function(Element, eventName, eventFun, elementHash) {
		var wrapEventFun = _event_cache[elementHash + $.hashCode(eventFun)];
		wrapEventFun && Element.removeEventListener(eventName, wrapEventFun, $FALSE);
	},
	_attachEvent = function(Element, eventName, eventFun, elementHash) {
		var eventConfig = _registerEventBase(Element, eventName, eventFun, elementHash)
		if (typeof eventConfig.name === "string") {
			Element.attachEvent("on" + eventConfig.name, eventConfig.fn);
		} else {
			$.ftE(eventConfig.name, function(eventName) {
				Element.attachEvent("on" + eventName, eventConfig.fn);
			})
		}
	},
	_detachEvent = function(Element, eventName, eventFun, elementHash) {
		var wrapEventFun = _event_cache[elementHash + $.hashCode(eventFun)];
		wrapEventFun && Element.detachEvent("on" + eventName, wrapEventFun);
	},
	_registerEvent = _isIE ? _attachEvent : _addEventListener,
	_cancelEvent = _isIE ? _detachEvent : _removeEventListener;
/*
 * SmartTriggerSet constructor
 */

function SmartTriggerSet(data) {
	var self = this;
	self.keys = [];
	self.store = {};
	self.TEMP = data;
};
(SmartTriggerSet.prototype = $.c(ArraySet.prototype)).push = function(key, value) {
	var self = this,
		keys = self.keys,
		store = self.store,
		currentCollection;
	key = String(key);
	self.id=$.uid();
	if (!(key in store)) {
		$.p(keys, key);
	}
	currentCollection = store[key] || (store[key] = []);
	if (value instanceof Array) {
		$.ftE(value, function(smartTriggerHandle) {
			self.push(key, smartTriggerHandle);
		})
		// currentCollection.push.apply(currentCollection, value)
	} else if (value instanceof SmartTriggerHandle) {
		$.p(currentCollection, value)
	} else {
		console.warn("type error,no SmartTriggerHandle instance!");
	}
	return currentCollection.length;
};
SmartTriggerSet.prototype.touchOff = function(key) {
	var self = this;
	$.ftE(self.get(key), function(smartTriggerHandle) {
		smartTriggerHandle.event(self);
	});
	return self;
};
SmartTriggerSet.prototype.remove = function(smartTriggerHandle) {
	var self = this,
		key = smartTriggerHandle.matchKey,
		store = self.store,
		currentCollection = store[key];
	if (currentCollection) {
		var index = $.iO(currentCollection, smartTriggerHandle);
		$.sp.call(currentCollection,index,1);
	}
	return self;
}
/*
 * SmartTriggerHandle constructor
 */

function SmartTriggerHandle(key, triggerEvent, data) {
	var self = this,
		match = key;
	self.matchKey = String(key);
	self.TEMP = data;
	self.event = triggerEvent instanceof Function ? triggerEvent : $.noop;
	self.moveAble = SmartTriggerHandle.moveAble(self);
	self.STS_Collection = [];
};
SmartTriggerHandle.moveAble = function(smartTriggerHandle) {
	return $TRUE;
};
SmartTriggerHandle.prototype = {
	bind: function(smartTriggerSet, key) {
		var self = this;
		$.p(self.STS_Collection, smartTriggerSet);
		smartTriggerSet.push(key === $UNDEFINED ? self.matchKey : key, self);
		return self;
	},
	unbind: function(smartTriggerSet) {
		var self = this,
			STS_Collection = self.STS_Collection,
			index = $.iO(STS_Collection, smartTriggerSet);
		if (index !== -1) {
			smartTriggerSet.remove(self);
			STS_Collection.splice(index, 1);
		}
		return self;
	}
};
/*
 * DataManager constructor
 */
// var _hasOwn = Object.prototype.hasOwnProperty;

function DataManager(baseData) {
	var self = this;
	if (!(self instanceof DataManager)) {
		return new DataManager(baseData);
	}
	// baseData = baseData || {};
	self.id = $.uid();

	self._database = baseData;
	self.__arrayLen = {}; //cache array length with key
	// self._cacheData = {};
	self._viewInstances = []; //to touch off
	self._parentDataManager // = $UNDEFINED; //to get data
	self._prefix // = $NULL; //冒泡时需要加上的前缀
	// self._smartSource // = $NULL; //store how to get parentDataManager
	// self._smartDataManagers = [];//store smart dm which has prefix key 

	self._siblingDataManagers = [];
	self._subsetDataManagers = []; //to touch off
	self._triggerKeys = new SmartTriggerSet({
		dataManager: self
	});
	DataManager._instances[self.id] = self;
};
(global.DataManager = DataManager)._instances = {};

var _DM_extends_object_constructor = _placeholder();
DataManager.Object = function(extendsObj) {
	extendsObj[_DM_extends_object_constructor] = $TRUE;
};
DataManager.get = function(id) {
	return DataManager._instances[id];
}
var $LENGTH = "length";

function _mix(sObj, nObj) {
	var obj_nx,
		obj_s,
		i;
	if (sObj instanceof Object && nObj instanceof Object) {
		for (var i in nObj) {
			obj_n = nObj[i];
			obj_s = sObj[i]; //||(sObj[i]={});
			if (obj_s && obj_s[_DM_extends_object_constructor]) { //拓展的DM_Object对象，通过接口实现操作
				obj_s.set(obj_n);
			} else if (obj_s !== obj_n) { //避免循环 Avoid Circular
				sObj[i] = _mix(obj_s, obj_n);
			}
			// DataManager.set(sObj, i, nObj);
		}
		return sObj;
	} else {
		return nObj;
	}
};

function _getAllSiblingDataManagers(self, result) {
	$.p(result || (result = []), self)
	var dmSublingDataManagers = self._siblingDataManagers;
	$.ftE(dmSublingDataManagers, function(dm) {
		if ($.iO(result, dm) === -1) {
			_getAllSiblingDataManagers(dm, result);
		}
	});
	return result;
};
var DM_config = DataManager.config = {
	prefix: {
		This: "$THIS",
		Parent: "$PARENT",
		Top: "$TOP"
	}
};
DataManager.session = {
	topGetter: $NULL,
	topSetter: $NULL,
	filterKey: $NULL,
	setStacks: [],
	finallyRunStacks: []
};
//DataManager._finallyQuene = [];
// DataManager._finallyHash = {};
DataManager.finallyRun = function(fun) {
	var finallyQuene = DataManager._finallyQuene || (DataManager._finallyQuene = []);
	if (fun) {
		$.p(finallyQuene, fun)
	} else {
		while (finallyQuene.length) {
			fun = finallyQuene.splice(0, 1)[0]
			fun && fun()
		}
	}
}
var _dm_force_update //= $FALSE;  //ignore equal
var DM_proto = DataManager.prototype = {
	get: function(key) { //
		var self = DataManager.session.topGetter = this,
			result = self._database;
		if (arguments.length !== 0) {
			var arrKey = key.split("."),
				// lastKey = arrKey.pop(),
				anchor = 0;
			if (result != $UNDEFINED && result !== $FALSE) { //null|undefined|false
				if (_isIE) {
					do { //fix IE String
						var perkey = arrKey[anchor++];
						if (typeof result === "string" && ~~perkey == perkey) {
							result = result.charAt(perkey)
						} else {
							result = result[perkey];
						}
					} while (result !== $UNDEFINED && arrKey.length - anchor);
				} else {
					do { //fix IE String
						result = result[arrKey[anchor++]];
						// result = $.valueOf(result[arrKey.splice(0, 1)]);
					} while (result !== $UNDEFINED && arrKey.length - anchor);
				}
			}

			/*
		//避免混淆，不使用智能作用域，否则关键字更新触发器无法准确绑定或者会照常大量计算
		if (arrKey.length && (parent = self._parentDataManager)) { //key不在对象中，查询父级
			result = parent.get(key);
		}*/
			DataManager.session.filterKey = key;
		} else {
			DataManager.session.filterKey = $UNDEFINED;
		}
		if (result && result[_DM_extends_object_constructor]) {
			result = result.get(self);
		}
		return result;
	},
	mix: function(key, nObj) {
		//mix Data 合并数据
		var self = this,
			result;
		switch (arguments.length) {
			case 0:
				break;
			case 1:
				result = self.get(); //maybe ExtendsClass
				result = self.set(_mix(result, key));
				break;
			default:
				result = self.get(key);
				result = self.set(key, _mix(result, nObj));
		}
		return result;
	},
	set: function(key, nObj) {
		//replace Data 取代原有对象数据
		var self = DataManager.session.topSetter = this,
			lastKey,
			argumentLen = arguments.length;
		if (argumentLen === 0) {
			return;
		} else if (argumentLen === 1) {
			nObj = key;
			key = "";
		}
		DataManager.session.filterKey = key;

		var result = self.getTopDataManager(key), //Leader:find the dataManager matched by key
			setStacks = DataManager.session.setStacks,
			result_dm = result.dataManager,
			result_dm_id = result_dm.id;
		if ($.iO(setStacks, result_dm_id) === -1) { //maybe have many fork by the ExtendsClass
			$.p(setStacks, result_dm_id);
			result = result.key ? result_dm.set(result.key, nObj) : result_dm.set(nObj);
			// result = result_dm.touchOff(result.key)
			setStacks.pop();
			!setStacks.length && DataManager.finallyRun();
		} else {
			switch (argumentLen) {
				// case 0:
				// 	break;
				case 1:
					if (self._database !== nObj || _dm_force_update) {
						self._database = nObj;
					} else if (!(nObj instanceof Object)) {
						return;
					};
					break;
				default: //find Object by the key-dot-path and change it
					if (_dm_force_update || nObj !== DM_proto.get.call(self, key)) {
						//[@Gaubee/blog/issues/45](https://github.com/Gaubee/blog/issues/45)
						var database = self._database || (self._database = {}),
							sObj,
							cache_n_Obj = database,
							cache_cache_n_Obj,
							arrKey = key.split("."),
							lastKey = arrKey.pop();
						$.ftE(arrKey, function(currentKey) {
							cache_cache_n_Obj = cache_n_Obj;
							cache_n_Obj = cache_n_Obj[currentKey] || (cache_n_Obj[currentKey] = {})
						});
						if ((sObj = cache_n_Obj[lastKey]) && sObj[_DM_extends_object_constructor]) {
							sObj.set(nObj, self, key) //call ExtendsClass API
						} else if (cache_n_Obj instanceof Object) {
							cache_n_Obj[lastKey] = nObj;
						} else if (cache_cache_n_Obj) {
							(cache_cache_n_Obj[$.lI(arrKey)] = {})[lastKey] = nObj
						} else { //arrKey.length === 0,and database instanceof no-Object
							(self._database = {})[lastKey] = nObj
						}
					} else if (!(nObj instanceof Object)) { //no any change, if instanceof Object and ==,just run touchOff
						return;
					}
			}
			result = $UNDEFINED; //var result
			var linkKey = "",
				__arrayLen = self.__arrayLen,
				__arrayData;
			arrKey && $.ftE(arrKey, function(maybeArrayKey) {
				linkKey = linkKey ? linkKey + "." + maybeArrayKey : maybeArrayKey;
				if ((__arrayData = DM_proto.get.call(self, linkKey)) instanceof Array && __arrayLen[linkKey] !== __arrayData.length) {
					// console.log(linkKey,__arrayData.length, __arrayLen[linkKey])
					__arrayLen[linkKey] = __arrayData.length
					result = self.touchOff(linkKey)
				}
			})
			if (!result && (__arrayData = self.get()) instanceof Array && __arrayLen[""] !== __arrayData.length) {
				__arrayLen[""] = __arrayData.length
				key = "";
			}
			// console.log(key)
			result = result || self.touchOff(key);
		}
		return result;
	},
	registerTrigger: function(key, trigger) {
		var self = this,
			triggerKeys = self._triggerKeys;
		if (typeof trigger === "function") {
			trigger = {
				key: key,
				event: trigger
			};
		} else {
			if (!("key" in trigger)) {
				trigger.key = key
			}
		}
		return "id" in trigger ? trigger.id : (trigger.id = (triggerKeys.push(key, trigger) - 1) + "-" + key);
	},
	removeTrigger: function(trigger_id) {
		var index = parseInt(trigger_id),
			key = trigger_id.replace(index + "-", ""),
			self = this,
			triggerKeys = self._triggerKeys,
			triggerCollection = triggerKeys.get(key) || [];
		triggerCollection.splice(index, 1);
	},
	getTopDataManager: function(key) {
		var self = this,
			parent = self._parentDataManager,
			result,
			prefix;
		if (parent) {
			prefix = self._prefix //||"" ,all prefix has been filter $scope key
			key ? (prefix && (key = prefix + "." + key) /*else key = key*/ ) : (prefix && (key = prefix) /*key=""*/ );
			result = parent.getTopDataManager(key)
		} else {
			result = {
				dataManager: self,
				key: key
			};
		}
		return result;
	},
	touchOff: function(key) { //always touchoff from toppest dm
		var self = this,
			database = self._database;
		$.ftE($.s(_getAllSiblingDataManagers(self)), function(dm) {
			dm._database = database; //maybe on-obj
			dm._touchOff(key)
		})
	},
	_touchOff: function(key) {
		var self = this,
			parent = self._parentDataManager,
			triggerKeys = self._triggerKeys,
			updateKey = [key],
			chidlUpdateKey = [],
			allUpdateKey,
			triggerCollection;
		//self
		triggerKeys.forIn(function(triggerCollection, triggerKey) {
			//!triggerKey==true;
			if (!key || !triggerKey || key === triggerKey || triggerKey.indexOf(key + ".") === 0 || key.indexOf(triggerKey + ".") === 0) {
				// console.log("filter triggerKey:",triggerKey)
				$.p(updateKey, triggerKey)
				$.ftE(triggerCollection, function(smartTriggerHandle) {
					smartTriggerHandle.event(triggerKeys);
				})
			}
		});
		//child
		$.ftE(self._subsetDataManagers, function(childDataManager) {
			// debugger
			/*if (childDataManager._eachIgonre) {
				return
			};*/
			var prefix = childDataManager._prefix,
				childResult; // || "";
			_dm_force_update = $TRUE;
			if (!key) { //key === "",touchoff all
				childResult = childDataManager.set(prefix ? self.get(prefix) : self.get())
			} else if (!prefix) { //prefix==="" equal to $THIS
				childResult = childDataManager.set(key, self.get(key))
			} else if (key === prefix || prefix.indexOf(key + ".") === 0) { //prefix is a part of key,just maybe had been changed
				// childDataManager.touchOff(prefix.replace(key + ".", ""));
				childResult = childDataManager.set(self.get(prefix))
			} else if (key.indexOf(prefix + ".") === 0) { //key is a part of prefix,must had be changed
				prefix = key.replace(prefix + ".", "")
				childResult = childDataManager.set(prefix, self.get(key))
				// childDataManager.touchOff("")
			}
			_dm_force_update = $FALSE;
			//如果不进行锁定，当数组因为其子对象被修改，
			//改动信息就需要冒泡到顶层，等同于强制触发数组的所有关键字，通知所有子对象检查自身是否发生变化。
			//所以锁定是效率所需。
			$.p(chidlUpdateKey, childResult);
		});
		return {
			key: key,
			// allUpdateKey: allUpdateKey,
			updateKey: updateKey,
			chidlUpdateKey: chidlUpdateKey
		}
	},
	rebuildTree: $.noop,
	getTop: function() { //get DM tree top
		var self = this,
			next;
		while (next = self._parentDataManager) {
			self = next;
		}
		return self;
	},
	collect: function(dataManager) {
		var self = this,
			finallyRunStacks = DataManager.session.finallyRunStacks;
		if (self !== dataManager) {
			if ($.iO(self._siblingDataManagers, dataManager) === -1) {
				$.p(self._siblingDataManagers, dataManager);
				$.p(dataManager._siblingDataManagers, self);
				self.rebuildTree()
				dataManager._database = self._database;
				// dataManager.set(dataManager._database)
				finallyRunStacks.push(self.id)
				dataManager.getTop().touchOff("");
				finallyRunStacks.pop();
				!finallyRunStacks.length && DataManager.finallyRun();
			}
		} else {
			// self.set(self._database)
			finallyRunStacks.push(self.id)
			self.getTop().touchOff("");
			finallyRunStacks.pop();
			!finallyRunStacks.length && DataManager.finallyRun();
		}
		return self;
	},
	subset: function(dataManager, prefixKey) {
		var self = this,
			finallyRunStacks = DataManager.session.finallyRunStacks;
		dataManager.remove();
		dataManager._prefix = prefixKey;
		dataManager._parentDataManager = self;
		$.p(self._subsetDataManagers, dataManager);
		dataManager.rebuildTree()
		dataManager._database = self.get(prefixKey);
		// dataManager.set(dataManager._database)
		finallyRunStacks.push(self.id)
		self.getTop().touchOff("");
		finallyRunStacks.pop();
		!finallyRunStacks.length && DataManager.finallyRun();
		return self;
	},
	remove: function(dataManager) {
		var self = this;
		if (dataManager) {
			var subsetDataManagers = self._subsetDataManagers,
				index = $.iO(subsetDataManagers, dataManager);
			subsetDataManagers.splice(index, 1);
			dataManager._parentDataManager = $UNDEFINED;
		} else {
			dataManager = self._parentDataManager;
			if (dataManager) {
				subsetDataManagers = dataManager._subsetDataManagers
				index = $.iO(subsetDataManagers, self);
				subsetDataManagers.splice(index, 1);
				self._parentDataManager = $UNDEFINED;
			}
		}
		return self;
	},
	replaceAs: function(dataManager) {
		var self = this;
		$.ftE(self._subsetDataManagers, function(subsetDM) {
			subsetDM._parentDataManager = dataManager;
			$.p(dataManager._subsetDataManagers, subsetDM)
		});
		var new_siblingDataManagers = dataManager._siblingDataManagers;
		$.ftE(_getAllSiblingDataManagers(self), function(sublingDM) {
			var siblingDataManagers = sublingDM._siblingDataManagers;
			$.rm(siblingDataManagers, self)
			if ($.iO(new_siblingDataManagers, sublingDM) === -1) {
				$.p(new_siblingDataManagers, sublingDM)
			}
			if ($.iO(siblingDataManagers, dataManager) === -1) {
				$.p(siblingDataManagers, dataManager)
			}
		});
		$.rm(new_siblingDataManagers, self)
		$.ftE(self._viewInstances, function(viewInstance) {
			viewInstance.dataManager = dataManager;
			$.p(dataManager._viewInstances, viewInstance)
		});
		self._triggerKeys.forIn(function(smartTriggerSet, key) {
			dataManager._triggerKeys.push(key, smartTriggerSet)
		})
		dataManager.set(dataManager.get());
		DataManager._instances[self.id] = dataManager;
		self.destroy()
		return $NULL;
	},
	destroy: function() {
		for (var i in this) {
			delete this[i]
		}
	}
	/*,
	buildGetter: function(key) {},
	buildSetter: function(key) {}*/
};
/*
 * _ArrayDataManager constructor
 * to mamage #each datamanager 
 */
function _ArrayDataManager (perfix) {
	this.perfix = perfix;
	this._showed_len = 0;
	this._eachDM = [];
}
var _ArrDM_proto = _ArrayDataManager.prototype
$.fI(DM_proto,function(fun,funName){
	_ArrDM_proto[funName] = function(){
		var args = arguments;
		$.ftE(this._eachDM,function(_each_dataManager){
			_each_dataManager[funName].apply(_each_dataManager,args)
		})
	}
})
_ArrDM_proto.set = function(key,nObj){//只做set方面的中间导航垫片，所以无需进行特殊处理
		var args = arguments;
		var eachDM = this._eachDM;
		switch (args.length) {
			case 0:
			return;
			case 1:
			
			break;
			default:
		}
}
_ArrDM_proto.length = function(length){
	var self = this;
	var showed_len = self._showed_len;
	var eachDM = this._eachDM;
	if (length===$UNDEFINED) {
		return showed_len;
	}else{
		if (showed_len<length) {
			$.ftE(eachDM,function(){
				
			},length)
		}else if(length>showed_len){
			$.ftE(eachDM,function(){

			},showed_len)
		}
	}
}
_ArrDM_proto.push = function(){

}
_ArrDM_proto.remove = function(){

}
;
(function() {
	var _get = DM_proto.get,
		_set = DM_proto.set,
		prefix = DM_config.prefix,
		set = DM_proto.set = function(key) {
			var self = this,
				args = arguments/*$.s(arguments)*/,
				result;
			if (args.length > 1) {
				if (key.indexOf(prefix.Parent) === 0) { //$parent
					if (self = self._parentDataManager) {
						if (key === prefix.Parent) {
							// args.splice(0, 1);
							$.sp.call(args,0,1)
						} else if (key.charAt(prefix.Parent.length) === ".") {
							args[0] = key.replace(prefix.Parent + ".", "");
						}
						result = set.apply(self, args);
					} else {
						DataManager.session.filterKey = $UNDEFINED;
						DataManager.session.topSetter = $UNDEFINED;
						key = ""
					}
				} else if (key.indexOf(prefix.This) === 0) { //$this
					if (key === prefix.This) {
						// args.splice(0, 1);
						$.sp.call(args,0,1)
					} else if (key.charAt(prefix.This.length) === ".") {
						args[0] = key.replace(prefix.This + ".", "");
					}
					result = set.apply(self, args);
				} else if (key.indexOf(prefix.Top) === 0) {
					var next;
					while (next = self._parentDataManager) {
						self = next;
					}
					if (key === prefix.Top) {
						// args.splice(0, 1);
						$.sp.call(args,0,1)
					} else if (key.charAt(prefix.Top.length) === ".") {
						args[0] = key.replace(prefix.Top + ".", "");
					}
					result = set.apply(self, args);
				} else { //no prefix key
					result = _set.apply(self, args);
				}
			} else { //one argument
				result = _set.apply(self, args);
			}
			return result || {
				key: key,
				// allUpdateKey: allUpdateKey,
				updateKey: [key],
				chidlUpdateKey: []
			};
		},
		get = DM_proto.get = function(key) {
			var self = this,
				args = arguments/*$.s(arguments)*/,
				result;
			if (args.length > 0) {
				if (key.indexOf(prefix.Parent) === 0) { //$parent
					if (self = self._parentDataManager) {
						if (key === prefix.Parent) {
							// args.splice(0, 1);
							$.sp.call(args,0,1)
						} else if (key.charAt(prefix.Parent.length) === ".") {
							args[0] = key.replace(prefix.Parent + ".", "");
						}
						result = get.apply(self, args);
					} else {
						DataManager.session.filterKey = $UNDEFINED;
						DataManager.session.topGetter = $UNDEFINED;
						key = ""
					}
				} else if (key.indexOf(prefix.This) === 0) { //$this
					if (key === prefix.This) {
						// args.splice(0, 1);
						$.sp.call(args,0,1)
					} else if (key.charAt(prefix.This.length) === ".") {
						args[0] = key.replace(prefix.This + ".", "");
					}
					result = get.apply(self, args);
				} else if (key.indexOf(prefix.Top) === 0) {
					var next;
					while (next = self._parentDataManager) {
						self = next;
					}
					if (key === prefix.Top) {
						// args.splice(0, 1);
						$.sp.call(args,0,1)
					} else if (key.charAt(prefix.Top.length) === ".") {
						args[0] = key.replace(prefix.Top + ".", "");
					}
					result = get.apply(self, args);
				} else { //no prefix key
					result = _get.apply(self, args);
				}
			} else { //one argument
				result = _get.apply(self, args);
			}
			return result;
		},
		_rebuildTree = DM_proto.rebuildTree,
		_subset = DM_proto.subset;

	function _getAllSmartDataManagers(self, result) {
		result ? $.p(result, self) : (result = []);
		var dmSmartDataManagers = self._smartDMs_id;
		dmSmartDataManagers && $.ftE(dmSmartDataManagers, function(dm) {
			dm = DataManager.get(dm);
			if ($.iO(result, dm) === -1) {
				_getAllSmartDataManagers(dm, result);
			}
		});
		// console.table(result)
		return result;
	};
	DM_proto.rebuildTree = function() {
		var self = this,
			smartSource;
		$.ftE(_getAllSmartDataManagers(self), function(dm) {
			if (smartSource = dm._smartSource) {
				var smart_prefix = smartSource.prefix,
					smart_dataManager = DataManager.get(smartSource.dm_id);
				// console.log(smart_prefix)
				if (smart_prefix.indexOf(prefix.Parent) === 0 || smart_prefix.indexOf(prefix.Top) === 0) {
					var data = smart_dataManager.get(smart_prefix);
					var topGetter = DataManager.session.topGetter
					if (topGetter !== smartSource.topGetter && (smartSource.topGetter = topGetter)) {
						console.log("rebuild", dm.id,
							"\n\tself:", self.id,
							"\n\ttopGetter:", topGetter.id,
							"\n\tparent:", dm._parentDataManager && dm._parentDataManager.id)

						smart_dataManager.subset(dm, smart_prefix);
						// console.log(data)
					}
				}
			}
		})
		return _rebuildTree.call(self);
	};
	DM_proto.subset = function(dataManager, prefixKey) {
		var self = this,
			data = self.get(prefixKey),
			result,
			topGetter = DataManager.session.topGetter,
			filterKey = DataManager.session.filterKey||"";
		if (filterKey !== prefixKey) { //is smart key

			if (prefixKey.indexOf(prefix.This) === 0) {
				if (filterKey) {
					_subset.call(self, dataManager, filterKey)
				} else { //prefixKey === "$THIS"
					dataManager.replaceAs(self);
				}
			} else {
				dataManager._smartSource = {
					topGetter: topGetter, // current coordinate
					dm_id: self.id,
					prefix: prefixKey
				};
				$.p(self._smartDMs_id || (self._smartDMs_id = []), dataManager.id);
				if (topGetter) { // smart dm maybe change coodition
					if (filterKey) {
						_subset.call(topGetter, dataManager, filterKey)
					} else {
						topGetter.collect(dataManager);
					}
				}
			}
		} else {
			result = _subset.apply(self, arguments/*$.s(arguments)*/);
		}
		return result;
	}
}());
var newTemplateMatchReg = /\{\{([\w\W]+?)\}\}/g,
	// DoubleQuotedString = /"(?:\.|(\\\")|[^\""\n])*"/g, //双引号字符串
	// SingleQuotedString = /'(?:\.|(\\\')|[^\''\n])*'/g, //单引号字符串
	QuotedString = /"(?:\.|(\\\")|[^\""\n])*"|'(?:\.|(\\\')|[^\''\n])*'/g, //引号字符串
	templateHandles = {
		"#if": $TRUE,
		"#else": $FALSE, //no arguments
		"/if": $FALSE,
		"@": $TRUE,
		"#each": $TRUE,
		"/each": $FALSE,
		"#with": $TRUE,
		"/with": $TRUE,
		"HTML": $TRUE,
		"#>": $TRUE,
		"#layout": $TRUE,
		"define":$TRUE
	},
	templateOperatorNum = {
		"@": 1
		// , "!": 1
		// , "~": 1
		// , "++": 1
		// , "--": 1
		// , "+": 2
		// , "-": 2
		// , "*": 2
		// , "/": 2
		// , "&&": 2
		// , "||": 2
		// , "&": 2
		// , "|": 2
		// , "=": 2
		// , "==": 2
		// , "===": 2
		// , "!=": 2
		// , "!==": 2
		// , "%": 2
		// , "^": 2
		// , ">": 2
		// , "<": 2
		// , ">>": 2
		// , "<<": 2
	},
	parse = function(str) {
		var quotedString = [];
		var Placeholder = "_" + Math.random(),
			str = str.replace(QuotedString, function(qs) {
				quotedString.push(qs)
				return Placeholder;
			}),
			result = str.replace(newTemplateMatchReg, function(matchStr, innerStr, index) {
				innerStr = innerStr.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&") //Semantic confusion with HTML
				var fun_name = $.trim(innerStr).split(" ")[0];
				if (fun_name in templateHandles) {
					if (templateHandles[fun_name]) {
						var args = innerStr.replace(fun_name, "").split(","),
							result = "{" + fun_name + "(";
						$.ftE(args, function(arg) {
							if (arg = $.trim(arg)) {
								result += parseIte(parseArg(arg));
							}
						});
						result += ")}"
						return result;
					} else {
						return "{" + fun_name + "()}";
					}
				} else {
					return parseIte(parseArg($.trim(innerStr))); //"{(" + innerStr + ")}";
				}
			})

			result = result.replace(RegExp(Placeholder, "g"), function(p) {
				return quotedString.splice(0, 1);
			}).replace(/\{\@\(\{\(([\w\W]+?)\)\}\)\}/g, function(matchStr, matchKey) {
				return "{@(" + matchKey + ")}";
			});
			return result
	},
	parseArg = function(argStr) {
		var allStack = [],
			inner = $TRUE;
		// console.log("argStr:", argStr);
		argStr.replace(/\(([\W\w]+?)\)/, function(matchSliceArgStr, sliceArgStr, index) {
			inner = $FALSE;
			var stack = parseStr(argStr.substring(0, index));
			allStack.push.apply(allStack, stack);
			// console.log();
			$.p(allStack, {
				// allStack.push({
				type: "arg",
				value: sliceArgStr,
				parse: parseIte(parseArg(sliceArgStr))
			})
			stack = parseStr(argStr.substring(index + matchSliceArgStr.length));
			allStack.push.apply(allStack, stack);
		});
		if (inner) {
			allStack.push.apply(allStack, parseStr(argStr));
		}
		return allStack;
	},
	parseStr = function(sliceArgStr) {
		var stack = [],
			pointer = 0;
		sliceArgStr.replace(/([^\w$\(\)]+)/g, function(matchOperator, operator, index, str) { //([\W]+)
			operator = $.trim(operator);
			if (operator && operator !== ".") {
				$.p(stack, {
					type: "arg",
					value: str.substring(pointer, index)
				});
				$.p(stack, {
					type: "ope",
					value: operator,
					num: templateOperatorNum[operator] || 0
				});
				pointer = index + matchOperator.length;
			}
			return matchOperator;
		});
		if (stack.length && !stack[0].value) {
			stack.splice(0, 1);
		}
		if (sliceArgStr.length - pointer) {
			$.p(stack, {
				type: "arg",
				value: sliceArgStr.substring(pointer, sliceArgStr.length)
			})
		}
		return stack;
	},
	parseIte = function(arr) {
		var result = "";
		$.ftE(arr, function(block, index) {
			if (block.type === "arg") {
				!block.parse && (block.parse = "{(" + block.value + ")}");
			}
			if (!block.value) {
				block.ignore = $TRUE;
			}
		});
		$.ftE(arr, function(block, index) {
			if (block.type === "ope") {
				var prev = arr[index - 1],
					next = arr[index + 1];
				if (block.num === 1) {
					if (prev && prev.type === "arg") { //a++
						block.parse = "{$" + block.value + "(" + prev.parse + ")}";
						prev.ignore = $TRUE;
					} else { //++a
						next.parse = "{" + block.value + "(" + next.parse + ")}"
						block.ignore = $TRUE;
					}
				} else if (block.num === 2) {
					next.parse = "{" + block.value + "(" + prev.parse + next.parse + ")}"
					prev.ignore = $TRUE;
					block.ignore = $TRUE;
				} else {
					throw "Unknown type:" + block.value
				}
			}
		});
		$.ftE(arr, function(block) {
			if (!block.ignore) {
				result += block.parse;
			}
		});
		return result; //arr;
	};
	//by RubyLouvre(司徒正美)
	//setAttribute bug:http://www.iefans.net/ie-setattribute-bug/
var IEfix = {
		acceptcharset: "acceptCharset",
		accesskey: "accessKey",
		allowtransparency: "allowTransparency",
		bgcolor: "bgColor",
		cellpadding: "cellPadding",
		cellspacing: "cellSpacing",
		"class": "className",
		colspan: "colSpan",
		// checked: "defaultChecked",
		selected: "defaultSelected",
		"for": "htmlFor",
		frameborder: "frameBorder",
		hspace: "hSpace",
		longdesc: "longDesc",
		maxlength: "maxLength",
		marginwidth: "marginWidth",
		marginheight: "marginHeight",
		noresize: "noResize",
		noshade: "noShade",
		readonly: "readOnly",
		rowspan: "rowSpan",
		tabindex: "tabIndex",
		valign: "vAlign",
		vspace: "vSpace",
		DOMContentLoaded:"readystatechange"
	},
	/*
The full list of boolean attributes in HTML 4.01 (and hence XHTML 1.0) is (with property names where they differ in case): 

checked             (input type=checkbox/radio) 
selected            (option) 
disabled            (input, textarea, button, select, option, optgroup) 
readonly            (input type=text/password, textarea) 
multiple            (select) 
ismap     isMap     (img, input type=image) 

defer               (script) 
declare             (object; never used) 
noresize  noResize  (frame) 
nowrap    noWrap    (td, th; deprecated) 
noshade   noShade   (hr; deprecated) 
compact             (ul, ol, dl, menu, dir; deprecated) 
//------------anyother answer 
all elements: hidden 
script: async, defer 
button: autofocus, formnovalidate, disabled 
input: autofocus, formnovalidate, multiple, readonly, required, disabled, checked 
keygen: autofocus, disabled 
select: autofocus, multiple, required, disabled 
textarea: autofocus, readonly, required, disabled 
style: scoped 
ol: reversed 
command: disabled, checked 
fieldset: disabled 
optgroup: disabled 
option: selected, disabled 
audio: autoplay, controls, loop, muted 
video: autoplay, controls, loop, muted 
iframe: seamless 
track: default 
img: ismap 
form: novalidate 
details: open 
object: typemustmatch 
marquee: truespeed 
//---- 
editable 
draggable 
*/
	_AttributeHandle = function(attrKey,element) {
		var assign;
		var attrHandles = V.attrHandles,
			result;
		$.fE(attrHandles, function(attrHandle) {
			if (attrHandle.match(attrKey)) {
				// if (element.type==="textarea") {debugger}
				result = attrHandle.handle(attrKey,element);
				return $FALSE
			}
		});
		return result || _AttributeHandleEvent.com;
	},
	_templateMatchRule= /\{[\w\W]*?\{[\w\W]*?\}[\s]*\}/,
	attributeHandle = function(attrKey , attrValue, node, handle, triggerTable) {
		attrKey = attrKey.indexOf(V.prefix) ? attrKey : attrKey.replace(V.prefix, "")
		attrKey = (_isIE && IEfix[attrKey]) || attrKey
		// console.log(attrValue,":",_matchRule.test(attrValue)||_templateMatchRule.test(attrValue))
		//if (/*_matchRule.test(attrValue)||*/_templateMatchRule.test(attrValue)) {
			var attrViewInstance = (V.attrModules[handle.id + attrKey] = ViewParser.parse(attrValue))(),
				_shadowDIV = $.D.cl(shadowDIV), //parserNode
				_attributeHandle = _AttributeHandle(attrKey,node);
			attrViewInstance.append(_shadowDIV);
			attrViewInstance._isAttr = {
				key: attrKey
			}
			var attrTrigger = {
				handleId:handle.id+attrKey,
				key:attrKey,
				type:"attributesTrigger",
				event: function(NodeList, dataManager,/* eventTrigger,*/ isAttr, viewInstance_ID) { /*NodeList, dataManager, eventTrigger, self._isAttr, self._id*/
					var currentNode = NodeList[handle.id].currentNode,
						viewInstance = V._instances[viewInstance_ID];
					if (currentNode) {
						attrViewInstance.dataManager = dataManager;
						$.fE(attrViewInstance._triggers, function(key) {//touchoff all triggers
							attrViewInstance.touchOff(key);
						});
						_attributeHandle(attrKey, currentNode, _shadowDIV, viewInstance, /*dataManager.id,*/ handle, triggerTable);
						// dataManager.remove(attrViewInstance); //?
					}
				}
			}
			$.fE(attrViewInstance._triggers, function(key) {
				$.us(triggerTable[key] || (triggerTable[key] = []), attrTrigger);
			});
			// console.log(attrKey,attrValue)
			node.removeAttribute(attrKey);
		//}
	};
/*
 * View constructor
 */

function View(arg) {
	var self = this;
	if (!(self instanceof View)) {
		return new View(arg);
	}
	self.handleNodeTree = arg;
	self._handles = [];
	self._triggerTable = {};
	_buildHandler.call(self);
	_buildTrigger.call(self);
	return function(data) {
		return _create.call(self, data);
	}
};
// var V_session = View.session = {};
function _buildHandler(handleNodeTree) {
	var self = this,
		handles = self._handles
		handleNodeTree = handleNodeTree || self.handleNodeTree;
	_traversal(handleNodeTree, function(item_node, index, handleNodeTree) {
		item_node.parentNode = handleNodeTree;
		if (item_node.type === "handle") {
			var handleFactory = V.handles[item_node.handleName];
			if (handleFactory) {
				var handle = handleFactory(item_node, index, handleNodeTree)
				handle && $.p(handles, handle);
			}
		}
	});
};
var _attrRegExp = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g;


function _buildTrigger(handleNodeTree, dataManager) {
	var self = this, //View Instance
		triggerTable = self._triggerTable;
	handleNodeTree = handleNodeTree || self.handleNodeTree,
	_traversal(handleNodeTree, function(handle, index, parentHandle) {
		if (handle.type === "handle") {
			var triggerFactory = V.triggers[handle.handleName];
			if (triggerFactory) {
				var trigger = triggerFactory(handle, index, parentHandle);
				if (trigger) {
					var key = trigger.key || (trigger.key = "");
					trigger.handleId = trigger.handleId || handle.id;
					//unshift list and In order to achieve the trigger can be simulated bubble
					$.us((triggerTable[key]||(triggerTable[key]  =  [])), trigger); //Storage as key -> array
					$.p(handle._triggers, trigger); //Storage as array
				}
			}
		} else if (handle.type === "element") {
			var node = handle.node,
				nodeHTMLStr = node.outerHTML.replace(node.innerHTML, ""),
				attrs = nodeHTMLStr.match(_attrRegExp);
			$.fE(node.attributes,function(attr,i){
				var value = attr.value;
				if (_templateMatchRule.test(value)) {
					attributeHandle(attr.name, value, node, handle, triggerTable);
				}
			})
		}
	});
};

function _create(data) { //data maybe basedata or dataManager
	var self = this,
		NodeList_of_ViewInstance = {}, //save newDOM  without the most top of parentNode -- change with append!!
		topNode = $.c(self.handleNodeTree);
	topNode.currentNode = $.D.cl(shadowBody);
	$.pI(NodeList_of_ViewInstance, topNode);

	_traversal(topNode, function(node, index, parentNode) {
		node = $.pI(NodeList_of_ViewInstance, $.c(node));
		if (!node.ignore) {
			var currentParentNode = NodeList_of_ViewInstance[parentNode.id].currentNode || topNode.currentNode;
			var currentNode = node.currentNode = $.D.cl(node.node);
			$.D.ap(currentParentNode, currentNode);
		} else {

			_traversal(node, function(node) { //ignore Node's childNodes will be ignored too.
				node = $.pI(NodeList_of_ViewInstance, $.c(node));
			});
			return $FALSE
		}
	});


	$.fE(self._handles, function(handle) {
		handle.call(self, NodeList_of_ViewInstance);
	});
	return ViewInstance(self.handleNodeTree, NodeList_of_ViewInstance, self._triggerTable, data);
};
/*
 * View Instance constructor
 */

(function() { //DM_extends_fot_VI
	var _rebuildTree = DM_proto.rebuildTree;
	DM_proto.rebuildTree = function() {
		var self = this,
			DMSet = self._subsetDataManagers;
		$.ftE(self._viewInstances, function(childViewInstance) {
			$.ftE(childViewInstance._smartTriggers, function(smartTrigger) {
				var TEMP = smartTrigger.TEMP;

				TEMP.viewInstance.get(TEMP.sourceKey);
				var topGetter = DataManager.session.topGetter,
					currentTopGetter = DataManager.get(TEMP.dm_id),
					matchKey = DataManager.session.filterKey||"";
				if (topGetter) {
					if (topGetter!==currentTopGetter||matchKey!==smartTrigger.matchKey) {
						TEMP.dm_id = topGetter.id;
						currentTopGetter&&smartTrigger.unbind(currentTopGetter._triggerKeys)
						smartTrigger.matchKey = matchKey;
						smartTrigger.bind(topGetter._triggerKeys);
						currentTopGetter = topGetter
					}
				}
				//smartTrigger.event(currentTopGetter._triggerKeys);//filter as dm.getTop().touchOff("")
			})
		})
		$.ftE(self._subsetDataManagers, function(childDataManager) {
			childDataManager.rebuildTree()
		})
		return _rebuildTree.call(self);
	}
	var _collect = DM_proto.collect;
	DM_proto.collect = function(viewInstance) {
		var self = this;
		if (viewInstance instanceof DataManager) {
			_collect.call(self, viewInstance);
			//TODO:release memory.
		} else if (viewInstance instanceof ViewInstance) {
			var vi_DM = viewInstance.dataManager;
			if (!vi_DM) { // for VI init in constructor
				vi_DM = viewInstance.dataManager = self;
				var viewInstanceTriggers = viewInstance._triggers
				$.ftE(viewInstanceTriggers, function(sKey) {
					viewInstance._buildSmart(sKey);
				});
			}
			$.p(viewInstance.dataManager._viewInstances, viewInstance);
			_collect.call(self, vi_DM)//self collect self will Forced triggered updates
		}
		return self;
	};
	var _subset = DM_proto.subset;
	DM_proto.subset = function(viewInstance, prefix) {
		var self = this;

		if (viewInstance instanceof DataManager) {
			_subset.call(self, viewInstance, prefix);
		} else {

			var vi_DM = viewInstance.dataManager;
			if (!vi_DM) {
				vi_DM = DataManager();
				vi_DM.collect(viewInstance);
			}
			_subset.call(self, vi_DM, prefix);
		}
	};
}());
var ViewInstance = function(handleNodeTree, NodeList, triggerTable, dataManager) {
	if (!(this instanceof ViewInstance)) {
		return new ViewInstance(handleNodeTree, NodeList, triggerTable, dataManager);
	}
	var self = this;
	self._isAttr = $FALSE; //if no null --> Storage the attribute key and current.
	self._isEach = $FALSE; //if no null --> Storage the attribute key and current.
	self.dataManager; //= dataManager;
	self.handleNodeTree = handleNodeTree;
	self.DOMArr = $.s(handleNodeTree.childNodes);
	self.NodeList = NodeList;
	var el = self.topNode(); //NodeList[handleNodeTree.id].currentNode;
	self._packingBag = el;
	V._instances[self._id = $.uid()] = self;
	self._open = $.D.C(self._id + " _open");
	self._close = $.D.C(self._id + " _close");
	self._canRemoveAble = $FALSE;
	self._AVI = {};
	self._ALVI = {};
	self._WVI = {};
	$.D.iB(el, self._open, el.childNodes[0]);
	$.D.ap(el, self._close);
	(self._triggers = [])._ = {};
	// self._triggers._u = [];//undefined key,update every time
	self.TEMP = {};
	$.fI(triggerTable, function(tiggerCollection, key) {
		if ("".indexOf(key) !== 0) { //"" //||"."
			$.p(self._triggers, key);
		}
		self._triggers._[key] = tiggerCollection;
	});
	/*$.fE(triggerTable["."], function(tiggerFun) { //const value
		tiggerFun.event(NodeList, dataManager);
	});*/

	if (!(dataManager instanceof DataManager)) {
		dataManager = DataManager(dataManager);
	}
	self._smartTriggers = [];

	//self.dataManager = dataManager
	dataManager.collect(self); //touchOff All triggers

	//delete self._triggers._["."] //remove "."(const) key,just touch one time;
},
	VI_session = ViewInstance.session = {
		touchHandleIdSet: $NULL,
		touchStacks: $NULL
	};

function _bubbleTrigger(tiggerCollection, NodeList, dataManager /*, eventTrigger*/ ) {
	var self = this, // result,
		eventStack = [],
		touchStacks = VI_session.touchStacks,
		touchHandleIdSet = VI_session.touchHandleIdSet;
	$.p(touchStacks, eventStack); //Add a new layer event collector
	$.fE(tiggerCollection, function(trigger) { //TODO:测试参数长度和效率的平衡点，减少参数传递的数量
		if (!touchHandleIdSet[trigger.handleId]) { //To prevent repeated collection
			$.p(eventStack, trigger) //collect trigger
			if ( /*result !== $FALSE &&*/ trigger.bubble) {
				// Stop using the `return false` to prevent bubble triggered
				// need to use `this. Mercifully = false` to control
				var parentNode = NodeList[trigger.handleId].parentNode;
				parentNode && _bubbleTrigger.call(self, parentNode._triggers, NodeList, dataManager /*, trigger*/ );
			}
			touchHandleIdSet[trigger.handleId] = $TRUE;
		}
		/*else{
			console.log(trigger.handleId)
		}*/
	});

};

function _moveChild(self, el) {
	var AllEachViewInstance = self._AVI,
		AllLayoutViewInstance = self._ALVI,
		AllWithViewInstance = self._WVI;
	_replaceTopHandleCurrent(self, el);
	$.ftE(self.NodeList[self.handleNodeTree.id].childNodes, function(child_node) {
		var viewInstance,
			arrayViewInstances,
			id = child_node.id;
		if (viewInstance = AllLayoutViewInstance[child_node.id] || AllWithViewInstance[child_node.id]) {
			_moveChild(viewInstance, el)
		} else if (arrayViewInstances = AllEachViewInstance[id]) {
			$.ftE(arrayViewInstances, function(viewInstance) {
				_moveChild(viewInstance, el);
			})
		}
	});
};

function _replaceTopHandleCurrent(self, el) {
	self._canRemoveAble = $TRUE;
	self.topNode(el);
};
var VI_proto = ViewInstance.prototype = {
	// reDraw: function() {
	// 	var self = this,
	// 		dataManager = self.dataManager;

	// 	$.fE(self._triggers, function(key) {
	// 		dataManager._touchOffSubset(key)
	// 	});
	// 	return self;
	// },
	append: function(el) {
		var self = this,
			handleNodeTree = self.handleNodeTree,
			NodeList = self.NodeList,
			currentTopNode = NodeList[handleNodeTree.id].currentNode;

		$.fE(currentTopNode.childNodes, function(child_node) {
			$.D.ap(el, child_node);
		});
		// _replaceTopHandleCurrent(self, el);

		_moveChild(self, el);

		return self;
	},
	insert: function(el) {
		var self = this,
			handleNodeTree = self.handleNodeTree,
			NodeList = self.NodeList,
			currentTopNode = self.topNode(), //NodeList[handleNodeTree.id].currentNode,
			elParentNode = el.parentNode;

		$.fE(currentTopNode.childNodes, function(child_node) {
			$.D.iB(elParentNode, child_node, el);
		});
		// _replaceTopHandleCurrent(self, elParentNode);

		_moveChild(self, elParentNode);

		return self;
	},
	remove: function() {
		var self = this,
			el = this._packingBag;
		// debugger
		if (self._canRemoveAble) {
			var handleNodeTree = self.handleNodeTree,
				NodeList = self.NodeList,
				currentTopNode = self.topNode(), //NodeList[handleNodeTree.id].currentNode,
				openNode = self._open,
				closeNode = self._close,
				childNodes = $.s(currentTopNode.childNodes),

				startIndex = $.iO(childNodes,openNode),
				child_node;

			while (child_node = childNodes[startIndex]) {
				$.D.ap(el, child_node);
				if (child_node === closeNode) {
					break;
				}
				startIndex += 1
			}
			/*
			//no-TODO:use nextSilingNode
			//Firefox、Opera对DOM的理解不同，所以用nextSibling还要做兼容处理，而且效率方面不见得有所提高
			var currentNode = openNode;
			while($TRUE){
				var nextNode = currentNode.nextSibling;
				$.D.ap(el, currentNode);
				if(nextNode === closeNode){
					$.D.ap(el, nextNode);
					break;
				}
				currentNode = nextNode;
			}*/
			_replaceTopHandleCurrent(self, el);
			this._canRemoveAble = $FALSE; //Has being recovered into the _packingBag,can't no be remove again. --> it should be insert
		}
		return self;
	},
	get: function get() {
		var dm = this.dataManager;
		return dm.get.apply(dm, arguments /*$.s(arguments)*/ );
	},
	mix: function mix() {
		var dm = this.dataManager;
		return dm.mix.apply(dm, arguments /*$.s(arguments)*/ )
	},
	set: function set() {
		var dm = this.dataManager;
		return dm.set.apply(dm, arguments /*$.s(arguments)*/ )
	},
	topNode: function(newCurrentTopNode) {
		var self = this,
			handleNodeTree = self.handleNodeTree,
			NodeList = self.NodeList,
			result;
		if (newCurrentTopNode) {
			NodeList[handleNodeTree.id].currentNode = newCurrentTopNode
		} else {
			result = NodeList[handleNodeTree.id].currentNode;
			if (result.nodeType === 8) {
				result = result.parentNode;
			}
		}
		return result;
	},
	touchOff: function(key) {
		var self = this,
			dataManager = self.dataManager,
			NodeList = self.NodeList;
		VI_session.touchHandleIdSet = {};
		VI_session.touchStacks = [];
		// collect trigger stack
		_bubbleTrigger.call(self, self._triggers._[key], NodeList, dataManager)
		// trigger trigger stack
		$.ftE(VI_session.touchStacks, function(eventStack) {
			$.ftE(eventStack, function(trigger) {
				trigger.event(NodeList, dataManager, /*trigger,*/ self._isAttr, self._id)
			})
		})
	},
	_buildSmart:function(sKey) {
		var self = this,
			dataManager = self.dataManager,
			smartTriggers = self._smartTriggers;
		dataManager.get(sKey);
		var baseKey = DataManager.session.filterKey,
			topGetterTriggerKeys = DataManager.session.topGetter && DataManager.session.topGetter._triggerKeys,
			smartTrigger = new SmartTriggerHandle(
				baseKey || (baseKey = ""), //match key

				function(smartTriggerSet) { 
					self.touchOff(sKey);
				}, { //TEMP data
					viewInstance: self,
					dm_id: dataManager.id,
					// triggerSet: topGetterTriggerKeys,
					sourceKey: sKey
				}
			);
		$.p(smartTriggers, smartTrigger);
		topGetterTriggerKeys && smartTrigger.bind(topGetterTriggerKeys); // topGetterTriggerKeys.push(baseKey, smartTrigger);
	}/*,
	on: function(eventName, fun) {

	},
	trigger: function(eventName) {

	}*/
};
/*var _allEventNames = ("blur focus focusin focusout load resize" +
	"scroll unload click dblclick mousedown mouseup mousemove" +
	"mouseover mouseout mouseenter mouseleave change select" +
	"submit keydown keypress keyup error contextmenu").split(" ");
$.ftE(_allEventNames, function(eventName) {
	VI_proto[eventName] = function(fun) {
		return fun ? this.on(eventName, fun) : this.trigger(eventName);
	}
})
/*
 * parse function
 */
var _removeNodes = _isIE ? $.noop/*function() {//IE 不能回收节点，会导致子节点被销毁
		//@大城小胖 http://fins.iteye.com/blog/172263
		var d = $.D.cl(shadowDIV);
		return function(n) {
			// if (n && n.tagName != 'BODY') {
				d.appendChild(n);
				d.innerHTML = '';
			// }
		}
	}() */: function(n) {
		// if (n && n.parentNode && n.tagName != 'BODY') {
			$.ftE(n, function(nodeToDelete){
				delete nodeToDelete.parentNode.removeChild(nodeToDelete);
			})
		// }
	},
	_parse = function(node) { //get all childNodes
		var result = [],
			GC_node = [];
		for (var i = 0, child_node, childNodes = node.childNodes; child_node = childNodes[i]; i += 1) {
			switch (child_node.nodeType) {
				case 3:
					if ($.trim(child_node.data)) {
						$.p(result, new TextHandle(child_node))
					}
					break;
				case 1:
					if (child_node.tagName.toLowerCase() === "span" && child_node.getAttribute("type") === "handle") {
						var handleName = child_node.getAttribute("handle");
						if (handleName !== $NULL) {
							$.p(result, new TemplateHandle(handleName, child_node))
						}
						// delete child_node.parentNode.removeChild(child_node);
						$.p(GC_node, child_node);
					} else {
						$.p(result, new ElementHandle(child_node))
					}
					break;
			}
		}
		// $.ftE(GC_node, _removeNode)
		_removeNodes(GC_node);
		return result;
	};

/*
 * Handle constructor
 */

function Handle(type, opction) {
	var self = this;
	if (!(self instanceof Handle)) {
		return new Handle(type, opction);
	}
	if (type) {
		self.type = type;
	}
	$.fI(opction, function(val, key) {
		self[key] = val;
	});
};
Handle.init = function(self, weights) {
	self.id = $.uid(); //weights <= 1
	if (weights < 2) return;
	self._controllers = []; //weights <= 2
	self._controllers[$TRUE] = []; //In the #if block scope
	self._controllers[$FALSE] = []; //In the #else block scope
	if (weights < 3) return;
	self._triggers = []; //weights <= 3
};
Handle.prototype = {
	nodeType: 0,
	ignore: $FALSE, //ignore Handle --> no currentNode
	display: $FALSE, //function of show or hidden DOM
	childNodes: [],
	parentNode: $NULL,
	type: "handle"
};

/*
 * TemplateHandle constructor
 */

function TemplateHandle(handleName, node) {
	var self = this;
	self.handleName = $.trim(handleName);
	self.childNodes = _parse(node);
	Handle.init(self, 3);
};
TemplateHandle.prototype = Handle("handle", {
	ignore: $TRUE,
	nodeType: 1
})

/*
 * ElementHandle constructor
 */

function ElementHandle(node) {
	var self = this;
	self.node = node;
	self.childNodes = _parse(node);
	Handle.init(self, 3);
};
ElementHandle.prototype = Handle("element", {
	nodeType: 1
})

/*
 * TextHandle constructor
 */

function TextHandle(node) {
	var self = this;
	self.node = node;
	Handle.init(self, 2);
};
TextHandle.prototype = Handle("text", {
	nodeType: 3
})

/*
 * CommentHandle constructor
 */

function CommentHandle(node) {
	var self = this;
	self.node = node;
	Handle.init(self, 1);
};
CommentHandle.prototype = Handle("comment", {
	nodeType: 8
})
/*
 * parse rule
 */
var placeholder = {
	"<": "&lt;",
	">": "&gt;",
	"{": _placeholder(),
	"(": _placeholder(),
	")": _placeholder(),
	"}": _placeholder()
},
	_Rg = function(s) {
		return RegExp(s, "g")
	},
	placeholderReg = {
		"<": /</g,
		">": />/g,
		"/{": /\\\{/g,
		"{": _Rg(placeholder["{"]),
		"/(": /\\\(/g,
		"(": _Rg(placeholder["("]),
		"/)": /\\\)/g,
		")": _Rg(placeholder[")"]),
		"/}": /\\\}/g,
		"}": _Rg(placeholder["}"])
	}, _head = /\{([\w\W]*?)\(/g,
	_footer = /\)[\s]*\}/g,
	parseRule = function(str) {
		var parseStr = str
			.replace(/</g, placeholder["<"])
			.replace(/>/g, placeholder[">"])
			.replace(placeholderReg["/{"], placeholder["{"])
			.replace(placeholderReg["/("], placeholder["("])
			.replace(placeholderReg["/)"], placeholder[")"])
			.replace(placeholderReg["/}"], placeholder["}"])
			.replace(_head, "<span type='handle' handle='$1'>")
			.replace(_footer, "</span>")
			.replace(placeholderReg["{"], "{")
			.replace(placeholderReg["("], "(")
			.replace(placeholderReg[")"], ")")
			.replace(placeholderReg["}"], "}");
		return parseStr;
	},
	_matchRule = /\{[\w\W]*?\([\w\W]*?\)[\s]*\}/,
	/*
	 * expores function
	 */

	V = {
		prefix: "attr-",
		_nodeTree: function(htmlStr) {
			var _shadowBody = $.D.cl(shadowBody);
			_shadowBody.innerHTML = htmlStr;
			var insertBefore = [];
			_traversal(_shadowBody, function(node, index, parentNode) {
				if (node.nodeType === 3) {
					$.p(insertBefore, {
						baseNode: node,
						parentNode: parentNode,
						insertNodesHTML: parseRule(node.data)
					});
				}
			});
			$.fE(insertBefore, function(item, i) {
				var node = item.baseNode,
					parentNode = item.parentNode,
					insertNodesHTML = item.insertNodesHTML;
				shadowDIV.innerHTML = $.trim(insertNodesHTML); //optimization
				//Using innerHTML rendering is complete immediate operation DOM, 
				//innerHTML otherwise covered again, the node if it is not, 
				//then memory leaks, IE can not get to the full node.
				$.fE(shadowDIV.childNodes, function(refNode) {
					$.D.iB(parentNode, refNode, node)
				})
				$.D.rC(parentNode, node);
			});
			//when re-rendering,select node's child will be filter by ``` _shadowBody.innerHTML = _shadowBody.innerHTML;```
			return new ElementHandle(_shadowBody);
		},
		parse: function(htmlStr) {
			return View(this._nodeTree(htmlStr));
		},
		rt: function(handleName, triggerFactory) {
			return V.triggers[handleName] = triggerFactory;
		},
		rh: function(handleName, handle) {
			return V.handles[handleName] = handle
		},
		ra: function(match, handle) {
			var attrHandle = V.attrHandles[V.attrHandles.length] = {
				match: $NULL,
				handle: handle
			}
			if (typeof match === "function") {
				attrHandle.match = match;
			} else {
				attrHandle.match = function(attrKey) {
					return attrKey === match;
				}
			}
		},
		triggers: {},
		handles: {},
		attrHandles: [],
		modules: {},
		attrModules: {},
		eachModules: {},
		withModules: {},
		_instances: {},

		// Proto: DynamicComputed /*Proto*/ ,
		Model: DataManager
	};
var ViewParser = global.ViewParser = {
	scans: function() {
		$.fE(document.getElementsByTagName("script"), function(scriptNode) {
			if (scriptNode.getAttribute("type") === "text/template") {
				V.modules[scriptNode.getAttribute("name")] = ViewParser.parse(scriptNode.innerHTML);
				$.D.rm(scriptNode)
			}
		});
	},
	parseStr: function(htmlStr) {
		return V.parse(parse(htmlStr))
	},
	parseNode: function(htmlNode) {
		return V.parse(parse(htmlNode.innerHTML))
	},
	parse: function(html) {
		if (html instanceof Object) {
			return this.parseNode(html)
		}
		return this.parseStr(html)
	},
	modules: V.modules,
	config: {
		Id: 'HVP',
		Var: 'App',
		Data: {}
	},
	registerHandle: registerHandle,
	app: function(userConfig) {
		ViewParser.scans();
		var HVP_config = ViewParser.config;
		userConfig = _mix(HVP_config, userConfig) || HVP_config;
		var App = document.getElementById(userConfig.Id); //configable
		if (App) {
			var appName = userConfig.Var;
			var template = ViewParser.parseNode(App)(userConfig.Data); //App.getAttribute("template-data")//json or url or configable
			// template.set(HVP_config.Data);
			App.innerHTML = "";
			template.append(App);
			if ( /*!appName || */ appName == userConfig.Id || appName in global) {
				//IE does not support the use and the DOM ID of the same variable names, so automatically add '_App' after the most.
				appName = userConfig.Id + "_App";
				// console.error("App's name shouldn't the same of the DOM'ID");
				console.warn("App's name will be set as " + appName);
			}
			global[appName] = template
		}
		return template;
	},
	ready: (function() {
		var ready = "DOMContentLoaded", //_isIE ? "DOMContentLoaded" : "readystatechange",
			ready_status = $FALSE,
			callbackFunStacks = [];

		function _load() {
			var callbackObj;
			while (callbackFunStacks.length) {
				callbackObj = callbackFunStacks.shift(0, 1);
				callbackObj.callback.call(callbackObj.scope || global)
			}
			ready_status = $TRUE;
		}
		_registerEvent(doc, (_isIE && IEfix[ready]) || ready, _load);
		return function(callbackFun, scope) {
			if (ready_status) {
				callbackFun.call(scope || global);
			} else {
				$.p(callbackFunStacks, {
					callback: callbackFun,
					scope: scope
				})
				//complete ==> onload , interactive ==> DOMContentLoaded
				//https://developer.mozilla.org/en-US/docs/Web/API/document.readyState
				if (/complete|interactive/.test(doc.readyState)) { //fix asyn load
					_load()
				}
			}
		}
	}())
};
(function() {
	var scriptTags = document.getElementsByTagName("script"),
		userConfigStr = $.trim(scriptTags[scriptTags.length - 1].innerHTML);
	ViewParser.ready(function() {
		ViewParser.scans();
		if (userConfigStr.charAt(0) === "{") {
			try {
				var userConfig = userConfigStr ? Function("return" + userConfigStr)() : {};
			} catch (e) {
				console.error("config error:" + e.message);
			}
			userConfig && ViewParser.app(userConfig)
		}
	});
}());
var _commentPlaceholder = function(handle, parentHandle, commentText) {
	var handleName = handle.handleName,
		commentText = commentText || (handleName + handle.id),
		commentNode = $.D.C(commentText),
		commentHandle = new CommentHandle(commentNode); // commentHandle as Placeholder

	$.p(handle.childNodes, commentHandle);
	$.iA(parentHandle.childNodes, handle, commentHandle);
	//Node position calibration
	//no "$.insert" Avoid sequence error
	return commentHandle;
};
var placeholderHandle = function(handle, index, parentHandle) {
	var commentHandle = _commentPlaceholder(handle, parentHandle);
};
V.rh("define", function(handle, index, parentHandle) {
	if(parentHandle.type !== "handle"){
		$.iA(parentHandle.childNodes,handle,handle.childNodes[0].childNodes[0]);
		return $.noop
	}
});
var _each_display = function(show_or_hidden, NodeList_of_ViewInstance, dataManager, triggerBy, viewInstance_ID) {
	var handle = this,
		parentHandle = handle.parentNode,
		comment_endeach_id,
		allArrViewInstances = V._instances[viewInstance_ID]._AVI,
		arrViewInstances = allArrViewInstances[handle.id];
	$.fE(parentHandle.childNodes, function(child_handle, index, cs) { //get comment_endeach_id
		if (child_handle.id === handle.id) {
			comment_endeach_id = cs[index + 3].id;
			return $FALSE;
		}
	});
	// console.log(comment_endeach_id,viewInstance_ID)
	arrViewInstances && (arrViewInstances.hidden = !show_or_hidden);
	if (show_or_hidden) {
		$.fE(arrViewInstances, function(viewInstance, index) {
			// console.log(comment_endeach_id,NodeList_of_ViewInstance[comment_endeach_id],handle,parentHandle)
			viewInstance.insert(NodeList_of_ViewInstance[comment_endeach_id].currentNode)
			// console.log(handle.len)
			if (arrViewInstances.len === index + 1) {
				return $FALSE;
			}
		});
	} else {
		$.fE(arrViewInstances, function(viewInstance) {
			// console.log(viewInstance)
			viewInstance.remove();
		})
	}
};
V.rh("#each", function(handle, index, parentHandle) {
	//The Nodes between #each and /each will be pulled out , and not to be rendered.
	//which will be combined into new View module.
	var _shadowBody = $.D.cl(shadowBody),
		eachModuleHandle = new ElementHandle(_shadowBody),
		endIndex = 0;

	// handle.arrViewInstances = [];//Should be at the same level with currentNode
	// handle.len = 0;
	var layer = 1;
	$.fE(parentHandle.childNodes, function(childHandle, index) {
		endIndex = index;
		if (childHandle.handleName === "#each") {
			layer += 1
		}
		if (childHandle.handleName === "/each") {
			layer -= 1;
			if (!layer) {
				return $FALSE
			}
		}
		$.p(eachModuleHandle.childNodes, childHandle);
		// layer && console.log("inner each:", childHandle)
	}, index + 1);
	// console.log("----",handle.id,"-------")
	parentHandle.childNodes.splice(index + 1, endIndex - index - 1); //Pulled out
	V.eachModules[handle.id] = View(eachModuleHandle); //Compiled into new View module

	handle.display = _each_display; //Custom rendering function
	_commentPlaceholder(handle, parentHandle);
});
V.rh("/each", placeholderHandle);
// var _noParameters = _placeholder();
V.rh("", function(handle, index, parentHandle) {
	var textHandle = handle.childNodes[0];
	if (!textHandle) {//{()} 无参数
		textHandle = $.p(handle.childNodes,new TextHandle(doc.createTextNode("")))
	}
	if (parentHandle.type !== "handle") { //is textNode
		if (textHandle) {
			$.iA(parentHandle.childNodes, handle, textHandle);
			//Node position calibration
			//textHandle's parentNode will be rewrited. (by using $.insertAfter)
			return $.noop;
		}
	}// else {console.log("ignore:",textHandle) if (textHandle) {textHandle.ignore = $TRUE; } }  //==> ignore Node's childNodes will be ignored too.
});
V.rh("@", function(handle, index, parentHandle) {
	var textHandle = handle.childNodes[0];
	var i = 0;
	do {
		i += 1;
		var nextHandle = parentHandle.childNodes[index + i];
	} while (nextHandle && nextHandle.ignore);
	if (textHandle) { //textNode as Placeholder

		$.iA(parentHandle.childNodes, handle, textHandle);
		//Node position calibration
		//no "$.insert" Avoid sequence error

		return function(NodeList_of_ViewInstance) {
			var nextNodeInstance = nextHandle && NodeList_of_ViewInstance[nextHandle.id].currentNode,
				textNodeInstance = NodeList_of_ViewInstance[textHandle.id].currentNode,
				parentNodeInstance = NodeList_of_ViewInstance[parentHandle.id].currentNode
				parentNodeInstance&&$.D.iB(parentNodeInstance, textNodeInstance, nextNodeInstance); //Manually insert node
		}
	}
});
V.rh("/if", V.rh("#else", V.rh("#if", placeholderHandle)));
var _layout_display = function(show_or_hidden, NodeList_of_ViewInstance, dataManager, triggerBy, viewInstance_ID) {
	var handle = this,
		commentPlaceholderElement,
		layoutViewInstance = V._instances[viewInstance_ID]._ALVI[handle.id];
	if (!layoutViewInstance) {
		return;
	}
	$.fE(handle.parentNode.childNodes, function(child_handle, index, cs) { //get comment_endeach_id
		if (child_handle.id === handle.id) {
			commentPlaceholderElement = NodeList_of_ViewInstance[cs[index + 1].id].currentNode
			return $FALSE;
		}
	});
	console.log(show_or_hidden, viewInstance_ID, layoutViewInstance)
	if (show_or_hidden) {
		layoutViewInstance.insert(commentPlaceholderElement);
	} else {
		layoutViewInstance.remove();
	}

};
V.rh("#>",V.rh("#layout", function(handle, index, parentHandle) {
	handle.display = _layout_display; //Custom rendering function
	_commentPlaceholder(handle, parentHandle);
}));
var _operator_handle  = function(handle, index, parentHandle) {
	var textHandle = handle.childNodes[0].childNodes[0];
	if (parentHandle.type !== "handle") {
		if (textHandle) {
			$.iA(parentHandle.childNodes, handle, textHandle);
			return $.noop;
		}
	}
},
_operator_list = "+ - * / % == === != !== > < && || ^ >> << & |".split(" ");
$.ftE(_operator_list, function(operator) {
	templateOperatorNum[operator] = 2;
	V.rh(operator, _operator_handle)
});
var _unary_operator_list = "! ~ -".split(" ");// ++ --
$.ftE(_unary_operator_list, function(operator) {
	templateOperatorNum[operator] = 1;
	V.rh(operator, _operator_handle)
});
var _with_display = function(show_or_hidden, NodeList_of_ViewInstance, dataManager, triggerBy, viewInstance_ID) {
	var handle = this,
		parentHandle = handle.parentNode,
		comment_endwith_id,
		AllLayoutViewInstance = V._instances[viewInstance_ID]._WVI,
		withViewInstance = AllLayoutViewInstance[handle.id];
	if (!withViewInstance) {
		return;
	}
	$.fE(parentHandle.childNodes, function(child_handle, index, cs) { //get comment_endwith_id
		if (child_handle.id === handle.id) {
			comment_endwith_id = cs[index + 3].id;
			return $FALSE;
		}
	});
	console.log(show_or_hidden,NodeList_of_ViewInstance[comment_endwith_id].currentNode)
	if (show_or_hidden) {
		withViewInstance.insert(NodeList_of_ViewInstance[comment_endwith_id].currentNode)
	} else {
		withViewInstance.remove();
	}
};
V.rh("#with", function(handle, index, parentHandle) {
	//The Nodes between #with and /with will be pulled out , and not to be rendered.
	//which will be combined into new View module.
	var _shadowBody = $.D.cl(shadowBody),
		withModuleHandle = new ElementHandle(_shadowBody),
		endIndex = 0;

	// handle.arrViewInstances = [];//Should be at the same level with currentNode
	var layer = 1;
	$.fE(parentHandle.childNodes, function(childHandle, index) {
		endIndex = index;
		// console.log(childHandle,childHandle.handleName)
		if (childHandle.handleName === "#with") {
			layer += 1
		}
		if (childHandle.handleName === "/with") {
			layer -= 1;
			if (!layer) {
				return $FALSE
			}
		}
		$.p(withModuleHandle.childNodes, childHandle);
	}, index + 1);
	// console.log("----",handle.id,"-------")
	parentHandle.childNodes.splice(index + 1, endIndex - index - 1); //Pulled out
	V.withModules[handle.id] = View(withModuleHandle); //Compiled into new View module

	handle.display = _with_display; //Custom rendering function
	_commentPlaceholder(handle, parentHandle);
});
V.rh("/with", placeholderHandle);
V.rt("define", function(handle, index, parentHandle) {
	var handleChilds = handle.childNodes,
		statusKeyHandleId = handleChilds[0].id,
		textHandle_id = handleChilds[0].childNodes[0].id,
		valueHandleId = handleChilds[1].id,
		trigger = {
			bubble: $TRUE,
			name: "define"
		};
	// console.log(handle.childNodes[0].parentNode, handle.parentNode)

	if (parentHandle.type !== "handle") { //as textHandle
		trigger.event = function(NodeList_of_ViewInstance, dataManager /*, triggerBy*/ , isAttr, viewInstance_ID) { //call by ViewInstance's Node
			var key = NodeList_of_ViewInstance[statusKeyHandleId]._data,
				result = NodeList_of_ViewInstance[valueHandleId]._data,
				currentNode = NodeList_of_ViewInstance[textHandle_id].currentNode,
				uid_hash = viewInstance_ID + key,
				viewInstance = V._instances[viewInstance_ID],
				finallyRun;
			// console.log(key,":",result,viewInstance.id);
			if (key !== $UNDEFINED) {
				if (!(finallyRun = DataManager.finallyRun[uid_hash])) {
					DataManager.finallyRun(DataManager.finallyRun[uid_hash] = finallyRun = function() {
						viewInstance = finallyRun.viewInstance
						// if (finallyRun.key==="dd") {debugger};
						//已经被remove的VI，就不应该触发define
						if (viewInstance._canRemoveAble) {
							viewInstance.set(finallyRun.key, finallyRun.result)
						}
						DataManager.finallyRun[uid_hash] = $FALSE; //can push into finally quene
					})
				}
				finallyRun.viewInstance = viewInstance
				finallyRun.key = key
				finallyRun.result = result
			}
			result = String(result);
			// if (result==="1 ==> 6undefined1") {debugger};
			if (currentNode.data !== result) {
				currentNode.data = result;
			}
		}
	} else {
		trigger.event = function(NodeList_of_ViewInstance, dataManager /*, triggerBy*/ , isAttr, viewInstance_ID) { //call by ViewInstance's Node
			var key = NodeList_of_ViewInstance[statusKeyHandleId]._data,
				result = NodeList_of_ViewInstance[valueHandleId]._data;

			DataManager.finallyRun(function() {
				console.log(key, result)
				//key!==$UNDEFINED&&dataManager.set(key,result)
			}, 0)
			NodeList_of_ViewInstance[this.handleId]._data = result;
		}
	}

	return trigger;
});
var eachConfig = {
	$I: "$INDEX"
}
V.rt("#each", function(handle, index, parentHandle) {
	var id = handle.id,
		arrDataHandle_id = handle.childNodes[0].id,
		comment_endeach_id = parentHandle.childNodes[index + 3].id, //eachHandle --> eachComment --> endeachHandle --> endeachComment
		trigger;
	trigger = {
		// smartTrigger:$NULL,
		// key:$NULL,
		// key:$.isString(arrDataHandleKey)?arrDataHandleKey.substring(1,arrDataHandleKey.length-1):arrDataHandleKey+".length",
		event: function(NodeList_of_ViewInstance, dataManager, /*eventTrigger,*/ isAttr, viewInstance_ID) {
			var arrDataHandleKey = NodeList_of_ViewInstance[arrDataHandle_id]._data,
				data = dataManager.get(arrDataHandleKey),
				// arrTriggerKey = arrDataHandleKey + ".length",
				viewInstance = V._instances[viewInstance_ID],
				allArrViewInstances = viewInstance._AVI,
				arrViewInstances = allArrViewInstances[id] || (allArrViewInstances[id] = []),
				showed_vi_len = arrViewInstances.len,
				new_data_len = data ? data.length : 0,
				eachModuleConstructor = V.eachModules[id],
				inserNew,
				comment_endeach_node = NodeList_of_ViewInstance[comment_endeach_id].currentNode;

			if (showed_vi_len !== new_data_len) {
				arrViewInstances.len = new_data_len; //change immediately,to avoid the `subset` trigger the `rebuildTree`,and than trigger each-trigger again.

				var _rebuildTree = dataManager.rebuildTree,
					_touchOff = DM_proto.touchOff;
				dataManager.rebuildTree = $.noop //doesn't need rebuild every subset
				DM_proto.touchOff = $.noop; //touchOff会遍历整个子链，会造成爆炸性增长。


				if (showed_vi_len > new_data_len) {
					$.fE(arrViewInstances, function(eachItemHandle) {
						// eachItemHandle.dataManager._eachIgonre = $TRUE;
						eachItemHandle.remove();
					}, new_data_len);
				}else{
					data != $UNDEFINED && $.ftE($.s(data), function(eachItemData, index) {
						//TODO:if too mush vi will be create, maybe asyn
						var viewInstance = arrViewInstances[index];
						if (!viewInstance) {
							viewInstance = arrViewInstances[index] = eachModuleConstructor(eachItemData);
							viewInstance._isEach = {
								index: index,
								brotherVI: arrViewInstances
							}
							dataManager.subset(viewInstance, arrDataHandleKey + "." + index); //+"."+index //reset arrViewInstance's dataManager
						}
						viewInstance.insert(comment_endeach_node)
						// viewInstance.dataManager._eachIgonre = $FALSE;
					}, showed_vi_len); //showed_vi_len||0
				}
				// dataManager.rebuildTree = _rebuildTree
				// dataManager.rebuildTree();
				(dataManager.rebuildTree = _rebuildTree).call(dataManager);
				DM_proto.touchOff = _touchOff;
			}
		}
	}
	return trigger
});
V.rt("", function(handle, index, parentHandle) {
	var textHandle = handle.childNodes[0],
		textHandleId = textHandle.id,
		key = textHandle.node.data,
		trigger;

	if (parentHandle.type !== "handle") { //as textHandle
		if ($.isString(key)) { // single String
			trigger = { //const 
				key: ".", //const trigger
				bubble: $TRUE,
				event: function(NodeList_of_ViewInstance, dataManager) {
					NodeList_of_ViewInstance[textHandleId].currentNode.data = key.substring(1, key.length - 1);
				}
			};
		} else { //String for databese by key
			trigger = {
				key: key,
				event: function(NodeList_of_ViewInstance, dataManager, /* triggerBy,*/ isAttr/*, vi*/) { //call by ViewInstance's Node
					var data = dataManager.get(key),
						nodeHandle = NodeList_of_ViewInstance[textHandleId],
						currentNode = nodeHandle.currentNode;
					if (isAttr) {
						//IE浏览器直接编译，故不需要转义，其他浏览器需要以字符串绑定到属性中。需要转义，否则会出现引号冲突
						if (isAttr.key.indexOf("on") === 0 && !_isIE) {
							data = String(data).replace(/"/g, '\\"').replace(/'/g, "\\'");
						}
					}
					// data = String(data);
					if (nodeHandle._data !== data) {
						// console.log(currentNode.data,nodeHandle._data,data,currentNode.parentNode.outerHTML)
						currentNode.data = nodeHandle._data = data;
					}
				}
			}
		}
	} else { //as stringHandle
		if ($.isString(key)) { // single String
			trigger = { //const 
				key: ".", //const trigger
				bubble: $TRUE,
				event: function(NodeList_of_ViewInstance, dataManager) {
					NodeList_of_ViewInstance[this.handleId]._data = key.substring(1, key.length - 1);
				}
			};
		} else { //String for databese by key
			trigger = {
				key: key,
				bubble: $TRUE,
				event: function(NodeList_of_ViewInstance, dataManager) {
					NodeList_of_ViewInstance[this.handleId]._data = dataManager.get(key);
				}
			};
		}
	}
	return trigger;
});
V.rt("@", function(handle, index, parentHandle) {
	var textHandle = handle.childNodes[0],
		textHandleId = textHandle.id,
		key = textHandle.node.data,
		trigger = { //const 
			key: key, //const trigger
			bubble: $TRUE
		};

	if (parentHandle.type !== "handle") { //as textHandle
		trigger.event = function(NodeList_of_ViewInstance, dataManager) {
			//trigger but no bind data
			NodeList_of_ViewInstance[textHandleId].currentNode.data = key;
		}
	} else {
		trigger.event = function(NodeList_of_ViewInstance, dataManager) {
			NodeList_of_ViewInstance[this.handleId]._data = key;
		}
	}
	return trigger;
});
V.rt("#if", function(handle, index, parentHandle) {
	// console.log(handle)
	var id = handle.id,
		ignoreHandleType = /handle|comment/,
		conditionHandleId = handle.childNodes[0].id,
		parentHandleId = parentHandle.id,

		comment_else_id, //#if inserBefore #else
		comment_endif_id, //#else inserBefore /if

		conditionDOM = handle._controllers,
		conditionStatus = $TRUE, //the #if block scope
		trigger,
		deep = 0;

	$.fE(parentHandle.childNodes, function(child_handle, i, childHandles) {

		if (child_handle.handleName === "#if") {
			deep += 1
		} else if (child_handle.handleName === "#else") {
			if (deep === 1) {
				conditionStatus = !conditionStatus;
				comment_else_id = $.lI(child_handle.childNodes).id;
			}
		} else if (child_handle.handleName === "/if") {
			deep -= 1
			if (!deep) {
				comment_endif_id = $.lI(child_handle.childNodes).id;
				return $FALSE;
			}
		} else if (child_handle.type !== "comment") {
			$.p(child_handle._controllers, id);
			$.p(conditionDOM[conditionStatus], child_handle.id);
		}
	}, index); // no (index + 1):scan itself:deep === 0 --> conditionStatus = !conditionStatus;

	trigger = {
		// key:"",//default is ""
		event: function(NodeList_of_ViewInstance, dataManager, /*triggerBy,*/ isAttr, viewInstance_ID) {
			var conditionVal = !! NodeList_of_ViewInstance[conditionHandleId]._data,
				parentNode = NodeList_of_ViewInstance[parentHandleId].currentNode,
				markHandleId = comment_else_id, //if(true)
				markHandle; //default is undefined --> insertBefore === appendChild
			
			if (NodeList_of_ViewInstance[this.handleId]._data !== conditionVal /*|| triggerBy*/) {
				NodeList_of_ViewInstance[this.handleId]._data = conditionVal;
				if (!conditionVal) {
					markHandleId = comment_endif_id;
				}
				if (markHandleId) {
					markHandle = NodeList_of_ViewInstance[markHandleId].currentNode;
				}
				$.fE(conditionDOM[conditionVal], function(id) {
					var currentHandle = NodeList_of_ViewInstance[id],
						node = currentHandle.currentNode,
						placeholderNode = (NodeList_of_ViewInstance[id].placeholderNode = NodeList_of_ViewInstance[id].placeholderNode || $.D.C(id)),
						display = $TRUE;

					$.fE(currentHandle._controllers, function(controller_id) {
						//Traverse all Logic Controller(if-else-endif) to determine whether each Controller are allowed to display it.
						var controllerHandle = NodeList_of_ViewInstance[controller_id]
						return display = display && ($.iO(controllerHandle._controllers[controllerHandle._data ? $TRUE : $FALSE], currentHandle.id) !== -1);
						//when display is false,abort traversing
					});
					if (display) {
						if (currentHandle.display) { //Custom Display Function,default is false
							currentHandle.display($TRUE, NodeList_of_ViewInstance, dataManager, /*triggerBy, */viewInstance_ID)
						} else if (node) {
							$.D.re(parentNode, node, placeholderNode)
						}
					}
				});
				$.fE(conditionDOM[!conditionVal], function(id) {
					var currentHandle = NodeList_of_ViewInstance[id],
						node = currentHandle.currentNode,
						placeholderNode = (currentHandle.placeholderNode = currentHandle.placeholderNode || $.D.C(id));

					if (currentHandle.display) { //Custom Display Function,default is false
						currentHandle.display($FALSE, NodeList_of_ViewInstance, dataManager, /*triggerBy,*/ viewInstance_ID)
					} else if (node) {
						$.D.re(parentNode, placeholderNode, node)
					}
				})
			}
		}
	}

	return trigger;
});
V.rt("#>", V.rt("#layout", function(handle, index, parentHandle) {
	// console.log(handle)
	var id = handle.id,
		childNodes = handle.childNodes,
		templateHandle_id = childNodes[0].id,
		dataHandle_id = childNodes[1].id,
		ifHandle = childNodes[2],
		ifHandle_id = ifHandle.type==="handle" && ifHandle.id,
		comment_layout_id = parentHandle.childNodes[index + 1].id, //eachHandle --> eachComment --> endeachHandle --> endeachComment
		trigger;

	trigger = {
		event: function(NodeList_of_ViewInstance, dataManager, /*eventTrigger,*/ isAttr, viewInstance_ID) {
			var AllLayoutViewInstance = V._instances[viewInstance_ID]._ALVI;
			if (!AllLayoutViewInstance[id]) {
				var key = NodeList_of_ViewInstance[dataHandle_id]._data,
					layoutViewInstance = AllLayoutViewInstance[id] = V.modules[NodeList_of_ViewInstance[templateHandle_id]._data]().insert(NodeList_of_ViewInstance[comment_layout_id].currentNode);
				dataManager.subset(layoutViewInstance, key);
			}
		}
	}
	if (ifHandle_id) {
		trigger.event = function(NodeList_of_ViewInstance, dataManager, /*eventTrigger,*/ isAttr, viewInstance_ID){
			var isShow = $.trim(String(NodeList_of_ViewInstance[ifHandle_id]._data)).replace(_booleanFalseRegExp,""),
				AllLayoutViewInstance = V._instances[viewInstance_ID]._ALVI,
				layoutViewInstance = AllLayoutViewInstance[id];
			// console.log(isShow,":",NodeList_of_ViewInstance[ifHandle_id]._data)
			if(isShow){
				if (!layoutViewInstance) {
					var key = NodeList_of_ViewInstance[dataHandle_id]._data;
					if(dataManager.get(key)){
						// console.log(key,":",dataManager.get(key))
						layoutViewInstance = AllLayoutViewInstance[id] = V.modules[NodeList_of_ViewInstance[templateHandle_id]._data]();
						dataManager.subset(layoutViewInstance, key);
					}
				}
				if(layoutViewInstance&&!layoutViewInstance._canRemoveAble){
					// console.log("show",layoutViewInstance._id)
					layoutViewInstance.insert(NodeList_of_ViewInstance[comment_layout_id].currentNode);
				}
				// console.log(isShow,layoutViewInstance.get())
			}else{
				if(layoutViewInstance&&layoutViewInstance._canRemoveAble){
					// console.log("hidden",layoutViewInstance._id)
					layoutViewInstance.remove();
				}
			}
		}
	}
	return trigger;
}));
V.rt("!", V.rt("nega", function(handle, index, parentHandle) { //Negate
	var nageteHandlesId = handle.childNodes[0].id,
		trigger;
	trigger = {
		// key:"",//default key === ""
		bubble: $TRUE,
		event: function(NodeList_of_ViewInstance, dataManager) {
			NodeList_of_ViewInstance[this.handleId]._data = !NodeList_of_ViewInstance[nageteHandlesId]._data; //first value
		}
	}
	return trigger;
}));
var _operator_handle_builder = function(handle, index, parentHandle){
	var firstParameter_id = handle.childNodes[0].id,
		textHandle_id = handle.childNodes[0].childNodes[0].id,
		secondParameter = handle.childNodes[1],
		trigger = {
			bubble: true//build in global,can't use $TRUE
		};
	// console.log(handle.childNodes[0].parentNode, handle.parentNode)

	if (parentHandle.type !== "handle") { //as textHandle
		trigger.event = function(NodeList_of_ViewInstance /*, dataManager, triggerBy, isAttr, vi*/ ) { //call by ViewInstance's Node
			var result =  NodeList_of_ViewInstance[firstParameter_id]._data+(secondParameter ? NodeList_of_ViewInstance[secondParameter.id]._data : 0) ,
				currentNode = NodeList_of_ViewInstance[textHandle_id].currentNode;
			currentNode.data = result;
		}
	} else {
		trigger.event = function(NodeList_of_ViewInstance /*, dataManager, triggerBy, isAttr, vi*/ ) { //call by ViewInstance's Node
			var result =  NodeList_of_ViewInstance[firstParameter_id]._data+(secondParameter ? NodeList_of_ViewInstance[secondParameter.id]._data : 0) ;
			NodeList_of_ViewInstance[this.handleId]._data = result;
		}
	}

	return trigger;
}
var _operator_handle_build_str = String(_operator_handle_builder),
	_operator_handle_build_arguments = _operator_handle_build_str.match(/\(([\w\W]+?)\)/)[1],
	_operator_handle_build_str = _operator_handle_build_str.substring(_operator_handle_build_str.indexOf("{")+1,_operator_handle_build_str.length-1),
	_operator_handle_build_factory = function(operator) {
		var result= Function(_operator_handle_build_arguments, _operator_handle_build_str.replace(/\+/g, operator))
		return result
	};
$.ftE(_operator_list, function(operator) {
	V.rt(operator, _operator_handle_build_factory(operator))
});
var _unary_operator_handle_builder = function(handle, index, parentHandle){
	var firstParameter_id = handle.childNodes[0].id,
		textHandle_id = handle.childNodes[0].childNodes[0].id,
		trigger = {
			bubble: true//build in global,can't use $TRUE
		};

	if (parentHandle.type !== "handle") { //as textHandle
		trigger.event = function(NodeList_of_ViewInstance /*, dataManager, triggerBy, isAttr, vi*/ ) { //call by ViewInstance's Node
			var result =  +NodeList_of_ViewInstance[firstParameter_id]._data,
				currentNode = NodeList_of_ViewInstance[textHandle_id].currentNode;
			currentNode.data = result;
		}
	} else {
		trigger.event = function(NodeList_of_ViewInstance /*, dataManager, triggerBy, isAttr, vi*/ ) { //call by ViewInstance's Node
			var result =  +NodeList_of_ViewInstance[firstParameter_id]._data;
			NodeList_of_ViewInstance[this.handleId]._data = result;
		}
	}

	return trigger;
}
var _unary_operator_handle_build_str = String(_unary_operator_handle_builder),
	_unary_operator_handle_build_arguments = _unary_operator_handle_build_str.match(/\(([\w\W]+?)\)/)[1],
	_unary_operator_handle_build_str = _unary_operator_handle_build_str.substring(_unary_operator_handle_build_str.indexOf("{")+1,_unary_operator_handle_build_str.length-1),
	_unary_operator_handle_build_factory = function(operator) {
		var result= Function(_unary_operator_handle_build_arguments, _unary_operator_handle_build_str.replace(/\+/g, operator))
		return result
	};
$.ftE(_unary_operator_list, function(operator) {
	V.rt(operator, _unary_operator_handle_build_factory(operator))
});
V.rt("#with", function(handle, index, parentHandle) {
	// console.log(handle)
	var id = handle.id,
		dataHandle_id = handle.childNodes[0].id,
		comment_with_id = parentHandle.childNodes[index + 3].id, //eachHandle --> eachComment --> endeachHandle --> endeachComment
		trigger;

	trigger = {
		event: function(NodeList_of_ViewInstance, dataManager, /*eventTrigger,*/ isAttr, viewInstance_ID) {
			var key = NodeList_of_ViewInstance[dataHandle_id]._data,
				AllLayoutViewInstance = V._instances[viewInstance_ID]._WVI,
				withViewInstance = AllLayoutViewInstance[id], // || (AllLayoutViewInstance[id] = V.withModules[id](data).insert(NodeList_of_ViewInstance[comment_with_id].currentNode)),
				inserNew;
			if (!withViewInstance) {
				withViewInstance = AllLayoutViewInstance[id] = V.withModules[id]();
				dataManager.subset(withViewInstance,key);
				withViewInstance.insert(NodeList_of_ViewInstance[comment_with_id].currentNode);
			}
		}
	}
	return trigger;
});
/*
 * user defined handle function like Handlebarsjs
 */
function registerHandle(handleName, handleFun) {
	templateHandles[handleName]= $TRUE;
	V.rh(handleName, function(handle, index, parentHandle) {
		var endCommentHandle = _commentPlaceholder(handle, parentHandle, "html_end_" + handle.id),
			startCommentHandle = _commentPlaceholder(handle, parentHandle, "html_start_" + handle.id);
	});
	V.rt(handleName, function(handle, index, parentHandle) {
		var handleChilds = handle.childNodes,
			beginCommentId,// = handleChilds[handleChilds.length - 1].id,
			endCommentId,// = handleChilds[handleChilds.length - 2].id,
			cacheNode = $.D.cl(shadowDIV),
			trigger,
			argumentsIdSet = [];
		$.ftE(handleChilds, function(handle_arg) {
			$.p(argumentsIdSet, handle_arg.id);
		});
		beginCommentId = argumentsIdSet[argumentsIdSet.length-1]
		endCommentId = argumentsIdSet[argumentsIdSet.length-2]
		trigger = {
			// key:"",//default key === ""
			bubble: true,
			event: function(NodeList_of_ViewInstance, dataManager, /*triggerBy,*/ isAttr, viewInstance_ID) {
				var startCommentNode = NodeList_of_ViewInstance[beginCommentId].currentNode,
					endCommentNode = NodeList_of_ViewInstance[endCommentId].currentNode,
					parentNode = endCommentNode.parentNode,
					brotherNodes = parentNode.childNodes,
					argumentsDataSet = [],
					index = -1;

				for (var i = 0, len = argumentsIdSet.length - 2, handle_arg_data, argumentsDataSet; i < len; i += 1) {
					$.p(argumentsDataSet,NodeList_of_ViewInstance[argumentsIdSet[i]]._data)
				};
				$.fE(brotherNodes, function(node, i) {
					index = i;
					if (node === startCommentNode) {
						return $FALSE;
					}
				});
				index = index + 1;
				$.fE(brotherNodes, function(node, i) {
					if (node === endCommentNode) {
						return $FALSE;
					}
					$.D.rC(parentNode, node); //remove
				}, index);

				cacheNode.innerHTML = handleFun.apply(V._instances[viewInstance_ID],argumentsDataSet)
				$.fE(cacheNode.childNodes, function(node, i) {
					$.D.iB(parentNode, node, endCommentNode);
				});
			}
		}
		return trigger;
	});
	return ViewParser;
}
registerHandle("HTML",function () {
	return Array.prototype.join.call(arguments,"");
})
var _testDIV = $.D.cl(shadowDIV),
	_getAttrOuter = Function("n", "return n." + (("textContent" in _testDIV) ? "textContent" : "innerText") + "||''");

var _AttributeHandleEvent = {
	event: function(key, currentNode, parserNode) { //on开头的事件绑定，IE需要绑定Function类型，现代浏览器绑定String类型（_AttributeHandleEvent.com）
		var attrOuter = _getAttrOuter(parserNode);
		try {
			var attrOuterEvent = Function(attrOuter); //尝试编译String类型数据
		} catch (e) {
			attrOuterEvent = $.noop; //失败使用空函数替代
		}
		currentNode.setAttribute(key, attrOuterEvent);
	},
	style: function(key, currentNode, parserNode) {
		var attrOuter = _getAttrOuter(parserNode);
		currentNode.style.setAttribute('cssText', attrOuter);
	},
	com: function(key, currentNode, parserNode) {
		var attrOuter = _getAttrOuter(parserNode);
		if (currentNode.getAttribute(key) !== attrOuter) {
			currentNode.setAttribute(key, attrOuter)
		}
	},
	dir: function(key, currentNode, parserNode) {
		var attrOuter = _getAttrOuter(parserNode);
		if (currentNode[key] !== attrOuter) {
			currentNode[key] = attrOuter;
		}
	},
	bool: function(key, currentNode, parserNode) {
		var attrOuter = $.trim(_getAttrOuter(parserNode).replace(_booleanFalseRegExp, ""));
		// console.log("key:", key, "attrOuter:", attrOuter)
		if (attrOuter) { // currentNode.setAttribute(key, key);
			currentNode[key] = key;
		} else { // currentNode.removeAttribute(key);
			currentNode[key] = $FALSE;
		}
	},
	radio: function(key, currentNode, parserNode) { //radio checked
		var attrOuter = _getAttrOuter(parserNode);
		if (attrOuter === currentNode.value) {
			currentNode[key] = attrOuter;
		}
	}
};
if (_isIE) {
	var __radio = _AttributeHandleEvent.radio;
	_AttributeHandleEvent.radio = function(key, currentNode, parserNode) {
		var attrOuter = $.trim(_getAttrOuter(parserNode).replace(_booleanFalseRegExp, ""));
		console.log("IE checked", attrOuter)
		if (attrOuter === currentNode.value) {
			currentNode.defaultChecked = attrOuter;
		} else {
			currentNode.defaultChecked = $FALSE;
		}
		(this._attributeHandle = __radio)(key, currentNode, parserNode);
	}
	var __bool = _AttributeHandleEvent.bool;
	_AttributeHandleEvent.bool = function(key, currentNode, parserNode) {
		var attrOuter = $.trim(_getAttrOuter(parserNode).replace(_booleanFalseRegExp, ""));
		console.log("IE selected", attrOuter)
		if (attrOuter) {
			currentNode.defaultChecked = attrOuter;
		} else {
			currentNode.defaultChecked = $FALSE;
		}
		(this._attributeHandle = __bool)(key, currentNode, parserNode);
	}
}
var _boolAssignment = " checked selected disabled readonly multiple defer declare noresize nowrap noshade compact truespeed async typemustmatch open novalidate ismap default seamless autoplay controls loop muted reversed scoped autofocus required formnovalidate editable draggable hidden "
/*for ie fix*/+"defaultSelected ";
V.ra(function(attrKey) {
	return _boolAssignment.indexOf(" " + attrKey + " ") !== -1;
}, function(attrKey, element) {
	var result = _AttributeHandleEvent.bool
	switch (element.type.toLowerCase()) {
		case "radio":
			(attrKey === "checked") && (result = _AttributeHandleEvent.radio)
			break
		case "select-one":
			/selected|defaultSelected/.test(attrKey) && (result = _AttributeHandleEvent.select)
			break
	}
	return result;
})
var _dirAssignment = " className value ";
V.ra(function(attrKey){
	return _dirAssignment.indexOf(" "+attrKey+" ")!==-1;
}, function() {
	return _AttributeHandleEvent.dir;
})
var _elementCache = {},
	eventListerAttribute = function(key, currentNode, parserNode, vi /*, dm_id*/ ) {
		var attrOuter = _getAttrOuter(parserNode),
			eventName = key.replace("event-on", "").replace("event-", "").toLowerCase(),
			eventFun = vi.get(attrOuter), //在重用函数的过程中会出现问题
			elementHashCode = $.hashCode(currentNode, "event"),
			eventCollection,
			oldEventFun;
		if (eventFun) {
			var wrapEventFun = function(e) {
				return eventFun.call(this, e, vi)
			}
			eventCollection = _elementCache[elementHashCode] || (_elementCache[elementHashCode] = {});
			if (oldEventFun = eventCollection[eventName]) {
				_cancelEvent(currentNode, eventName, oldEventFun, elementHashCode)
			}
			_registerEvent(currentNode, eventName, wrapEventFun, elementHashCode);
			eventCollection[eventName] = wrapEventFun;
		}
	};

V.ra(function(attrKey) {
	return attrKey.indexOf("event-") === 0;
}, function(attrKey) {
	return eventListerAttribute;
})
/*
 *form-bind只做绑定form处理事件，value绑定需要另外通过attr-value={(XX)}来绑定，避免重复
 */
var _formCache = {},
	__text = {
		attributeName: "value",
		eventNames: ["input"]
	},
	_formKey = {
		"input": function(node) { //需阻止默认事件，比如Checked需要被重写，否则数据没有变动而Checked因用户点击而变动，没有达到V->M的数据同步
			var result = __text;
			switch (node.type.toLowerCase()) {
				case "checkbox":
					result = {
						attributeName: "checked",
						eventNames: _isIE ? ["change", "click"] : ["change"]
					}
					break;
				case "radio":
					result = {
						// attributeName: "checked",
						attributeName: "value",
						eventNames: _isIE ? ["change", "click"] : ["change"]
					}
					break;
					// case "button":
					// case "reset":
					// case "submit":
			}
			return result
		},
		"select": {
			eventNames: ["change"],
			init: function(currentNode, vi, attrOuter) {
				//---init value
				var _init_hashCode = $.hashCode(currentNode, "init"),
					DM_finallyRun = DataManager.finallyRun;
				if (!DM_finallyRun[_init_hashCode]) {
					var _init_finallyRun = DM_finallyRun[_init_hashCode] = function() {
						var options = currentNode.options
						if (options.length) {
							//待存在options后，则进行初始化bind-form的值
							//并确保只运行一次。
							DM_finallyRun[_init_hashCode] = $FALSE;
							var value = [];
							$.ftE(options,function(optionNode){
								if(optionNode.selected&&optionNode.value){
									$.p(value,optionNode.value)
								}
							})
							if (value.length) {
								// console.log(value)
								if (!currentNode.multiple) {
									value = value[0]
								}
								// console.log(attrOuter,value)
								vi.set(attrOuter,value)
							}
						}else{
							//当each运作后是继续允许进入finallyRun队列
							_init_finallyRun._inQuene = $FALSE
						}
					}
				}
			},
			inner: function(e, vi, attrOuter, value /*for arguments*/ ) {
				// console.log(e.target.tagName==="OPTION")
				var ele = this;
				var obj = vi.get(attrOuter)

				if (ele.multiple) {
					value = [];
					$.ftE(ele.options, function(option) {
						if (option.selected && option.value) {
							$.p(value, option.value);
						}
					})
				} else {
					value = ele.options[ele.selectedIndex].value;
				}
				if (obj && obj[_DM_extends_object_constructor] && obj.form) {
					arguments[3] = value;
					vi.set(attrOuter, obj.form.apply(ele, arguments))
				} else {
					vi.set(attrOuter, value)
					// console.log(ele.options)
				}
			}
		},
		"textarea": __text
	},
	formListerAttribute = function(key, currentNode, parserNode, vi, /*dm_id,*/ handle, triggerTable) {
		var attrOuter = _getAttrOuter(parserNode),
			eventNameHashCode = $.hashCode(currentNode, "bind-form");
		if (handle[eventNameHashCode] !== attrOuter) {
			// console.log(handle[eventNameHashCode], attrOuter, arguments)
			handle[eventNameHashCode] = attrOuter;
			var eventNames,
				eventConfig = _formKey[currentNode.tagName.toLowerCase()];
			if (!eventConfig) return;
			var elementHashCode = $.hashCode(currentNode, "form"),
				formCollection,
				outerFormHandle;
			if (eventConfig) {
				typeof eventConfig === "function" && (eventConfig = eventConfig(currentNode));
				eventNames = eventConfig.eventNames;
				eventConfig = $.c(eventConfig); //wrap eventConfig to set inner in diffrent eventConfig
				formCollection = _formCache[elementHashCode] || (_formCache[elementHashCode] = {});
				if (eventConfig.init) {
					eventConfig.init(currentNode, vi, attrOuter)
				}
				if (!eventConfig.inner) {
					eventConfig.inner = function(e, vi, attrOuter /**/ ) {
						var obj = vi.get(attrOuter)
						if (obj && obj[_DM_extends_object_constructor] && obj.form) {
							vi.set(attrOuter, obj.form.apply(this, arguments))
						} else {
							vi.set(attrOuter, this[eventConfig.attributeName])
						}
					};
				}
				$.ftE(eventNames, function(eventName) {
					eventConfig.key = attrOuter;
					eventConfig.vi = vi;
					if (!(outerFormHandle = formCollection[eventName])) {
						outerFormHandle = function(e) {
							var self = this;
							eventConfig.before && eventConfig.before.call(this, e, eventConfig.vi, eventConfig.key)
							eventConfig.inner.call(this, e, eventConfig.vi, eventConfig.key);
							eventConfig.after && eventConfig.after.call(this, e, eventConfig.vi, eventConfig.key)
						}
						// outerFormHandle = Function('o' /*eventConfig*/ , 'return function(e){var s=this;' + (eventConfig.before ? 'o.before.call(s,e,o.vi, o.key);' : '') + 'o.inner.call(s,e,o.vi, o.key);' + (eventConfig.after ? 'o.after.call(s,e,o.vi, o.key);' : '') + '}')(eventConfig);
						outerFormHandle.eventConfig = eventConfig
						_registerEvent(currentNode, eventName, outerFormHandle, elementHashCode);
						formCollection[eventName] = outerFormHandle;
					} else {
						for (var i in eventConfig) {
							outerFormHandle.eventConfig[i] = eventConfig[i];
							// try{outerFormHandle.call(currentNode)}catch(e){};
						}
					}

				});
			}
		}
	};
V.ra("bind-form", function(attrKey) {
	return formListerAttribute;
});
var _event_by_fun = (function() {
	var testEvent = Function(""),
		attrKey = "onclick";

	_testDIV.setAttribute(attrKey, testEvent);
	if (typeof _testDIV.getAttribute(attrKey) === "string") {
		return $FALSE;
	}
	return $TRUE;
}());
V.ra(function(attrKey){
	attrKey.indexOf("on") === 0;
},function () {
	return _event_by_fun&&_AttributeHandleEvent.event;
})
_AttributeHandleEvent.select = function(key, currentNode, parserNode, vi) { //select selected
	var attrOuter = _getAttrOuter(parserNode),
		data = vi.get(attrOuter),
		selectHashCode = $.hashCode(currentNode, "selected"),
		options = currentNode.options;
	currentNode[selectHashCode] = attrOuter;
	// console.log(attrOuter,typeof data, currentNode, selectHashCode)
	if (data instanceof Array) {
		if (currentNode.multiple) {
			$.ftE(options, function(optionNode) {
				optionNode.selected = ($.iO(data, optionNode.value) !== -1)
			})
		}else{
			$.fE(options, function(optionNode) {
				if(optionNode.selected = ($.iO(data, optionNode.value) !== -1)){
					return $FALSE
				}
			})
		}
	} else {
		$.ftE(options, function(optionNode) {
			optionNode.selected = data === optionNode.value
		})
	}
}
var _triggersEach = V.triggers["#each"];
V.rt("#each", function(handle, index, parentHandle) {
	var trigger = _triggersEach(handle, index, parentHandle);
	if (parentHandle.type === "element" && parentHandle.node.tagName === "SELECT") {
		if (_isIE) {
			//IE需要强制触发相关于option的属性来强制使其渲染更新DOM
			//使用clone的节点问题？是否和clone出来的HTML5节点的问题一样？
			var _ieFix_triggerEvent = trigger.event;
			trigger.event = function(NodeList_of_ViewInstance, dataManager, /*eventTrigger,*/ isAttr, viewInstance_ID) {
				var result = _ieFix_triggerEvent.apply(this, arguments);
				var currentNode_options = NodeList_of_ViewInstance[parentHandle.id].currentNode.options;
				currentNode_options.length += 1;
				currentNode_options.length -= 1;
				return result;
			}
		}
		//数组的赋值与绑定相关联，实时更新绑定值。
		var _triggerEvent = trigger.event;
		trigger.event = function(NodeList_of_ViewInstance, dataManager, /*eventTrigger,*/ isAttr, viewInstance_ID) {
			var result = _triggerEvent.apply(this, arguments);
			var currentNode = NodeList_of_ViewInstance[parentHandle.id].currentNode,
				selectHashCode = $.hashCode(currentNode, "selected"),
				touchKey = currentNode[selectHashCode],
				DM_finallyRun = DataManager.finallyRun;
			// console.log(touchKey,currentNode);
			if (touchKey) { //value-map
				var finallyRun;
				if (!(finallyRun = DM_finallyRun[selectHashCode])) {
					DM_finallyRun(DM_finallyRun[selectHashCode] = finallyRun = function() {
						finallyRun.dataManager.touchOff(finallyRun.touchKey)
						DM_finallyRun[selectHashCode] = $FALSE;
					})
				}
				finallyRun.dataManager = dataManager;
				finallyRun.touchKey = touchKey;
			}else{
				//如果没有指定绑定的selected值，那么为bind-from配置默认选中值
				var _init_hashCode = $.hashCode(currentNode, "init"),
					_init_finallyRun = DM_finallyRun[_init_hashCode];
				if(_init_finallyRun&&!_init_finallyRun._inQuene){
					DM_finallyRun(_init_finallyRun)
					_init_finallyRun._inQuene = $TRUE;
				}
			}
			return result;
		}
	}
	return trigger;
})
V.ra("style",function () {
	return _isIE&&_AttributeHandleEvent.style;
})