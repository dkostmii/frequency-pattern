window.onload = () => {
    init();

    inputs=document.getElementsByClassName("num-input");

    for (let i = 0; i < inputs.length; i++) {
	inputs[i].setAttribute("onfocus", `rndSelect(${i});`);
    }
}

function drawRotated(image,degrees,blend,canvas){
    if (typeof canvas === "undefined") {
	canvas = document.getElementsByClassName("image")[0];
    }
    var context = canvas.getContext("2d");
    context.translate(canvas.width/2,canvas.height/2);
    context.rotate(degrees*Math.PI/180);
    if (typeof blend !== "undefined") {
	context.globalCompositeOperation = blend;
    }
    context.drawImage(image,-image.width/2,-image.height/2);
    context.save();
}

function draw(max, iter, startY, offset, jitter, c) {
    if (typeof c === "undefined") {
	c = document.getElementsByClassName("image")[0];
    }  
    var ctx = c.getContext("2d");
    var blendMode = document.getElementById("redraw").checked == true ? "normal" : "difference";
    ctx.globalCompositeOperation = blendMode;
    while (iter <= max) {
	var height = 48*(iter/max);
	ctx.fillRect(offset < 0 ? -offset : 0,startY,c.width-jitter*Math.random()-offset, height);
	iter++;
	startY=startY+(2*(1-iter/max))*height;
    }
}

function init(iter, angle, offset, offsetY, jitter, scaling) {
    var c, display;
    if (document.getElementById("redraw").checked) {
	c = document.getElementsByClassName("image")[0];
    }
    else {
	c = document.createElement("canvas");
	c.setAttribute("class", "hiddenImage");
    }

    var media = window.matchMedia("(max-width: 414px)");
    if (media.matches) {
	c.hidden = true;
	display=document.getElementsByClassName("image-wrap")[0];
	if (typeof display  === "undefined") {
	    display=document.createElement("img");
	    display.setAttribute("class", "image-wrap");
	    display.width=92*window.innerWidth;
	    display.height=1.25*display.width;
	    document.body.prepend(display);
	}
    }
    
    var ctx = c.getContext("2d");
    if (typeof iter === "undefined") iter = 1024;
    if (typeof angle === "undefined") angle = 22;
    if (typeof offset === "undefined") offset = 32;
    if (typeof offsetY === "undefined") offsetY = 0;
    if (typeof jitter === "undefined") jitter = 2;
    if (typeof scaling === "undefined") scaling = 1;
    if (scaling > 8) scaling = 8;
    else if (scaling < 0.5) scaling = 0.5;
    scaling = Math.abs(scaling);
    document.getElementById("scale").value = scaling;
    
    iter*=scaling;
    offset*=scaling;
    jitter*=scaling;
    c.width = 384*scaling;
    c.height = 480*scaling;
    ctx.fillStyle = "white";
    draw(iter,1,offsetY,offset,jitter,c);
    var img = new Image();
    img.src = c.toDataURL();
    img.onload = () => {
	drawRotated(img, angle ,"difference",c);
	if (!document.getElementById("redraw").checked) {
	    canvas = document.getElementsByClassName("image")[0];
	    context = canvas.getContext("2d");
	    context.resetTransform();
	    context.globalCompositeOperation = "difference";
	    var image = new Image();
	    image.src = c.toDataURL();
	    image.onload = () => {
		context.drawImage(image, 0,0);
	    };
	    c.remove();
	    if (media.matches) {
		display.src = canvas.toDataURL();
	    }
	}
	else {
	    if (media.matches) {
		display.src = c.toDataURL();
	    }
	}
    };
}

function randomize(id) {
    inputs=document.getElementsByClassName("num-input")
    if (typeof id === "undefined") {
	for (let i = 0; i < inputs.length; i++) {
	    randomize(i);
	}
    }
    else {
	switch (id) {
	case 0:
	    inputs[0].value = Math.floor(Math.random()*8192);
	    break;
	case 1:
	    inputs[1].value = (Math.random()*360).toFixed(4);
	    break;
	case 2:
	    inputs[2].value = (Math.random()*512-256).toFixed(4);
	    break;
	case 3:
	    inputs[3].value = (Math.random()*64-32).toFixed(4);
	    break;
	case 4:
	    inputs[4].value = (Math.random()*8).toFixed(4);
	    break;
	case 5:
	    inputs[5].value = (Math.random()*1.5+0.5).toFixed(2);
	    break;
	}
    }
}

function currInit(initFun) {
    return function(a) {
	return function(b) {
	    return function (c) {
		return function (d) {
		    return function (i) {
			 return function (sc) {
			     return initFun(a,b,c,d,i,sc);
			 };
		    };
		};
	    };
	};
    };
}

function initParams() {
    inputs=document.getElementsByClassName("num-input");
    var current=currInit(init);
    for (let i = 0; i < inputs.length; i++) {
	current=current(Number(inputs[i].value));
    }
}

function toggleView() {
    toggleButtons = document.getElementsByClassName("btn-transparent");
    for (let i = 0; i< toggleButtons.length; i++) {
	toggleButtons[i].hidden = !toggleButtons[i].hidden;
    }

    inputs = document.getElementsByClassName("advanced");
    for (let i = 0; i<inputs.length; i++) {
	inputs[i].hidden = !inputs[i].hidden;
    }
    if (window.matchMedia("(max-width: 414px)").matches) {
	if (inputs[0].hidden) {
	    document.body.style.setProperty("height", "106vh");
	}
	else {
	    document.body.style.setProperty("height", "125vh");
	}
    }
}

function rndSelect(id) {
    if (typeof id !== "undefined") {
	document.getElementById("randomize").setAttribute("onclick", `randomize(${id})`);
    }
}

function save() {
    canvas=document.getElementsByClassName("image")[0];
    var link = document.getElementById('link');
    link.setAttribute('download', 'Frequency.png');
    link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
}
