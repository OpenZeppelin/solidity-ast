import { SolcOutput } from './solc';
import { Node, NodeType, NodeTypeMap, YulNode, YulNodeType, YulNodeTypeMap } from './node';

export function isNodeType<N extends Node, T extends NodeType>(nodeType: T | readonly T[]): (node: N) => node is N & NodeTypeMap[T];
export function isNodeType<N extends Node, T extends NodeType>(nodeType: T | readonly T[], node: N): node is N & NodeTypeMap[T];

export function findAll<T extends NodeType>(nodeType: T | readonly T[]): (node: Node) => Generator<NodeTypeMap[T]>;
export function findAll<T extends NodeType>(nodeType: T | readonly T[], node: Node, prune?: (node: Node) => boolean): Generator<NodeTypeMap[T]>;

export function findAll<T extends NodeType | YulNodeType>(nodeType: T | readonly T[]): (node: Node | YulNode) => Generator<(NodeTypeMap & YulNodeTypeMap)[T]>;
export function findAll<T extends NodeType | YulNodeType>(nodeType: T | readonly T[], node: Node | YulNode, prune?: (node: Node | YulNode) => boolean): Generator<(NodeTypeMap & YulNodeTypeMap)[T]>;

export interface ASTDereferencer {
  <T extends NodeType>(nodeType: T | readonly T[]): (id: number) => NodeTypeMap[T];
  <T extends NodeType>(nodeType: T | readonly T[], id: number): NodeTypeMap[T];
}

export function astDereferencer(solcOutput: SolcOutput): ASTDereferencer;
