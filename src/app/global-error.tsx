"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "4rem", fontWeight: 700 }}>500</h1>
          <p style={{ marginTop: "1rem", fontSize: "1.125rem" }}>
            Something went wrong
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.5rem 1.5rem",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              backgroundColor: "#3B82F6",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
