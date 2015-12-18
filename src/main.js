var _ = require('underscore');

var exports = {
    _container: []
};


exports.insert = function(item){

    var ref = this.find({id: item.id});
    var plat = ref[0];

    if (!plat) this._container.push(item);

    if (item.channels && item.channels.length > 1){//多个channels的情况

        var items = item.channels.map(function(e){
            return {id: item.id, channels: [e]};
        });
        var _this = this;
        _.each(items, function(e){
            _this.insert(e);
        });

        return;
    }

    if (item.channels && item.channels[0]){
        ref = this.find({id: item.id, channels:[{id: item.channels[0].id}]});

        if (!ref[0].length){
            if (!plat.channels) plat.channels = [];
            plat.channels.push(item.channels[0]);
        }else{
            if (item.channels[0].contents && item.channels[0].contents.length){
                var ch = ref[0][0];
                var cs = this.find(item)[0];

                if (cs.length){
                    if (cs.length != ch.contents.length){
                        _.each(cs, function(m){
                            var isfound = _.find(ch.contents, function(n){
                                return n.id == m.id;
                            });

                            if (!isfound){
                                if (!ch.contents) ch.contents = [];
                                ch.contents.push(m);
                            }
                        });
                    }
                }else{
                    ch.contents = ch.contents.concat(item.channels[0].contents);
                }
            }
        }
    }
};

exports.batch_insert = function(items){
    if (!_.isArray(items)) throw new Error('invalid parameters');

    var _this = this;
    items.forEach(function(e){
        _this.insert(e);
    });
};

exports.log = function(){
    console.log('container content:\n: ', JSON.stringify(this._container));
};

/*
查找是否存在, 如果是平台, 返回平台信息
其他形式返回数组

有可能存在查找不全的情况, 结果照样返回
 */
exports.find = function(item){
    var plat = _.find(this._container, function(e){
        return item.id == e.id;
    });

    if (!plat) return [null, 0];
    if (!item.channels) return [plat, 0];

    var rs = [];
    if (item.channels && item.channels.length){
        rs = item.channels.map(function(channel){
            return _.find(plat.channels, function(_channel){
                return _channel.id == channel.id;
            });
        }).filter(function(e){return e != null;});
    }

    if (item.channels[0].contents == null || item.channels[0].contents.length === 0)
        return [rs, 1];

    if (item.channels.length !== 1)
        throw new Error('invalid usage: multiple channels query with contents');

    rs = item.channels[0].contents.map(function(f){
        return _.find(rs[0].contents, function(e){
            return e.id == f.id;
        });
    }).filter(function(e){return e != null;});

    return [rs, 2];

};

exports.set = function(data){
    this._container = data;
};

exports.clear = function(){
    this._container.length = 0;
};


/*
query valid form:
    -{id: channels:[{id:}]}
    -{id: channels:[{id:, contents:[{id:}...]}]}
 */
exports.delete = function(query){
    if (!(query.id && query.channels && query.channels.length === 1))
        throw new Error('invalid parameters');

    var channel = this.find({id: query.id, channels:[{id: query.channels[0].id}]})[0][0];

    if (!channel) return ;

    var _this = this;
    function rm_channel(){
        var plat = _this.find({id: query.id})[0];
        if (!plat) return;

        var i = _.findIndex(plat.channels, function(m){
            return m.id == channel_query.id;
        });

        if (i !== -1){
            plat.channels.splice(i, 1);
        }
    }

    var channel_query = query.channels[0];
    if (channel_query.contents && channel_query.contents.length){
        if (channel.contents){
            _.each(channel_query.contents, function(m){
                var i = _.findIndex(channel.contents, function(n){
                    return m.id == n.id;
                });

                if (i !== -1){
                    if (channel.contents.length === 1){
                        rm_channel();
                    }else{
                        channel.contents.splice(i, 1);
                    }
                }
            });
        }

    }else{
        rm_channel();
    }

};

exports.get_container = function(){
    return this._container;
};

module.exports = exports;