import { Channel } from '../types/iptv';

export function parseM3U(m3uContent: string): { channels: Channel[]; categories: string[] } {
  // Remove BOM if present
  const cleaned = m3uContent.replace(/^\uFEFF/, '');
  const lines = cleaned.split(/\r?\n/);
  
  const channels: Channel[] = [];
  const categoriesSet = new Set<string>();
  
  let currentMetadata: Partial<Channel> | null = null;
  let channelIndex = 1;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      currentMetadata = {};

      // Match tvg-logo
      const logoMatch = line.match(/tvg-logo="([^"]*)"/i) || line.match(/tvg-logo='([^']*)'/i);
      currentMetadata.logo = logoMatch ? logoMatch[1].trim() : '';

      // Match group-title
      const groupMatch = line.match(/group-title="([^"]*)"/i) || line.match(/group-title='([^']*)'/i);
      let group = groupMatch ? groupMatch[1].trim() : '';

      // Match tvg-id & tvg-name
      const idMatch = line.match(/tvg-id="([^"]*)"/i);
      if (idMatch) currentMetadata.tvgId = idMatch[1].trim();

      const nameMatch = line.match(/tvg-name="([^"]*)"/i);
      if (nameMatch) currentMetadata.tvgName = nameMatch[1].trim();

      // Channel title is after the last comma
      const lastCommaIdx = line.lastIndexOf(',');
      let title = '';
      if (lastCommaIdx !== -1) {
        title = line.substring(lastCommaIdx + 1).trim();
      }

      // Fallback title
      if (!title && currentMetadata.tvgName) {
        title = currentMetadata.tvgName;
      }
      currentMetadata.title = title || `Channel ${channelIndex}`;

      // Normalize group title
      if (!group || group.toLowerCase() === 'undefined' || group.toLowerCase() === 'null') {
        const lowerTitle = currentMetadata.title.toLowerCase();
        if (lowerTitle.includes('news') || lowerTitle.includes('নিউজ') || lowerTitle.includes('সংবাদ') || lowerTitle.includes('24')) {
          group = 'সংবাদ (News)';
        } else if (lowerTitle.includes('sports') || lowerTitle.includes('খেলা') || lowerTitle.includes('cricket') || lowerTitle.includes('football')) {
          group = 'খেলাধুলা (Sports)';
        } else if (lowerTitle.includes('cinema') || lowerTitle.includes('movie') || lowerTitle.includes('ছবি')) {
          group = 'সিনেমা (Movies)';
        } else if (lowerTitle.includes('music') || lowerTitle.includes('গান') || lowerTitle.includes('sangeet')) {
          group = 'সঙ্গীত (Music)';
        } else if (lowerTitle.includes('kids') || lowerTitle.includes('cartoon') || lowerTitle.includes('কার্টুন')) {
          group = 'কার্টুন ও শিশু (Kids)';
        } else if (lowerTitle.includes('islam') || lowerTitle.includes('quran') || lowerTitle.includes('মক্কা') || lowerTitle.includes('মদিনা')) {
          group = 'ধর্মীয় (Religious)';
        } else {
          group = 'সাধারণ (General)';
        }
      }

      currentMetadata.group = group;
      categoriesSet.add(group);

    } else if (!line.startsWith('#')) {
      // It's a stream URL
      if (currentMetadata && (line.startsWith('http://') || line.startsWith('https://') || line.startsWith('rtmp://') || line.startsWith('mms://'))) {
        const id = `ch_${channelIndex}_${Math.random().toString(36).substring(2, 7)}`;
        
        channels.push({
          id,
          number: channelIndex,
          title: currentMetadata.title || `চ্যানেল ${channelIndex}`,
          group: currentMetadata.group || 'সাধারণ',
          logo: currentMetadata.logo || '',
          url: line,
          tvgId: currentMetadata.tvgId,
          tvgName: currentMetadata.tvgName,
        });

        channelIndex++;
        currentMetadata = null;
      }
    }
  }

  return {
    channels,
    categories: Array.from(categoriesSet).sort((a, b) => a.localeCompare(b, 'bn')),
  };
}

export async function fetchPlaylistWithFallback(url: string): Promise<string> {
  // 1. Direct fetch attempt
  try {
    const res = await fetch(url);
    if (res.ok) {
      return await res.text();
    }
  } catch (e) {
    console.warn('Direct playlist fetch failed, trying CORS proxy fallback...', e);
  }

  // 2. CORS Proxy 1: corsproxy.io
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      return await res.text();
    }
  } catch (e) {
    console.warn('CORS proxy 1 failed, trying proxy 2...', e);
  }

  // 3. CORS Proxy 2: allorigins.win
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      return await res.text();
    }
  } catch (e) {
    console.error('All playlist fetch attempts failed:', e);
  }

  throw new Error('প্লেলিস্ট ফাইলটি লোড করা সম্ভব হয়নি। সংযোগ চেক করুন।');
}
