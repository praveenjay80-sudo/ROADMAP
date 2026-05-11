"use client";

import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Edge, 
  Node,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

interface RoadmapData {
  nodes: Array<{
    id: string;
    label: string;
    author: string;
    year: string;
    type: 'seminal' | 'breakthrough' | 'pedagogical';
    level: 'beginner' | 'intermediate' | 'advanced';
    description: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
  }>;
}

const levelYMap = {
  beginner: 0,
  intermediate: 300,
  advanced: 600
};

const CustomNode = ({ data }: any) => {
  return (
    <div className={`custom-node type-${data.type}`}>
      <div className="node-type">{data.type.toUpperCase()}</div>
      <div className="node-label">{data.label}</div>
      <div className="node-info">{data.author} ({data.year})</div>
      <div className="node-desc">{data.description}</div>
      <div className="node-level">{data.level}</div>
    </div>
  );
};

const nodeTypes = {
  roadmap: CustomNode
};

const RoadmapGraph: React.FC<{ data: RoadmapData }> = ({ data }) => {
  const { nodes, edges } = useMemo(() => {
    // Basic auto-layout based on levels
    const levelCounts: Record<string, number> = { beginner: 0, intermediate: 0, advanced: 0 };
    
    const formattedNodes: Node[] = data.nodes.map((node) => {
      const x = levelCounts[node.level] * 300;
      const y = levelYMap[node.level];
      levelCounts[node.level]++;
      
      return {
        id: node.id,
        type: 'roadmap',
        data: { ...node },
        position: { x, y },
      };
    });

    const formattedEdges: Edge[] = data.edges.map((edge, index) => ({
      id: `e-${index}`,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: { stroke: '#ffffff' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#ffffff',
      },
    }));

    return { nodes: formattedNodes, edges: formattedEdges };
  }, [data]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#333" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default RoadmapGraph;
