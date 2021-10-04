pragma solidity >=0.8.8;

// Enum min and max
contract T {
    enum E { A, B }
    function minmax(bool b) external returns (E) {
        return b ? type(E).min : type(E).max;
    }
}


// User defined value types
type Price is uint128;
contract UDVT {
    type Quantity is uint128;
}
