var IndexBuilder = require('./tree').IndexBuilder;
var Cache = require('./cache').Cache;
var Precondition = require('./precondition').Precondition;

/*

build the index,

hold index reference
directUpAndDownNodes
leverage the cache
*/

function CateRelations(treedatas){
    Precondition.require(treedatas);

    this._indexer = IndexBuilder.newInstance(treedatas);
    this._cache = new Cache();
    // this._cache.startChecking();
}
/*
返回对应节点的直接上层分类节点和所有下层节点:

@param platid {string, number}: 平台id
@param cateid {string, number}: 分类id

@return List[Entry]

type Entry:
    {
        "id": "1",
        "name": "儿童教育",
        "pid": "1001",
        "ad_plat": "1",
        "mapping_id": "1"
    }
*/
CateRelations.prototype.directUpAndDownCaties = function(platid, cateid, skipCache) {
    Precondition.require(platid, cateid);

    var find = function(){
        var node = this._indexer.find(this._indexer.buildUniqueId(platid, cateid));
        return node.parents(this._indexer)
            .concat(node.childs())
            .map(function(e){ return e.get(); });
    }.bind(this);

    if (skipCache){
        return find();
    }else{
        var id = this._indexer.buildUniqueId(platid, cateid);
        if (!this._cache.isValid(id)){
            var r = find();
            this._cache.set(id, r);
            return r;
        }else{
            var result = this._cache.get(id);
            if (result == null){
                throw new Error('fatal logic error');
            }
            return result;
        }
    }
};

// call destroy to release resources
CateRelations.prototype.destroy = function() {
    this._cache.destroy();
};

exports.CateRelations = CateRelations;
