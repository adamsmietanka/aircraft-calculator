import { useEffect } from 'react';

declare global {
  interface Window {
    MathJax: any;
  }
}

const Formula = ({
  tex = '',
  className = '',
  onPointerEnter = () => {},
  onPointerLeave = () => {},
}) => {
  useEffect(() => {
    if (typeof window?.MathJax !== 'undefined') {
      window.MathJax.typesetClear();
      window.MathJax.typeset();
      
    }
  }, [tex]);

  return (
    <p
      className={className}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >{`\\(${tex}\\)`}</p>
  );
};

export default Formula;
