import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="pa-header">
      <div className="container-xl">
        <div className="d-flex align-items-center justify-content-between">
          <div className="pa-brand">
            <span className="pa-brand-mark">◈</span>
            <Link className="portfolio-iq" to="/"><span className="pa-brand-name">PortfolioIQ</span></Link>
          </div>
          <span className="pa-header-tag">AI Career Analyzer</span>
        </div>
      </div>
    </header>
  );
}
