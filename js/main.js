var bgCanvas = null;
var ctx = null;
var width = 0;
var height = 0;
var hlfSize = 0;
var qrtSize = 0;
var ctxBG = null;
var stars=[];
var blurMap;
var blurMap2;


var starAmounts = {
	cStarField:10,
	rStarField:0,
	galaxies:4,
	roundGalaxies:1,
	spiralGalaxies:1,
	riftGalaxies:1,
	rndStarsL:1000,
	rndStarsS:5000,
	moons:3,
	flares:5,

}


function start() {
	width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth
	height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
	width = Math.floor(width);
	height = Math.floor(height);

	
	
	bgCanvas=createCanvas(width,height,0,0,"cnvBG","cnvBG",0,0,true);
	ctx = bgCanvas.getContext("2d");
	let starsStatic = createCanvas(width,height,0,0,"static","static",0,0,true);
	starsStatic.style.zIndex = 100;
	document.body.appendChild(starsStatic);
	ctxStatic = starsStatic.getContext("2d");
	$("body").append(bgCanvas);

	hlfSize = Math.floor(Math.min(width, height) / 2) + 0.5;
	qrtSize = Math.floor(hlfSize / 2) + 0.5;
	blurMap=createBlurMap();
	blurMap.style.opacity=0.5;
	blurMap.style.zIndex=-2;
	
	createStars();

	document.addEventListener("mousemove",handleMouseMove);
	tick();
}
var checkScrollBars = function(){
    var b = $('#mainCanvas');
    var normalw = 0;
    var scrollw = 0;
    if(b.prop('scrollHeight')>b.height()){
        
        scrollw = width - b.width();
        $('#mainCanvas').css({marginRight:'-'+scrollw+'px'});
    }
}
function createStar(x,y,rad,col,mExt) {
		stars.push([
			x,
			y,
			rad,
			col,
			mExt
			])
}
function createGalaxy(x,y,rad,iter,turn,spin,starsPerIter) {
	
	let stepSize = rad / (iter+1);
	let stepAng = Math.PI*2*spin / (iter+1);
	let i = 0;
	let ang = spin * stepAng * i;
	let midx = (x) ;
	let midy = (y) ;
	starsPerIter=starsPerIter || 50;
	x = (x) + ang * Math.cos(ang - turn);
	y = (y) + ang * Math.sin(ang - turn);
	

	while (i < iter) {
		i+=stepSize;
		ang = spin * stepAng * i;
		let dis = Distance(midx,midy,x,y);
		x = midx + i * Math.cos(ang - turn);
		y = midy + i * Math.sin(ang - turn);
		let cx = x;
		let cy = y;
		for (let h=0;h<starsPerIter;h++) {
			let rnd = 0.5+0.5*Math.random();
			let rgb = [Math.floor(255*rnd),Math.floor(255*rnd),Math.floor(255*rnd)];
			let rndCol = "rgba("+(Math.floor(rgb[0]))+","+(Math.floor(rgb[1]))+","+(255)+","+(0+1*(1-dis/rad)*Math.random()*(1))+")";
			let mouseEx = Math.random()*5;
			cx +=(Math.random()-Math.random()*stepSize*3);
			cy +=(Math.random()-Math.random()*stepSize*3);

			createStar(cx,cy,0.5+0.5*Math.random(),rndCol,mouseEx);	
			
		}

		
	}

	
}
function createRoundGalaxy(x,y,rad,iter,turn,spin,starsPerIter) {
	
	let stepSize = rad / (iter+1);
	let stepAng = Math.PI*2*spin / (iter+1);
	let i = 0;
	let ang = spin * stepAng * i;
	let midx = (x) ;
	let midy = (y) ;
	starsPerIter=starsPerIter || 250;
	x = (x) + ang * Math.cos(ang - turn);
	y = (y) + ang * Math.sin(ang - turn);
	

	while (i < iter) {
		i+=stepSize;
		ang = spin * stepAng * i;
		let dis = Distance(midx,midy,x,y);
		x = midx + i * Math.cos(ang - turn);
		y = midy + i * Math.sin(ang - turn);
		let cx = x;
		let cy = y;
		for (let h=0;h<starsPerIter;h++) {
			let rnd = 0.5+0.5*Math.random();
			let rgb = [Math.floor(255*rnd),Math.floor(255*rnd),Math.floor(255*rnd)];
			let rndCol = "rgba("+(Math.floor(rgb[0]))+","+(Math.floor(rgb[1]))+","+(255)+","+(0+1*(1-dis/rad)*Math.random()*(1))+")";
			let mouseEx = Math.random()*5;
			cx +=(Math.random()-Math.random())*stepSize*2;
			cy +=(Math.random()-Math.random())*stepSize*2;

			createStar(cx,cy,0.5+0.5*Math.random(),rndCol,mouseEx);	
			
		}

		
	}

	
}
function createRiftGalaxy(x,y,rad,arms,spin,stars) {
	let iter = rad;
	let starsPerIter = stars / iter;
	let stepSize = rad / (iter+1);
	let stepAng = Math.PI*2*spin / (iter+1);
	let i = 0;
	let ang = spin * stepAng * i;
	let midx = x;
	let midy = y;
	starsPerIter=starsPerIter || 250;
	let curDis = 0;
	let curAng = 0; 
	
	for (let i = 0;i<iter;i++) {
		for (let a = 0;a<arms;a++) {
			let nx = midx + Math.cos(curAng+a*(Math.PI*2/arms)) * curDis;
			let ny = midy + Math.cos(curAng+a*(Math.PI*2/arms)) * curDis;

			let dis = Distance(midx,midy,nx,ny);
			let rnd = 0.5+0.5*Math.random();
			let rgb = [Math.floor(255*rnd),Math.floor(255*rnd),Math.floor(255*rnd)];
			let rndCol = "rgba("+(Math.floor(rgb[0]))+","+(Math.floor(rgb[1]))+","+(255)+","+(0+1*(1-curDis/rad)*Math.random()*(1))+")";
			let mouseEx = Math.random()*5;
			
			for (let h=0;h<starsPerIter;h++) {
				let cx = nx+(Math.random()-Math.random())*stepSize*5;
				let cy = ny+(Math.random()-Math.random())*stepSize*5;
				createStar(cx,cy,0.5+0.5*Math.random(),rndCol,mouseEx);	
				
			}
		}
		curDis+=stepSize;
		curAng+=stepAng;
	}

	

	
}
function createSpiralGalaxy(ct,x,y,rad,arms,spin,stars) {
	let w = Math.ceil(rad*2);
	let h = Math.ceil(rad*2);
	let img  = createCanvas(w,h,0,0);
	let c = img.getContext("2d");
	

	let iter = rad;
	let starsPerIter = stars / iter;
	let stepSize = rad / (iter+1);
	let stepAng = Math.PI*2*spin / (iter+1);
	let i = 0;
	let ang = spin * stepAng * i;
	let midx = (x) ;
	let midy = (y) ;
	starsPerIter=starsPerIter || 100;
	let curDis = 0;
	let curAng = 0; 
	
	for (let i = 0;i<iter;i++) {
		for (let a = 0;a<arms;a++) {
			let nx = midx + Math.cos(curAng+a*(Math.PI*2/arms)) * curDis;
			let ny = midy + Math.sin(curAng+a*(Math.PI*2/arms)) * curDis;

			let dis = Distance(midx,midy,nx,ny);
			let rnd = 0.5+0.5*Math.random();
			let rgb = [Math.floor(255*rnd),Math.floor(255*rnd),Math.floor(255*rnd)];
			let rndCol = "rgba("+(Math.floor(rgb[0]))+","+(Math.floor(rgb[1]))+","+(255)+","+(0+1*(1-curDis/rad)*Math.random()*(1))+")";
			let mouseEx = Math.random()*5;
			let cx = nx+(Math.random()-Math.random())*2;
			let cy = ny+(Math.random()-Math.random())*2;
			for (let h=0;h<0.5*starsPerIter+2.5*starsPerIter*(1-curDis/rad);h++) {
				cx += (Math.random()-Math.random())*2;
				cy += (Math.random()-Math.random())*2;
				
				c.fillStyle=rndCol;
				
				
				createStar(cx,cy,0.5*Math.random(),rndCol,mouseEx);	
				
			}
		}
		curDis+=stepSize;
		curAng+=stepAng;
	}
	return img;

	

	
}

