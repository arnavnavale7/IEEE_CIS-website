import React, { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, prefersMotion } from './motion';

const topics = [
  ['Hackathons', 'Turn an idea into something real.', 'Hackathons bring students together to tackle a challenge, explore possible solutions and build a working prototype. From brainstorming and coding to testing and presenting, the experience is about learning through experimentation, collaborating under a deadline and making an idea tangible.'],
  ['Speaker Sessions', 'A conversation can change your perspective.', 'Speaker sessions create space for students to hear different perspectives on technology, careers and the ideas shaping the field. Talks and conversations offer an opportunity to ask questions, connect classroom learning with wider experiences and discover new directions to explore.'],
  ['Placement Talks', 'Prepare for your next step.', 'Placement talks focus on the transition from college to professional life. Discussions around preparation, technical interviews, communication and career choices help students think through their next steps, ask practical questions and approach placement opportunities with a clearer plan.'],
  ['Industry Visit', 'See technology beyond the classroom.', 'An industry visit offers a closer look at professional environments and how teams work with technology in practice. Observing workflows, interacting with professionals and asking questions helps connect academic concepts with real applications and gives students a broader view of possible career paths.'],
];

export function TopicExplorer() {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const root = useRef(null);
  const first = useRef(true);
  // The new panel's heading and text slide in from the side of the chosen tab.
  useGSAP(() => {
    if (first.current) { first.current = false; return; }
    if (!prefersMotion()) return;
    const panel = root.current.querySelector(`#topic-panel-${active}`);
    gsap.from(panel.children, { x: (i) => i ? 26 : -18, opacity: 0, duration: 0.65, stagger: 0.07, ease: 'expo.out', clearProps: 'opacity,transform' });
  }, { scope: root, dependencies: [active] });
  function navigate(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % topics.length;
    if (event.key === 'ArrowLeft') next = (index + topics.length - 1) % topics.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = topics.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }
  return <div className="topic-explorer" ref={root}>
    <div className="topic-tabs" role="tablist" aria-label="Explore club activities">
      {topics.map(([title], index) => <button key={title} ref={el => tabs.current[index] = el} id={`topic-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls={`topic-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => navigate(event, index)}>{title}<span aria-hidden="true">↗</span></button>)}
    </div>
    {topics.map(([, title, text], index) => <div key={title} hidden={active !== index} id={`topic-panel-${index}`} role="tabpanel" tabIndex={0} aria-labelledby={`topic-tab-${index}`} className="topic-panel"><h2>{title}</h2><p>{text}</p></div>)}
  </div>;
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 650);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  if (!visible) return null;
  return <button className="back-to-top" type="button" aria-label="Back to top" onClick={() => {
    document.querySelector('header a')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }}><span aria-hidden="true">↑</span><span className="back-to-top-label">Back to top</span></button>;
}
