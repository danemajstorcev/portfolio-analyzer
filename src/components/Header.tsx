import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="container-xl">
        <div className="d-flex align-items-center justify-content-between">
          <div className="brand">
            <span className="brand-mark">◈</span>
            <Link className="portfolio-iq" to="/">
              <span className="brand-name">PortfolioIQ</span>
            </Link>
          </div>
          <span className="header-tag">AI Career Analyzer</span>
        </div>
      </div>
    </header>
  );
}
