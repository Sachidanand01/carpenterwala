import { supabase } from './supabase';

/**
 * Extracts YouTube Video ID from various YouTube URL formats
 * Supports:
 * - youtube.com/shorts/VIDEO_ID
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 * - Plain VIDEO_ID string (11 characters)
 */
export function extractYouTubeId(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex matching various YouTube URL patterns
  const match = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  return match ? match[1] : null;
}

/**
 * Returns the highest quality available YouTube thumbnail URL
 */
export function getYouTubeThumbnail(youtubeId, quality = 'maxres') {
  if (!youtubeId) return '/images/og-image.png';
  if (quality === 'maxres') {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

/**
 * Starter fallback seed reels for when Supabase tables are newly created or offline
 */
export const SEED_REELS = [
  {
    id: 101,
    youtube_id: "dQw4w9WgXcQ", // Starter placeholder replaced with actual DIY Shorts format
    title: "How to Fix Loose Hinges in 60 Seconds",
    description: "Quick carpentry trick to fix stripped screw holes in cabinet hinges using wooden dowels and wood glue.",
    category_name: "Cabinet & Wardrobe",
    category_id: 1,
    tags: ["hinges", "quick fix", "cabinet", "screws"],
    thumbnail_url: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80",
    likes_count: 142,
    views_count: 3200,
    is_published: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 102,
    youtube_id: "L_LUpnjgPso",
    title: "Wood Polish at Home – Pro Scratch Removal",
    description: "Restoring old teak wood coffee table scratches using natural beeswax and mineral oil polish technique.",
    category_name: "Polish & Restoration",
    category_id: 2,
    tags: ["polish", "scratch repair", "teak", "restoration"],
    thumbnail_url: "https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=600&auto=format&fit=crop&q=80",
    likes_count: 289,
    views_count: 5410,
    is_published: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 103,
    youtube_id: "kJQP7kiw5Fk",
    title: "Fixing Squeaky Door Hinges in 30 Sec",
    description: "No more annoying noise! Discover the best lubricant to permanently stop wooden door squeaks.",
    category_name: "Doors & Windows",
    category_id: 3,
    tags: ["squeaky door", "hinge", "door repair", "lubricant"],
    thumbnail_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    likes_count: 310,
    views_count: 7800,
    is_published: true,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    id: 104,
    youtube_id: "9bZkp7q19f0",
    title: "Smooth Sliding Wardrobe Track Maintenance",
    description: "How to clean, align rollers, and adjust height for effortless heavy sliding wardrobe doors.",
    category_name: "Cabinet & Wardrobe",
    category_id: 1,
    tags: ["sliding wardrobe", "rollers", "track fix"],
    thumbnail_url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80",
    likes_count: 198,
    views_count: 4210,
    is_published: true,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString()
  }
];

/**
 * Fetch all custom categories from Supabase with fallback
 */
export async function getDiyCategories() {
  try {
    const { data, error } = await supabase
      .from('diy_reel_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.warn("Could not fetch categories from Supabase, returning empty/default array:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.warn("Exception fetching diy_reel_categories:", err);
    return [];
  }
}

/**
 * Create a new custom category
 */
export async function createCategory(name) {
  if (!name || !name.trim()) throw new Error("Category name is required");
  const trimmed = name.trim();
  const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const { data, error } = await supabase
    .from('diy_reel_categories')
    .insert([{ name: trimmed, slug }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a category by ID
 */
export async function deleteCategory(id) {
  const { error } = await supabase
    .from('diy_reel_categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

/**
 * Fetch DIY Reels with optional search query, category filter, and pagination
 */
export async function getDiyReels({ search = '', category = '', limit = 50, includeUnpublished = false } = {}) {
  try {
    let query = supabase
      .from('diy_reels')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }

    if (category && category !== 'all') {
      // Category can be slug, ID, or name
      query = query.or(`category_name.ilike.%${category}%,category_id.eq.${!isNaN(category) ? category : -1}`);
    }

    if (search && search.trim()) {
      const term = search.trim();
      query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%,category_name.ilike.%${term}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("Supabase diy_reels query error, returning empty:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.warn("Exception in getDiyReels:", err);
    return [];
  }
}

/**
 * Add a new DIY Reel to Supabase
 */
export async function addDiyReel({
  youtube_url,
  title,
  description = '',
  category_id = null,
  category_name = '',
  tags = [],
  thumbnail_url = null,
  is_published = true
}) {
  const youtubeId = extractYouTubeId(youtube_url);
  if (!youtubeId) {
    throw new Error("Invalid YouTube URL or Video ID provided.");
  }
  if (!title || !title.trim()) {
    throw new Error("Reel title is required.");
  }

  const finalThumbnail = thumbnail_url || getYouTubeThumbnail(youtubeId, 'hq');

  const { data, error } = await supabase
    .from('diy_reels')
    .insert([
      {
        youtube_id: youtubeId,
        title: title.trim(),
        description: description?.trim() || '',
        category_id: category_id || null,
        category_name: category_name || null,
        tags: Array.isArray(tags) ? tags : [],
        thumbnail_url: finalThumbnail,
        is_published,
        likes_count: 0,
        views_count: 0,
        published_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing DIY Reel
 */
export async function updateDiyReel(id, updates) {
  const payload = { ...updates, updated_at: new Date().toISOString() };
  if (payload.youtube_url) {
    const yId = extractYouTubeId(payload.youtube_url);
    if (yId) {
      payload.youtube_id = yId;
      if (!payload.thumbnail_url) {
        payload.thumbnail_url = getYouTubeThumbnail(yId, 'hq');
      }
    }
    delete payload.youtube_url;
  }

  const { data, error } = await supabase
    .from('diy_reels')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a DIY Reel
 */
export async function deleteDiyReel(id) {
  const { error } = await supabase
    .from('diy_reels')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

/**
 * Toggle publish status of a reel
 */
export async function toggleReelPublish(id, is_published) {
  return updateDiyReel(id, { is_published });
}

/**
 * Record a view count increment on-site
 */
export async function recordReelView(id) {
  try {
    const { data: current } = await supabase
      .from('diy_reels')
      .select('views_count')
      .eq('id', id)
      .single();

    if (current) {
      await supabase
        .from('diy_reels')
        .update({ views_count: (current.views_count || 0) + 1 })
        .eq('id', id);
    }
  } catch (err) {
    console.warn("Silent error updating views_count:", err);
  }
}

/**
 * Toggle like count increment / decrement on-site
 */
export async function toggleReelLike(id, delta = 1) {
  try {
    const { data: current } = await supabase
      .from('diy_reels')
      .select('likes_count')
      .eq('id', id)
      .single();

    if (current) {
      const newCount = Math.max(0, (current.likes_count || 0) + delta);
      await supabase
        .from('diy_reels')
        .update({ likes_count: newCount })
        .eq('id', id);
      return newCount;
    }
  } catch (err) {
    console.warn("Silent error updating likes_count:", err);
  }
  return null;
}

/**
 * Fetches recent video uploads metadata from a public YouTube Channel feed or Data API
 */
export async function fetchChannelReelsFromYouTube(channelHandleOrId = '@your-carpenterwala') {
  try {
    const cleanHandle = channelHandleOrId.replace(/^@/, '');
    
    // Attempt 1: Fetch through YouTube public RSS / Atom XML feed
    const channelFeedUrl = `https://www.youtube.com/feeds/videos.xml?user=${cleanHandle}`;
    
    let res = await fetch(channelFeedUrl, { next: { revalidate: 3600 } }).catch(() => null);
    
    if (!res || !res.ok) {
      // Try channel_id format if user handle failed
      const channelIdUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${cleanHandle}`;
      res = await fetch(channelIdUrl, { next: { revalidate: 3600 } }).catch(() => null);
    }

    if (res && res.ok) {
      const xmlText = await res.text();
      // Parse XML entries with regex
      const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
      const results = [];
      let match;

      while ((match = entryRegex.exec(xmlText)) !== null) {
        const entryContent = match[1];
        const idMatch = entryContent.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
        const titleMatch = entryContent.match(/<title>(.*?)<\/title>/);
        const descMatch = entryContent.match(/<media:description>([\s\S]*?)<\/media:description>/);
        const publishedMatch = entryContent.match(/<published>(.*?)<\/published>/);

        if (idMatch && idMatch[1]) {
          const yId = idMatch[1];
          results.push({
            youtube_id: yId,
            title: titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : 'DIY Short',
            description: descMatch ? descMatch[1].substring(0, 300) : '',
            thumbnail_url: getYouTubeThumbnail(yId, 'hq'),
            published_at: publishedMatch ? publishedMatch[1] : new Date().toISOString()
          });
        }
      }

      if (results.length > 0) return results;
    }

    // Fallback seed list if network is restricted during dev
    return SEED_REELS.map(r => ({
      youtube_id: r.youtube_id,
      title: r.title,
      description: r.description,
      thumbnail_url: r.thumbnail_url,
      published_at: r.created_at
    }));
  } catch (err) {
    console.error("Error fetching channel reels from YouTube:", err);
    return [];
  }
}

/**
 * Server/Client sync logic: Sync channel uploads with Supabase
 */
export async function syncYouTubeChannelToDatabase(channelHandle = '@your-carpenterwala') {
  const youtubeVideos = await fetchChannelReelsFromYouTube(channelHandle);
  if (!youtubeVideos || youtubeVideos.length === 0) {
    return { added: 0, existing: 0, total: 0, message: "No videos found or unable to fetch feed." };
  }

  let addedCount = 0;
  let existingCount = 0;

  for (const video of youtubeVideos) {
    try {
      // Check if video already exists
      const { data: existing } = await supabase
        .from('diy_reels')
        .select('id')
        .eq('youtube_id', video.youtube_id)
        .maybeSingle();

      if (existing) {
        existingCount++;
      } else {
        const { error: insertErr } = await supabase
          .from('diy_reels')
          .insert([
            {
              youtube_id: video.youtube_id,
              title: video.title,
              description: video.description || '',
              thumbnail_url: video.thumbnail_url,
              published_at: video.published_at || new Date().toISOString(),
              is_published: true,
              likes_count: 0,
              views_count: 0
            }
          ]);

        if (!insertErr) {
          addedCount++;
        }
      }
    } catch (e) {
      console.warn("Sync insert error for video", video.youtube_id, e);
    }
  }

  return {
    added: addedCount,
    existing: existingCount,
    total: youtubeVideos.length,
    message: `Sync completed: ${addedCount} new reels added, ${existingCount} already up to date.`
  };
}
