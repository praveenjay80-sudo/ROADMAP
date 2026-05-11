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

const levelYMap: Record<string, number> = {
  beginner: 0,
  intermediate: 350,
  advanced: 700,
  research: 1050
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
  console.log('Rendering RoadmapGraph with data:', data);

  const { nodes, edges } = useMemo(() => {
    if (!data || !data.nodes) return { nodes: [], edges: [] };

    // Basic auto-layout based on levels
    const levelCounts: Record<string, number> = { beginner: 0, intermediate: 0, advanced: 0, research: 0 };
    
    const formattedNodes: Node[] = data.nodes.map((node) => {
      const level = node.level || 'beginner';
      const x = (levelCounts[level] || 0) * 350;
      const y = levelYMap[level] || 0;
      levelCounts[level] = (levelCounts[level] || 0) + 1;
      
      return {
        id: node.id || Math.random().toString(),
        type: 'roadmap',
        data: { ...node },
        position: { x, y },
      };
    });

    const formattedEdges: Edge[] = (data.edges || []).map((edge, index) => ({
      id: `e-${index}`,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#94a3b8',
      },
    }));

    return { nodes: formattedNodes, edges: formattedEdges };
  }, [data]);

  if (nodes.length === 0) {
    return <div className="placeholder">No graph data available to render.</div>;
  }

  return (
    <div style={{ width: '100%', height: '1200px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
      >
        <Background color="#333" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default RoadmapGraph;
