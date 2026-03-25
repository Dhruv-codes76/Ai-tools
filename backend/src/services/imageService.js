const axios = require('axios');
const metascraper = require('metascraper')([
    require('metascraper-image')(),
    require('metascraper-title')(),
    require('metascraper-description')()
]);
const got = require('got');
const { uploadToCloudinary } = require('../config/cloudinary');

/**
 * Service to handle image sourcing, scraping, and uploads.
 */

/**
 * Extracts an image from a URL, or falls back to Unsplash/Placeholder.
 * Used for automated news scraping.
 */
const getFeaturedImageFromUrl = async (articleUrl, articleTitle) => {
    try {
        // 1. Try to scrape the og:image from the source
        let imageUrl = await scrapeImage(articleUrl);
        
        // 2. If no image found, try Unsplash if configured
        if (!imageUrl) {
            imageUrl = await getFallbackImage(articleTitle);
        }

        // 3. Upload to Cloudinary
        if (imageUrl) {
            return await uploadToCloudinaryFromUrl(imageUrl);
        }

        return null;
    } catch (error) {
        console.error('ImageService Error:', error.message);
        return null;
    }
};

const scrapeImage = async (url) => {
    try {
        const { body: html, url: responseUrl } = await got(url, { timeout: 10000 });
        const metadata = await metascraper({ html, url: responseUrl });
        return metadata.image;
    } catch (e) {
        console.error(`Scraping failed for ${url}:`, e.message);
        return null;
    }
};

const getFallbackImage = async (query) => {
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (unsplashKey) {
        try {
            const res = await axios.get(`https://api.unsplash.com/search/photos`, {
                params: { query, per_page: 1 },
                headers: { Authorization: `Client-ID ${unsplashKey}` }
            });
            if (res.data.results.length > 0) {
                return res.data.results[0].urls.regular;
            }
        } catch (e) {
            console.error('Unsplash Search Failed:', e.message);
        }
    }
    
    // Final fallback: High-quality AI related image
    return `https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000`;
};

const uploadToCloudinaryFromUrl = async (imageUrl) => {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        const uploadResult = await uploadToCloudinary(buffer, 'news');
        return uploadResult.secure_url;
    } catch (error) {
        console.error('Cloudinary Upload Failed:', error.message);
        return null;
    }
};

/**
 * Service to handle multiple image uploads for a single entity (News/Tool).
 * Maps specific file fields to their uploaded URLs.
 */
const handleImageUploads = async (files, existingData, folder = 'uploads') => {
  const updatedData = { ...existingData };
  const fields = ['featuredImage', 'ogImage', 'twitterImage'];

  for (const field of fields) {
    if (files && files[field] && files[field][0]) {
      const result = await uploadToCloudinary(files[field][0].buffer, folder);
      updatedData[field] = result.secure_url;
    }
  }

  return updatedData;
};

module.exports = {
  handleImageUploads,
  getFeaturedImageFromUrl
};
