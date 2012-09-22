$(function() {
	var elapsedTime = 0;
	var targetTime = 0;
	var timer = null;
	
	var perSec = function() {
		if(elapsedTime >= targetTime) {
			$('#start_page #timer').addClass('over');
		}
		$('#start_page #hour').html(Math.floor(elapsedTime / 3600));
		$('#start_page #min').html(Math.floor(elapsedTime % 3600 / 60));
		$('#start_page #sec').html(Math.floor(elapsedTime % 60));
		elapsedTime++;
	};
	
	$('#input_page #start').click(function() {
		
		// タスク名をセット
		$('#start_page #task').html($('#input_page #task').val());
		
		// 目標時間をセット
		var targetHour = $('#input_page #hour :selected').val();
		var targetMin = $('#input_page #min :selected').val();
		$('#start_page #target_hour').html(targetHour);
		$('#start_page #target_min').html(targetMin);
		$('#start_page #target_sec').html(0);
		targetTime = targetHour * 3600 + targetMin * 60;
		
		// 経過時間をリセット
		elapsedTime = 0;
		$('#start_page #hour').html(0);
		$('#start_page #min').html(0);
		$('#start_page #sec').html(0);
		clearInterval(timer);
		timer = setInterval(perSec, 1000);
		
		// 一時停止ボタン
		$('#stop').bind('change', function(event, ui) {
			if($('#stop :selected').val() == 'active') {
				timer = setInterval(perSec, 1000);
				$('#timer').removeClass('stopped');
			} else {
				clearInterval(timer);
				$('#timer').addClass('stopped');
			}
		});
	});
	
	// アプリにアクセスしたら入力画面へ飛ばす
	$.mobile.changePage($('#input_page'));
});