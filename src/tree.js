var SingleLinkList = require('./single_link_list').SingleLinkList;
/*
{id:, pid: }
 */

// 不能创建 data 为 null 的节点
function TreeNode(data){
    this._data = data == null ? null: data;
    this._subnodes = SingleLinkList.newInstance();
}
function checkBuilder(indexBuilder){
    if (indexBuilder == null || indexBuilder.constructor !== IndexBuilder)
        throw new Error('index is needed');
}

TreeNode.zero = new TreeNode();

TreeNode.prototype.get = function() {
    return this._data;
};

TreeNode.prototype.isEmpty = function() {
    return this._data == null;
};

TreeNode.prototype.isTopRoot = function() {
    return this._data.isPlat === true;
};

TreeNode.prototype.hasChildNodes = function() {
    return !this._subnodes.isEmpty();
};

TreeNode.prototype.insertChild = function(node) {
    if (node == null || node.constructor !== TreeNode)
        throw new Error('invalid param');

    this._subnodes.insert(node);
};

// get list of childs, [TreeNode]
TreeNode.prototype.childs = function() {
    var result = [];
    this._subnodes.iterate(function(node){
        var trnode = node.get();
        result.push(trnode);
        var r = trnode.childs();
        if (r.length !== 0){
            Array.prototype.push.apply(result, r);
        }
    });
    return result;
};


// return all childNodes
TreeNode.prototype.childNodes = function() {
    return this._subnodes;
};


TreeNode.prototype.getParent = function(indexBuilder) {
    checkBuilder(indexBuilder);
    if (this.isTopRoot()) return TreeNode.zero;
    var index;
    if (this._data.pid.indexOf('lvl0') === 0){//begin with
        index = indexBuilder.buildUniqueId(null, this._data.pid);
    }else{
        index = indexBuilder.buildUniqueId(this._data.ad_plat, this._data.pid);
    }
    return indexBuilder.find(index);
};

//get parent nodes, smallest index means closest parent, plat root node is not included
//不包括平台根节点
TreeNode.prototype.parents = function(indexBuilder) {
    checkBuilder(indexBuilder);
    var rs = [];

    var node = this;

    if (node.isTopRoot()) return rs;

    while(true){
        node = node.getParent(indexBuilder);
        if (!node.isTopRoot()){
            rs.push(node);
        }else{
            break;
        }
    }

    return rs;
};



TreeNode.prototype.toString = function() {
    return 'TreeNode(' + JSON.stringify(this._data) + ')';
};

exports.TreeNode = TreeNode;

var IndexBuilder = (function(){

    function IndexBuilder(){
        /*
        id -> TreeNode
        */
        this._index = {};
    }

    IndexBuilder.prototype.buildIndex = function(list){
        var _this = this;
        list.forEach(function(e){
            var id = _this.buildEntryId(e);
            if (_this._index[id])
                throw new Error('duplicate id found, id:' + e + ', content:' + this._index[id]);
            _this._index[id] = new TreeNode(e);
        });

        for (var i in this._index){
            if (this._index.hasOwnProperty(i)){
                var node = this._index[i];
                if (!node.isTopRoot()){
                    var parent = node.getParent(this);
                    parent.insertChild(node);
                }
            }
        }

    };

    IndexBuilder.newInstance = function(datas){
        var builder = new IndexBuilder();
        builder.buildIndex(datas);
        return builder;
    };

    IndexBuilder.prototype.buildUniqueId = function(platid, id){
        if (id == null)
            throw new Error('invalid params');

        platid = platid == null ? '' : platid;
        return '' + platid + ':' + id;
    };

    IndexBuilder.prototype.buildEntryId = function(entry) {
        return this.buildUniqueId(entry.ad_plat, entry.id);
    };

    IndexBuilder.prototype.getIndex = function(){
        return this._index;
    };

    // bm: 必须校验 id 为空. 这是这个函数工作的前置条件
    IndexBuilder.prototype.find = function(id){
        if (id == null)
            throw new Error('invalid paramter');

        var r = this._index[id];
        if (r == null){
            throw new Error('failed to find @IndexBuilder, id: '+ id);
        }
        return r;
    };

    return IndexBuilder;

})();

exports.IndexBuilder = IndexBuilder;













