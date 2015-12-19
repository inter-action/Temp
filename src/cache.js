var Precondition = require('./precondition').Precondition;

function CacheItem(data){
    this._data = data;
    this._lastAccessTime = new Date().getTime() / 1000;
}

//@param timespan seconds
CacheItem.prototype.isValid = function(timespan) {
    Precondition.require(timespan);

    var now = new Date().getTime() / 1000;
    return now - this._lastAccessTime <= timespan;
};

CacheItem.prototype.get = function() {
    this._lastAccessTime = new Date().getTime() / 1000;
    return this._data;
};

function IdGenerator(){
    var id = 0;

    return function(){
        return id++ & 0xff;
    };
}
var newId = IdGenerator();

function Cache (idleTime) {
    this._id = newId();
    this._reg = {};
    this._maxIdleTime = idleTime || 30;//default to 30 secs
    this._checking_holder = null;
    this._checking_frequence = 1;// this should not be less than 100 millisecs
}

Cache.prototype.set = function(id, data) {
    Precondition.require(id, data);
    this._reg[id] = new CacheItem(data);
};

Cache.prototype.get = function(id) {
    Precondition.require(id);

    if (this._reg[id] != null && this._reg[id].isValid(this._maxIdleTime)){
        return this._reg[id].get();
    }
    return null; 
};

Cache.prototype.isValid = function(id) {
    Precondition.require(id);

    var result = false;

    if (this._reg[id] != null){
        if (this._reg[id].isValid(this._maxIdleTime))
            result = true;
        else
            this._reg[id] = null;
    }

    return result;
};
// !! warning: be cautious when using this feature, this could cause potential phantom read, 
// since this setInterval is running on the js Engine event queue
Cache.prototype.startChecking = function() {
    var _chk = function(){
        for (var i in this._reg){
            if (!this._reg[i].isValid(this._maxIdleTime)){
                // console.log('delete: ', i, JSON.stringify(this._reg));
                delete this._reg[i];
            }
        }
        return true;
    }.bind(this);

    var finished = true;
    this._checking_holder = setInterval(function(){
        if (finished){
            finished = false;
            finished = _chk();
        }
    }, this._checking_frequence * 1000);
};

Cache.prototype.destroy = function() {
    if (!this._checking_holder){
        clearInterval(this._checking_holder);
        this._reg = null;
    }
};


exports.Cache = Cache;


















