import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function PieChart3D() {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [rotationX, setRotationX] = useState(-15);
  const [rotationY, setRotationY] = useState(20);

  const data = [
    { label: 'Technology', value: 30, color: '#10b981' }, // Purple
    { label: 'Marketing', value: 25, color: '#3b82f6' },  // Blue
    { label: 'Sales', value: 20, color: '#06b6d4' },     // Cyan
    { label: 'Support', value: 15, color: '#10b981' },   // Green
    { label: 'Finance', value: 10, color: '#f59e0b' },   // Yellow/Orange
  ];

  // Calculate angles for each segment
  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const angle = (item.value / 100) * 360;
    const segment = {
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      midAngle: currentAngle + angle / 2,
      index
    };
    currentAngle += angle;
    return segment;
  });

  const createSegmentPath = (startAngle, endAngle, innerRadius = 50, outerRadius = 150) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = Math.cos(startAngleRad) * outerRadius;
    const y1 = Math.sin(startAngleRad) * outerRadius;
    const x2 = Math.cos(endAngleRad) * outerRadius;
    const y2 = Math.sin(endAngleRad) * outerRadius;
    
    const x3 = Math.cos(endAngleRad) * innerRadius;
    const y3 = Math.sin(endAngleRad) * innerRadius;
    const x4 = Math.cos(startAngleRad) * innerRadius;
    const y4 = Math.sin(startAngleRad) * innerRadius;

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotY = (mouseX / rect.width) * 60 - 30;
    const rotX = -(mouseY / rect.height) * 60 + 30;
    
    setRotationX(Math.max(-45, Math.min(15, rotX)));
    setRotationY(Math.max(-45, Math.min(45, rotY)));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        gap: '50px',
        alignItems: 'center',
        maxWidth: '1200px',
        width: '100%'
      }}>
        
        {/* 3D Pie Chart */}
        <div 
          style={{
            perspective: '1000px',
            width: '700px', // Increased width
            height: '700px', // Increased height
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setRotationX(-15);
            setRotationY(20);
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '400px',
              height: '400px',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
              transition: 'transform 0.3s ease',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
            }}
          >
            {/* Base Circle */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))',
                transform: 'translateZ(-30px)'
              }}
            />

            {/* Top Surface */}
            <svg
              width="100%"
              height="100%"
              viewBox="-200 -200 400 400"
              preserveAspectRatio="xMidYMid meet"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                borderRadius: '50%',
                overflow: 'visible'
              }}
            >
              {segments.map((segment, index) => (
                <g key={index}>
                  <path
                    d={createSegmentPath(segment.startAngle, segment.endAngle)}
                    fill={segment.color}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                    style={{
                      cursor: 'pointer',
                      filter: hoveredSegment === index ? 'brightness(1.2)' : 'brightness(1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                  {/* Highlight effect */}
                  <path
                    d={createSegmentPath(segment.startAngle, segment.endAngle)}
                    fill="url(#highlight)"
                    opacity="0.3"
                    pointerEvents="none"
                  />
                </g>
              ))}
              
              {/* Gradient definitions */}
              <defs>
                <radialGradient id="highlight" cx="30%" cy="30%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>

            {/* Side surfaces for each segment */}
            {segments.map((segment, index) => {
              const startAngleRad = (segment.startAngle * Math.PI) / 180;
              const endAngleRad = (segment.endAngle * Math.PI) / 180;
              const midAngleRad = (segment.midAngle * Math.PI) / 180;
              
              return (
                <div key={`side-${index}`}>
                  {/* Outer edge */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: `${(segment.endAngle - segment.startAngle) * 2.6}px`,
                      height: '30px',
                      background: `linear-gradient(to bottom, ${segment.color}, ${segment.color}dd)`,
                      transformOrigin: '0 0',
                      transform: `translate(-50%, -50%) rotateZ(${segment.midAngle}deg) translateX(150px) translateY(-15px) rotateY(90deg)`,
                      borderRadius: '2px',
                      opacity: 0.8
                    }}
                  />
                  
                  {/* Inner edge */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: `${(segment.endAngle - segment.startAngle) * 1.4}px`,
                      height: '30px',
                      background: `linear-gradient(to bottom, ${segment.color}aa, ${segment.color}88)`,
                      transformOrigin: '0 0',
                      transform: `translate(-50%, -50%) rotateZ(${segment.midAngle}deg) translateX(50px) translateY(-15px) rotateY(90deg)`,
                      borderRadius: '2px',
                      opacity: 0.6
                    }}
                  />
                </div>
              );
            })}

            {/* Center hole sides */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))',
                transform: 'translate(-50%, -50%)',
                border: '30px solid',
                borderImage: 'linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2)) 1',
                borderRadius: '50%'
              }}
            />
          </div>
        </div>

        {/* Legend and Stats */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255,255,255,0.2)',
          minWidth: '300px'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '20px',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Department Distribution
          </h2>
          
          <div style={{ marginBottom: '30px' }}>
            {segments.map((segment, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px',
                  padding: '10px',
                  borderRadius: '10px',
                  background: hoveredSegment === index ? 'rgba(255,255,255,0.1)' : 'transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: segment.color,
                    marginRight: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '2px'
                  }}>
                    {segment.label}
                  </div>
                  <div style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '12px'
                  }}>
                    {segment.value}%
                  </div>
                </div>
                <div style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  {segment.value}%
                </div>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '20px',
            textAlign: 'center'
          }}>
            <div style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '12px',
              marginBottom: '5px'
            }}>
              Total Departments
            </div>
            <div style={{
              color: 'white',
              fontSize: '28px',
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              {segments.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}