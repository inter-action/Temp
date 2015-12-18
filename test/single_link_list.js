var assert = require('chai').assert;
var expect = require('chai').expect;
var SingleLinkList = require('../src/single_link_list').SingleLinkList;
var Node = require('../src/single_link_list').Node;


describe('single link list', function() {
    describe('Node operation', function(){
        it('init value should be null', function(){
            var node = new Node();
            assert.ok(node.get() == null);
            assert.ok(!node.hasNext());
        });

        it('should get right value', function(){
            var node = new Node('test');
            assert.ok(node.get() === 'test');
        });

        it('null node @next returns Node', function(){
            var node = new Node().next();
            assert.ok(node.constructor === Node);
        });

        it('append success', function(){
            var node = new Node('test');
            node.append(new Node('n2'));
            assert.ok(node.next().get() === 'n2');
        });

        it('throw error when append none Node type', function(){
            var node = new Node('test');

            var ferro = function(){
                node.append('abc');
            };
            expect(ferro).to.throw(Error);
        });

        it('prepend success', function(){
            var node = new Node();
            var head = node.prepend(new Node('head'));
            assert.ok(head.hasNext() && head.next().get() == null && head.get() === 'head');
        });

        it('throw error when prepend none Node type', function(){
            var ferro = function(){
                new Node().prepend('test');
            };
            expect(ferro).to.throw(Error);
        });
    });


    describe('list operation', function(){
        it('insert should succeed', function(){
            var list = SingleLinkList.newInstance();
            list.insert({name: 'alex'});
            assert.ok(list.length() === 1);

        });

        it('length should works', function(){
            var list = SingleLinkList.newInstance();
            assert.ok(list.length() === 0);
        });

        it('find existed should work', function(){
            var list = SingleLinkList.newInstance();
            list.insert({name: 'alex'});

            var result = list.find(function(n){return n.get().name === 'alex';}).get();
            assert.ok(result.name === 'alex');
        });


        it('list to String', function(){
            var list = SingleLinkList.newInstance();
            list.insert({name: 'alex'}).insert({name: 'james'});
            console.log(list.toString());
        });

        it('isEmpty', function(){
            var list = SingleLinkList.newInstance();
            assert.ok(list.isEmpty());

            list.insert('test');
            assert.ok(!list.isEmpty());
        });


        it('delete should work', function(){
            var list;
            list = SingleLinkList.newInstance();

            list.insert('text');
            list.delete(function(node){ return node.get() === 'text'; });
            assert.ok(list.length() === 0);

            list.insert('text').insert('james');
            list.delete(function(node){return node.get() === 'text';});
            assert.ok(list.length() === 1);
            assert.ok(list.find(function(n){return n.get() === 'james';}).get() === 'james');

            list.insert('text').insert('james').insert('jimmy');
            list.delete(function(node){return node.get() === 'james';});
            assert.ok(list.length() === 2);

        });

    });
});