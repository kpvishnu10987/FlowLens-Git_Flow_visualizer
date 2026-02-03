import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const ROW_HEIGHT = 36; // Height of each commit row
const LANE_WIDTH = 20;  // Spacing between vertical branch lines
const PADDING_TOP = 20;

const CommitGraph = ({ nodes, links, onSelect }) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || !entries[0]) return;
            setDimensions(entries[0].contentRect);
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Helper: Assign X/Y coordinates deterministically
    const processedNodes = nodes.map((node, index) => {
        // Simple Logic: Main branch (0), Random offset for fun until we have real lane logic
        const lane = index % 5 === 0 ? 1 : 0;
        return {
            ...node,
            x: 50 + (lane * LANE_WIDTH),
            y: PADDING_TOP + (index * ROW_HEIGHT),
            // NEON PALETTE: Blue-400 for main, Purple-400 for branches
            color: lane === 0 ? '#60a5fa' : '#c084fc'
        };
    });

    return (
        <div ref={containerRef} className="w-full h-full overflow-y-auto bg-[#1e1e2e] custom-scrollbar">
            <svg width={dimensions.width} height={Math.max(dimensions.height, nodes.length * ROW_HEIGHT + 100)}>
                {/* 1. LINKS (The Metro Lines) */}
                <g>
                    {links.map((link, i) => {
                        const source = processedNodes.find(n => n.id === link.source);
                        const target = processedNodes.find(n => n.id === link.target);
                        if (!source || !target) return null;

                        // Bezier Curve for smooth "merge" look
                        const path = `M ${source.x} ${source.y} C ${source.x} ${target.y}, ${target.x} ${source.y}, ${target.x} ${target.y}`;

                        return (
                            <path
                                key={i}
                                d={path}
                                stroke={target.color}
                                strokeWidth="2"
                                fill="none"
                                opacity="0.5"
                            />
                        );
                    })}
                </g>

                {/* 2. NODES (The Commits) + TEXT */}
                <g>
                    {processedNodes.map((node) => (
                        <g
                            key={node.id}
                            onClick={() => onSelect && onSelect(node)}
                            className="cursor-pointer hover:opacity-80"
                        >
                            {/* The Dot */}
                            <circle cx={node.x} cy={node.y} r={5} fill={node.color} stroke="#1e1e2e" strokeWidth="2" />

                            {/* The Text Rows (GitKraken Style) */}
                            {/* Message */}
                            <text
                                x={100} // Fixed column start
                                y={node.y + 5}
                                fill="#cdd6f4"
                                fontSize="13"
                                fontFamily="monospace"
                            >
                                {node.message.split('\n')[0].substring(0, 60)}
                            </text>

                            {/* Author Badge */}
                            <text
                                x={600} // Author Column
                                y={node.y + 5}
                                fill="#6c7086"
                                fontSize="12"
                            >
                                {node.author}
                            </text>

                            {/* Hash */}
                            <text
                                x={750}
                                y={node.y + 5}
                                fill="#585b70"
                                fontSize="12"
                                fontFamily="monospace"
                            >
                                {node.id.substring(0, 7)}
                            </text>

                            {/* Row Hover effect (invisible rect) */}
                            <rect x={0} y={node.y - 15} width="100%" height={30} fill="transparent" stroke="none" className="hover:fill-white/5" />
                        </g>
                    ))}
                </g>
            </svg>
        </div>
    );
};

export default CommitGraph;