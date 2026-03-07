#!/usr/bin/env node
/**
 * check-overflow.js — Reveal.js slide overflow detector
 *
 * Renders each slide in a headless browser, makes all fragments visible,
 * then checks whether any element extends beyond the slide boundary.
 *
 * Usage:
 *   node tools/check-overflow.js slides/my-slides.html
 *
 * First-time setup:
 *   cd tools && npm install
 */

const puppeteer = require('puppeteer');
const path = require('path');

const OVERFLOW_THRESHOLD_PX = 8; // ignore sub-pixel rounding errors
const SLIDE_SETTLE_MS = 300;      // wait after navigating to a slide

async function checkSlides(htmlPath) {
    const absolutePath = path.resolve(htmlPath);
    console.log(`\nChecking: ${absolutePath}`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Match a typical projector / presentation viewport
    await page.setViewport({ width: 1280, height: 720 });

    // Load the file; allow extra time for CDN resources
    try {
        await page.goto(`file://${absolutePath}`, {
            waitUntil: 'networkidle0',
            timeout: 30000,
        });
    } catch (_) {
        // CDN timeout is non-fatal — Reveal.js may still have initialised
    }

    // Wait for Reveal.js to be ready
    try {
        await page.waitForFunction(
            () => typeof Reveal !== 'undefined' && Reveal.isReady(),
            { timeout: 15000 }
        );
    } catch {
        console.error(
            '\nError: Reveal.js did not initialise.\n' +
            '  • Make sure the file path is correct.\n' +
            '  • CDN resources require an internet connection.'
        );
        await browser.close();
        process.exit(1);
    }

    const totalSlides = await page.evaluate(() => Reveal.getTotalSlides());
    console.log(`Total slides: ${totalSlides}\n`);

    const issues = [];

    for (let i = 0; i < totalSlides; i++) {
        // Navigate to slide i (horizontal index; vertical always 0 for flat decks)
        await page.evaluate((idx) => Reveal.slide(idx, 0, 0), i);
        await new Promise((r) => setTimeout(r, SLIDE_SETTLE_MS));

        // Force all fragments to be visible so we see the fully-populated slide
        await page.evaluate(() => {
            document
                .querySelectorAll(
                    '.reveal .slides section.present .fragment:not(.visible)'
                )
                .forEach((el) => {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                    el.style.display = '';
                });
        });
        await new Promise((r) => setTimeout(r, 100));

        const result = await page.evaluate((threshold) => {
            const slide = document.querySelector(
                '.reveal .slides section.present'
            );
            if (!slide) return null;

            const slideRect = slide.getBoundingClientRect();
            const cfg       = Reveal.getConfig();
            const scale     = Reveal.getScale();

            // Use Reveal.js configured dimensions as the true boundary,
            // converting to viewport coordinates via the current scale.
            // This catches overflow that the section element absorbs by
            // expanding beyond the configured 960×700 slide area.
            const boundaryBottom = slideRect.top  + cfg.height * scale;
            const boundaryRight  = slideRect.left + cfg.width  * scale;

            const overflows = [];

            slide.querySelectorAll('*').forEach((el) => {
                // Skip speaker notes
                if (el.tagName === 'ASIDE' || el.closest('aside')) return;

                const rect = el.getBoundingClientRect();
                if (rect.height < 1 || rect.width < 1) return;

                const overflowY = rect.bottom - boundaryBottom;
                const overflowX = rect.right  - boundaryRight;

                if (overflowY > threshold || overflowX > threshold) {
                    overflows.push({
                        tag:      el.tagName.toLowerCase(),
                        classes:  Array.from(el.classList).slice(0, 4).join('.'),
                        text:     (el.textContent || '')
                                      .replace(/\s+/g, ' ')
                                      .trim()
                                      .slice(0, 60),
                        overflowY: overflowY > threshold ? Math.round(overflowY) : 0,
                        overflowX: overflowX > threshold ? Math.round(overflowX) : 0,
                    });
                }
            });

            if (overflows.length === 0) return null;

            overflows.sort((a, b) => b.overflowY - a.overflowY);
            return {
                maxOverflowY:  overflows[0].overflowY,
                maxOverflowX:  overflows[0].overflowX,
                worstElement:  overflows[0],
                configHeight:  cfg.height,
                slideActualH:  Math.round(slide.scrollHeight),
            };
        }, OVERFLOW_THRESHOLD_PX);

        if (result) {
            const title = await page.evaluate(() => {
                const h = document.querySelector(
                    '.reveal .slides section.present h1,' +
                    '.reveal .slides section.present h2,' +
                    '.reveal .slides section.present h3'
                );
                return h
                    ? h.textContent.replace(/\s+/g, ' ').trim().slice(0, 60)
                    : '(no title)';
            });
            issues.push({ slide: i + 1, title, ...result });
        }
    }

    await browser.close();

    // ── Report ────────────────────────────────────────────────────────────
    const divider = '─'.repeat(64);
    console.log(divider);

    if (issues.length === 0) {
        console.log('✅  All slides fit within the slide boundary.');
    } else {
        console.log(`⚠️   Overflow in ${issues.length} of ${totalSlides} slides:\n`);

        issues.forEach(({ slide, title, maxOverflowY, maxOverflowX, worstElement }) => {
            const num = String(slide).padStart(2);
            console.log(`  Slide ${num}: "${title}"`);
            if (maxOverflowY > 0)
                console.log(`           Vertical overflow:   ${maxOverflowY}px`);
            if (maxOverflowX > 0)
                console.log(`           Horizontal overflow: ${maxOverflowX}px`);

            const cls = worstElement.classes ? ` .${worstElement.classes}` : '';
            console.log(`           Worst element: <${worstElement.tag}>${cls}`);
            if (worstElement.text)
                console.log(`           Content:       "${worstElement.text}"`);
            console.log('');
        });
    }

    console.log(divider + '\n');
    return issues;
}

// ── CLI entry point ──────────────────────────────────────────────────────
const htmlPath = process.argv[2];
if (!htmlPath) {
    console.error('Usage: node tools/check-overflow.js <path-to-reveal-slides.html>');
    process.exit(1);
}

checkSlides(htmlPath).catch((err) => {
    console.error('Fatal error:', err.message);
    process.exit(1);
});
