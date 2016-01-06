var assert = require('chai').assert;
var expect = require('chai').expect;
var _ = require('underscore');
var CateContainer = require('../src/cate_container').CateContainer;
var treedatas = require('./treedatas');

/*
[{
    "id": "1",
    "name": "艾德",
    "channels": [{
        "id": "6",
        "name": "商业杂志",
        "mapping_id": "6",
        "contents": [{
            "id": "5",
            "name": "IT时代周刊",
            "mapping_id": "5"
        }, {
            "id": "7",
            "name": "中文报刊",
            "mapping_id": "7"
        }]
    }, {
        "id": "10",
        "name": "金融",
        "mapping_id": "10",
        "contents": [{
                "id": "6",
            "name": "中国股票 ipad",
            "mapping_id": "6"
        }]
    }]
}]
 */

/*
// expect([{name: '1'}, {name: '2'}]).to.satisfy(function(num){
//     expect(foo).to.have.any.keys('bar', 'baz');
// });
 */
var cateContainer = new CateContainer(treedatas);

function reset() {
    cateContainer.set([{
        "id": "1",
        "name": "艾德",
        "channels": [{
            "id": "6",
            "name": "商业杂志",
            "mapping_id": "6",
            "contents": [{
                "id": "5",
                "name": "IT时代周刊",
                "mapping_id": "5"
            }, {
                "id": "7",
                "name": "中文报刊",
                "mapping_id": "7"
            }]
        }, {
            "id": "10",
            "name": "金融",
            "mapping_id": "10",
            "contents": [{
                "id": "6",
                "name": "中国股票 ipad",
                "mapping_id": "6"
            }]
        }]
    }]);
}
describe('CateContainer', function() {

    describe('# find in node', function() {
        it('find plat', function() {
            reset();

            var r = cateContainer.find({
                id: 1
            });
            assert.ok(r[0]);

            r = cateContainer.find({
                id: 1,
                channels: [{
                    id: 6
                }]
            })[0];
            assert.ok(r[0].id == 6);

            r = cateContainer.find({
                id: 1,
                channels: [{
                    id: 6,
                    contents: [{
                        id: 5
                    }, {
                        id: 7
                    }]
                }]
            })[0];
            assert.ok(r.length == 2);

            assert.ok(r[0].id == 5 || r[0].id == 7);
            assert.ok(r[1].id == 5 || r[1].id == 7);

            var ferro = function() {
                cateContainer.find({
                    id: 1,
                    channels: [{
                        id: 6,
                        contents: [{
                            id: 5
                        }, {
                            id: 7
                        }]
                    }, {
                        id: 4
                    }]
                });
            };

            expect(ferro).to.throw(Error);
        });


        it('find channels with no exist node', function() {
            reset();

            var data = {
                id: 1,
                channels: [{
                    id: 11
                }]
            };
            var r = cateContainer.find(data)[0];
            assert.ok(r.length === 0);
        });

        it('find contents with no exist node', function() {
            reset();

            var data = {
                id: 1,
                channels: [{
                    id: 6,
                    contents: [{
                        id: 8
                    }]
                }]
            };
            var r = cateContainer.find(data)[0];
            assert.ok(r.length === 0);
        });


    });


    describe('#insert plat', function() {


        it('it should success', function() {
            cateContainer.clear();
            cateContainer.insert({
                id: 1,
                name: 'ad'
            });
            assert.ok(cateContainer.get_container().length === 1);

            cateContainer.insert({
                id: 2,
                name: 'ad'
            });
            expect(cateContainer.get_container()).to.satisfy(function(c) {
                return c.length === 2 && c[1].id == 2;
            });
        });

        it('it should ignore', function() {
            cateContainer.clear();
            cateContainer.insert({
                id: 1,
                name: 'ad'
            });
            cateContainer.insert({
                id: 1
            });
            assert.ok(cateContainer.get_container().length === 1);
        });
    });

    describe('#insert channels', function() {
        it('channels should success', function() {
            reset();

            var data = {
                id: 1,
                channels: [{
                    id: 11
                }]
            };
            cateContainer.insert(data, true);
            var r = cateContainer.find(data)[0];

            assert.ok(r[0].id == 11);

        });

        it('channels should ignore', function() {
            reset();

            var data = {
                id: 1,
                channels: [{
                    id: 6
                }]
            };
            cateContainer.insert(data, true);
            var r = cateContainer.get_container()[0];

            assert.ok(r.channels.length === 2);

        });

        it('it should remove categories before insert category', function() {
            //todo:
            // assert.ok(false);
        });
    });


    describe('#insert contents', function() {
        it('contents should success', function() {
            reset();

            var data = {
                id: 1,
                channels: [{
                    id: 10,
                    contents: [{
                        id: 3
                    }]
                }]
            };
            cateContainer.insert(data, true);
            var r = cateContainer.find(data)[0];

            assert.ok(r[0].id == 3);

        });

        it('contents should ignore', function() {
            reset();

            var data = {
                id: 1,
                channels: [{
                    id: 10,
                    contents: [{
                        id: 3
                    }]
                }]
            };
            cateContainer.insert(data, true);
            var r = cateContainer.get_container()[0];

            assert.ok(r.channels[0].contents.length === 2);

        });

        it('remove categories before insert contents', function() {
            //todo:
            // assert.ok(false);
        });
    });


    describe('batch insert', function() {
        it('batch insert should success', function() {
            var data = [{
                "id": "1",
                "name": "艾德",
                "channels": [{
                    "id": "6",
                    "name": "商业杂志",
                    "mapping_id": "6",
                    "contents": [{
                        "id": "5",
                        "name": "IT时代周刊",
                        "mapping_id": "5"
                    }, {
                        "id": "7",
                        "name": "中文报刊",
                        "mapping_id": "7"
                    }]
                }, {
                    "id": "10",
                    "name": "金融",
                    "mapping_id": "10",
                    "contents": [{
                        "id": "6",
                        "name": "中国股票 ipad",
                        "mapping_id": "6"
                    }]
                }]
            }, {
                "id": "1",
                "name": "艾德",
                "channels": [{
                    "id": "3",
                    "name": "3xxx",
                    "mapping_id": "6",
                    "contents": [{
                        "id": "5",
                        "name": "IT时代周刊",
                        "mapping_id": "5"
                    }, {
                        "id": "7",
                        "name": "中文报刊",
                        "mapping_id": "7"
                    }]
                }, {
                    "id": "10",
                    "name": "金融",
                    "mapping_id": "10",
                    "contents": [{
                        "id": "8",
                        "name": "xxf",
                        "mapping_id": "6"
                    }]
                }]
            }, {
                id: 3,
                name: 'ad',
                channels: [{
                    id: 5,
                    contents: [{
                        id: 3
                    }]
                }]
            }];


            //---
            cateContainer.clear();

            cateContainer.batch_insert(data, true);

            assert.ok(cateContainer.get_container().length === 2);
            assert.ok(cateContainer.find({
                id: 1
            })[0].channels.length === 3);

            assert.ok(cateContainer.find({
                id: 1,
                channels: [{
                    id: 10
                }]
            })[0][0].contents.length === 2);


        });
    });

    describe('delete', function() {
        it('delete content should  success', function() {
            reset();

            //1, 6, 5
            var query = {
                id: 1,
                channels: [{
                    id: 6,
                    contents: [{
                        id: 5
                    }]
                }]
            };
            cateContainer.delete(query);

            var contents = cateContainer.find(query)[0];
            assert.ok(contents.length === 0);
        });

        it('delete channels should success', function() {
            reset();

            var query = {
                id: 1,
                channels: [{
                    id: 6
                }]
            };
            cateContainer.delete(query);
            assert.ok(cateContainer.find({
                id: 1
            })[0].channels.length === 1);

        });

        it('delete: should clear channels when no contents', function() {
            reset();

            var query = {
                id: 1,
                channels: [{
                    id: 10,
                    contents: [{
                        id: 6
                    }]
                }]
            };
            cateContainer.delete(query);

            assert.ok(cateContainer.find({
                id: 1,
                channels: [{
                    id: 10
                }]
            })[0].length === 0);
        });


    });

    describe('removeCategories', function() {
        it('should success insert', function() {
            cateContainer.clear();
            /*
            var query = {
                        "id": "1001",
                        "name": "读书/教育/报刊",
                        "pid": "lvl0_1",
                        "ad_plat": "1",
                        "mapping_id": "1001"
                    };

            TreeNode({"id":"9","name":"其他读物","pid":"1001","ad_plat":"1","mapping_id":"9"})
            TreeNode({"id":"8","name":"言情都市","pid":"1001","ad_plat":"1","mapping_id":"8"})
            TreeNode({"id":"7","name":"成功励志","pid":"1001","ad_plat":"1","mapping_id":"7"})
            TreeNode({"id":"6","name":"商业杂志","pid":"1001","ad_plat":"1","mapping_id":"6"})
            TreeNode({"id":"5","name":"职场外语","pid":"1001","ad_plat":"1","mapping_id":"5"})
            TreeNode({"id":"4","name":"非职场外语","pid":"1001","ad_plat":"1","mapping_id":"4"})
            TreeNode({"id":"3","name":"欧美日韩漫画","pid":"1001","ad_plat":"1","mapping_id":"3"})
            TreeNode({"id":"2","name":"儿童漫画","pid":"1001","ad_plat":"1","mapping_id":"2"})
            TreeNode({"id":"1","name":"儿童教育","pid":"1001","ad_plat":"1","mapping_id":"1"})
                */
            cateContainer.insert({
                id: 1,
                channels: [{
                    id: 1001,
                    name: '读书/教育/报刊',
                    contents: [{
                        "id": "9",
                        "name": "其他读物",
                        "pid": "1001",
                        "ad_plat": "1",
                        "mapping_id": "9"
                    }, {
                        "id": "8",
                        "name": "言情都市",
                        "pid": "1001",
                        "ad_plat": "1",
                        "mapping_id": "8"
                    }]
                }]
            });
            var cs = cateContainer.find({id: 1, channels:[{id: 1001}]})[0][0];
            assert.ok(cs.contents.length === 2);

            cateContainer.insert({
                id: 1,
                channels:[{
                    id: 1001,
                    name: '读书/教育/报刊'
                }]
            });

            cs = cateContainer.find({id: 1, channels:[{id: 1001}]})[0][0];
            assert.ok(cs.contents.length === 0);
        });


        it('middle category remove', function() {
            // todos:
            //set up
            // find middle node
            // var cateries = [];
            // var platid = '';
            // cateContainer.removeCategories(platid, cateries);
            // assert.ok(cateContainer.find()[0].length === 0);
        });

        it('top category remove', function() {

        });

        it('bottom category remove', function() {

        });
    });

});