'use strict';

/***************
 *  Utilities  *
 ***************/

var c = 1;

/**
 * Returns a unique number for identifying animation handlers
 * @return {Number} An ID that specifies a unique animation handler
 */
function cuniq() {
    var d = new Date(),
        m = d.getMilliseconds() + '',
        u = ++d + m + (++c === 10000 ? (c = 1) : c);

    return u;
}

/********************
 *  Animation Shim  *
 ********************/

var lastTime = 0;
window.requestAnimationFrame = function (callback) {
    var now = Date.now();
    var nextTime = Math.max(lastTime + 16, now);
    return setTimeout(function () { callback(lastTime = nextTime); },
                      nextTime - now);
};
window.cancelAnimationFrame = clearTimeout;

/******************
 *  Time Warping  *
 ******************/

/**
 * Eases the animation in
 * @param {Number} complete The percent complete from 0 to 1
 */
function easeIn(complete) {
    return Math.pow(complete, 2);
}

/**
 * Eases the animation out
 * @param {Number} complete The percent complete from 0 to 1
 */
function easeOut(complete) {
    return 1 - Math.pow(1 - complete, 2);
}

/**
 * Eases in then out
 * @param {Number} complete The percent complete from 0 to 1
 */
function easeInOut(complete) {
    return complete - Math.sin(complete * 2 * Math.PI) / (2 * Math.PI);
}

/***************
 *  Animation  *
 ***************/

var listeners = [];

/**
 * A callback used to handle and continue to the next animation frame
 * @param {Number} now The current time
 */
function tick(now) {
    var listener, prog;

    for (var i = listeners.length - 1; i >= 0; i -= 1) {
        listener = listeners[0];

        // Handle finished animations
        if (now >= listener.finish) {
            listener.callback(1);
            if (listener.oncomplete) {
                setTimeout(listener.oncomplete, 0);
            }

            // Remove the completed animation
            listeners.splice(i, 1);
        }

        // Progress animations
        else {
            prog = (now - listener.start) / listener.duration;
            listener.callback(listener.warp(prog));
        }
    }

    // Request next animation frame if any listeners remain
    if (listeners.length) {
        window.requestAnimationFrame(tick);
    }
}

/**
 * Adds a new animation to the list of animation handlers
 * @param {Function} callback   The function called on each animation tick
 * @param {Number}   duration   The duration of the animation in milliseconds
 * @param {Function} warp       A time-warping function used for easing, etc.
 * @param {Function} oncomplete A callback that is called when the animation has completed
 */
function animate(callback, duration, warp, oncomplete) {
    var listener = {
        callback   : callback,
        duration   : duration,
        warp       : warp || function (prog) { return prog; },
        oncomplete : oncomplete,
        start      : Date.now(),
        finish     : Date.now() + duration,
        uid        : cuniq()
    };

    listeners.push(listener);

    // If first listener added, call the animation handler
    if (listeners.length === 1) {
        window.requestAnimationFrame(tick);
    }

    return listener.uid;
}

/**
 * Call to stop a particular animation from occurring. If an animation has been
 * canceled, it will still attempt to call the oncomplete method, passing a value
 * of 'true' as an argument.
 * @param {Number} uid The uid associated with a particular animation
 */
function cancel(uid) {
    var listener;

    // Search for the listener with the given uid and remove it
    for (var i = listeners.length - 1; i >= 0; i -= 1) {
        listener = listeners[i];
        if (listener.uid === uid) {
            listeners.splice(i, 1);

            // Run an oncomplete function if provided
            if (listener.oncomplete) { listener.oncomplete(true); }
        }
    }
}

// Add time warping functions
animate.easeIn    = easeIn;
animate.easeOut   = easeOut;
animate.easeInOut = easeInOut;

animate.cancel = cancel;

/*************
 *  Exports  *
 *************/

module.exports = animate;
