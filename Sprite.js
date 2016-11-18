// JavaScript Document

Sprite.ongoingAnimation = false;
Sprite.animatingInstances = new Array();
Sprite.instancesCount = 0;
Sprite.animationsFinishedTimer = false;
Sprite.setOnAnimationsFinished = function(args) {
	clearInterval(Sprite.animationsFinishedTimer);
	if(!args.onFinish)
		return;
	
	var f = function() {
		if(Sprite.ongoingAnimation)
			return;
		if(args.args)
			args.onFinish(args.args);
		else args.onFinish();
		clearInterval(Sprite.animationsFinishedTimer);
	}
	Sprite.animationsFinishedTimer = setInterval(f, 100);
	f();
}

function Sprite(args) {	
	this.container 		= args.container;
	this.imagePath 		= args.imagePath;
	this.framesCount 	= args.framesCount;
	this.scale 			= args.scale;
	this.fps			= args.fps;
	this.looped			= args.looped;
	
	this.originalWidth	= args.width;
	this.height			= args.height;
	
	this.frameInterval 	= 1000 / this.fps; 
	this.currentFrame 	= 0;
	this.timer			= false;
	this.ongoingAnimation = false;
	this.tickOffset 	= 1;
	this.width		 	= 1;
	this.imgContainer	= document.createElement('img');
	
	this.instanceID = Sprite.instancesCount;
	Sprite.instancesCount++;

	this.initContainer();
	
	if(typeof args.beginFrame != "undefined")
		this.renderFrame(args.beginFrame);
}

Sprite.prototype.initContainer = function () {
	$(this.container).css('overflow', 'hidden');
	$(this.container).append(this.imgContainer);
	this.rescaleContainer();
}

Sprite.prototype.rescaleContainer = function () {
	this.width = this.originalWidth * this.scale;
	this.width = Math.floor(this.width);
	this.scale = this.width / this.originalWidth;
	
	$(this.container).css('width', this.width);
	$(this.container).css('height', this.height * this.scale);
	$(this.imgContainer).css('width', this.width * this.framesCount);
	$(this.imgContainer).css('height', this.height * this.scale);
	$(this.imgContainer).attr('src', this.imagePath);
}

Sprite.prototype.setScale = function (scaleIn) {
	this.scale = scaleIn;
	this.rescaleContainer();
}

Sprite.prototype.play = function () {
	this.gotoAndPlay(this.currentFrame);
}

Sprite.prototype.pause = function () {
	clearInterval(this.timer);
	this.setOngoingAnimation(false);
}

Sprite.prototype.setLoop = function (loopedIn) {
	this.looped = loopedIn;
}

Sprite.prototype.gotoAndPlay = function (whatFrame) {
	if(this.tickOffset > 0)
		var endFrame = 0;
	else var endFrame = 0;
	this.playInterval(whatFrame, endFrame, false);
}

Sprite.prototype.playInterval = function (startFrame, endFrame, loopedIn) {

	var me = this;
	
	me.pause();
	me.renderFrame(startFrame);
	this.setOngoingAnimation(true);
	
	this.timer = setInterval(
		function() {
			var nextFrame = me.modulo(me.currentFrame + me.tickOffset);
			me.renderFrame(nextFrame);
	
			if(me.currentFrame == endFrame) {
				me.pause();
				if(loopedIn)
					me.playInterval(startFrame, endFrame, loopedIn);	
			}
			
		}, me.frameInterval
	);
	
}

Sprite.prototype.animateToFrame = function (args) {
	this.pause();
	
	var endFrame = args.endFrame;
	
	var me = this;
	var framesToPlay = new Array();
	
	var increment = me.tickOffset;
	
	if(args.shortestPath) {
		if(endFrame > me.currentFrame)	
			increment = 1;
		else increment = -1;
	}
	
	for(var i = me.currentFrame; i != endFrame; i += increment) {
		i = me.modulo(i);
		framesToPlay.push(i);	
	}
	framesToPlay.push(endFrame);	
	
	framesToPlay.reverse();
	
	this.setOngoingAnimation(true);
	this.timer = setInterval(
		function() {
			var nextFrame = framesToPlay.pop();
			me.renderFrame(nextFrame);
	
			if(framesToPlay.length <= 0) {
				me.pause();
				if(args.onFinish)
					args.onFinish();	
			}
			
		}, me.frameInterval
	);
}

Sprite.prototype.reverseAnimation = function (revIn) {

	if(typeof revIn == 'undefined')
		this.tickOffset *= -1;
	else if(revIn)
		this.tickOffset = -1;
	else this.tickOffset = 1;
	
}

Sprite.prototype.modulo = function (val) {
	val += 2 * this.framesCount;
	val %= this.framesCount;
	return val;
}

Sprite.prototype.setOngoingAnimation = function(going) {
	this.ongoingAnimation = going;
	
	if(going) {
		Sprite.animatingInstances.push(this.instanceID);
		Sprite.ongoingAnimation = true;
	} else {
		for(var i = 0; i < Sprite.animatingInstances.length; i++)
			if(Sprite.animatingInstances[i] == this.instanceID) {
				Sprite.animatingInstances[i] = Sprite.animatingInstances[Sprite.animatingInstances.length - 1];
				Sprite.animatingInstances.length--;
			}
		Sprite.ongoingAnimation = (Sprite.animatingInstances.length > 0);
	}
}

Sprite.prototype.showFrame = function (whatFrame) {
	this.pause();
	this.renderFrame(whatFrame);
}

Sprite.prototype.renderFrame = function (whatFrame) {

	whatFrame = this.modulo(whatFrame);
	
	var offsetX = -1 * (whatFrame * this.width);
	offsetX = Math.floor(offsetX);

	$(this.imgContainer).css('margin-left', offsetX);
	
	this.currentFrame = whatFrame;
	
}