export function extractVideoId(rawUrl) {
  const url = URL.parse(rawUrl);

  if (!url) {
    return null;
  }

  const host = url.hostname;
  const hostsWithVParam = ["youtube.com", "www.youtube.com"];
  const hostsWithPathId = ["youtu.be"];
  const validHosts = [...hostsWithVParam, ...hostsWithPathId];

  if (!validHosts.includes(host)) {
    return null;
  }

  const pathname = url.pathname;
  const searchParams = url.searchParams;

  if (hostsWithVParam.includes(host) && searchParams.has("v")) {
    return searchParams.get("v");
  }

  if (hostsWithPathId.includes(host) && pathname.length > 1) {
    return pathname.slice(1);
  }

  return null;
}

export async function fetchVideoMetadata(videoUrl) {
  const videoId = extractVideoId(videoUrl);
  const encodedUrl = encodeURIComponent(videoUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?feature=oembed`;
  const metadataUrl = `https://youtube.com/oembed?url=${encodedUrl}&format=json`;

  try {
    const response = await fetch(metadataUrl);
    const data = await response.json();

    return {
      id: crypto.randomUUID(),
      videoId,
      url: videoUrl,
      embedUrl,
      title: data.title,
      thumbnail: data.thumbnail_url,
    };
  } catch (error) {
    console.error("Failed to fetch video metadata:", error);
    return {
      id: crypto.randomUUID(),
      videoId,
      url: videoUrl,
      embedUrl,
    };
  }
}
