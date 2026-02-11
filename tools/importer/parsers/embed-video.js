/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-video block
 *
 * Source: https://www.hftcm.org
 * Base Block: embed
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Embed-Video")
 * - Row 2: Video URL (YouTube link)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="wsb-element-youtube">
 *   <div>
 *     <div class="youtube">
 *       <iframe src="//www.youtube.com/embed/HbEkGB4mkkk?..."></iframe>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  // Extract YouTube URL from iframe src attribute
  // VALIDATED: Captured DOM shows <iframe src="//www.youtube.com/embed/HbEkGB4mkkk?...">
  const iframe = element.querySelector('iframe[src*="youtube"]') ||
                 element.querySelector('iframe[src*="youtu.be"]');

  let videoUrl = '';

  if (iframe) {
    const src = iframe.getAttribute('src') || '';
    // Extract video ID from embed URL
    // Pattern: //www.youtube.com/embed/{videoId}?...
    const match = src.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    if (match) {
      videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
    } else {
      // Fallback: use src directly, fixing protocol if needed
      videoUrl = src.startsWith('//') ? `https:${src}` : src;
    }
  }

  // Fallback: Check for direct YouTube links
  if (!videoUrl) {
    const link = element.querySelector('a[href*="youtube"], a[href*="youtu.be"]');
    if (link) {
      videoUrl = link.href;
    }
  }

  // Build cells array matching embed block structure
  // Row 1: Video URL as a link element
  const linkEl = document.createElement('a');
  linkEl.href = videoUrl;
  linkEl.textContent = videoUrl;

  const cells = [
    [linkEl],
  ];

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Embed-Video', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