function createStars() {
	
	//colored starFields
	//amount of starFields
	let tmp = 0;
	let k =0;
	for (k = 0;k<starAmounts.cStarField;k++) {
		let x =(Math.random())*width;
		let y =(Math.random())*height;
		let alpha = 1;

		let rgb = [Math.floor(155+Math.random()*100),Math.floor(155+Math.random()*100),Math.floor(100+Math.random()*55)];
		
		//amount of stars in StarField
		loop2:
		for (let i = 0;i< 5000;i++) {

			let rnd1= Math.random()-Math.random()
			let rnd2= Math.random()-Math.random()
			let rad = Math.random()*0.5;
			x += (rnd1)* 5;
			y += (rnd2)* 5;
			if (x<0||x>width||y<0||y>height) {
				k--;
				break loop2;
			}
			let rnd = 0.5+0.5*Math.random();
			let rgb = [Math.floor(255*rnd),Math.floor(255*rnd),Math.floor(255*rnd)];
			let rndCol = "rgba("+(Math.floor(rgb[0]))+","+(Math.floor(rgb[1]))+","+(255)+","+(0.5)+")";
			let mouseEx = Math.random()*5;
			createStar(x,y,rad,rndCol,mouseEx);	
		}
	}
	console.log(k + " color Galaxies with " + (stars.length-tmp) + " stars created");
	tmp = stars.length;
	//regular Starfields
	for (k = 0;k<starAmounts.rStarField;k++) {
		let x =(Math.random())*width;
		let y =(Math.random())*height;
		let alpha = 1;

		let rgb = [155+Math.floor(Math.random()*100),155+Math.floor(Math.random()*100),Math.floor(255)];

		//amount of stars in StarField
		loop2:
		for (let i = 0;i< 5000;i++) {

			let rnd1= Math.random()-Math.random()
			let rnd2= Math.random()-Math.random()
			let rad = Math.random()*1.5;
			x += (rnd1)* 5;
			y += (rnd2)* 5;
			if (x<0||x>width||y<0||y>height) {
				k--;
				break loop2;
			}
			let rndCol = nebulaPallet[Math.floor(Math.random()*nebulaPallet.length)] ;
			let mouseEx = Math.random()*5;
			createStar(x,y,rad,rndCol,mouseEx);	
			//alpha-=1/5000;
		}
	}
	console.log(k + " normal Galaxies with " + (stars.length-tmp) + " stars created");
	tmp = stars.length;
	
	spiralG = [];
	for (let i = 0;i<starAmounts.spiralGalaxies;i++) {
		let spir = createSpiralGalaxy(
			ctxStatic,
			Math.random()*width/*+0.25 *(Math.random()-Math.random())*width*/,
			Math.random()*height/*+0.25*(Math.random()-Math.random())*height*/,
			80+Math.random()*40,//Math.max(100,Math.random()*Math.sqrt(width*height)*0.1),
			3+Math.random()*4,//iterations
			0.5+Math.random()*0.5,//ang
			500+Math.random()*1000)//Spin
		
	}

	console.log("spiral galaxy with " + (stars.length-tmp) + " stars created");
	tmp = stars.length;

	for (let i = 0;i<starAmounts.riftGalaxies;i++) {
		let rift = createRiftGalaxy(
			
			width/2/*+0.25 *(Math.random()-Math.random())*width*/,
			height/2/*+0.25*(Math.random()-Math.random())*height*/,
			100,//rad
			4,//arms
			5,//spin
			1000)//Stars
		
	}

	console.log("rift galaxy with " + (stars.length-tmp) + " stars created");
	tmp = stars.length;

	for (var i = starAmounts.galaxies - 1; i >= 0; i--) {
		createGalaxy(width/2,height/2,50,Math.random()*100,Math.random()*Math.PI*2,3,80)
	};

	console.log(" galaxy with " + (stars.length-tmp) + " stars created");
	tmp = stars.length;
	for (var i = starAmounts.roundGalaxies - 1; i >= 0; i--) {
		createRoundGalaxy(Math.random()*width,Math.random()*height,50+Math.random()*50,100,Math.random()*Math.PI*2,Math.random()*10,50)
	}

	console.log("round galaxy with " + (stars.length-tmp) + " stars created");
	tmp = stars.length;




	for (let i = 0;i<starAmounts.rndStarsL;i++) {
		let rnd1= Math.random();
		let x = Math.random()*width;
		let y = Math.random()*height;
		let rad = Math.random()*1.9;
		let rndCol = "rgba("+(155 + Math.floor(Math.random()*100))+","+(155 + Math.floor(Math.random()*100))+","+255+","+(0.1+Math.random()*0.5)+")";
		let mouseEx = Math.random()*5;
		createStar(x,y,rad,rndCol,mouseEx);
	}
	console.log("Background Stars: " + 1000 + " stars created");
	for (let i = 0;i<starAmounts.rndStarsS;i++) {
		let rnd1= Math.random();
		let x = Math.random()*width;
		let y = Math.random()*height;
		let rad = Math.random()*0.5;
		let rndCol = "rgba("+(155 + Math.floor(Math.random()*100))+","+(155 + Math.floor(Math.random()*100))+","+255+","+(0.1+Math.random()*0.3)+")";
		let mouseEx = Math.random()*5;
		createStar(x,y,rad,rndCol,mouseEx);
	}
	console.log("Background Stars: " + 10000 + " stars created");

	console.log("Rendering Stars...");
	drawStars();
	
	console.log("Rendered Stars");

	
	let sunPos = {x:Math.random()*width,y:Math.random()*height}

	renderSun(ctxStatic,sunPos.x,sunPos.y,Math.random()*15+15);

	for (let i = 0;i<starAmounts.moons;i++) {
		let moonX = width*0.2+Math.random()*0.6*width;
		let moonY = height*0.2+Math.random()*0.6*height
		renderMoon(ctxStatic,
			moonX,
			moonY,
			Math.random()*35+15,angle(moonX,moonY,sunPos.x,sunPos.y));
		
	}

	let flares = [];
	for (let i =0;i<starAmounts.flares;i++) {
		createFlare(ctxStatic,
			Math.random()*width,
			Math.random()*height,
			10+Math.random()*50,
			Math.random()*Math.PI*2);
	}
	

}
function createFlare(ct,x,y,rad,dir) {
	let amount = 150;
	ct.fillStyle="rgba(255,255,255,0.01)";
	for (let i = 0;i< amount;i++) {
		ct.beginPath();
		ct.moveTo(x,y);
		ct.ellipse(x,y,rad/2,rad/(i/2+1),dir,0,Math.PI*2,0);
		ct.moveTo(x,y);
		ct.ellipse(x,y,rad/(i/2+1),rad/2,dir,0,Math.PI*2,0);
		ct.fill();
		ct.closePath();
	}

}
function renderSun(ct,x,y,rad) {
	let img = createCanvas(rad*8,rad*8);
	let c = img.getContext("2d");
	rad = Math.floor(rad);
	c.fillStyle="yellow";
	for (let i = 0;i<100;i++) {
		c.fillStyle="rgba("+(255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*155)+","+(0.5/(i+1))+")";
		c.beginPath();
		c.ellipse(rad*4,rad*4,rad+i,rad*0.7+Math.random()*rad*0.5,Math.random()*Math.PI*2,0,Math.PI*2,0);
		c.fill();
		c.closePath();
		
	}

	ct.drawImage(img,x,y);
}
function renderMoon(ct,x,y,rad,dir) {
	let img = createCanvas(rad*4,rad*4);
	let c = img.getContext("2d");
	rad = Math.floor(rad);
	c.imageSmoothingEnabled=false;
	let rgr = c.createRadialGradient(
		rad*2-Math.cos(dir)*rad/2,
		rad*2-Math.sin(dir)*rad/2,0,
		rad*2-Math.cos(dir)*rad/2,
		rad*2-Math.sin(dir)*rad/2,rad*2)
	rgr.addColorStop(0,"rgba(0,0,0,1)");
	rgr.addColorStop(0.01,"rgba(0,0,0,1)");
	rgr.addColorStop(0.4,"rgba(0,0,0,1)");
	rgr.addColorStop(0.5,"rgba(0,0,0,0)");
	rgr.addColorStop(1,"rgba(0,0,0,0)");

	let rgr2 = c.createRadialGradient(rad*2,rad*2,0,rad*2,rad*2,rad*2)
	rgr2.addColorStop(0,"rgba(0,0,44,1)");
	rgr2.addColorStop(1,"rgba(11,11,66,1)");

	let rgr3 = c.createRadialGradient(rad*2,rad*2,0,rad*2,rad*2,rad)
	rgr3.addColorStop(0,"rgba(0,0,0,0)");
	rgr3.addColorStop(1,"rgba(255,255,255,0.1)");

	let rgr4 = c.createRadialGradient(rad*2,rad*2,0,rad*2,rad*2,rad*1.1)
	rgr4.addColorStop(0.5,"rgba(255,255,255,0.5)");
	rgr4.addColorStop(1,"rgba(255,255,255,0)");


	c.fillStyle=rgr4;
	c.beginPath();
	c.arc(rad*2+rad*0.1*Math.cos(dir),rad*2+rad*0.1*Math.sin(dir),rad*1.1,0,Math.PI*2,0);
	c.fill();
	c.closePath();
	
	c.fillStyle=rgr2;
	c.beginPath();
	c.arc(rad*2,rad*2,rad,0,Math.PI*2,0);
	c.fill();
	c.fillStyle=rgr3;
	c.fill();
	c.clip();
	addNoise(c);
	c.fillStyle=rgr;
	c.fillRect(0,0,rad*4,rad*4);

	ct.drawImage(img,x,y);
	//document.body.appendChild(img);
}
var spiralG = null;
var spiralGRot=0;
function addNoise(ct) {
	ct.save();
	ct.globalCompositeOperation="overlay";
	ct.strokeStyle="rgba(20,20,250,0.4)"
	ct.lineCap = "round";
	ct.lineWidth=ct.canvas.width/100;
	for (let i = 0;i<100;i++) {
		let rnd = Math.random();
		ct.beginPath();
		ct.arc(Math.random()*ct.canvas.width,Math.random()*ct.canvas.height,Math.random()*25,0,Math.PI*2,0);
		ct.fill();
		ct.closePath();
	}
	ct.globalCompositeOperation="saturation";
	for (let i = 0;i<100;i++) {
		let rnd = Math.random();
		ct.beginPath();
		ct.arc(Math.random()*ct.canvas.width,Math.random()*ct.canvas.height,Math.random()*5,0,Math.PI*2,0);
		ct.fill();
		ct.closePath();
	}
	ct.restore();
}
function drawSpiralG() {
	spiralGRot-=0.5;
	if (spiralGRot<=00) {
		spiralGRot=199;
	}
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(spiralG[Math.floor(spiralGRot)],
		0.5+Math.floor(width/2-spiralG[0].width/2),
		0.5+Math.floor(height/2-spiralG[0].height/2))
	
}
var ctxStatic;
var nebulaPallet = [
	"rgba(250,250,255,0.1)",
	"rgba(155,155,255,0.1)",
	"rgba(155,0,0,0.1)"
	
	]
