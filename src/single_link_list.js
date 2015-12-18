var Node = (function() {
    function Node(data) {
        this._data = data == null ? null: data;
        this._next = null;
    }

    Node.prototype.ZERO = new Node();

    Node.zero = function() {
        return new Node();
    };

    Node.prototype.get = function() {
        return this._data;
    };

    Node.prototype.append = function(node) {
        if (node == null || node.constructor !== Node) throw new Error('invalid parameter');

        this._next = node;
    };

    Node.prototype.prepend = function(node) {
        if (node == null || node.constructor !== Node)
            throw new Error('invalid parameter');

        node._next = this;

        return node;
    };

    Node.prototype.next = function() {
        if (this.hasNext())
            return this._next;
        else
            return this.ZERO;
    };

    Node.prototype.hasNext = function() {
        return this._next != null;
    };

    Node.prototype.toString = function() {
        return '[Node](' + JSON.stringify(this._data) + ')';
    };

    return Node;
})();
exports.Node = Node;

var SingleLinkList = (function(){
    function SingleLinkList(){
        this._head = new Node();
    }

    SingleLinkList.newInstance = function() {
        return new SingleLinkList();
    };

    SingleLinkList.prototype.length = function() {
        var count = 0;

        this.iterate(function(){
            count++;
        });

        return count;
    };

    SingleLinkList.prototype.iterate = function(cb) {
        var node = this._head;
        if (!this._head.hasNext()) return;//skip zero node

        do{
            cb(node);
            node = node.next();
        }while(node.hasNext());
    };

    SingleLinkList.prototype.find = function(cb) {
        var rnode = Node.zero();
        if (!this._head.hasNext()) return rnode;//skip zero node

        var node = this._head;

        do {
            if (cb(node)){
                rnode = node;
                break;
            }
            node = node.next();
        }while(node.hasNext());

        return rnode;
    };


    SingleLinkList.prototype.insert = function(data) {
        var node = new Node(data);
        this._head = this._head.prepend(node);
        return this;
    };

    SingleLinkList.prototype.delete = function(cb) {
        var pre = null;
        var _this = this;
        this.iterate(function(node){
            if (cb(node)){
                if (pre){
                    pre._next = node._next;
                }else{
                    _this._head = node._next;
                }
            }
            pre = node;
        });
    };

    SingleLinkList.prototype.toString = function() {
        var rs = [];

        this.iterate(function(n){
            rs.push(n.toString() + ' -> ');
        });

        return rs.join('');
    };

    SingleLinkList.prototype.isEmpty = function(){
        return !this._head.hasNext();
    };

    return SingleLinkList;
})();

exports.SingleLinkList = SingleLinkList;


