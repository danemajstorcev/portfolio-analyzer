import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="main">
      <div className="container-xl text-center" style={{ paddingTop: "6rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>◈</div>
        <h1 className="hero-title" style={{ fontSize: "2rem" }}>
          Page not found
        </h1>
        <p className="hero-sub" style={{ margin: "1rem auto" }}>
          This page doesn't exist.
        </p>
        <Link
          to="/"
          className="btn-reset"
          style={{ display: "inline-block", marginTop: "1rem" }}
        >
          ← Back to analyzer
        </Link>
      </div>
    </main>
  );
}
