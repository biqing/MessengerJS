//
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
 * @version 2.0
 * @license release under MIT license
 */

window.Messenger = (function() {

    // !注意 消息前缀应使用字符串类型
    var supportPostMessage = 'postMessage' in window;

    // Target 类, 消息对象
    function Target(target, name, projectName) {
        var errMsg = '';
        if (arguments.length < 2) {
            errMsg = 'target error - target and name are both requied';
        } else if (typeof target != 'object') {
            errMsg = 'target error - target itself must be window object';
        } else if (typeof name != 'string') {
            errMsg = 'target error - target name must be string type';
        }
        if (errMsg) {
            throw new Error(errMsg);
        }
        this.target = target;
        this.name = name;
        this.projectName = projectName;
    }

    // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
    if (supportPostMessage) {
        // IE8+ 以及现代浏览器支持
        Target.prototype.send = function(msg) {
            this.target.postMessage(this.projectName + msg, '*');
        };
    } else {
        // 兼容IE 6/7
        Target.prototype.send = function(msg) {
            var targetFunc = window.navigator[this.projectName + this.name];
            if (typeof targetFunc == 'function') {
                targetFunc(this.projectName + msg, window);
            } else {
                throw new Error("target callback function is not defined");
            }
        };
    }

    // 信使类
    // 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
    // !注意: 父子页面中projectName必须保持一致, 否则无法匹配
    function Messenger(messengerName, projectName) {
        this.targets = {};
        this.name = messengerName;
        this.listenFunc = [];
        this.projectName = String(projectName);
        this.initListen();
    }

    // 添加一个消息对象
    Messenger.prototype.addTarget = function(target, name) {
        var targetObj = new Target(target, name, this.projectName);
        this.targets[name] = targetObj;
    };

    // 初始化消息监听
    Messenger.prototype.initListen = function() {
        var self = this;
        var projectName = self.projectName;
        var generalCallback = function(msg) {
            if (typeof msg == 'object' && msg.data) {
                msg = msg.data;
            }
            if (typeof msg !== "string") {
                return;
            }
            if (msg.slice(0, projectName.length) !== projectName) {
                return;
            }
            // 剥离消息前缀
            msg = msg.slice(projectName.length);
            for (var i = 0; i < self.listenFunc.length; i++) {
                self.listenFunc[i](msg);
            }
        };

        if (supportPostMessage) {
            if ('addEventListener' in document) {
                window.addEventListener('message', generalCallback, false);
            } else if ('attachEvent' in document) {
                window.attachEvent('onmessage', generalCallback);
            }
        } else {
            // 兼容IE 6/7
            window.navigator[projectName + this.name] = generalCallback;
        }
    };

    // 监听消息
    Messenger.prototype.listen = function(callback) {
        this.listenFunc.push(callback);
    };
    // 注销监听
    Messenger.prototype.clear = function() {
        this.listenFunc = [];
    };
    // 广播消息
    Messenger.prototype.send = function(msg) {
        var targets = this.targets,
            target;
        for (target in targets) {
            if (targets.hasOwnProperty(target)) {
                targets[target].send(msg);
            }
        }
    };

    return Messenger;
})();
