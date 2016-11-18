This Javascript Class enables sprite-based animations on HTML pages.
It works with JQuery, so please include it 
(https://jquery.com/download/).

For a working demo: 
http://dorukkicikoglu.com/works/kobiDeniz/calisan250.php

Initialization:

var wheelSprite = new Sprite({
						container: $(".someDiv"),
						imagePath: 'pathToYourSprite/sprite.png',
						framesCount: 30,
						scale: 1,
						fps: 24,
						looped: false,
						width: 251,
						height: 251,
						beginFrame: 11
					});
					
wheelSprite.animateToFrame({endFrame: 18, shortestPath: true});

*Some sample sprites:
http://dorukkicikoglu.com/works/kobiDeniz/images/sprites/armSprite.png
http://dorukkicikoglu.com/works/kobiDeniz/images/sprites/martiSprite1.png
http://dorukkicikoglu.com/works/kobiDeniz/images/sprites/martiSprite2.png

**If you need a photoshop script to generate sprites:
https://github.com/danielstern/photoshopSpritesheet/blob/master/layertoanimation.jsx
