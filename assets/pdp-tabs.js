/* ═══════════════════════════════════════════════════════════
   PDP Tabs Controller
   ─────────────────────────────
   Vanilla JS controller for the `pdp-tabs` section. For each
   [data-pdp-tabs] root it:
     • Finds all tab buttons ([data-tab-target])
     • Resolves target panels by element id
     • Activates one at a time, hiding the rest via
       .pdp-tab-panel--hidden
     • Supports keyboard nav (Left/Right arrows, Home/End)
     • Reads & updates window.location.hash for deep-links
   Gracefully no-ops when no matching panels exist on the page.
   ═══════════════════════════════════════════════════════════ */

(function () {
  var tabsRoots = document.querySelectorAll('[data-pdp-tabs]');
  if (!tabsRoots.length) return;

  tabsRoots.forEach(function (tabsRoot) {
    var updateHash = tabsRoot.dataset.updateHash === 'true';
    var tabButtons = Array.prototype.slice.call(
      tabsRoot.querySelectorAll('[data-tab-target]')
    );
    if (!tabButtons.length) return;

    // Resolve each button's target panel by id. Buttons without a
    // matching panel on the page are dropped from the active set.
    var pairs = tabButtons
      .map(function (btn) {
        var panel = document.getElementById(btn.dataset.tabTarget);
        return panel ? { btn: btn, panel: panel } : null;
      })
      .filter(Boolean);

    if (!pairs.length) return;

    var activeButtons = pairs.map(function (p) { return p.btn; });
    var panels = pairs.map(function (p) { return p.panel; });

    function activate(anchor, pushHash) {
      activeButtons.forEach(function (btn) {
        var active = btn.dataset.tabTarget === anchor;
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
        btn.tabIndex = active ? 0 : -1;
      });
      panels.forEach(function (panel) {
        if (panel.id === anchor) {
          panel.classList.remove('pdp-tab-panel--hidden');
        } else {
          panel.classList.add('pdp-tab-panel--hidden');
        }
      });
      if (pushHash && updateHash && anchor) {
        try {
          history.replaceState(null, '', '#' + anchor);
        } catch (e) {
          /* no-op: older browsers / sandboxed contexts */
        }
      }
    }

    // Click → activate
    activeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activate(btn.dataset.tabTarget, true);
      });
    });

    // Keyboard nav: Left/Right cycle, Home/End jump to ends
    tabsRoot.addEventListener('keydown', function (e) {
      var keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (keys.indexOf(e.key) === -1) return;
      var currentIdx = activeButtons.findIndex(function (b) {
        return b.getAttribute('aria-selected') === 'true';
      });
      if (currentIdx === -1) currentIdx = 0;
      var nextIdx;
      if (e.key === 'Home') {
        nextIdx = 0;
      } else if (e.key === 'End') {
        nextIdx = activeButtons.length - 1;
      } else {
        var delta = e.key === 'ArrowRight' ? 1 : -1;
        nextIdx = (currentIdx + delta + activeButtons.length) % activeButtons.length;
      }
      activeButtons[nextIdx].focus();
      activate(activeButtons[nextIdx].dataset.tabTarget, true);
      e.preventDefault();
    });

    // Initial activation: hash → data-tab-default panel → first tab
    var hashAnchor = window.location.hash ? window.location.hash.slice(1) : '';
    var hashMatch = hashAnchor && activeButtons.find(function (b) {
      return b.dataset.tabTarget === hashAnchor;
    });
    if (hashMatch) {
      activate(hashAnchor, false);
    } else {
      var defaultPanel = panels.find(function (p) {
        return p.dataset.tabDefault === 'true';
      });
      var initialAnchor = defaultPanel ? defaultPanel.id : activeButtons[0].dataset.tabTarget;
      activate(initialAnchor, false);
    }

    // Respond to hash changes (back/forward, external anchor links)
    window.addEventListener('hashchange', function () {
      var anchor = window.location.hash ? window.location.hash.slice(1) : '';
      if (anchor && activeButtons.find(function (b) {
        return b.dataset.tabTarget === anchor;
      })) {
        activate(anchor, false);
      }
    });
  });
})();
