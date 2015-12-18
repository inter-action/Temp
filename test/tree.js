var assert = require('chai').assert;
// var expect = require('chai').expect;
var IndexBuilder = require('../src/tree').IndexBuilder;
var TreeNode = require('../src/tree').TreeNode;
var treedatas = require('./treedatas');

/*

    return {
        buildIndex: buildIndex,
        buildUniqueId: buildUniqueId,
        find: find
    };
 */
var builder = IndexBuilder.newInstance(treedatas);

describe('IndexBuilder', function() {
    it('should load treedatas', function() {
        assert.ok(treedatas && treedatas.length && treedatas[0].name === '儿童教育');
    });

    it('test unique id builder', function() {

        var r = {
            "id": "1",
            "name": "儿童教育",
            "pid": "1001",
            "ad_plat": "1",
            "mapping_id": "1"
        };
        var r2 = builder.find(builder.buildUniqueId(r.ad_plat, r.id)).get();
        assert.ok(r.id == r2.id && r.ad_plat == r2.ad_plat);
        assert.ok(builder.find(builder.buildEntryId(r)).get().id == r.id);
    });
});


describe('TreeNode', function() {

    it('getParent should work', function() {
        var e1 = {
            "id": "9999",
            "name": "其他类别",
            "pid": "lvl0_1",
            "ad_plat": "1",
            "mapping_id": "9999"
        };
        var node = builder.find(builder.buildEntryId(e1));

        var p1 = {
            "id": "lvl0_1",
            "name": "艾德",
            "alias": "se",
            "is_patch": "1",
            "tips": "",
            "pid": "lvl0",
            "_id": "1",
            "isPlat": true
        };

        assert.ok(node.getParent(builder).get().id === p1.id, 'A');


        var e2 = {
            "id": "99",
            "name": "其他应用",
            "pid": "9999",
            "ad_plat": "1",
            "mapping_id": "99"
        };
        var p2 = {
            "id": "9999",
            "name": "其他类别",
            "pid": "lvl0_1",
            "ad_plat": "1",
            "mapping_id": "9999"
        };
        node = builder.find(builder.buildEntryId(e2));
        var pnode = node.getParent(builder);
        assert.ok(pnode.get().id === e2.pid && pnode.get().id === p2.id, 'B');

    });

    it('test childs', function() {
        var query = {
            "id": "1001",
            "name": "读书/教育/报刊",
            "pid": "lvl0_1",
            "ad_plat": "1",
            "mapping_id": "1001"
        };
        var childs = builder.find(builder.buildEntryId(query)).childs();
        assert(childs.length === 9);
        // console.log(childs.map(function(e){ return e.toString(); }).join('\n'));
    });


    it('insert child node', function(){
        var node  = new TreeNode('a');
        node.insertChild(new TreeNode('b'));
        assert.ok(node.hasChildNodes());
        assert.ok(node.childNodes().length() == 1);
    });


    it('parents', function(){
        var query = {"id":"8","name":"言情都市","pid":"1001","ad_plat":"1","mapping_id":"8"};
        var ps = builder.find(builder.buildEntryId(query)).parents(builder);
        assert.ok(ps.length === 1 && ps[0].get().id === '1001');
    });

});




















