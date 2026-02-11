/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Hope for the Children Ministries website cleanup
 * Purpose: Remove non-content elements and fix HTML issues from GoDaddy Website Builder
 * Applies to: www.hftcm.org (all templates)
 * Generated: 2026-02-11
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - GoDaddy Website Builder (WSB) specific elements
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove GoDaddy WSB navigation element (handled by EDS header)
    // EXTRACTED: Found <div class="wsb-element-navigation"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.wsb-element-navigation',
    ]);

    // Remove WSB line/divider elements (decorative only)
    // EXTRACTED: Found <div class="wsb-element-line"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.wsb-element-line',
    ]);

    // Remove WSB shape elements (decorative background shapes)
    // EXTRACTED: Found <div class="wsb-element-shape"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.wsb-element-shape',
    ]);

    // Remove footer section (handled by EDS footer)
    // EXTRACTED: Found <div id="wsb-canvas-template-footer"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#wsb-canvas-template-footer',
    ]);

    // Remove "View on Mobile" link (WSB specific)
    // EXTRACTED: Found <div class="view-as-mobile"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.view-as-mobile',
    ]);

    // Remove site logo/title in header (handled by EDS header)
    // EXTRACTED: Found <div id="wsb-element-00000000-0000-0000-0000-000388728370"> with site name links
    const siteTitle = element.querySelector('#wsb-element-00000000-0000-0000-0000-000388728370');
    if (siteTitle) siteTitle.remove();

    // Fix nested font/span elements from GoDaddy builder
    // EXTRACTED: Captured DOM shows <font><span><b>text</b></span></font> patterns
    const fontElements = element.querySelectorAll('font');
    for (const font of fontElements) {
      const parent = font.parentNode;
      while (font.firstChild) {
        parent.insertBefore(font.firstChild, font);
      }
      font.remove();
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove iframes (YouTube handled by embed block)
    // EXTRACTED: Found <iframe src="//www.youtube.com/embed/..."> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'iframe',
    ]);

    // Remove HTML snippet elements (GuideStar badge etc.)
    // EXTRACTED: Found <div class="wsb-element-htmlsnippet"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.wsb-element-htmlsnippet',
    ]);

    // Remove data:image placeholder images from WSB
    // EXTRACTED: Found <img src="data:image/gif;base64,..."> in captured DOM navigation
    const dataImages = element.querySelectorAll('img[src^="data:"]');
    for (const img of dataImages) {
      img.remove();
    }
  }
}