function createBlurMap() {
	let cn = createCanvas(width*2,height*2,0,0,null,null,0,0,1);
	let ct = cn.getContext("2d");
	ct.globalCompositeOperation = "multiply";
	for (let i = 0 ; i < 100;i++) {
		let x = Math.random()*width*2;
		let y = Math.random()*height*2;
		let rad = Math.random()*0.05*Math.sqrt(width*height)
		let col = nebulaPallet[Math.floor(Math.random()*nebulaPallet.length)]
		loop2:
		for (let i = 0;i<500;i++) {
			let rnd1 =(Math.random()-Math.random())*rad;
			let rnd2 = (Math.random()-Math.random())*rad;
			x+=rnd1*3;
			y+=rnd2*3;
			if (x<0||x>width||y<0||y>height) {
				break loop2;
			}
			
			let rgr = ct.createRadialGradient(x,y,0,x,y,rad+(rnd1+rnd2)/2);
			rgr.addColorStop(0,col);
			rgr.addColorStop(1,"rgba(0,0,0,0)");
			ct.fillStyle=rgr;
			fillCircle(ct,x,y,rad+(rnd1+rnd2)/2);
		}
	}
	blurMap2 = createCanvas(width*2,height*2,0,0,null,null,0,0,1);
	let ct2 = blurMap2.getContext("2d");
	ct2.drawImage(cn,0,0);
	$("body").append(blurMap2);
	return cn;
}
function drawStars() {
	for (let key in stars) {
		let s = stars[key];
		ctx.fillStyle=s[3];
		star(ctx,stars[key][0],stars[key][1],stars[key][2]);
		
	}
}
var particles=[];
function spawnParticle(x,y,sum) {
	let rad = 0.5+2*Math.random();
	let img = createCanvas(rad*2,rad*2);
	let c = img.getContext("2d");
	let rgr = c.createRadialGradient(rad,rad,0,rad,rad,rad);
	rgr.addColorStop(0,"rgba(255,255,255,0.5)");
	rgr.addColorStop(1,"rgba(255,255,255,0)");
	c.fillStyle=rgr;
	c.beginPath();
	c.arc(rad,rad,rad,0,Math.PI*2,0);
	c.fill();
	particles.push([x,y,img,Math.random()*Math.PI*2,100]);
}
function drawParticles() {
	ctx.fillStyle="rgba(255,255,50,1)";
	for (let i = particles.length-1;i>=0;i--) {
		let p = particles[i]
		p[4]--;
		if (p[4]<=0) {
			particles.splice(i,1);
			continue;
		} else {
			ctx.drawImage(p[2],p[0],p[1]);
			p[0]+=Math.cos(p[3])*3;
			p[1]+=Math.sin(p[3])*3;
		}
	}
}

