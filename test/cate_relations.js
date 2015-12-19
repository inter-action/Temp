var assert = require('chai').assert;
var treedatas = require('./treedatas');
var CateRelations = require('../src/cate_relations').CateRelations;

var cateRelations = new CateRelations(treedatas); 

describe('CateRelations', function(){
    it('directUpAndDownCaties', function(){
        var query = {
            "id": "1001",
            "name": "读书/教育/报刊",
            "pid": "lvl0_1",
            "ad_plat": "1",
            "mapping_id": "1001"
        };
        var rs = cateRelations.directUpAndDownCaties(query.ad_plat, query.id);
        assert(rs.length === 9);
    });
});