var _ = require('underscore');
var CateRelations = require('./cate_relations').CateRelations;
var Precondition = require('./precondition').Precondition;


function CateContainer(treedatas){
    Precondition.require(treedatas);

    this._container = [];
    this._cateRelations = new CateRelations(treedatas);
}

/*
@param skipRemoveCateogries {bool} only used in unit test, you probably dont need this
*/
CateContainer.prototype.insert = function(item, skipRemoveCateogries){

    var ref = this.find({id: item.id});
    var plat = ref[0];

    if (!plat) this._container.push(item);

    if (item.channels && item.channels.length > 1){//多个channels的情况

        var items = item.channels.map(function(e){
            return {id: item.id, channels: [e]};
        });
        var _this = this;
        _.each(items, function(e){
            _this.insert(e, skipRemoveCateogries);
        });

        return;
    }


    if (item.channels && item.channels[0]){
        if (!skipRemoveCateogries){
            var cateIds = this._cateRelations
                .directUpAndDownCaties(item.id, item.channels[0].id)
                .map(function(e){
                    return e.id;
                });

            this.removeCategories(item.id, cateIds);
        }

        ref = this.find({id: item.id, channels:[{id: item.channels[0].id}]})[0];

        if (!ref.length){
            if (!plat.channels) plat.channels = [];
            plat.channels.push(item.channels[0]);
        }else{
            var ch = ref[0];
            if (item.channels[0].contents){
                var item_contents = item.channels[0].contents;
                if (item_contents.length){
                    _.each(item_contents, function(m){
                        var isfound = _.find(ch.contents, function(n){
                            return n.id == m.id;
                        });
                        if (!isfound){
                            if (!ch.contents) ch.contents = [];
                            ch.contents.push(m);
                        }
                    });
                }

            }else{// 移除 contents
                if (ch.contents != null)
                    ch.contents.length = 0;
            }
        }
    }
};

CateContainer.prototype.batch_insert = function(items, skipRemoveCateogries){
    if (!_.isArray(items)) throw new Error('invalid parameters');

    var _this = this;
    items.forEach(function(e){
        _this.insert(e, skipRemoveCateogries);
    });
};

CateContainer.prototype.log = function(){
    console.log('container content:\n: ', JSON.stringify(this._container));
};

/*
查找是否存在, 如果是平台, 返回平台信息
其他形式返回数组

有可能存在查找不全的情况, 结果照样返回
 */
CateContainer.prototype.find = function(item){
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

CateContainer.prototype.set = function(data){
    this._container = data;
};

CateContainer.prototype.clear = function(){
    this._container.length = 0;
};


/*
query valid form:
    -{id: channels:[{id:}]}
    -{id: channels:[{id:, contents:[{id:}...]}]}
 */
CateContainer.prototype.delete = function(query){
    if (!(query.id && query.channels && query.channels.length === 1))
        throw new Error('invalid parameters');

    var channel = this.find({id: query.id, channels:[{id: query.channels[0].id}]})[0][0];

    if (!channel) return ;

    var rm_channel = function(){
        var plat = this.find({id: query.id})[0];
        if (!plat) return;

        var i = _.findIndex(plat.channels, function(m){
            return m.id == channel_query.id;
        });

        if (i !== -1){
            if (plat.channels.length === 1){ // remove plat when channels are all removed
                var j = _.findIndex(this._container, function(e){
                    return e.id == query.id;
                });

                if (j !== -1){
                    this._container.splice(j, 1);
                }
            }else{
                plat.channels.splice(i, 1);
            }
        }
    }.bind(this);

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

CateContainer.prototype.get_container = function(){
    return this._container;
};

CateContainer.prototype.removeCategories = function(platid, cateIds) {
    Precondition.require(platid, cateIds);

    var plat = this.find({id: platid})[0];

    if (plat === null) throw new Error('fatal logic error');


    if (plat.channels && plat.channels.length){
        cateIds.forEach(function(m){
            var index = _.findIndex(plat.channels, function(n){
                return m == n.id;
            });

            if (index !== -1){
                plat.channels.splice(index, 1);
            }
        });
    }
};

module.exports.CateContainer = CateContainer;