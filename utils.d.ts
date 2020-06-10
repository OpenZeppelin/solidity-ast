import { Node, NodeType, NodeTypeMap } from './node';

export function isNodeType<N extends Node, T extends NodeType>(nodeType: T): (node: N) => node is N & NodeTypeMap[T];
export function isNodeType<N extends Node, T extends NodeType>(nodeType: T, node: N): node is N & NodeTypeMap[T];

export function findAll<T extends NodeType>(node: Node, nodeType: T): Generator<NodeTypeMap[T]>;
