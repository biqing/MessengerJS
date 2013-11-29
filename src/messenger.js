/**
 *     __  ___
 *    /  |/  /___   _____ _____ ___   ____   ____ _ ___   _____
 *   / /|_/ // _ \ / ___// ___// _ \ / __ \ / __ `// _ \ / ___/
 *  / /  / //  __/(__  )(__  )/  __// / / // /_/ //  __// /
 * /_/  /_/ \___//____//____/ \___//_/ /_/ \__, / \___//_/
 *                                        /____/
 *
 * @description MessengerJS, a common cross-document communicate solution.
 * @author biqing kwok
 * @author Gaubee
 * @version 2.1
 * @license release under MIT license
 */

window.Messenger = (function() {

    // 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突
    var prefix = "[PROJECT_NAME]",
        supportPostMessage = 'postMessage' in window;

    // Target 类, 消息对象
    function _isWindow(obj) {
        // return Object.prototype.toString.call(obj) === "[object global]";
        return obj.window === obj;
    }

    function Target(target, name) {
        var errMsg = '';
        if (arguments.length < 2) {
            errMsg = 'target error - target and name are both requied';
        } else if (!_isWindow(target)) {
            errMsg = 'target error - target itself must be window object';
        } else if (typeof name != 'string') {
            errMsg = 'target error - target name must be string type';
        }
        if (errMsg) {
            throw new Error(errMsg);
        }
        this.targets = target instanceof Array ? target : [target];
        this.name = name;
    }

    // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
    if (supportPostMessage) {
        // IE8+ 以及现代浏览器支持
        var send = function(msg) {
            var targets = this.targets,
                i = 0,
                target;
            for (; target = targets[i]; i += 1) {
                target.postMessage(prefix + msg, '*');
            }
        };
    } else {
        // 兼容IE 6/7
        send = function(msg) {
            var targets = this.targets,
                i = 0,
                target;
            for (; target = targets[i]; i += 1) {
                var targetFunc = target.navigator[prefix + this.name];
                if (typeof targetFunc == 'function') {
                    targetFunc(prefix + msg, window);
                } else {
                    throw new Error("target callback function is not defined");
                }
            }
        };
    }
    Target.prototype = {
        send: send,
        add: function(new_target) {
            var targets = this.targets,
                i = 0,
                target;
            if (!_isWindow(new_target)) {
                throw new Error('target error - target itself must be window object');
            }
            for (; target = targets[i]; i += 1) {
                if (new_target === target) {
                    return;
                }
            }
            targets.push(new_target)
        }
    }

    // 信使类

    function Messenger(name) {
        var self = this;
        self.targets = [];
        self.targets._ = {}; //save by target name
        self.name = name;
        self.lH = []; //listen handle function
        _init(self);
    }

    // initListen
    // 初始化消息监听

    function _init(self) {
        var generalCallback = function(msg) {
            if (typeof msg == 'object' && msg.data) {
                msg = msg.data;
            }
            // 剥离消息前缀
            msg = msg.slice(prefix.length);
            for (var i = 0,listenHandle; listenHandle=self.lH[i]; i+=1) { //listenHandle
                listenHandle(msg); //listenHandle
            }
        };

        if (supportPostMessage) {
            if ('attachEvent' in document) {
                window.attachEvent('onmessage', generalCallback);
            } else {
                window.addEventListener('message', generalCallback, false);
            }

        } else {
            // 兼容IE 6/7
            window.navigator[prefix + self.name] = generalCallback;
        }
    }
    Messenger.prototype = {
        // add Target
        // 添加一个消息对象
        add: function(target, target_name) {
            var self = this,
                targets = self.targets,
                targetObj;
            if (!(targetObj = targets._[target_name])) {
                targets.push(targetObj = targets._[target_name] = new Target(target, target_name))
            }
            targetObj.add(target)
            return targetObj;
        },
        // 监听消息
        listen: function(callback) {
            this.lH.push(callback); //listenHandle
        },
        // 广播消息
        send: function(msg) {
            var targets = this.targets,
                targetObj,
                i = 0;
            for (; targetObj = targets[i]; i += 1) {
                targetObj.send(msg);
            }
        }
    }

    return Messenger;
})();