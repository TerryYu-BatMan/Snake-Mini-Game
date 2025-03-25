var ctx = document.getElementById("cas").getContext('2d');
var log = console.log;
const startId = document.getElementById('start');
const overId = document.getElementById('end');
const pauseId = document.getElementById('pause');
var scoreList = document.querySelector('.scoreList');
var scoreText = document.querySelector('.score');
var scoreMaxText = document.querySelector('.max-score');
const bgm = document.getElementById('bgm');

window.onload = () => {
	var snake = [
		[3, 3],
		[2, 3],
		[1, 3]
	];

	var food = [10, 10];
	var direction = [1, 0];

	let scores = JSON.parse(localStorage.getItem('scores')) || [];
	var maxScore = 0;
	var timeId;
	// for(var i = -15; i < 400;) {
	// 搭建格子地图
	//     i += 15;
	//     for(var j = -15; j < 400;) {
	//         j += 15;
	//         ctx.strokeStyle = 'blue';
	//         ctx.lineWidth = 1;
	//         ctx.strokeRect(i, j, 15, 15);
	//     }
	// }
	startId.onclick = () => {
		gameStart();
	}

	function gameStart() {
		snake = [
			[3, 3],
			[2, 3],
			[1, 3]
		];

		food = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]
		direction = [1, 0];

		score = 0;
		clearInterval(timeId);
		scoreText.innerText = score;
		startId.style.display = 'none';
		timeId = setInterval(() => {
			render();
		}, 200);
	}

	window.onkeydown = (e) => {
		switch (e.key) {
			case 'd':
				if (direction[0] !== -1) {
					direction = [1, 0];
				}
				break;
			case 'a':
				if (direction[0] !== 1) {
					direction = [-1, 0];
				}
				break;
			case 'w':
				if (direction[1] !== 1) {
					direction = [0, -1];
				}
				break;
			case 's':
				if (direction[1] !== -1) {
					direction = [0, 1];
				}
				break;
			case ' ':
				clearInterval(timeId);
				bgm.pause();
				pauseId.style.display = 'block';
				overId.style.display = 'none';
				startId.style.display = 'none';
				setPause()
		}
	};
	// 暂停
	function setPause() {
		pauseId.onclick = () => {
			pauseId.style.display = 'none';
			timeId = setInterval(() => {
				render();
			}, 200);
		}
	}
	function reStart() {
		overId.onclick = () => {
			overId.style.display = 'none';
			startId.style.display = 'block';
			pauseId.style.display = 'none';
			startId.onclick = () => {
				startId.style.display = 'none';
				gameStart();
			}
		}
	}

	function render() {
		bgm.play();
		let length = snake.length;
		for (var i = 0; i < length - 1; i++) {
			snake[i][0] = snake[i + 1][0];
			snake[i][1] = snake[i + 1][1];
		}
		var newHeadX = snake[length - 1][0] + direction[0];
		var newHeadY = snake[length - 1][1] + direction[1];

		ctx.clearRect(0, 0, 400, 400);
		
		snake[length - 1][0] = newHeadX;
		snake[length - 1][1] = newHeadY;
		// 获取分数并计算最大值??
		maxScore = Math.max(...scores);
		scoreMaxText.innerText = maxScore;
		if (newHeadX < 0 || newHeadX > 19 || newHeadY < 0 || newHeadY > 19) {
			// 边界检测
			log("出界了，游戏结束!");
			overId.style.display = 'block';
			bgm.pause();
			clearInterval(timeId);
			reStart(newHeadY);
			return false;
		}
		for (var i = 0; i < length - 1; i++) {
			if (snake[i][0] === newHeadX && snake[i][1] === newHeadY && length > 3) {
				// 碰撞到自己，游戏结束 
				log("撞到自己了，游戏结束!");
				overId.style.display = 'block';
				bgm.pause();
				clearInterval(timeId);
				reStart();
				return false;
			}
		}

		if (newHeadX === food[0] && newHeadY === food[1]) {
			// 吃到食物，增加长��?
			snake.unshift([newHeadX - direction[0], newHeadY - direction[1]]);
			food = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]
			score++;
			storeScore(score) // 存入评分
			// $.ajax({
			//     url: '/data',
			//     type: 'POST',
			//     data: { score: score },
			//     success: function (response) {
			//         console.log(response);
			//     },
			//     // error: function (xhr, status, error) {
			//     //     console.error(error);
			//     // }
			// });
		}
		scoreText.innerText = score;
		for (var i = 0; i < length; i++) {
			draw(snake[i][0], snake[i][1], 'yellow');
			draw(snake[length - 1][0], snake[length - 1][1], 'darkgreen');
		}
		draw(food[0], food[1], 'red');
	}
	// 存储分数��? localStorage
	function storeScore(score) {
		scores.push(score);
		localStorage.setItem('scores', JSON.stringify(scores));
	}

	function draw(x, y, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x * 20 - 1, y * 20 - 1, 15, 15);
	}
};