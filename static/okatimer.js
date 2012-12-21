$(function() {
	var elapsedTime = 0;
	var targetTime = 0;
	var timer = null;
	var startTime = null;
	
	var now = function() {
		return Math.floor((new Date()).getTime() / 1000);
	};
	
	// 目標時間を超えた時の処理　呼び出し１回目だけ実行される
	var timeOver = function() {
		var isOver = false;
		var over = function() {
			if(!isOver) {
				$('#start_page #timer').addClass('over');
				var se = $('#over_se').get(0);
				se.play();
				gauge_green.css('background-color', 'red');
				isOver = true;
			}
		};
		return over;
	}();
	
	var gauge_green = $('#gauge_green');
	var perSec = function() {
		elapsedTime = now() - startTime;
		if($('#stop :selected').val() == 'inactive') {
			startTime++;
		} else {
			// 目標時間オーバー
			if(elapsedTime > targetTime) {
				timeOver();
			} else {
				// ゲージをすすめる
				gauge_green.css('width', (elapsedTime / targetTime) * 300);
			}
			$('#start_page #hour').html(Math.floor(elapsedTime / 3600));
			$('#start_page #min').html(Math.floor(elapsedTime % 3600 / 60));
			$('#start_page #sec').html(Math.floor(elapsedTime % 60));
		}
	};
	
	$('#input_page #start').click(function() {
		// 0時間0分の場合は実行しない
		var targetHour = $('#input_page #hour :selected').val();
		var targetMin = $('#input_page #min :selected').val();
		if(targetHour == 0 && targetMin == 0) {
			alert('目標時間を設定してください');
			return false;
		}
		
		// タスク名をセット
		$('#start_page #task').html($('#input_page #task').val());
		
		// 目標時間をセット
		$('#start_page #target_hour').html(targetHour);
		$('#start_page #target_min').html(targetMin);
		$('#start_page #target_sec').html(0);
		targetTime = targetHour * 3600 + targetMin * 60;
		
		// 経過時間をリセット
		startTime = now();
		$('#start_page #hour').html(0);
		$('#start_page #min').html(0);
		$('#start_page #sec').html(0);
		clearInterval(timer);
		timer = setInterval(perSec, 1000);
		$('#stop').val('active').slider('refresh');
		$('#timer').removeClass('stopped').removeClass('over');
	});
	
	// 一時停止ボタン
	$('#stop').bind('change', function(event, ui) {
		if($('#stop :selected').val() == 'active') {
			$('#timer').removeClass('stopped');
		} else {
			$('#timer').addClass('stopped');
		}
	});
	
	// 以下 初期化
	// アプリにアクセスしたら入力画面へ飛ばす
	$.mobile.changePage($('#input_page'));
	$('#stop').slider();
});