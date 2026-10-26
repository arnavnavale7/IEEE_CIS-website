# IEEE CIS · VIT Pune

React + Vite + JavaScript + CSS. The member-provided site's design ideas are adapted into the existing chapter website. The approved logo, core team, photographs, event data and official contact links are retained.

## Start on Windows

1. Install Node.js 22 or newer from https://nodejs.org/.
2. Extract the entire source ZIP into a folder.
3. Double-click `START-WEBSITE.cmd`.

The launcher installs dependencies when needed (internet required on the first launch), starts Vite and opens your browser. Keep the terminal open while using the website. Press Ctrl+C to stop. Vite selects another port if its default port is occupied.

Alternatively:

```sh
npm ci
npm run dev -- --open
```

## Build and deploy

```sh
npm run build
```

The `dist` folder is the built website. Preview it with `npm run preview`.

- **Vercel:** Import the source repository, select Vite, use `npm run build` and output directory `dist`. The included `vercel.json` supports direct links to routes such as `/events/techshift`.
- **Cloudflare Pages:** Use the `ieee-cis-upload-ready.zip` with Direct Upload, or deploy the contents of `dist`. `_redirects` supports React routes.

The source ZIP includes the launcher. The upload-ready ZIP contains only the built website and should be uploaded to a static host. Do not open its index.html directly using a file URL.

## Content and assets

Edit `src/content.js` to update club information, team members, events and galleries. Current team order:

- Prasanna Mehkarkar — President
- Atharva Mankar — Vice President
- Surabhi Patel — Secretary
- Vedant Gandhi — Event Manager
- Angel Gurjar — Event Manager
- Saachi Biyani — Treasurer
- Samarth Shinde — PR Officer

The logo is `public/images/club-logo-sticker.png`. The transparent team portraits are in `public/images/team`; event photographs are in `public/images/techshift`.

The design merge leaves the current data unchanged: Techshift, dated 12 October 2026, is the listed past event. Upcoming events display an empty state until an event is added. No sample events, faculty names, awards or resources from the member's template are imported.

Official email: ieee.cis@vit.edu. Instagram and LinkedIn URLs are configured in `src/content.js`.

## Design and interactions

- Navy `#10283F`, cyan `#007E9C`, bright cyan `#00A9CE`, white and pale blue surfaces.
- `src/style.css`: layout, shared components and responsive behavior.
- `src/identity.css`: homepage and chapter-specific presentation.
- `src/motion.css`: restrained entrance and interaction animations.
- Team carousel advances every 3.5 seconds. The portrait enters from the left, followed by the name and role on the right. Dot selection and swiping restart the interval; clicking a dot does not stop autoplay. Hidden tabs and reduced-motion settings pause autoplay.
- Gallery supports next/previous buttons, arrow keys, Escape and focus restoration.
- Mobile navigation can be dismissed with Escape and closes after route navigation.
- Reduced-motion preferences disable animations; pagination remains usable.

## Contact behavior

The contact form prepares an email draft. Visitors can open Gmail or their configured mail app and send it themselves. Email is not sent directly from the website, and submissions are not stored. This source package is a static React website; it does not include a server or database. No environment variables or secrets are required.

All required club images are local. Google Fonts use system-font fallbacks; the campus map uses Google Maps.

## Interactive controls

- Homepage topic tabs respond to clicks, taps, Left/Right arrow keys, Home and End.
- Team pagination supports Left/Right arrow keys, Home and End without stopping autoplay.
- Event cover images open event details.
- The photo viewer includes a thumbnail strip, active-photo feedback, horizontal swiping and keyboard navigation.
- A back-to-top button appears after scrolling, restores focus to the header and respects reduced-motion preferences.

These components are in `src/interactions.jsx` and `src/interactions.css`.

## Latest refinements

- A small circular cluster of random cyan binary digits follows the cursor across the entire pale-blue hero grid. Its 11px digits refresh while the cursor is still, at up to 33% opacity. The smaller, 30px-radius circle uses staggered digit changes and leaves fading circular binary clusters as a trail, and the cluster fades on pointer exit. Painting is capped at 25fps; the effect stops outside the grid and is disabled for touch and reduced-motion settings.
- Activity tabs cover Hackathons, Speaker Sessions, Placement Talks and Industry Visit, with fuller descriptions.
- The footer uses the existing transparent logo with its white outline; no white rectangular backing.
- Past Events shows event cards only. Explore event opens the detail page; the duplicate View event details link is removed.
- Event galleries initially show three photographs, followed by a blurred preview and Show more photos control. Expanding reveals the full gallery and moves keyboard focus to the first newly revealed photo.
- Techshift has a fuller, three-paragraph description based on supplied event material. Speaker names and unconfirmed talk topics are not added.


# IEEE_CIS-website
