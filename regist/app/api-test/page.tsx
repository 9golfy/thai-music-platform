export default async function ApiTestPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  let data = null;
  let error = null;

  try {
    const res = await fetch(`${base}/`, { cache: "no-store" });
    data = await res.json();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>API Test</h1>
      <p>Base URL: {base}</p>
      {error ? (
        <div style={{ color: "red" }}>
          <p>Error: {error}</p>
          <p>Make sure the API server is running. Start it with:</p>
          <pre>docker-compose up api</pre>
        </div>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </main>
  );
}
