// app/head.tsx
export default function Head() {
    return (
      <>
        <meta charSet="utf-8" />
  
        {/* tell browsers & crawlers to treat width as device width */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
  
        <title>Property Hall — Greece Real Estate</title>
        <meta name="description" content="Find and invest in Greek properties…" />
        {/* …any other global SEO tags (OG, twitter, favicon, etc.) */}
      </>
    );
  }