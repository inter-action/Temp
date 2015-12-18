var assert = require('chai').assert;
var expect = require('chai').expect;
var _ = require('underscore');
var dsp = require('../src/main');

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

function reset() {
    dsp.set([{
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
describe('dsp', function() {

    describe('# find in node', function() {
        it('find plat', function() {
            reset();

            var r = dsp.find({
                id: 1
            });
            assert.ok(r[0]);

            r = dsp.find({
                id: 1,
                channels: [{
                    id: 6
                }]
            })[0];
            // console.log(JSON.stringify(dsp.find({id: 1, channels:[{id: 6}]})));
            assert.ok(r[0].id == 6);

            r = dsp.find({
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
                dsp.find({
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
            var r = dsp.find(data)[0];
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
            var r = dsp.find(data)[0];
            assert.ok(r.length === 0);
        });


    });


    describe('#insert plat', function() {


        it('it should success', function() {
            dsp.clear();
            dsp.insert({
                id: 1,
                name: 'ad'
            });
            assert.ok(dsp.get_container().length === 1);

            dsp.insert({
                id: 2,
                name: 'ad'
            });
            expect(dsp.get_container()).to.satisfy(function(c) {
                return c.length === 2 && c[1].id == 2;
            });
        });

        it('it should ignore', function() {
            dsp.clear();
            dsp.insert({
                id: 1,
                name: 'ad'
            });
            dsp.insert({
                id: 1
            });
            assert.ok(dsp.get_container().length === 1);
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
            dsp.insert(data);
            var r = dsp.find(data)[0];

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
            dsp.insert(data);
            var r = dsp.get_container()[0];

            assert.ok(r.channels.length === 2);

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
            dsp.insert(data);
            var r = dsp.find(data)[0];

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
            dsp.insert(data);
            var r = dsp.get_container()[0];

            assert.ok(r.channels[0].contents.length === 2);

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
            },{
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
            },{
                id: 3,
                name: 'ad',
                channels:[{
                    id: 5,
                    contents:[{
                        id:3
                    }]
                }]
            }];


            //---
            dsp.clear();

            dsp.batch_insert(data);

            assert.ok(dsp.get_container().length === 2);
            assert.ok(dsp.find({id: 1})[0].channels.length === 3);
            // console.log(JSON.stringify(dsp.find({id:1, channels:[{id: 10}]})));return;
            assert.ok(dsp.find({id:1, channels:[{id: 10}]})[0][0].contents.length === 2);


        });
    });

    describe('delete', function(){
        it('delete content should  success', function(){
            reset();

            //1, 6, 5
            var query = {id: 1, channels:[{id: 6, contents:[{id: 5}]}]};
            dsp.delete(query);

            var contents = dsp.find(query)[0];
            assert.ok(contents.length === 0);
        });

        it('delete channels should success', function(){
            reset();

            var query = {id: 1, channels:[{id: 6}]};
            dsp.delete(query);
            assert.ok(dsp.find({id: 1})[0].channels.length === 1);

        });

        it('delete: should clear channels when no contents', function(){
            reset();

            var query = {id: 1, channels:[{id: 10, contents:[{id: 6}]}]};
            dsp.delete(query);

            assert.ok(dsp.find({id:1, channels:[{id: 10}]})[0].length === 0);
        });
    });

});