Array.prototype.find = function(validator) {
    var result = undefined;
    var count = this.length;

    for(var i = 0; i < count; i++) {
        var current = this[i];
        
        if(validator(current)) {
            result = current;
            break;
        }
    }

    return result;
}