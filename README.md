# MessengerJS #

## 跨文档通信解决方案 ##
Since modern browsers have native cross-document communication method(the PostMeessage API, and the "message" event), this project is primarily for the developers who still need to care about the compatiblity in IE6/7, especially the developers in China, I will use Chinese in this document. If you guys wanna learn some more, please leave an [issue](https://github.com/biqing/MessengerJS/issues/new), and I will provide the english version of help.

简单地说, 如果你不用兼容IE6/7的iframe通信, 你就不需要这套方案了..

## 适用场景 ##
此方案适用于以下跨域情形:

- 父窗口与iframe之间通信
- 多个iframe之间通信

*上述所有情况, 都需确保对不同域的页面有修改权限, 并同时加载MessengerJS

*IE下不支持跨窗口通信

常见跨源问题有:

- 跨子域
- 跨全域
- 跨协议(HTTP与HTTPS)

## 理念: 关于"信使"的一切 ##
理解设计理念对实际使用有帮助作用, 高手可以直接跳到下方使用说明 : )

在跨文档通信中, 一切消息都是以字符串形式存在, 可以视其为"报文", 因此负责派送和接受信件的角色, 我们称其为"信使"(**Messenger**).

**Messenger**的职责很简单, 主要分为 **发送消息**(`send`) 与 **监听消息**(`listen`), 而消息的内容都是字符串. 实际使用中, 最好不要直接使用简单的字符串, 而建议使用结构化的消息(JSON String). 具体逻辑请自行实现: 发送前将json内容stringify, 收到后进行parse, 以实现消息内容的扩展性.


## 如何使用 ##
1. 在需要通信的文档中(父窗口和iframe们), 都确保引入MessengerJS

2. 每一个文档(`document`)，都需要自己的`Messenger`与其他文档通信。即每一个`window`对象都对应着一个，且仅有一个`Messenger`对象，该`Messenger`对象会负责当前`window`的所有通信任务。每个`Messenger`对象都需要**唯一的名字**，这样它们才可以知道跟谁通信。另外，推荐指定**项目名称**（类似命名空间的作用），以增强代码健壮性与组件复用性，避免未来与其他项目冲突。(注意: 项目名称应使用 **字符串类型** )

		// 父窗口中 - 初始化Messenger对象
		// 推荐指定项目名称, 避免Mashup类应用中, 多个开发商之间的冲突
		var messenger = new Messenger('Parent', 'projectName');

		// iframe中 - 初始化Messenger对象
		// 注意! Messenger之间必须保持项目名称一致, 否则无法匹配通信
		var messenger = new Messenger('iframe1', 'projectName');

		// 多个iframe, 使用不同的名字
		var messenger = new Messenger('iframe2', 'projectName');

3. 在发送消息前，确保目标文档已经**监听**了**消息**事件。

		// iframe中 - 监听消息
		// 回调函数按照监听的顺序执行
		messenger.listen(function(msg){
			alert("收到消息: " + msg);
		});

4. 父窗口想给iframe发消息，它怎么知道iframe的存在呢？添加一个消息对象吧。

		// 父窗口中 - 添加消息对象, 明确告诉父窗口iframe的window引用与名字
		messenger.addTarget(iframe1.contentWindow, 'iframe1');

		// 父窗口中 - 可以添加多个消息对象
		messenger.addTarget(iframe2.contentWindow, 'iframe2');

5. 一切ready，发消息吧~发送消息有两种方式。 (以父窗口向iframe发消息为例)

		// 父窗口中 - 向单个iframe发消息
		messenger.targets['iframe1'].send(msg1);
		messenger.targets['iframe2'].send(msg2);

		// 父窗口中 - 向所有目标iframe广播消息
		messenger.send(msg);

6. 现在看到iframe收到消息的alert提示了吗?
		
## Demo ##
<a href="http://biqing.github.io/labs/messenger/parent.html">http://biqing.github.io/labs/messenger/parent.html</a>

## 关于消息安全性 ##
由于任何iframe都可以收到广播的消息，建议传递消息时使用JSON String的形式，使用一个字段做消息有效性的验证。如果怕一个固定值（如项目名）不安全，可以使用一个简单的加密算法，并对业务脚本进行压缩混淆，此时的安全风险可以降到最低。

## 问题与建议 ##
使用中难免遇到问题，欢迎提问与建议 : )

[提交Issue](https://github.com/biqing/MessengerJS/issues/new)