class Heap {
    constructor(hash) {
        // holds the elements in the heap
        this.elems = [];
        // priority value for each element
        this.values = [];
        // maps elements to their indexes in `elems` list
        this.refs = new Dict(hash);
    }
    push(elem, value) {
        var index = this.elems.length;
        this.elems.push(elem);
        this.values.push(value);
        this.refs.set(elem, index);
        
        this._sift_up( index );
    }
    pop() {
        this._swap( 0, this.elems.length - 1 );
    
        var max = this.elems.pop();
        this.values.pop();
        this.refs.delete( max );
    
        this._sift_down( 0 );
        return max;
    }
    is_empty() {
        return this.elems.length == 0;
    }
    has(elem) {
        return this.refs.has(elem);
    }
    update( elem ) {
        if( !this.refs.has( elem ) ) {
            throw new Error( "Item not found" );
        }
    
        this._sift_up( this.refs.get( elem ) );
        this._sift_down( this.refs.get( elem ) );
    }
    _swap( i, j ) {
        // swaps elements in the array
        var elem1 = this.elems[i];
        var elem2 = this.elems[j];
    
        this.elems[i] = elem2;
        this.elems[j] = elem1;
    
        // swaps index references
        this.refs.set(elem1, j);
        this.refs.set(elem2, i);

        // swaps values
        var value_i = this.values[i];
        this.values[i] = this.values[j];
        this.values[j] = value_i;
    }
    _sift_up( index ) {
        while( index > 0 ) {
            var parent_index = ((index + 1) >>> 1) - 1;
            if( this.values[parent_index] < this.values[index] ) {
                break;
            }
    
            this._swap( index, parent_index );
            index = parent_index;
        }
    }
    _sift_down( index ) {
        var left_child_index = (index + 1) * 2 - 1;
        
        while( left_child_index < this.elems.length ) {
            var right_child_index = left_child_index + 1;
    
            if( right_child_index < this.elems.length ) {
                var l_value = this.values[left_child_index];
                var r_value = this.values[right_child_index];
                var larger_child_index = ( l_value < r_value ) ? left_child_index : right_child_index;
            } else {
                var larger_child_index = left_child_index;
            }
            
            if( this.values[index] <= this.values[larger_child_index] ) {
                break;
            }
        
            this._swap( index, larger_child_index );
            index = larger_child_index;
            left_child_index = (index + 1) * 2 - 1;
        }
    }
};

class Dict {
    constructor(hash) {
        this.map = new Map();
        this.hash = hash;
    }
    set(key, value) {
        this.map.set(this.hash(key), value);
    }
    get(key) {
        return this.map.get(this.hash(key));
    }
    has(key, value) {
        return this.map.has(this.hash(key), value);
    }
    delete(key) {
        this.map.delete(this.hash(key));
    }
};