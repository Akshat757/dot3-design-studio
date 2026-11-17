// Three-dot intro curtain, pure CSS so it also clears without JavaScript.
// The inline script in the layout sets `data-intro-seen` before first paint on repeat visits in a session.
export const introScript = `try{if(sessionStorage.getItem('dot3-intro')){document.documentElement.setAttribute('data-intro-seen','')}else{sessionStorage.setItem('dot3-intro','1')}}catch(e){}`;

export function Intro() {
  return (
    <div className="intro" aria-hidden>
      <div className="intro-dots">
        <span />
        <span />
        <span />
      </div>
      <p className="intro-word display">Dot Three</p>
    </div>
  );
}
