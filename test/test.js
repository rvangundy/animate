'use strict';

var assert = chai.assert;
var animate = require('../src/animate');

describe('animate()', function() {

    it('is a function', function() {
        assert.ok(typeof animate === 'function');
    });

    it('calls all callbacks', function(next) {
        function callback(x) { assert.ok(isFinite(x), 'callback triggered'); }
        function warp(x) { assert.ok(isFinite(x), 'warping method triggered'); return x; }
        function oncomplete() {
            assert.ok(true, 'oncomplete triggered');
            next();
        }

        animate(callback, 1, warp, oncomplete);
    });

    it('can be cancelled', function(next) {
        var id;
        function callback() {
            animate.cancel(id);
        }
        function oncomplete(cancelled) {
            assert.ok(cancelled, 'oncomplete cancelled');
            next();
        }

        id = animate(callback, 2000, null, oncomplete);
    });
});
