pragma solidity >=0.8.20;

contract T {
    event E();

    function test() external {
        // ContractDefinition.usedEvents
        emit E();

        // ContractDefinition.internalFunctionIDs
        (foo)();
    }

    function foo() internal {
    }


    // StructDefinition.documentation
    /// docs
    struct A {
        uint x;
    }
}
