/**
 * Automatically italicizes "Igni" prefix in product names
 * Uses text node walking to avoid breaking URLs, attributes, or scripts
 *
 * FIXED: Prevents MutationObserver infinite loops
 */

(function() {
  'use strict';

  // Elements to skip entirely (their children won't be processed)
  const SKIP_TAGS = new Set([
    'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'CODE', 'PRE', 'NOSCRIPT'
  ]);

  // Flag to prevent observer from firing during our own modifications
  let isProcessing = false;

  // Debounce timer for observer
  let observerTimeout = null;

  /**
   * Check if a node should be skipped
   */
  function shouldSkipNode(node) {
    if (!node || !node.parentNode) return true;

    const parent = node.parentNode;

    // Skip if parent tag should be ignored
    if (SKIP_TAGS.has(parent.tagName)) return true;

    // Skip if already inside an .igni-styled element
    if (parent.closest && parent.closest('.igni-styled')) return true;

    // Skip if parent IS the igni-styled element
    if (parent.classList && parent.classList.contains('igni-styled')) return true;

    // Skip social follow buttons (don't split brand handle text)
    if (parent.closest && parent.closest('.ge-social-steps')) return true;

    return false;
  }

  /**
   * Process a single text node
   */
  function processTextNode(textNode) {
    // Safety checks
    if (!textNode || !textNode.nodeValue || !textNode.parentNode) return;

    // Check if should skip
    if (shouldSkipNode(textNode)) return;

    const text = textNode.nodeValue;

    // Only process if "Igni" exists
    if (!/Igni/.test(text)) return;

    // Regex: "Igni" at word boundary, followed by uppercase letter OR "ton" (for Igniton)
    const regex = /\bIgni(?=[A-Zt])/g;

    if (!regex.test(text)) return;

    // Reset regex lastIndex after test
    regex.lastIndex = 0;

    // Create a document fragment to hold the new nodes
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;
    let hasMatches = false;

    while ((match = regex.exec(text)) !== null) {
      hasMatches = true;

      // Add text before the match
      if (match.index > lastIndex) {
        var beforeText = text.slice(lastIndex, match.index);
        // Replace trailing space with non-breaking space to prevent
        // flexbox whitespace collapse (e.g. in Dawn .button elements)
        if (beforeText.endsWith(' ')) {
          beforeText = beforeText.slice(0, -1) + '\u00A0';
        }
        fragment.appendChild(
          document.createTextNode(beforeText)
        );
      }

      // Create the italic element
      const italic = document.createElement('i');
      italic.textContent = 'Igni';
      italic.classList.add('igni-styled'); // For CSS control if needed
      fragment.appendChild(italic);

      lastIndex = match.index + 4; // "Igni" is 4 characters
    }

    // If no matches found, don't modify
    if (!hasMatches) return;

    // Add any remaining text after the last match
    if (lastIndex < text.length) {
      fragment.appendChild(
        document.createTextNode(text.slice(lastIndex))
      );
    }

    // Replace the original text node with our fragment
    // CRITICAL: Double-check parent still exists
    if (textNode.parentNode) {
      try {
        textNode.parentNode.replaceChild(fragment, textNode);
      } catch (e) {
        // Node was already removed, ignore silently
      }
    }
  }

  /**
   * Walk all text nodes in an element
   */
  function processElement(root) {
    if (!root) return;

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip if parent is a tag we should ignore
          if (shouldSkipNode(node)) {
            return NodeFilter.FILTER_REJECT;
          }

          // Skip empty or whitespace-only nodes
          if (!node.nodeValue || !node.nodeValue.trim()) {
            return NodeFilter.FILTER_REJECT;
          }

          // Skip if doesn't contain "Igni"
          if (!/Igni/.test(node.nodeValue)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    // Collect nodes first (modifying while walking causes issues)
    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    // Process each text node
    textNodes.forEach(processTextNode);
  }

  /**
   * Main initialization
   */
  function init() {
    isProcessing = true;
    processElement(document.body);
    // Small delay before allowing observer to run
    setTimeout(() => {
      isProcessing = false;
    }, 100);
  }

  /**
   * Observe for dynamic content (AJAX, Shopify sections, etc.)
   */
  function observeDynamicContent() {
    const observer = new MutationObserver((mutations) => {
      // CRITICAL: Skip if we're currently processing
      if (isProcessing) return;

      // Check if any mutations are worth processing
      let hasRelevantChanges = false;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          // Skip our own igni-styled elements
          if (node.nodeType === Node.ELEMENT_NODE &&
              node.classList &&
              node.classList.contains('igni-styled')) {
            continue;
          }

          // Check if contains "Igni"
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.textContent && /Igni/.test(node.textContent)) {
              hasRelevantChanges = true;
              break;
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            if (node.nodeValue && /Igni/.test(node.nodeValue) && !shouldSkipNode(node)) {
              hasRelevantChanges = true;
              break;
            }
          }
        }
        if (hasRelevantChanges) break;
      }

      // Only process if we found relevant changes
      if (!hasRelevantChanges) return;

      // Debounce processing to prevent rapid-fire
      clearTimeout(observerTimeout);
      observerTimeout = setTimeout(() => {
        isProcessing = true;

        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            // Skip igni-styled elements we created
            if (node.nodeType === Node.ELEMENT_NODE &&
                node.classList &&
                node.classList.contains('igni-styled')) {
              return;
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
              processElement(node);
            } else if (node.nodeType === Node.TEXT_NODE) {
              // FIXED: Check shouldSkipNode before processing
              if (!shouldSkipNode(node)) {
                processTextNode(node);
              }
            }
          });
        });

        // Allow observer to run again after delay
        setTimeout(() => {
          isProcessing = false;
        }, 100);
      }, 50); // 50ms debounce
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      observeDynamicContent();
    });
  } else {
    init();
    observeDynamicContent();
  }

  // Shopify section events
  document.addEventListener('shopify:section:load', (e) => {
    if (e.target && !isProcessing) {
      isProcessing = true;
      processElement(e.target);
      setTimeout(() => {
        isProcessing = false;
      }, 100);
    }
  });

})();
