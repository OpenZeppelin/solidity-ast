import type {ElementaryTypeName, Assignment, BinaryOperation, Conditional, ElementaryTypeNameExpression, IndexAccess, FunctionCall, FunctionCallOptions, Literal, MemberAccess, NewExpression, TupleExpression, UnaryOperation, FunctionTypeName, ForStatement, IfStatement, EmitStatement, ExpressionStatement, VariableDeclarationStatement, WhileStatement, PlaceholderStatement, UserDefinedTypeName, InheritanceSpecifier, ModifierInvocation, Identifier, Block, OverrideSpecifier, EnumValue, EnumDefinition, EventDefinition, FunctionDefinition, ParameterList, ArrayTypeName, Mapping, ModifierDefinition, InlineAssembly, ImportDirective, PragmaDirective, ContractDefinition, Return, StructDefinition, UsingForDirective, VariableDeclaration, StructuredDocumentation} from './types';
type SolidityNode = ElementaryTypeName | Assignment | BinaryOperation | Conditional | ElementaryTypeNameExpression | IndexAccess | FunctionCall | FunctionCallOptions | Literal | MemberAccess | NewExpression | TupleExpression | UnaryOperation | FunctionTypeName | ForStatement | IfStatement | EmitStatement | ExpressionStatement | VariableDeclarationStatement | WhileStatement | PlaceholderStatement | UserDefinedTypeName | InheritanceSpecifier | ModifierInvocation | Identifier | Block | OverrideSpecifier | EnumValue | EnumDefinition | EventDefinition | FunctionDefinition | ParameterList | ArrayTypeName | Mapping | ModifierDefinition | InlineAssembly | ImportDirective | PragmaDirective | ContractDefinition | Return | StructDefinition | UsingForDirective | VariableDeclaration | StructuredDocumentation;
function isElementaryTypeName(node: SolidityNode): node is ElementaryTypeName {
  return node.nodeType === 'ElementaryTypeName';
}
function isAssignment(node: SolidityNode): node is Assignment {
  return node.nodeType === 'Assignment';
}
function isBinaryOperation(node: SolidityNode): node is BinaryOperation {
  return node.nodeType === 'BinaryOperation';
}
function isConditional(node: SolidityNode): node is Conditional {
  return node.nodeType === 'Conditional';
}
function isElementaryTypeNameExpression(node: SolidityNode): node is ElementaryTypeNameExpression {
  return node.nodeType === 'ElementaryTypeNameExpression';
}
function isIndexAccess(node: SolidityNode): node is IndexAccess {
  return node.nodeType === 'IndexAccess';
}
function isFunctionCall(node: SolidityNode): node is FunctionCall {
  return node.nodeType === 'FunctionCall';
}
function isFunctionCallOptions(node: SolidityNode): node is FunctionCallOptions {
  return node.nodeType === 'FunctionCallOptions';
}
function isLiteral(node: SolidityNode): node is Literal {
  return node.nodeType === 'Literal';
}
function isMemberAccess(node: SolidityNode): node is MemberAccess {
  return node.nodeType === 'MemberAccess';
}
function isNewExpression(node: SolidityNode): node is NewExpression {
  return node.nodeType === 'NewExpression';
}
function isTupleExpression(node: SolidityNode): node is TupleExpression {
  return node.nodeType === 'TupleExpression';
}
function isUnaryOperation(node: SolidityNode): node is UnaryOperation {
  return node.nodeType === 'UnaryOperation';
}
function isFunctionTypeName(node: SolidityNode): node is FunctionTypeName {
  return node.nodeType === 'FunctionTypeName';
}
function isForStatement(node: SolidityNode): node is ForStatement {
  return node.nodeType === 'ForStatement';
}
function isIfStatement(node: SolidityNode): node is IfStatement {
  return node.nodeType === 'IfStatement';
}
function isEmitStatement(node: SolidityNode): node is EmitStatement {
  return node.nodeType === 'EmitStatement';
}
function isExpressionStatement(node: SolidityNode): node is ExpressionStatement {
  return node.nodeType === 'ExpressionStatement';
}
function isVariableDeclarationStatement(node: SolidityNode): node is VariableDeclarationStatement {
  return node.nodeType === 'VariableDeclarationStatement';
}
function isWhileStatement(node: SolidityNode): node is WhileStatement {
  return node.nodeType === 'WhileStatement';
}
function isPlaceholderStatement(node: SolidityNode): node is PlaceholderStatement {
  return node.nodeType === 'PlaceholderStatement';
}
function isUserDefinedTypeName(node: SolidityNode): node is UserDefinedTypeName {
  return node.nodeType === 'UserDefinedTypeName';
}
function isInheritanceSpecifier(node: SolidityNode): node is InheritanceSpecifier {
  return node.nodeType === 'InheritanceSpecifier';
}
function isModifierInvocation(node: SolidityNode): node is ModifierInvocation {
  return node.nodeType === 'ModifierInvocation';
}
function isIdentifier(node: SolidityNode): node is Identifier {
  return node.nodeType === 'Identifier';
}
function isBlock(node: SolidityNode): node is Block {
  return node.nodeType === 'Block';
}
function isOverrideSpecifier(node: SolidityNode): node is OverrideSpecifier {
  return node.nodeType === 'OverrideSpecifier';
}
function isEnumValue(node: SolidityNode): node is EnumValue {
  return node.nodeType === 'EnumValue';
}
function isEnumDefinition(node: SolidityNode): node is EnumDefinition {
  return node.nodeType === 'EnumDefinition';
}
function isEventDefinition(node: SolidityNode): node is EventDefinition {
  return node.nodeType === 'EventDefinition';
}
function isFunctionDefinition(node: SolidityNode): node is FunctionDefinition {
  return node.nodeType === 'FunctionDefinition';
}
function isParameterList(node: SolidityNode): node is ParameterList {
  return node.nodeType === 'ParameterList';
}
function isArrayTypeName(node: SolidityNode): node is ArrayTypeName {
  return node.nodeType === 'ArrayTypeName';
}
function isMapping(node: SolidityNode): node is Mapping {
  return node.nodeType === 'Mapping';
}
function isModifierDefinition(node: SolidityNode): node is ModifierDefinition {
  return node.nodeType === 'ModifierDefinition';
}
function isInlineAssembly(node: SolidityNode): node is InlineAssembly {
  return node.nodeType === 'InlineAssembly';
}
function isImportDirective(node: SolidityNode): node is ImportDirective {
  return node.nodeType === 'ImportDirective';
}
function isPragmaDirective(node: SolidityNode): node is PragmaDirective {
  return node.nodeType === 'PragmaDirective';
}
function isContractDefinition(node: SolidityNode): node is ContractDefinition {
  return node.nodeType === 'ContractDefinition';
}
function isReturn(node: SolidityNode): node is Return {
  return node.nodeType === 'Return';
}
function isStructDefinition(node: SolidityNode): node is StructDefinition {
  return node.nodeType === 'StructDefinition';
}
function isUsingForDirective(node: SolidityNode): node is UsingForDirective {
  return node.nodeType === 'UsingForDirective';
}
function isVariableDeclaration(node: SolidityNode): node is VariableDeclaration {
  return node.nodeType === 'VariableDeclaration';
}
function isStructuredDocumentation(node: SolidityNode): node is StructuredDocumentation {
  return node.nodeType === 'StructuredDocumentation';
}
