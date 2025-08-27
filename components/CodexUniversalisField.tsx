import React from 'react';
import { CodexNode, HarmonicInfluenceMap } from '../types';

interface CodexUniversalisFieldProps {
    nodes: CodexNode[];
    influenceMap: HarmonicInfluenceMap | null;
    interactionMode: 'static' | 'breathing' | 'rotating';
    highlightedModulus: number | null;
    onNodeClick: (node: CodexNode) => void;
    onNodeHover: (node: CodexNode | null) => void;
}


// Helper function to convert hex color to RGB values for the glow animation
const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    // Fallback to gold color if parsing fails
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '255, 215, 0';
};


export const CodexUniversalisField: React.FC<CodexUniversalisFieldProps> = ({ nodes, influenceMap, interactionMode, highlightedModulus, onNodeClick, onNodeHover }) => {
    
    const centerNode = influenceMap?.coreBlueprint || nodes.find(n => n.modulus === 0)!;
    const activeOuterModuli = influenceMap 
        ? [influenceMap.yearlyModulation.modulus, influenceMap.monthlyOverlay.modulus, influenceMap.dailyResonance.modulus]
        : [];
    
    const outerNodes = nodes.filter(n => n.modulus !== centerNode.modulus);
    const radius = 150;
    const viewSize = 350;

    return (
        <div className="relative w-full max-w-[350px] mx-auto aspect-square">
            <svg viewBox={`0 0 ${viewSize} ${viewSize}`} className={`w-full h-full ${interactionMode === 'rotating' ? 'animate-spin-slow' : ''}`}>
                <g transform={`translate(${viewSize / 2}, ${viewSize / 2})`}>
                    {/* Connection Lines */}
                    {influenceMap && outerNodes.map((node, i) => {
                        if (!activeOuterModuli.includes(node.modulus)) return null;
                        const angle = (i / outerNodes.length) * 2 * Math.PI - Math.PI / 2;
                        const x = radius * Math.cos(angle);
                        const y = radius * Math.sin(angle);
                        return (
                            <line
                                key={`line-${node.modulus}`}
                                x1="0" y1="0" x2={x} y2={y}
                                stroke={centerNode.color}
                                strokeWidth="1"
                                strokeOpacity="0.5"
                                className="transition-all duration-500"
                            />
                        );
                    })}
                    
                    {/* Outer Nodes */}
                    {outerNodes.map((node, i) => {
                        const angle = (i / outerNodes.length) * 2 * Math.PI - Math.PI / 2;
                        const x = radius * Math.cos(angle);
                        const y = radius * Math.sin(angle);
                        const isActive = activeOuterModuli.includes(node.modulus);
                        const isHighlighted = highlightedModulus === node.modulus;
                        const isBreathing = interactionMode === 'breathing' && isActive;

                        const style = isBreathing ? { '--glow-color-rgb': hexToRgb(node.color) } as React.CSSProperties : {};
                        
                        return (
                            <g key={node.modulus} transform={`translate(${x}, ${y})`}
                                onClick={() => onNodeClick(node)}
                                onMouseEnter={() => onNodeHover(node)}
                                onMouseLeave={() => onNodeHover(null)}
                                className="cursor-pointer group"
                            >
                                <circle 
                                    r="16" 
                                    fill={isActive || isHighlighted ? node.color : 'var(--node-bg, #e2e8f0)'}
                                    stroke={isActive || isHighlighted ? node.color : 'var(--node-border, #94a3b8)'}
                                    strokeWidth="2"
                                    className={`transition-all duration-300 ${isHighlighted ? 'animate-pulse-strong' : ''} ${isBreathing ? 'breathing' : ''}`}
                                    style={style}
                                />
                                <text
                                    textAnchor="middle"
                                    dy=".3em"
                                    className="font-bold text-xs pointer-events-none"
                                    fill={isActive || isHighlighted ? '#fff' : 'var(--node-text, #475569)'}
                                >
                                    {node.modulus}
                                </text>
                            </g>
                        );
                    })}

                    {/* Center Node */}
                     {(() => {
                        const isBreathing = !!influenceMap && interactionMode === 'breathing';
                        const isStatic = interactionMode === 'static';
                        const isCenterHighlighted = highlightedModulus === centerNode.modulus;
                        const style = (isBreathing || isStatic) ? { '--glow-color-rgb': hexToRgb(centerNode.color) } as React.CSSProperties : {};
                        
                        return (
                            <g
                                key={centerNode.modulus}
                                onClick={() => onNodeClick(centerNode)}
                                onMouseEnter={() => onNodeHover(centerNode)}
                                onMouseLeave={() => onNodeHover(null)}
                                className="cursor-pointer group"
                            >
                                <circle
                                    r="30"
                                    fill={centerNode.color}
                                    stroke="#fff"
                                    strokeWidth="3"
                                    className={`${isCenterHighlighted ? 'animate-pulse-strong' : ''} ${isBreathing ? 'breathing' : ''} ${isStatic ? 'pulse-core-animation' : ''}`}
                                    style={style}
                                />
                                <text textAnchor="middle" dy=".3em" className="font-bold pointer-events-none" fill="#fff" fontSize="18">
                                   {centerNode.modulus}
                                </text>
                            </g>
                        )
                     })()}
                </g>
            </svg>
        </div>
    );
};
