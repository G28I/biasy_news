/**
 * Oxylabs Web Scraper API Client Helper
 * Connects to the Realtime universal scraping endpoint.
 */

export async function scrapeUrl(url: string, render: boolean = false): Promise<string> {
  const username = process.env.OXY_WSA_USERNAME;
  const password = process.env.OXY_WSA_PASSWORD;

  if (!username || !password) {
    throw new Error("Missing Oxylabs WSA credentials (OXY_WSA_USERNAME and OXY_WSA_PASSWORD) in environment.");
  }

  const payload = {
    source: "universal",
    url: url,
    render: render ? "html" : undefined,
    user_agent_type: "desktop_chrome",
  };

  const response = await fetch("https://realtime.oxylabs.io/v1/queries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Oxylabs WSA query returned status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("Oxylabs WSA query returned zero results.");
  }

  const result = data.results[0];
  if (result.status_code && result.status_code >= 400) {
    throw new Error(`Oxylabs target request failed with status ${result.status_code}`);
  }

  return result.content || "";
}
