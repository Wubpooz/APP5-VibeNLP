/**
 * VibeNLP Slides - Theme Toggle
 * Press T or click the button to switch Day/Night mode.
 * Button is positioned to the left of Reveal.js navigation controls.
 * Preference is saved in localStorage.
 */
(function () {
    var STORAGE_KEY = 'vibeNLP-theme';
    var LIGHT_CLASS = 'theme-light';

    // Apply saved theme immediately to avoid flash of wrong theme
    if (localStorage.getItem(STORAGE_KEY) === 'light') {
        document.documentElement.classList.add(LIGHT_CLASS);
    }

    function isLight() {
        return document.documentElement.classList.contains(LIGHT_CLASS);
    }

    function updateButton(btn) {
        if (!btn) return;
        btn.textContent = isLight() ? '\uD83C\uDF19' : '\u2600\uFE0F';
        btn.title = isLight() ? 'Switch to Night mode (T)' : 'Switch to Day mode (T)';
    }

    function toggleTheme() {
        var html = document.documentElement;
        if (isLight()) {
            html.classList.remove(LIGHT_CLASS);
            localStorage.setItem(STORAGE_KEY, 'dark');
        } else {
            html.classList.add(LIGHT_CLASS);
            localStorage.setItem(STORAGE_KEY, 'light');
        }
        updateButton(document.querySelector('.theme-toggle-btn'));
    }

    function alignToControls(btn) {
        // Target the previous-slide button specifically for accurate alignment
        var navLeft = document.querySelector('.navigate-left');
        var controls = document.querySelector('aside.controls');
        if (!navLeft && !controls) return false;

        var ref = navLeft || controls;
        var cr = ref.getBoundingClientRect();
        if (cr.width === 0) return false; // not yet rendered

        var bh = btn.offsetHeight || 42;

        // Vertically: center our button with the navigate-left button
        var bottom = window.innerHeight - cr.bottom + (cr.height - bh) / 2;
        // Horizontally: place to the left of navigate-left with a 24px gap
        var right = window.innerWidth - cr.left + 14;

        btn.style.bottom = Math.max(Math.round(bottom), 8) + 'px';
        btn.style.right  = Math.round(right) + 'px';
        return true;
    }

    function waitForControls(btn, attempt) {
        attempt = attempt || 0;
        if (alignToControls(btn)) {
            // Re-align on window resize
            window.addEventListener('resize', function () { alignToControls(btn); });
        } else if (attempt < 30) {
            // Reveal.js injects controls asynchronously; retry every 100ms
            setTimeout(function () { waitForControls(btn, attempt + 1); }, 100);
        }
        // If controls never appear (e.g. disabled), button stays at CSS default
    }

    function createButton() {
        var btn = document.createElement('button');
        btn.className = 'theme-toggle-btn';
        btn.setAttribute('aria-label', 'Toggle day/night theme');
        updateButton(btn);
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleTheme();
        });
        document.body.appendChild(btn);
        waitForControls(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createButton);
    } else {
        createButton();
    }

    // Keyboard shortcut: T (no modifier keys, capture phase so Reveal.js won't block it)
    document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        if (e.key === 't' || e.key === 'T') {
            toggleTheme();
        }
    }, true);
}());