function tick() {

	

	window.requestAnimationFrame(tick);
}
function createNebula(ticker) {
	let n = [0,0,0,null];
	let w = Math.max(250,Math.random()*width);
	let h = Math.max(250,Math.random()*height);
	let x = n[0] = width  * Math.random();
	let y = n[1] = height * Math.random();
	let img = createCanvas(w,h)
	let ct = img.getContext("2d");
	let tx = w/2;
	let ty = h/2	
		
	let col = nebulaPallet[Math.floor(Math.random()*nebulaPallet.length)]
	loop2:
	for (let i = 0;i<200;i++) {
		let rad = 0.5+Math.random()*0.1*Math.sqrt(w*h)
		let rnd1 =(Math.random()-Math.random())*rad*2;
		let rnd2 = (Math.random()-Math.random())*rad*2;
		tx+=rnd1*1.5;
		ty+=rnd2*1.5;
		if (tx<rad*2||tx>w-rad*2||ty<rad*2||ty>h-rad*2) {
			i--;
			tx = w/2;
			ty = h/2;
			continue loop2;
		}
		//rad*=1+(rnd1+rnd2)/rad
		ct.globalCompositeOperation="multiply";
		ct.globalAlpha=0.5;
		let rgr = ct.createRadialGradient(tx,ty,0,tx,ty,rad+Math.abs(rnd1+rnd2)/4);
		rgr.addColorStop(0,col);
		rgr.addColorStop(1,"rgba(0,0,0,0)");
		ct.fillStyle=rgr;
		fillCircle(ct,tx,ty,rad+Math.abs(rnd1+rnd2)/2);
	}




	n[2] = ticker || 100;
	n[3] = img;
	return n;
}
function spawnNebula(ticker) {
	ticker = ticker || 100;
	nebulas.push(createNebula(ticker))
}
function drawNebula(ct,n) {
		let x = n[0];
		let y = n[1];
		let tick = 1-n[2]/100;
			
			
			ct.drawImage(n[3],n[0]-n[3].width*tick*0.25,n[1]-n[3].height*tick*0.25,n[3].width*(1+tick)*0.5,n[3].height*(1+tick)*0.5);
			ct.globalAlpha=1;
			
		
}

