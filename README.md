animate
=======

A simple animation handler. Uses an animation polyfill to use either setTimeout or requestAnimationFrame. Provides a convenient interface for triggering a timed animation.

Installation
=======
```
npm install rvangundy/animate --save
```

Usage
=====
Animate is intended for use on the client-side using [browserify](https://github.com/substack/node-browserify). The package returns an animate() function.

```javascript
var animate = require('animate');

animate(callback, duration, warp, oncomplete);
```

The animate arguments work as follows :

### callback
The callback is called repeatedly for the course of the specified duration. Each time its called, the progress of the animation is passed as an argument (from 0 to 1).

### duration
The duration of the animation in ms.

### warp
A function used to time-warp the animation. Some warping functions exist, such as ```animate.easeIn```, ```animate.easeOut```, and ```animate.easeInOut```. A warping function takes a floating point value representing the time progress through the animation, and outputs a 'progress' value used during the animation. Both 'complete' and 'progress' values are from 0 to 1. For example, the easeIn function:

```javascript
function easeIn(complete) {
    return Math.pow(complete, 2);
}
```

### oncomplete
A function called when the animation has completed.

Example
=======

In the following example, the element will be scrolled in from the right of its container. Note: this example only sets the CSS properties for 'left' and 'top'. For higher performance animations, a similar method may access an element's CSS transformation properties.

```javascript
var animate = require('animate');

function move(element, startPos, stopPos) {
    return function(progress) {
        element.style.left = progress * (stopPos.x - startPos.x) * 100 + '%';
        element.style.top  = progress * (stopPos.y - startPos.y) * 100 + '%';
    }
}

var element = document.getElementById('ID');

animate(
    move(element, { x : 100, y : 0 }, { x : 0, y : 0 }),
    1000,
    animate.easeInOut,
    function() { console.log('I made it!'); }
);
```
