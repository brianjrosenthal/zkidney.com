# zkidney.com

Static HTML version of zkidney.com (medical and kidney calculators by Stephen Z. Fadem, MD), migrated from Wix. There is no build step: what is in this folder is what gets served.

## Preview locally

```sh
python3 -m http.server 4173
```

Then open <http://127.0.0.1:4173/>.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | Home page with the list of calculators |
| `<name>/index.html` | One calculator per folder, served at `zkidney.com/<name>` |
| `assets/site.js` | The shared header and navigation, drawn on every page |
| `assets/home.css` | Styles for the home page only |
| `assets/img/`, `assets/fonts/` | Images and the Poppins font |
| `abw/`, `sq/`, `mdrd/`, `old-sp/`, `blank*/` | Redirects carried over from the Wix site |

## Calculator pages

Each calculator page is the original calculator source, unchanged, with a short block added at the very top (page title, description, the `site.js` include, and three CSS rules that leave room for the header). Everything below the line `<script src="../assets/site.js" defer></script>` is the calculator as it was written.

Two things in that source were pointed at local copies: images that were hosted on Wix, and links to other zkidney.com pages. No JavaScript was edited.

Some pages deliberately have no `<!doctype html>`. Their originals had none, and adding one would change how the browser lays them out.

## Changing the navigation

Edit the `NAV` list at the top of `assets/site.js`. It applies to every page.

## Adding a calculator

1. Copy an existing calculator folder and rename it.
2. Replace everything below the `site.js` line with the new calculator.
3. Update the `<title>` and canonical link at the top.
4. Add a row to the table in `index.html` and a line to `sitemap.xml`.