var nebulas=[];
var mouseX = 0;
var mouseY = 0;


var easingTypes = 2;
var cMouseX=0;
var cMouseY=0;
var currentSite = "home";





var mouseDown=false;
var bgOffset=10;
function handleMouseMove(e) {
	let rect = e.target.getBoundingClientRect();
	cMouseX = e.clientX - rect.left;
	cMouseY = e.clientY - rect.top;
	mouseX = e.clientX;
	mouseY = e.clientY;


	//move blurMap a litle on mosuemvoe.
	//let c = blurMap2.getContext("2d");
	//c.clearRect(0,0,width,height);
	//c.drawImage(blurMap,0-mouseX/width*bgOffset,0-mouseY/height*bgOffset);

}

function createCanvas(w, h, mL, mT, id, className, L, T, abs) {

	let tmpCnv = document.createElement("canvas");
	tmpCnv.id = id;
	tmpCnv.className = className;
	tmpCnv.width = w;
	tmpCnv.height = h;
	tmpCnv.style.marginTop = mT + "px";
	tmpCnv.style.marginLeft = mL + "px";
	tmpCnv.style.left = L + "px";
	tmpCnv.style.top = T + "px";
	if (abs) {
		tmpCnv.style.position = "absolute";
	}
	return tmpCnv;
}

