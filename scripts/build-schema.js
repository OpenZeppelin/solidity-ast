#!/usr/bin/env node

'use strict';

const boolean = { type: 'boolean' };
const string = { type: 'string' };
const integer = { type: 'integer' };
const _null = { type: 'null' };

const pattern = pat => ({ type: 'string', pattern: pat.source });
const literal = (...values) => ({ enum: values });
const array = items => ({ type: 'array', items });
const record = values => ({ type: 'object', additionalProperties: values });
const anyOf = (...types) => ({ 'anyOf': types });
const ref = id => ({ $ref: `#/definitions/${id}` });

const $optional = Symbol('optional');
const optional = schema => ({ ...schema, [$optional]: true });
const nullable = schema => schema ? optional(anyOf(schema, _null)) : optional(_null);

const object = (properties = {}) => ({
  type: 'object',
  additionalProperties: false,
  properties,
  required: Object.keys(properties).filter(p => !properties[p][$optional]),
});

const baseNode = {
  id: integer,
  src: ref('SourceLocation'),
};

const node = (type, props) => object({ ...baseNode, ...props, nodeType: literal(type) });

const baseYulNode = {
  src: ref('SourceLocation'),
};

const yulNode = (type, props) => object({ ...baseYulNode, ...props, nodeType: literal(type) });

const mapValues = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(k, v)]));

const nodes = (defs) => mapValues(defs, node);
const yulNodes = (defs) => mapValues(defs, yulNode);

const documentation = nullable(ref('StructuredDocumentation'));
const typeDescriptions = ref('TypeDescriptions');
const overrides = nullable(ref('OverrideSpecifier'));
const parameters = ref('ParameterList');
const visibility = ref('Visibility');

const baseDefinition = {
  name: string,
  nameLocation: optional(string),
};

const baseExpression = {
  argumentTypes: nullable(array(ref('TypeDescriptions'))),
  isConstant: boolean,
  isLValue: optional(boolean),
  isPure: boolean,
  lValueRequested: boolean,
  typeDescriptions,
};

const baseExpressionL = {
  ...baseExpression,
  isLValue: boolean,
};

const baseStatement = {
  documentation: optional(string),
};

const baseTypeName = {
  typeDescriptions: ref('TypeDescriptions'),
};

