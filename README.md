# IMMISPATINA website

Static website prepared for Cloudflare Pages.

Files:
- index.html
- styles.css
- script.js

Cloudflare Pages deployment (GitHub):
1. Create a GitHub repository named `immispatina-site`.
2. Upload the three website files to the repository.
3. Cloudflare Dashboard > Workers & Pages > Create application > Pages > Import an existing Git repository.
4. Connect GitHub and select `immispatina-site`.
5. For a plain static HTML site, no framework is required. Use the repository root as the site content/output.
6. Deploy.
7. Open the Pages project > Custom domains > Set up a domain.
8. Add `immispatina.com`.
9. Add `www.immispatina.com` too, then configure your preferred redirect.
