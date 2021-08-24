(function() {

	var msgIndex, key;
	//インスタンスの作成
	var botui = new BotUI('chat-app');

	//ボット側のチャット処理
	botui.message.bot({

		//メッセージを表示する
		content: 'こんにちは、ボットです!'
	}).then(function() {

		//ユーザー側のチャット処理
		botui.message.human({
		
			content: 'こんにちは、ユーザーです!'
		});
	}).then(init);
	
	function init() {
		botui.message.bot({
			delay: 1500, //メッセージの表示タイミングをずらす
			content: '何か言ってみてください'
		}).then(function() {
			
			//キーワードの入力
			//「return」を記述して、ユーザーからの入力待ち状態にする
			return botui.action.text({
				delay: 1000,
				action: {
					placeholder: '例:javascript'
				}
			});
		}).then(function(res) {
			
			//入力されたキーワードを取得する
			key = res.value;
			
			//ローディング中のアイコンを表示
			botui.message.bot({
				loading: true
			}).then(function(index) {
				
				//ローディングアイコンのindexを取得
				//このindexを使ってメッセージ情報を更新する
				// (更新しないとローディングアイコンが消えないため...)
				msgIndex = index;
				showMessage();
			});
		});
	}
	
	//ボットがユーザーのメッセージをオウム返しする
	function showMessage() {
		
		//ローディングアイコンのindexを使ってメッセージを書き換える
		botui.message.update(msgIndex, {
			content: 'あなたは' + key + 'と言いましたね'
		}).then(function() {
			return botui.message.bot({
				delay: 1500,
				content: 'まだ続けますか?'
			})
		}).then(function() {
			
			//「はい」「いいえ」のボタンを表示
			return botui.action.button({
				delay: 1000,
				action: [{
					icon: 'circle-thin',
					text: 'はい',
					value: true
				}, {
					icon: 'clese',
					text: 'いいえ',
					value: false
				}]
			});
		}).then(function(res) {
		
			//「続ける」か「終了」するかの条件分岐処理
			res.value ? init() : end();
		});
	}
	
	//プログラムを終了する処理
	function end() {
		botui.message.bot({
			content: 'ご利用ありがとうございました!'
		})
	}
})();