function Precondition(){

}
// check precondition requirements
Precondition.require = function(){
    if (arguments.length === 0)
        throw new Error('invalid param');

    for (var i = 0; i<arguments.length; i++){
        if (arguments[i] == null){
            throw new Error('invalid params');
        }
    }
};


exports.Precondition = Precondition;
