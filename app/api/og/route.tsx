import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "notes";
  const emoji = searchParams.get("emoji") || "";

  const decodedTitle = title ? decodeURIComponent(title) : "new note";
  const truncatedTitle = decodedTitle.length > 50 ? decodedTitle.slice(0, 47) + "..." : decodedTitle;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          position: "relative",
          fontFamily: "sans-serif",
          backgroundColor: "#0C0C0E",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontSize: 60,
              fontWeight: "bold",
              color: "#EDEDEF",
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            nico nezhat
          </p>
          <p
            style={{
              fontSize: 36,
              color: "#636366",
              margin: 0,
              marginTop: 10,
              maxWidth: 1000,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {emoji} {truncatedTitle}
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, transparent 0%, #8B8BF5 50%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
