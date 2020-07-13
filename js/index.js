//**面向对象编程**
function Mine(tr, td, minenum) {
    this.tr = tr;
    this.td = td;
    this.minenum = minenum;

    this.squre = [];
    this.surplusMine = minenum;
    this.tds = [];
    this.parent = document.getElementsByClassName('mineBox')[0];
    this.allright = true;
}

//**随机生成n个不重复的数**
Mine.prototype.randomNum = function () {
    var squre = new Array(this.tr * this.td);
    for (var i = 0; i < squre.length; i++) {
        squre[i] = i;
    }
    squre.sort(function () {
        return 0.5 - Math.random();
    });
    return squre.slice(0, this.minenum);
}

//**游戏初始化**
Mine.prototype.init = function () {
    var rn = mine.randomNum();
    var n = 0;
    for (var i = 0; i < this.tr; i++) {
        this.squre[i] = [];
        for (var j = 0; j < this.td; j++) {
            if (rn.indexOf(++n) != -1) {
                this.squre[i][j] = { x: j, y: i, type: 'mine' };
            } else {
                this.squre[i][j] = { x: j, y: i, type: 'number', value: 0 };
            }
        }
    }
    mine.updataNum();
    mine.createDom();
    this.parent.oncontextmenu = function () {
        return false;
    }
   this.mineNum = document.getElementsByClassName('mineNum')[0];
   this.mineNum.innerHTML = this.surplusMine;
}

//**创建表格,改变this**
Mine.prototype.createDom = function () {
    var table = document.createElement('table');
    var This = this;
    for (var i = 0; i < this.tr; i++) {
        var domTr = document.createElement('tr');
        this.tds[i] = [];
        for (var j = 0; j < this.td; j++) {
            var domTd = document.createElement('td');
            domTd.pos = [i, j];	//把格子对应的行与列存到格子身上，为了下面通过这个值去数组里取到对应的数据
            domTd.onmousedown = function () {
                This.play(event, this);	//This指的实例对象，this指的点击的那个td
            };
            this.tds[i][j] = domTd;
            domTr.appendChild(domTd);
        }
        table.appendChild(domTr);
    }
    this.parent.innerHTML = '';
    this.parent.appendChild(table);
}

//**找某个方格周围的8个方格**
Mine.prototype.getAround = function (squre) {
    var x = squre.x;
    var y = squre.y;
    var result = [];
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (
                i < 0 ||
                j < 0 ||
                i > this.tr - 1 ||
                j > this.td - 1 ||
                (i == x && j == y) ||
                this.squre[j][i].type == 'mine') {
                continue;
            }
            result.push([j, i]);
        }
    }
    return result;
}

//**更新所有的数字**
Mine.prototype.updataNum = function () {
    for (var i = 0; i < this.tr; i++) {
        for (var j = 0; j < this.td; j++) {
            if (this.squre[i][j].type == 'number') {
                continue;
            }
            var num = this.getAround(this.squre[i][j]);
            for (var k = 0; k < num.length; k++) {
                this.squre[num[k][0]][num[k][1]].value += 1;
            }
        }
    }
}

//**开始游戏**
Mine.prototype.play = function (ev, obj) {
    var This = this;
    if (ev.which == 1) {
        var curSquare = this.squre[obj.pos[0]][obj.pos[1]];
        var cl = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eigth'];
        if (curSquare.type == 'number') {
            obj.innerHTML = curSquare.value;
            obj.className = cl[curSquare.value];
            if (curSquare.value == 0) {
                obj.innerHTML = '';
                function getAllZero(squre) {
                    var around = This.getAround(squre);
                    for (var i = 0; i < around.length; i++) {
                        var x = around[i][0];
                        var y = around[i][1];
                        This.tds[x][y].className = cl[This.squre[x][y].value];
                        if (This.squre[x][y].value == 0) {
                            if (!This.tds[x][y].check) {
                                This.tds[x][y].check = true;
                                getAllZero(This.squre[x][y]);
                            }
                        } else {
                            This.tds[x][y].innerHTML = This.squre[x][y].value;
                        }
                    }
                }
                getAllZero(curSquare);
            }
        }else{
            this.gameOver(obj);
            alert('别灰心，再接再厉');
        }
    }
    if (ev.which == 3) {

        if(obj.className && obj.className!='flag'){
			return;
        }
        if(this.squre[obj.pos[0]][obj.pos[1]].type != 'mine'){
            this.allright = false;
        }

        if(obj.className == 'flag'){
            this.mineNum.innerHTML = ++this.surplusMine;
        }else{
            this.mineNum.innerHTML = --this.surplusMine;
        }
        obj.className =  obj.className == 'flag' ? '' : 'flag';
        if(this.surplusMine == 0){
            if(this.allright){
                alert('恭喜你，游戏胜利');
            }else{
                alert('别灰心，再接再厉');
                this.gameOver();
            }
        }
    }
}

Mine.prototype.gameOver = function (clickTd) {
    for(var i = 0 ; i < this.tr; i ++){
        for(var j = 0; j < this.td; j++){
            if(this.squre[i][j].type == 'mine'){
                this.tds[i][j].className = 'mine';
            }
            this.tds[i][j].onmousedown = null;
        }
    }
    if(clickTd){
        clickTd.style.backgroundColor = '#f00';
    }
}

var button = document.getElementsByTagName('button');
var arr = [[9,9,10],[16,16,40],[28,28,99]];
var mine = null;
var ln = 0;

//新知识
for(let i = 0 ; i < arr.length ; i ++){
    button[i].onclick = function (){
        button[ln].className = '';
        button[i].className = 'active';
        mine = new Mine(...arr[i]);
        mine.init();
        ln = i;
    }
}
//**初始状态**
button[0].onclick();

button[3].onclick = function (){
    mine.init();
}