const schema = {
  $schema: 'http://json-schema.org/draft-06/schema#', 

  title: 'SourceUnit',

  ...node('SourceUnit', {
    absolutePath: string,
    exportedSymbols: record(array(integer)),
    license: nullable(string),
    nodes: array(anyOf(
      ref('ContractDefinition'),
      ref('EnumDefinition'),
      ref('ErrorDefinition'),
      ref('FunctionDefinition'),
      ref('ImportDirective'),
      ref('PragmaDirective'),
      ref('StructDefinition'),
      ref('VariableDeclaration'),
    )),
  }),

  definitions: {
    SourceLocation: pattern(/^\d+:\d+:\d+$/),

    Mutability: literal(
      'mutable',
      'immutable',
      'constant',
    ),

    StateMutability: literal(
      'payable',
      'pure',
      'nonpayable',
      'view',
    ),

    StorageLocation: literal(
      'calldata',
      'default',
      'memory',
      'storage',
    ),

    Visibility: literal(
      'external',
      'public',
      'internal',
      'private',
    ),

    TypeDescriptions: object({
      typeIdentifier: nullable(string),
      typeString: nullable(string),
    }),

    Expression: anyOf(
      ref('Assignment'),
      ref('BinaryOperation'),
      ref('Conditional'),
      ref('ElementaryTypeNameExpression'),
      ref('FunctionCall'),
      ref('FunctionCallOptions'),
      ref('Identifier'),
      ref('IndexAccess'),
      ref('Literal'),
      ref('MemberAccess'),
      ref('NewExpression'),
      ref('TupleExpression'),
      ref('UnaryOperation'),
    ),

    Statement: anyOf(
      ref('Block'),
      ref('EmitStatement'),
      ref('ExpressionStatement'),
      ref('ForStatement'),
      ref('IfStatement'),
      ref('InlineAssembly'),
      ref('PlaceholderStatement'),
      ref('Return'),
      ref('RevertStatement'),
      ref('TryStatement'),
      ref('UncheckedBlock'),
      ref('VariableDeclarationStatement'),
      ref('WhileStatement'),
    ),

    TypeName: anyOf(
      ref('ArrayTypeName'),
      ref('ElementaryTypeName'),
      ref('FunctionTypeName'),
      ref('Mapping'),
      ref('UserDefinedTypeName'),
    ),

    ...nodes({
      ArrayTypeName: {
        ...baseTypeName,
        baseType: ref('TypeName'),
        length: nullable(ref('Expression')),
      },

      Assignment: {
        ...baseExpressionL,
        leftHandSide: ref('Expression'),
        operator: literal(
          '=',
          '+=',
          '-=',
          '*=',
          '/=',
          '%=',
          '|=',
          '&=',
          '^=',
        ),
        rightHandSide: ref('Expression'),
      },

      BinaryOperation: {
        ...baseExpressionL,
        commonType: ref('TypeDescriptions'),
        leftExpression: ref('Expression'),
        operator: literal(
          '+',
          '-',
          '*',
          '/',
          '%',
          '**',
          '&&',
          '||',
          '!=',
          '==',
          '<',
          '<=',
          '>',
          '>=',
          '^',
          '<<',
          '>>'
        ),
        rightExpression: ref('Expression'),
      },

      Block: {
        ...baseStatement,
        statements: nullable(array(ref('Statement'))),
      },

      Conditional: {
        ...baseExpressionL,
        condition: ref('Expression'),
        falseExpression: ref('Expression'),
        trueExpression: ref('Expression'),
      },

      ContractDefinition: {
        ...baseDefinition,
        abstract: boolean,
        baseContracts: array(ref('InheritanceSpecifier')),
        contractDependencies: array(integer),
        contractKind: literal('contract', 'interface', 'library'),
        documentation,
        fullyImplemented: boolean,
        linearizedBaseContracts: array(integer),
        nodes: array(anyOf(
          ref('EnumDefinition'),
          ref('ErrorDefinition'),
          ref('EventDefinition'),
          ref('FunctionDefinition'),
          ref('ModifierDefinition'),
          ref('StructDefinition'),
          ref('UsingForDirective'),
          ref('VariableDeclaration'),
        )),
        scope: integer,
        usedErrors: optional(array(integer)),
      },

      ElementaryTypeName: {
        ...baseTypeName,
        name: string,
        stateMutability: optional(ref('StateMutability')),
      },

      ElementaryTypeNameExpression: {
        ...baseExpressionL,
        typeName: ref('ElementaryTypeName'),
      },

      EmitStatement: {
        ...baseStatement,
        eventCall: ref('FunctionCall'),
      },

      EnumDefinition: {
        ...baseDefinition,
        canonicalName: string,
        members: array(ref('EnumValue')),
      },

      EnumValue: {
        ...baseDefinition,
      },

      ErrorDefinition: {
        ...baseDefinition,
        documentation,
        parameters,
        nameLocation: string,
      },

      EventDefinition: {
        ...baseDefinition,
        anonymous: boolean,
        documentation,
        parameters,
      },

      ExpressionStatement: {
        ...baseStatement,
        expression: ref('Expression'),
      },

      ForStatement: {
        ...baseStatement,
        body: anyOf(
          ref('Block'),
          ref('Statement'),
        ),
        condition: nullable(ref('Expression')),
        initializationExpression: nullable(anyOf(
          ref('ExpressionStatement'),
          ref('VariableDeclarationStatement'),
        )),
        loopExpression: nullable(ref('ExpressionStatement')),
      },

      FunctionCall: {
        ...baseExpressionL,
        arguments: array(ref('Expression')),
        expression: ref('Expression'),
        kind: literal(
          'functionCall',
          'typeConversion',
          'structConstructorCall',
        ),
        names: array(string),
        tryCall: boolean,
        typeDescriptions,
      },

      FunctionCallOptions: {
        ...baseExpression,
        expression: ref('Expression'),
        names: array(string),
        options: array(ref('Expression')),
      },

      FunctionDefinition: {
        ...baseDefinition,
        baseFunctions: optional(array(integer)),
        body: nullable(ref('Block')),
        documentation,
        functionSelector: optional(string),
        implemented: boolean,
        kind: literal(
          'function',
          'receive',
          'constructor',
          'fallback',
          'freeFunction',
        ),
        modifiers: array(ref('ModifierInvocation')),
        overrides,
        parameters,
        returnParameters: ref('ParameterList'),
        scope: integer,
        stateMutability: ref('StateMutability'),
        virtual: boolean,
        visibility,
      },

      FunctionTypeName: {
        ...baseTypeName,
        parameterTypes: ref('ParameterList'),
        returnParameterTypes: ref('ParameterList'),
        stateMutability: ref('StateMutability'),
        visibility,
      },

      Identifier: {
        argumentTypes: nullable(array(ref('TypeDescriptions'))),
        name: string,
        overloadedDeclarations: array(integer),
        referencedDeclaration: nullable(integer),
        typeDescriptions,
      },

      IdentifierPath: {
        name: string,
        referencedDeclaration: integer,
      },

      IfStatement: {
        ...baseStatement,
        condition: ref('Expression'),
        falseBody: nullable(anyOf(
          ref('Statement'),
          ref('Block'),
        )),
        trueBody: anyOf(
          ref('Statement'),
          ref('Block'),
        ),
      },

      ImportDirective: {
        absolutePath: string,
        file: string,
        nameLocation: optional(string),
        scope: integer,
        sourceUnit: integer,
        symbolAliases: array(object({
          foreign: ref('Identifier'),
          local: nullable(string),
          nameLocation: optional(string),
        })),
        unitAlias: string,
      },

      IndexAccess: {
        ...baseExpressionL,
        baseExpression: ref('Expression'),
        indexExpression: ref('Expression'),
      },

      InheritanceSpecifier: {
        arguments: nullable(array(ref('Expression'))),
        baseName: anyOf(
          ref('UserDefinedTypeName'),
          ref('IdentifierPath'),
        ),
      },

      InlineAssembly: {
        ...baseStatement,
        AST: ref('YulBlock'),
        evmVersion: literal(
          'homestead',
          'tangerineWhistle',
          'spuriousDragon',
          'byzantium',
          'constantinople',
          'petersburg',
          'istanbul',
          'berlin'
        ),
        externalReferences: array(object({
          declaration: integer,
          isOffset: boolean,
          isSlot: boolean,
          src: ref('SourceLocation'),
          valueSize: integer,
        })),
      },

      Literal: {
        ...baseExpressionL,
        hexValue: pattern(/^[0-9a-f]*$/),
        kind: literal(
          'bool',
          'number',
          'string',
          'hexString',
          'unicodeString'
        ),
        subdenomination: nullable(),
        value: nullable(string),
      },

      Mapping: {
        ...baseTypeName,
        keyType: ref('TypeName'),
        valueType: ref('TypeName'),
      },

      MemberAccess: {
        ...baseExpressionL,
        expression: ref('Expression'),
        memberName: string,
        referencedDeclaration: nullable(integer),
      },

      ModifierDefinition: {
        ...baseDefinition,
        baseModifiers: nullable(array(integer)),
        body: ref('Block'),
        documentation,
        overrides,
        parameters,
        virtual: boolean,
        visibility,
      },

      ModifierInvocation: {
        arguments: nullable(array(ref('Expression'))),
        kind: optional(literal(
          'modifierInvocation',
          'baseConstructorSpecifier',
        )),
        modifierName: anyOf(
          ref('Identifier'),
          ref('IdentifierPath'),
        ),
      },

      NewExpression: {
        ...baseExpression,
        typeName: ref('TypeName'),
      },

      OverrideSpecifier: {
        overrides: anyOf(
          array(ref('UserDefinedTypeName')),
          array(ref('IdentifierPath')),
        ),
      },

      ParameterList: {
        parameters: array(ref('VariableDeclaration')),
      },

      PlaceholderStatement: {
        ...baseStatement,
      },

      PragmaDirective: {
        literals: array(string),
      },

      Return: {
        ...baseStatement,
        expression: nullable(ref('Expression')),
        functionReturnParameters: integer,
      },

      RevertStatement: {
        ...baseStatement,
        errorCall: ref('FunctionCall'),
      },

      StructDefinition: {
        ...baseDefinition,
        canonicalName: string,
        members: array(ref('VariableDeclaration')),
        scope: integer,
        visibility,
      },

      StructuredDocumentation: {
        text: string,
      },

      TryCatchClause: {
        block: ref('Block'),
        errorName: string,
        parameters: nullable(ref('ParameterList')),
      },

      TryStatement: {
        ...baseStatement,
        clauses: array(ref('TryCatchClause')),
        externalCall: ref('FunctionCall'),
      },

      TupleExpression: {
        ...baseExpressionL,
        components: array(ref('Expression')),
        isInlineArray: boolean,
      },

      UnaryOperation: {
        ...baseExpressionL,
        operator: literal(
          '++',
          '--',
          '-',
          '!',
          'delete'
        ),
        prefix: boolean,
        subExpression: ref('Expression'),
      },

      UncheckedBlock: {
        ...baseStatement,
        statements: array(ref('Statement')),
      },

      UserDefinedTypeName: {
        ...baseTypeName,
        contractScope: nullable(),
        name: optional(string),
        pathNode: optional(ref('IdentifierPath')),
        referencedDeclaration: integer,
      },

      UsingForDirective: {
        libraryName: anyOf(
          ref('UserDefinedTypeName'),
          ref('IdentifierPath'),
        ),
        typeName: ref('TypeName'),
      },

      VariableDeclaration: {
        ...baseDefinition,
        baseFunctions: nullable(array(integer)),
        constant: boolean,
        documentation,
        functionSelector: optional(string),
        indexed: optional(boolean),
        mutability: ref('Mutability'),
        overrides,
        scope: integer,
        stateVariable: boolean,
        storageLocation: ref('StorageLocation'),
        typeDescriptions,
        typeName: nullable(ref('TypeName')),
        value: nullable(ref('Expression')),
        visibility,
      },

      VariableDeclarationStatement: {
        ...baseStatement,
        assignments: array(nullable(integer)),
        declarations: array(nullable(ref('VariableDeclaration'))),
        initialValue: nullable(ref('Expression')),
      },

      WhileStatement: {
        ...baseStatement,
        body: anyOf(
          ref('Block'),
          ref('Statement'),
        ),
        condition: ref('Expression'),
      },
    }),

    YulStatement: anyOf(
      ref('YulAssignment'),
      ref('YulBlock'),
      ref('YulBreak'),
      ref('YulContinue'),
      ref('YulExpressionStatement'),
      ref('YulLeave'),
      ref('YulForLoop'),
      ref('YulFunctionDefinition'),
      ref('YulIf'),
      ref('YulSwitch'),
      ref('YulVariableDeclaration'),
    ),

    YulExpression: anyOf(
      ref('YulFunctionCall'),
      ref('YulIdentifier'),
      ref('YulLiteral'),
    ),

    ...yulNodes({
      YulAssignment: {
        value: ref('YulExpression'),
        variableNames: array(ref('YulIdentifier')),
      },

      YulBlock: {
        statements: array(ref('YulStatement')),
      },

      YulBreak: {},

      YulCase: {
        body: ref('YulBlock'),
        value: anyOf(
          literal('default'),
          ref('YulLiteral'),
        ),
      },

      YulContinue: {},

      YulExpressionStatement: {
        expression: ref('YulExpression'),
      },

      YulFunctionCall: {
        arguments: array(ref('YulExpression')),
        functionName: ref('YulIdentifier'),
      },

      YulForLoop: {
        body: ref('YulBlock'),
        condition: ref('YulExpression'),
        post: ref('YulBlock'),
        pre: ref('YulBlock'),
      },

      YulFunctionDefinition: {
        body: ref('YulBlock'),
        name: string,
        parameters: array(ref('YulTypedName')),
        returnVariables: array(ref('YulTypedName')),
      },

      YulIdentifier: {
        name: string,
      },

      YulIf: {
        body: ref('YulBlock'),
        condition: ref('YulExpression'),
      },

      YulLeave: {
      },

      YulLiteral: {
        kind: literal('number', 'string', 'bool'),
        type: string,
        value: string,
      },

      YulSwitch: {
        cases: array(ref('YulCase')),
        expression: ref('YulExpression'),
      },

      YulTypedName: {
        name: string,
        type: string,
      },

      YulVariableDeclaration: {
        value: nullable(ref('YulExpression')),
        variables: array(ref('YulTypedName')),
      },
    }),
  },
};

if (require.main === module) {
  const fs = require('fs');
  fs.writeFileSync('schema.json', JSON.stringify(schema, null, 2));
}

module.exports = schema;
