
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function response(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return response({
        app: "GAMECLIPS AI",
        status: "online",
        version: "1.0.0",
      });
    }

    if (url.pathname === "/api/analyze" && request.method === "POST") {
      let body;

      try {
        body = await request.json();
      } catch {
        return response({ error: "Invalid JSON request" }, 400);
      }

      const videoUrl = body.videoUrl;

      if (!videoUrl || typeof videoUrl !== "string") {
        return response({ error: "Please provide a YouTube video link" }, 400);
      }

      let parsedUrl;

      try {
        parsedUrl = new URL(videoUrl);
      } catch {
        return response({ error: "Invalid video URL" }, 400);
      }

      const allowedHosts = [
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com",
        "youtu.be",
        "www.youtube-nocookie.com",
      ];

      if (!allowedHosts.includes(parsedUrl.hostname)) {
        return response({ error: "Only YouTube links are supported" }, 400);
      }

      return response({
        app: "GAMECLIPS AI",
        status: "received",
        videoUrl,
        analysisReady: false,
        message: "Link received. Video analysis will be added in the next development stage.",
      }, 202);
    }

    return response({
      app: "GAMECLIPS AI",
      message: "Backend is running",
    });
  },
};
