var assert = require('chai').assert;
var Cache = require('../src/cache').Cache;

var cache = new Cache(2);
describe('Cache', function(){
    this.timeout(3000);
    it('invalid on time', function(done){
        cache.set('key', 'hello');

        setTimeout(function(){
            assert.ok(!cache.isValid('key'));
            assert.ok(cache.get('key') == null);
            done();
        }, 2400);
    });

    it('valid', function(done){
        cache.set('key', 'hello');
        setTimeout(function(){
            assert.ok(cache.isValid('key'));
            assert.ok(cache.get('key'));
            done();
        }, 1000);
    });

    it('valid after reaccess', function(done){
        cache.set('key', 'hello');
        setTimeout(function(){
            cache.get('key');

            setTimeout(function(){
                assert.ok(cache.isValid('key'));
                done();
            }, 500);
        }, 1900);
    });


    it('should automatically clear cache', function(done){
        var ch = new Cache(1);
        ch.set('tkey', 'hello');
        ch.startChecking();

        setTimeout(function(){
            assert.ok(ch._reg.tkey == null);
            done();
        }, 1200);
    });
});

