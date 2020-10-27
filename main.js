window.onload = () => {
    init();
}

function drawRotated(image,degrees, blend){
    var canvas = document.getElementsByClassName("image")[0];
    var context = canvas.getContext("2d");
    context.translate(canvas.width/2,canvas.height/2);
    context.rotate(degrees*Math.PI/180);
    if (typeof blend !== "undefined") {
	context.globalCompositeOperation = blend;
    }
    context.drawImage(image,-image.width/2,-image.height/2);
}

function init(iter, angle, offset, jitter) {
    console.log(iter, angle, offset,jitter);
    var c = document.getElementsByClassName("image")[0];
    var ctx = c.getContext("2d");
     console.log(iter, angle, offset,jitter);
    if (typeof iter === "undefined") iter = 1024;
    if (typeof angle === "undefined") angle = 22;
    if (typeof offset === "undefined") offset = 32;
    if (typeof jitter === "undefined") jitter = 2;
    
    c.width = 384;
    c.height = 480;
    ctx.fillStyle = "white";
    draw(iter,1,0,offset,jitter);
    var img = new Image();
    img.src = c.toDataURL();
    img.onload = () => {
	drawRotated(img, angle ,"difference");
    };
}
function currInit(initFun) {
    return function(a) {
	return function(b) {
	    return function (c) {
		return function (d) {
		    return initFun(a,b,c,d);
		};
	    };
	};
    };
}

function draw(max, iter, startY, offset, jitter) {
    var c = document.getElementsByClassName("image")[0];
    var ctx = c.getContext("2d");
    while (iter <= max) {
	var height = 48*(iter/max);
	ctx.fillRect(0,startY,c.width-jitter*Math.random()-offset, height);
	iter++;
	startY=startY+(2*(1-iter/max))*height;
    }
}

function initParams() {
    inputs=document.getElementsByClassName("num-input");
    var current=currInit(init);
    for (let i = 0; i < inputs.length; i++) {
	current=current(inputs[i].value);
	console.log(current);
    }
}