function createDiv(id, className) {
	let but = document.createElement("div");
	but.id = id;
	but.className = className;


	return but;
}

function createButton(w, h, t, l, mT, mL, pos, bR, bgCol, bgColHov, id, className, clickEv, innerHTML) {
	let but = document.createElement("div");
	but.style.width = w;
	but.style.height = h;
	but.style.top = t;
	but.style.left = l;
	but.style.marginTop = mT;
	but.style.marginLeft = mL;
	but.style.position = pos;
	but.style.borderRadius = bR;
	but.style.backgroundColor = bgCol;
	but.id = id;
	but.className = className;
	but.innerHTML = innerHTML;

	but.addEventListener("mouseenter", function() {
		but.style.backgroundColor = bgColHov;
	})
	but.addEventListener("mouseleave", function() {
		but.style.backgroundColor = bgCol;
	})
	but.addEventListener("click", function() {
		console.log(id + " clicked");

		clickEv();
	})
	return but;
}
function angle(p1x, p1y, p2x, p2y) {

	return Math.atan2(p2y - p1y, p2x - p1x);

}
function fillCircles(ct,arr) {
	ct.beginPath();
	for (let key in arr) {
		let s = arr[key];
		ct.arc(s[0],s[1],s[2],0,Math.PI*2,0);
	}
	ct.fill();
	ct.closePath();
}
function fillCircle(ct,x,y,rad) {
	ct.beginPath();
	ct.arc(x,y,rad,0,Math.PI*2,0);
	ct.fill();
	ct.closePath();
}
function star(ct,x,y,rad) {
	let rndAng = Math.random()*Math.PI*2;
	ct.lineWidth=rad*0.5;
	ct.beginPath();
	drawEvenTriangle(ct,x,y,rad,rndAng);
	
	drawEvenTriangle(ct,x,y,rad,rndAng+Math.PI);
	ct.fill();
	ct.closePath();
}
function drawSpiral(ct,x,y,rad,iter,turn,lineWidth,stroke) {
		let stepSize = rad / (iter+1);
		let i = 0;
		let ang = stepSize/Math.PI*2 * i;

		ct.lineWidth = lineWidth;
		
		ct.strokeStyle = stroke;
		let midx = (x) ;
		let midy = (y) ;
		x = (x) + ang * Math.cos(ang - turn);
		y = (y) + ang * Math.sin(ang - turn);
		ct.beginPath();

		while (i < iter) {
			i++;
			ang = stepSize/Math.PI*2 * i;

			ct.moveTo(x, y);
			x = midx + ang * Math.cos(ang - turn);
			y = midy + ang * Math.sin(ang - turn);


			ct.lineTo(x, y);
		}

		ct.stroke();
		ct.closePath();
}
function drawCrazySpiral(ct,x,y,rad,turns,iter,turn,lineWidth,stroke) {
		let stepSize = Math.log(rad) / (iter);
		let angStep = turns*Math.PI*2 / iter;
		let i = 1;
		let ang = angStep * i;

		ct.lineWidth = lineWidth;
		
		ct.strokeStyle = stroke;
		x = (x) + stepSize * Math.cos(ang - turn);
		y = (y) + stepSize * Math.sin(ang - turn);

		ct.beginPath();

		while (i < iter) {
			i++;
			ang = angStep * i ;

			ct.moveTo(x, y);
			x = (x) + stepSize*i * Math.cos(ang - turn);
			y = (y) + stepSize*i * Math.sin(ang - turn);


			ct.lineTo(x, y);
		}

		ct.stroke();
		ct.closePath();
}
function drawCoolRing(ct,x,y,rad,iter,turn,lineWidth,stroke) {
		let stepSize = rad / iter;
		let i = 0;
		let ang = stepSize * i;

		ct.lineWidth = lineWidth;
		
		ct.strokeStyle = stroke;
		x = (x) + stepSize*10 * Math.cos(ang - turn);
		y = (y) + stepSize*10 * Math.sin(ang - turn);

		ct.beginPath();

		while (i < iter) {
			i++;
			ang = stepSize * i;

			ct.moveTo(x, y);
			x = (x) + stepSize*10 * Math.cos(ang - turn);
			y = (y) + stepSize*10 * Math.sin(ang - turn);


			ct.lineTo(x, y);
		}

		ct.stroke();
		ct.closePath();
}
function drawEvenTriangle(ct,x,y,rad,turn) {
	//triangles - even
            let ang1 = Math.PI*2 / 3;
            //ct.beginPath();
            ct.moveTo(x + Math.cos(turn 			) 	* rad, 	y + Math.sin(turn 			) 	* rad);
            ct.lineTo(x + Math.cos(turn + ang1		) 	* rad, 	y + Math.sin(turn + ang1	) 	* rad);
            ct.lineTo(x + Math.cos(turn + ang1 * 2 	) 	* rad, 	y + Math.sin(turn + ang1 * 2) 	* rad);
            //ct.closePath();
            
}
function drawTriangle(x1,y1,x2,y2,x3,y3) {
			ct.beginPath();
            ct.moveTo(x1,y1);
            ct.lineTo(x2,y2);
            ct.lineTo(x3,y3);
            ct.closePath();
}
function Distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}