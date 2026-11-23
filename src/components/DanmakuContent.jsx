import React from 'react';
import './DanmakuContent.css';

export default function DanmakuContent({ item }) {
  return <>
    {item.segments.map((segment, index) => typeof segment === 'string' ? segment :
      <img className="danmaku-emoji" key={index} src={segment.src} alt={segment.alt} draggable={false} />)}
    {item.countLabel && <span className="danmaku-count">{item.countLabel}</span>}
  </>;
}
