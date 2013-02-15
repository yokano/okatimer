$(function() {
	var elapsedTime = 0;
	var targetTime = 0;
	var timer = null;
	var startTime = null;
	var lang = 'ja';
	
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
			alert(term[lang].input_target_time);
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
		gauge_green.css('background-color', 'blue');
	});
	
	// 一時停止ボタン
	$('#stop').bind('change', function(event, ui) {
		if($('#stop :selected').val() == 'active') {
			$('#timer').removeClass('stopped');
		} else {
			$('#timer').addClass('stopped');
		}
	});

	// 言語変更	l = 'ja' or 'en'
	var term = {
		en: {
			task: 'Task',
			target_time: 'Target time',
			hour: 'hour',
			min: 'min',
			second: 'sec',
			start: 'Start',
			target: 'Target',
			active: 'Run',
			inactive: 'Stop',
			input_target_time: 'Please choose the target time.',
			back: 'Back'
		},
		
		ja: {
			task: 'やること',
			target_time: '目標時間',
			hour: '時間',
			min: '分',
			second: '秒',
			start: 'スタート',
			target: '目標',
			active: '実行中',
			inactive: '停止中',
			input_target_time: '目標時間を設定してください',
			back: '戻る'
		}
	};
	var updateLanguage = function(l) {
		lang = l;
		$('#input_page #task_label').html(term[lang].task);
		$('#input_page #target_time_label').html(term[lang].target_time);
		$('#input_page #hour option').each(function() {
			$(this).html($(this).val() + ' ' + term[lang].hour);
		});
		$('#input_page #hour').selectmenu('refresh');
		$('#input_page #min option').each(function() {
			$(this).html($(this).val() + ' ' + term[lang].min);
		});
		$('#input_page #min').selectmenu('refresh');
		$('#input_page #start .ui-btn-text').html(term[lang].start);
		$('#start_page #back_button .ui-btn-text').html(term[lang].back);
		$('#start_page .hour_label').html(term[lang].hour);
		$('#start_page .min_label').html(term[lang].min);
		$('#start_page .sec_label').html(term[lang].second);
		$('#start_page #target_label').html(term[lang].target_time + ': ');
		$('#start_page .ui-slider-label-b').html(term[lang].active);
		$('#start_page .ui-slider-label-a').html(term[lang].inactive);
	};
	$('.lang_button').click(function() {
		var l = $(this).attr('id');
		updateLanguage(l);
		$('.lang_button').attr('data-theme', 'a');
		$(this).attr('data-theme', 'b')
	});
	
	// 以下 初期化
	// アプリにアクセスしたら入力画面へ飛ばす
	$.mobile.changePage($('#input_page'));
	$('#stop').slider();
});