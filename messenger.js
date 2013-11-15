/**
 * messenger 负责跨域文档通信
 * @author johnnyguo
 */

QC.module('Messenger', function(_qc){

    var prefix = "__QC__",
        supportPostMessage = 'postMessage' in window;

    // target 类, 消息对象
    function Target(target, name){
        this.target = target;
        this.name = name || target.toString();
    }

    // 往 target 发送消息
    if ( supportPostMessage ){
        // IE8+ 以及现代浏览器支持
        Target.prototype.postMessage = function(msg){
            this.target.postMessage(msg, '*');
        }
    } else {
        // 兼容IE 6/7
        var targetFunc = window.navigator[prefix + this.name];
        Target.prototype.postMessage = function(msg){
            if ( typeof targetFunc == 'function' ) {
                targetFunc(msg, window);
            }
        }
    }
   
    // 信使类
    function Messenger(name){
        this.targets = {};
        this.name = name;
    }

    // 添加一个消息对象
    Messenger.prototype.addTarget = function(target, name){
        var targetObj = new Target(target, name);
        this.targets[targetObj.name] = targetObj;
    }

    // 监听消息
    Messenger.prototype.listenMessage = function(callback){
        if ( supportPostMessage ){
            if ( 'addEventListener' in document ) {
                window.addEventListener('message', callback, false);
            } else if ( 'attachEvent' in document ) {
                window.attachEvent('onmessage', callback);
            }
        } else {
            // 兼容IE 6/7
            window.navigator[prefix + this.name] = callback;
        }
    }

    return Messenger;
});
