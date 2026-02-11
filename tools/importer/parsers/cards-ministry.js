/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-ministry block
 *
 * Source: https://www.hftcm.org
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Cards-Ministry")
 * - Row 2-N: [Image | Title + Description + CTA link] per card
 *
 * Source HTML Pattern (from captured DOM):
 * Cards are composed of adjacent wsb-element groups:
 * <div class="wsb-element-image"><div class="wsb-image-inner"><div class="img_theme"><img src="..."></div></div></div>
 * <div class="wsb-element-text"><div class="txt"><h3>Title</h3><p>Description</p></div></div>
 * <div class="wsb-element-button"><div><a class="wsb-button" href="..."><span>Read More</span></a></div></div>
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  // The cards section contains multiple image+text+button groups
  // VALIDATED: Captured DOM shows .wsb-element-image, .wsb-element-text, .wsb-element-button patterns
  const images = element.querySelectorAll('.wsb-element-image .img_theme img, .wsb-element-image .img img');
  const textBlocks = element.querySelectorAll('.wsb-element-text .txt');
  const buttonBlocks = element.querySelectorAll('.wsb-element-button a.wsb-button');

  // Build cells array - each card is one row with [image, content]
  const cells = [];

  // Determine card count from images (most reliable indicator)
  const cardCount = Math.max(images.length, textBlocks.length);

  for (let i = 0; i < cardCount; i++) {
    // Image cell
    const img = images[i];
    const imgCell = document.createElement('div');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src || img.getAttribute('src');
      newImg.alt = img.alt || '';
      imgCell.appendChild(newImg);
    }

    // Content cell: title + description + CTA
    const contentCell = document.createElement('div');

    // Extract heading and description from text block
    const textBlock = textBlocks[i];
    if (textBlock) {
      const heading = textBlock.querySelector('h3, h2, h4');
      if (heading) {
        const h3 = document.createElement('h3');
        h3.textContent = heading.textContent.trim();
        contentCell.appendChild(h3);
      }

      const desc = textBlock.querySelector('p');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        contentCell.appendChild(p);
      }
    }

    // Extract CTA link from button block
    const button = buttonBlocks[i];
    if (button) {
      const link = document.createElement('a');
      link.href = button.getAttribute('href') || button.href || '#';
      link.textContent = button.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(link);
      contentCell.appendChild(p);
    }

    cells.push([imgCell, contentCell]);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Ministry', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
