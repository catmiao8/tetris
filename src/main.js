import $ from 'jquery'
import './css/index.css'
// import './css/index.less'
// import './css/index.scss'
// import 'bootstrap/dist/css/bootstrap.css'

// $(function(){
//     $("li:odd").css('backgroundColor','lightblue');
//     $("li:even").css('background', '#ffaabb');
// })
$(function(){
    var maps = [
        [0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    //七种方块
    var block = [[4,-1,4,0,5,0,6,0],[4,0,5,0,6,0,6,-1],[4,-1,5,-1,5,0,6,0],[4,0,5,-1,5,0,6,-1],
               [5,-1,4,0,5,0,6,0],[4,0,5,0,6,0,7,0],[5,-1,6,-1,5,0,6,0]];
    //画板
    var c1 = document.getElementById('canvas');
    var ctx = c1.getContext('2d');
    //预览画板
    var c2 = document.getElementById('canvas1');
    var ctx2 = c2.getContext('2d');
    //游戏按钮
    var startBtn = document.getElementById('start');
    var suspendBtn = document.getElementById('suspend');
    var restartBtn = document.getElementById('restart');
    //定时器，方块下降的快慢
    var timer;
    var refreshTime = 600;
    //存储当前方块和下一个方块
    var nowBlock;
    var next;
    var nextBlock;

    //初始化边框
    ctx.save();
    ctx.lineWidth=4;
    ctx.strokeStyle='hsla(0, 100%, 0%, .3)';
    ctx.moveTo(12*28, 0);
    ctx.lineTo(12*28, 20*28);
    ctx.stroke();
    ctx.restore();

    //画板初始化
    boardInit();

    //当点击开始按钮开始定时刷新页面，视觉上感觉方块在向下降落
    startBtn.onclick = function (){
        showBlock();
        repaint();
        timer = setInterval(bolckMoveDown, refreshTime);
        startBtn.disabled = true;
        suspendBtn.disabled = false;
        document.addEventListener('keydown', keydownEvent, false);
    };

    //当点击暂停按钮时页面停止刷新，视觉上游戏暂停了
    suspendBtn.onclick = function (){
        if (startBtn.disabled == true);
            clearInterval(timer);
        suspendBtn.disabled = true;
        startBtn.disabled = false;
        document.removeEventListener('keydown', keydownEvent, false);
    };

    //当点击重新开始按钮时页面重新加载，重新开始游戏
    restartBtn.onclick = function (){
        clearInterval(timer);
        ctx2.clearRect(0, 0, c2.width, c2.height);
        boardInit();
        $('#score').text('0');
        startBtn.disabled = false;
        suspendBtn.disabled = false;
        $('#gameOver').css("bottom", "-200px");
    };

    //绘制页面
    function repaint(){
        ctx.clearRect(0, 0, c1.width, c1.height);
        for (let i = 0; i < 20; i++){
            for(let j = 0; j < 12; j++){
                ctx.fillRect(j*28, i*28, 28, 28);
                ctx.strokeRect(j*28, i*28, 28, 28);
                if(maps[i][j] == 1){//方格已经有填充内容
                    ctx.save();
                    ctx.lineWidth=4;
                    ctx.fillStyle='hsla(200,100%,50%,.5)';
                    ctx.strokeStyle='hsla(200,100%,50%,.9)';
                    ctx.fillRect(j*28, i*28, 28, 28);
                    ctx.strokeRect(j*28+2, i*28+2, 26, 26);
                    ctx.restore();
                }
            }
        }
        ctx.save();
        ctx.lineWidth=4;
        ctx.fillStyle='hsla(200,100%,50%,.5)';
        ctx.strokeStyle='hsla(200,100%,50%,.9)';

        for (let i = 0; i < 8; i+=2){
            let x = nowBlock[i];
            let y = nowBlock[i+1];
            ctx.fillRect(x*28, y*28, 28, 28);
            ctx.strokeRect(x*28+2, y*28+2, 26, 26);
        }
        ctx.restore();
    }

    //方块向下移动
    function bolckMoveDown(){
        //flag=0表示方块不可移动，flag=1表示方块可以移动
        let flag = judgeBar(nowBlock, 0, 1);
        //方块可移动，改变方块位置
        if(flag == 1){
            for (let i = 0; i < 8; i+=2){
                nowBlock[i] = nowBlock[i];
                nowBlock[i+1] = nowBlock[i+1] + 1;
            }
        }else{//方块不可移动
            //判断方块是否到顶了，到顶游戏结束
            for (let i = 0; i < 8; i+=2){
                if (nowBlock[i+1] == 0){
                    clearInterval(timer);
                    $('#gameOver').animate({bottom: '250px'}, 2000);
                    startBtn.disabled = true;
                    suspendBtn.disabled = true;
                    return 0;
                }
            }
            //方块没到顶
            for (let i = 0; i < 8; i+=2){
                let x = nowBlock[i];
                let y = nowBlock[i+1];
                maps[y][x] = 1;
            }
            eliminateBlock();
            nowBlock = nextBlock;
            next = randomBlock();
            nextBlock = block[next].slice(0);
            showBlock();
        }
        repaint();
    }

    //方块左右移动
    function bolckMoveLR(offsetX){
        //flag=0表示方块不可移动，flag=1表示方块可以移动
        let flag = judgeBar(nowBlock, offsetX, 0)
        //方块可移动，改变方块位置
        if(flag == 1){
            for (let i = 0; i < 8; i+=2){
                nowBlock[i] = nowBlock[i] + offsetX;
                nowBlock[i+1] = nowBlock[i+1];
            }
        }
    }

    //旋转方块
    function rotateBlock(){
        let nowRotateBlock = nowBlock.slice(0);
        let c = 4;
        let x = nowRotateBlock[c];
        let y = nowRotateBlock[c+1];
        let cos = Math.cos(Math.PI/2);
        let sin = Math.sin(Math.PI/2);
        for (let i = 0; i < 8; i+=2){
            if(i == c){
                continue;	
            }
            let mx = nowRotateBlock[i]- x;
            let my = nowRotateBlock[i+1] - y;
            let	nx = mx*cos - my*sin;
            let ny = my*cos + mx*sin;
            nowRotateBlock[i] = x + nx;	
            nowRotateBlock[i+1] = y + ny;
        }
        if (judgeBar(nowRotateBlock, 0, 0) == 1){
            nowBlock = nowRotateBlock;
        }
    }

    //判断方块在移动过程中是否有障碍
    function judgeBar(nBlock, offsetX, offsetY){
        for (let i = 0; i < 8; i++){
            nBlock[i] = Math.ceil(nBlock[i]);
        }
        for (let i = 0; i < 8; i+=2){
            let x = nBlock[i] + offsetX;
            let y = nBlock[i+1] + offsetY;
            if (y >= 0){
                if (x < 0 || x >= 12 || y >= 20 || maps[y][x] == 1){
                    return 0;
                }
            }
        }  
        return 1;
    }

    //随机生成方块形状
    function randomBlock(){
        return Math.floor(Math.random() * 7);
    }
    
    //监听按下键盘事件
    function keydownEvent(e){
        var key = e.key;
        if (key == 'ArrowUp'){//按下上键
            rotateBlock();
            repaint();
        }else if (key == 'ArrowLeft'){//按下左键
            bolckMoveLR(-1);
            repaint();
        }else if (key == 'ArrowRight'){//按下右键
            bolckMoveLR(1);
            repaint();
        }else if(key == 'ArrowDown'){//按下下键
            bolckMoveDown();
            repaint();
        }else if(key == ' '){//按下空格键
            while(true){
                let flag = judgeBar(nowBlock, 0, 1);
                //方块可移动，改变方块位置
                if(flag == 1){
                    for (let i = 0; i < 8; i+=2){
                        nowBlock[i] = nowBlock[i];
                        nowBlock[i+1] = nowBlock[i+1] + 1;
                    }
                }else{
                    break;
                }
            }
            repaint();
        }
    }

    //消除满行的方块
    function eliminateBlock(){
        //满行的行数,
        let arr = judgeLineCount();
        let count = arr[0];
        let lineCountArr = arr[1];
        //消除该满行行数
        if (count != 0){
            for (let i = 0; i < count; i++){
                maps[lineCountArr[i]] = [0,0,0,0,0,0,0,0,0,0,0,0];
                //消除行后下降上面的
                for (let j = lineCountArr[i]-1; j >= 0; j--){
                    for (let k = 0; k < 12; k++){
                        if (maps[j][k] == 1){
                            maps[j+1][k] = 1;
                            maps[j][k] = 0;
                        }
                    }
                }
                for (let j = i; j < count; j++){
                    lineCountArr[j] = lineCountArr[j] + 1;
                }
            }
            setScore(count);
        }
    }

    //设置分数
    function setScore(count){
        let score = parseInt($('#score').text());
        if (count == 1){
            score += 5;
        }else if (count == 2){
            score += 13;
        }else if (count == 3){
            score += 20;
        }else{
            score += 30;
        }
        $('#score').text(score.toString());
    }

    //判断哪些行是可以被消除的
    function judgeLineCount(){
        let lineCount = 0;
        let lineArr = [];
        for (let i = 19; i >= 0; i--){
            let number = 0;
            for (let j = 0; j < 12; j++){
                if (maps[i][j] == 1){
                    number++;
                }else{
                    break;
                }
            }
            if (number == 12){
                lineArr[lineCount] = i;
                lineCount++;
            }
        }
        return [lineCount, lineArr];
    }

    //在预览区显示方块
    function showBlock() {
        ctx2.clearRect(0, 0, c2.width, c2.height);
        ctx2.fillStyle='hsla(200, 100%, 50%, .5)';
        ctx2.strokeStyle='hsla(200, 100%, 50%, .9)';
        ctx2.lineWidth=4;
        for(let i = 0; i < 8; i+=2){
            let x = block[next][i] - 4;
            let y = block[next][i+1] + 2;
			ctx2.fillRect(x*28, y*28, 28, 28);
			ctx2.strokeRect(x*28+2, y*28+2, 26, 26);
        }
    }

    //初始化画板
    function boardInit(){
        ctx.clearRect(0, 0, c1.width, c1.height);
        nowBlock = block[randomBlock()].slice(0);
        next = randomBlock();
        nextBlock = block[next].slice(0);
        for (let i = 0; i < 20; i++){
            for(let j = 0; j < 12; j++){
                maps[i][j] = 0;
            }
        }
        ctx.fillStyle='hsla(0, 100%, 0%, .1)';
		ctx.strokeStyle='hsla(0, 100%, 0%, .1)';
        for(let i = 0; i < 20; i++){
            for(let j = 0; j < 12; j++){
                ctx.fillRect(j*28, i*28, 28, 28);
                ctx.strokeRect(j*28, i*28, 28, 28);
            }
        }
    }
})

