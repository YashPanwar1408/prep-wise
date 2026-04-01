const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==============================================================================
// 1. HELPER FUNCTIONS
// ==============================================================================

// Extract slug from href (e.g., '/learn/full-stack/html/html-basic' -> 'html-basic')
const getSlug = (href) => {
  const parts = href.split('/');
  return parts[parts.length - 1];
};

// ==============================================================================
// 2. CONTENT GENERATOR (Bootstraps meaningful text for every topic)
// ==============================================================================

const generateContent = (title, category) => {
  const lowerTitle = title.toLowerCase();
  const content = getTopicContent(title, category, lowerTitle);
  return content || generateGenericContent(title, category);
};

const getTopicContent = (title, category, lowerTitle) => {
  // HTML Topics
  if (category === 'HTML') {
    if (lowerTitle.includes('introduction')) {
      return `# HTML Introduction

HTML (HyperText Markup Language) is the **structure layer** of the web. If a web page were a house:
- **HTML** = the rooms and walls (structure)
- **CSS** = paint, spacing, and layout (presentation)
- **JavaScript** = switches and wiring (behavior)

This topic focuses on what HTML is, how browsers interpret it, and how to write **clean, semantic, accessible** markup.

---

## 1) What a browser does with HTML

When a browser loads an HTML document, it roughly does this:
1. **Parse HTML** → build the **DOM** (Document Object Model)
2. Download referenced resources (CSS, JS, images, fonts)
3. Parse CSS → build CSSOM
4. Combine DOM + CSSOM → render tree
5. Layout (sizes/positions) → paint pixels → composite layers

Why you care: small HTML choices impact **accessibility**, **SEO**, and **maintainability**.

---

## 2) Minimal valid HTML document

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My Page</title>
    <meta name="description" content="A short description for SEO" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>Hello</h1>
    <p>Welcome to my website.</p>
    <script src="app.js" defer></script>
  </body>
</html>
\`\`\`

### Key parts explained
- \`<!doctype html>\`: enables standards mode.
- \`<html lang="en">\`: helps screen readers and search engines.
- \`<meta charset="utf-8">\`: Unicode support.
- \`<meta name="viewport">\`: makes pages render correctly on mobile.
- \`<title>\`: appears in the browser tab and search results.
- \`defer\` on scripts: downloads JS without blocking HTML parsing.

---

## 3) Elements, tags, attributes (mental model)

- **Tag**: the syntax with angle brackets: \`<p>\`
- **Element**: the tag + content + closing tag: \`<p>Text</p>\`
- **Attribute**: extra info in opening tag: \`<img src="..." alt="...">\`

Void (self-contained) elements do not have closing tags:
- \`<img>\`, \`<input>\`, \`<br>\`, \`<meta>\`, \`<link>\`

---

## 4) Semantics: write meaning, not layout

Prefer semantic elements:
- \`header\`, \`nav\`, \`main\`, \`section\`, \`article\`, \`aside\`, \`footer\`
- \`button\` for actions, \`a\` for navigation

Bad (div soup):
\`\`\`html
<div class="top">
  <div class="menu">...</div>
</div>
\`\`\`

Good (semantic landmarks):
\`\`\`html
<header>
  <nav aria-label="Primary">
    ...
  </nav>
</header>
\`\`\`

Benefits:
- Better **accessibility landmarks**
- Better **SEO understanding**
- Easier maintenance for teams

---

## 5) Accessibility essentials (HTML-first)

### Images need \`alt\`
- Informative image: describe the meaning.
- Decorative image: empty alt.

\`\`\`html
<img src="team.jpg" alt="Engineering team on stage" />
<img src="sparkle.png" alt="" />
\`\`\`

### Forms need labels
\`\`\`html
<label for="email">Email</label>
<input id="email" name="email" type="email" autocomplete="email" required />
\`\`\`

### Buttons are not divs
\`\`\`html
<button type="button">Open</button>
\`\`\`

### Use headings in order
Use \`h1\` → \`h2\` → \`h3\`… as an outline. Don’t skip levels just for size.

---

## 6) Common beginner mistakes (and fixes)

1. Using \`<br>\` for spacing → use CSS margin/padding.
2. Clickable \`<div>\` → use \`<button>\` or \`<a>\`.
3. Missing \`alt\` → add meaningful text or \`alt=""\`.
4. Nested interactive elements (like \`<a><button>\`) → invalid; choose one.
5. No viewport meta → mobile looks tiny; add it.

---

## 7) Checklist (production-ready HTML)

- \`lang\` set on \`<html>\`
- viewport meta present
- one \`h1\` and consistent heading levels
- all form controls have labels
- all images have appropriate \`alt\`
- use landmarks: \`header/nav/main/footer\`
`;
    }
    if (lowerTitle.includes('basic') || lowerTitle.includes('tutorial')) {
      return `# ${title}

HTML basics cover the fundamental concepts every web developer must understand. This includes the structure of HTML documents, proper nesting of elements, and the distinction between block and inline elements. Every HTML file starts with a DOCTYPE declaration followed by html, head, and body tags.

The core building blocks of HTML are elements and tags. Tags are enclosed in angle brackets and usually come in pairs - an opening tag and a closing tag. Elements can contain text content, other elements, or both. Understanding how to properly nest and close tags prevents rendering issues and maintains code quality.

HTML attributes provide additional information about elements. Common attributes include class, id, src, href, and alt. These attributes are specified within the opening tag and help define element behavior, provide metadata, or link to external resources. Learning to use attributes correctly is fundamental to effective HTML development.

Write HTML is a critical skill for building any web application. Even modern frameworks like React and Vue ultimately generate HTML. Solid HTML foundations ensure you can structure content logically, create accessible websites, and debug markup issues efficiently.`;
    }
    if (lowerTitle === 'html elements') {
      return `# HTML Elements

HTML elements are the building blocks of a document. This topic goes deeper into:
- **block vs inline** behavior
- **nesting rules**
- **void elements**
- **semantic vs generic** elements
- debugging invalid markup

---

## 1) Anatomy of an element

\`\`\`html
<p class="lead">Hello <strong>world</strong>.</p>
\`\`\`

- **Opening tag**: \`<p class="lead">\`
- **Content**: \`Hello ...\`
- **Closing tag**: \`</p>\`
- **Nested elements**: \`<strong>world</strong>\`

### Void elements
Void elements don’t have closing tags:
\`\`\`html
<img src="logo.png" alt="PrepWise" />
<input type="text" name="q" />
<br />
\`\`\`

---

## 2) Block vs inline (behavior, not “meaning”)

### Block-level (takes full width; starts new line)
Common examples: \`div\`, \`p\`, \`h1-h6\`, \`ul\`, \`ol\`, \`li\`, \`section\`, \`article\`

\`\`\`html
<h2>Title</h2>
<p>Paragraph text…</p>
\`\`\`

### Inline (flows inside text)
Common examples: \`span\`, \`a\`, \`strong\`, \`em\`, \`code\`, \`img\`

\`\`\`html
<p>
  Read the <a href="/docs">docs</a> and press <kbd>Ctrl</kbd> + <kbd>S</kbd>.
</p>
\`\`\`

Note: CSS can change display behavior (\`display: block\`, \`inline-flex\`, etc.), but the **semantic meaning** remains.

---

## 3) Nesting rules that matter

### Don’t put block elements inside \`<p>\`
Bad:
\`\`\`html
<p>
  <div>Invalid</div>
</p>
\`\`\`

Good:
\`\`\`html
<div>
  <p>Valid</p>
</div>
\`\`\`

### Don’t nest interactive elements
Bad:
\`\`\`html
<a href="/">
  <button>Go</button>
</a>
\`\`\`

Good:
\`\`\`html
<a href="/" class="btn">Go</a>
\`\`\`

---

## 4) Semantic elements (choose the right one)

Example structure:
\`\`\`html
<header>
  <nav aria-label="Primary">
    <a href="/">Home</a>
    <a href="/learn">Learn</a>
  </nav>
</header>

<main>
  <article>
    <h1>Understanding Flexbox</h1>
    <p>...</p>
  </article>

  <aside>
    <h2>Related</h2>
    <ul>
      <li><a href="/learn/css/css-grid">CSS Grid</a></li>
    </ul>
  </aside>
</main>

<footer>
  <small>© 2026 PrepWise</small>
</footer>
\`\`\`

---

## 5) Generic containers (when semantic doesn’t fit)

- \`div\`: block container
- \`span\`: inline container

Use them when you need a wrapper for layout/styling and there is no semantic element that matches.

---

## 6) Debugging broken HTML

If layout “randomly” breaks, it’s often:
- unclosed tags
- invalid nesting

Use DevTools “Elements” and collapse nodes to spot unexpected nesting.
`;
    }

    if (lowerTitle.includes('elements')) {
      return `# ${title}

HTML elements are the building blocks of web pages, consisting of a start tag, content, and an end tag. Elements define the structure and meaning of content, from headings and paragraphs to complex interactive components. Understanding elements is fundamental to creating well-structured HTML documents.

Elements can be nested inside other elements to create hierarchical document structures. Block-level elements like div, p, and h1 start on new lines and take full width, while inline elements like span, a, and strong flow within text. Proper nesting maintains document validity and ensures consistent rendering across browsers.

Some elements are self-closing or void elements, meaning they don't have closing tags. Examples include img, br, hr, and input. These elements typically don't contain content but may have attributes that define their behavior. HTML5 allows either self-closing syntax or leaving them unclosed.

Modern HTML5 introduced semantic elements that describe their content's meaning, not just its presentation. Elements like header, nav, article, and footer help browsers, search engines, and assistive technologies understand page structure. Using semantic elements improves SEO, accessibility, and code maintainability.`;
    }
    if (lowerTitle === 'html attributes') {
      return `# HTML Attributes

Attributes provide additional information about an element (configuration, metadata, behavior hooks).

This topic covers:
- global vs element-specific attributes
- boolean attributes
- \`id\` vs \`class\`
- \`data-*\` custom attributes
- accessibility attributes you’ll use often

---

## 1) Attribute syntax

\`\`\`html
<a href="/learn" class="link" aria-label="Go to Learn">Learn</a>
\`\`\`

---

## 2) Global attributes (work on most elements)

### \`id\`
Unique identifier (one per page).
\`\`\`html
<section id="pricing">...</section>
\`\`\`

### \`class\`
Reusable styling hooks.
\`\`\`html
<button class="btn btn-primary">Save</button>
\`\`\`

---

## 3) Boolean attributes

Boolean attributes are “on” when present.

\`\`\`html
<input type="checkbox" checked />
<input type="text" disabled />
<input type="text" required />
\`\`\`

---

## 4) \`id\` vs \`class\`

- Use \`id\` for fragment links and label association.
- Use \`class\` for styling and grouping.

Avoid using IDs for styling; it increases specificity and makes overrides harder.

---

## 5) \`data-*\` attributes

\`\`\`html
<button data-track="signup" data-plan="pro">Start</button>
\`\`\`

Read it in JS:
\`\`\`js
const btn = document.querySelector('button');
console.log(btn.dataset.track); // "signup"
console.log(btn.dataset.plan);  // "pro"
\`\`\`

---

## 6) Common element-specific attributes

Links:
\`\`\`html
<a href="https://example.com" target="_blank" rel="noreferrer">External</a>
\`\`\`

Images:
\`\`\`html
<img src="/banner.jpg" alt="PrepWise dashboard" width="1200" height="600" />
\`\`\`

Inputs:
\`\`\`html
<input id="email" name="email" type="email" autocomplete="email" required />
\`\`\`

---

## 7) Accessibility attributes you’ll use

\`aria-label\`:
\`\`\`html
<button aria-label="Close dialog">✕</button>
\`\`\`

\`aria-expanded\`:
\`\`\`html
<button aria-expanded="false">Menu</button>
\`\`\`

---

## 8) Practice

Build a sign-up form using \`required\`, \`autocomplete\`, and correct label association.
`;
    }

    if (lowerTitle.includes('attributes')) {
      return `# ${title}

HTML attributes provide additional information about elements and modify their behavior or appearance. Attributes are always specified in the opening tag and consist of a name-value pair separated by an equals sign. Common attributes include id, class, src, href, and style.

Global attributes can be used on any HTML element. These include class for applying CSS styles, id for unique identification, title for tooltip text, and data-* for custom data storage. The style attribute allows inline CSS, though external stylesheets are generally preferred for maintainability.

Some attributes are element-specific and only work with certain tags. For example, the src attribute specifies image sources for img tags, href defines link destinations for a tags, and type determines input field types for input elements. Understanding which attributes apply to which elements is essential for valid HTML.

Boolean attributes like disabled, checked, and readonly don't require values - their presence alone activates the feature. Modern HTML5 introduced many new attributes for forms, media elements, and semantic markup. Proper use of attributes enhances functionality, accessibility, and user experience.`;
    }
    if (lowerTitle === 'html headings') {
      return `# HTML Headings

Headings (\`<h1>\` to \`<h6>\`) define the **outline** of your content.

They are not “big text” tags — they are **structure** tags.

---

## 1) What headings are for

- They label sections.
- They create a hierarchy for readers.
- Screen readers use them for navigation.
- Search engines use them to understand page structure.

---

## 2) Recommended hierarchy

- One \`<h1>\` for the page’s main title.
- Use \`<h2>\` for major sections.
- Use \`<h3>\` for subsections, etc.

Example:

\`\`\`html
<main>
  <h1>Learn HTML</h1>

  <section>
    <h2>Getting Started</h2>
    <p>...</p>

    <h3>Tools</h3>
    <p>...</p>
  </section>

  <section>
    <h2>Core Concepts</h2>
    <h3>Elements</h3>
    <h3>Attributes</h3>
  </section>
</main>
\`\`\`

---

## 3) Accessibility notes

- Screen readers let users jump by heading level.
- Skipping levels (\`h1 → h3\`) can be confusing.
- Don’t use headings to style random text blocks — use CSS.

---

## 4) Styling headings (CSS)

\`\`\`css
h1 { font-size: 2rem; margin: 0 0 0.75rem; }
h2 { font-size: 1.5rem; margin: 2rem 0 0.5rem; }
\`\`\`

---

## 5) Common mistakes

1. Multiple \`h1\` for “design” reasons.
2. Skipping levels to get smaller text.
3. Using \`div\` + \`class\` instead of headings.

If you want “big text”, keep semantics correct and style with CSS.
`;
    }

    if (lowerTitle === 'html paragraphs') {
      return `# HTML Paragraphs

Paragraphs (\`<p>\`) represent a block of text. They are the default element for body copy.

---

## 1) The \`<p>\` element

\`\`\`html
<p>
  A paragraph is a block-level element. Browsers add default margin above/below.
</p>
\`\`\`

Paragraphs can contain **inline elements**:

\`\`\`html
<p>
  Use <strong>strong</strong> for importance and <em>em</em> for emphasis.
  Visit <a href="/learn">Learn</a>.
</p>
\`\`\`

---

## 2) Whitespace collapsing

In HTML, repeated spaces/newlines collapse into a single space.

\`\`\`html
<p>Hello      world</p> <!-- renders like: "Hello world" -->
\`\`\`

If you need to preserve whitespace, use \`<pre>\`:

\`\`\`html
<pre>
Line 1
  indented
Line 3
</pre>
\`\`\`

---

## 3) Line breaks vs paragraphs

- Use \`<p>\` for separate thoughts.
- Use \`<br>\` only for line breaks inside the same “unit” (addresses, poems).

\`\`\`html
<p>
  221B Baker Street<br />
  London<br />
  UK
</p>
\`\`\`

---

## 4) Nesting rules

\`<p>\` cannot contain block elements like \`<div>\`, \`<h2>\`, \`<ul>\`.

Bad:
\`\`\`html
<p><div>Oops</div></p>
\`\`\`

Good:
\`\`\`html
<div>
  <p>Correct</p>
</div>
\`\`\`

---

## 5) Practical tip

If spacing looks off, it’s usually default margins. Reset/standardize with CSS:

\`\`\`css
p { margin: 0 0 1rem; }
\`\`\`
`;
    }

    if (lowerTitle === 'html styles') {
      return `# HTML Styles

“HTML Styles” usually means **ways to apply CSS** to HTML.

In real projects, the best default is: **external stylesheet**.

---

## 1) Inline styles (avoid for real apps)

\`\`\`html
<p style="color: red; font-weight: 600;">Hello</p>
\`\`\`

Pros: quick testing.
Cons: hard to maintain, high specificity, duplicates everywhere.

---

## 2) Internal styles (\`<style>\`)

\`\`\`html
<head>
  <style>
    .card { padding: 16px; border: 1px solid #ddd; }
  </style>
</head>
\`\`\`

Use this for small demos or one-off pages, not large apps.

---

## 3) External styles (recommended)

\`\`\`html
<head>
  <link rel="stylesheet" href="/styles.css" />
</head>
\`\`\`

Benefits:
- caching across pages
- better separation of concerns
- easier refactors

---

## 4) Cascade basics (why “my style didn’t apply”)

When multiple rules apply, the browser decides by:
1. importance (\`!important\`)
2. specificity
3. source order

---

## 5) Best practices

- Prefer classes for styling.
- Keep HTML semantic; do layout and visuals in CSS.
- Avoid inline styles except debugging.
`;
    }

    if (lowerTitle === 'html formatting') {
      return `# HTML Formatting

Formatting elements change how text is **presented** *and/or* what it **means**.

Modern HTML encourages: **use semantic tags** (meaning), then style with CSS.

---

## 1) Emphasis and importance

\`\`\`html
<p>
  Use <em>em</em> for emphasis and <strong>strong</strong> for importance.
</p>
\`\`\`

Avoid using \`<i>\` and \`<b>\` for meaning — they are mostly visual.

---

## 2) Common text formatting tags

\`\`\`html
<p>
  <mark>Highlighted</mark>
  <small>Small print</small>
  <del>Deleted</del>
  <ins>Inserted</ins>
  H<sub>2</sub>O and 2<sup>10</sup>
</p>
\`\`\`

---

## 3) Code-related tags

\`\`\`html
<p>Use <code>npm run dev</code> to start.</p>

<pre><code>
function add(a, b) {
  return a + b;
}
</code></pre>

<p>Press <kbd>Ctrl</kbd> + <kbd>C</kbd>.</p>
\`\`\`

---

## 4) When not to use formatting tags

Don’t use \`<br>\` to create spacing. Use CSS margins.

---

## 5) Practice

Write an article snippet with:
- one emphasis
- one code block
- one keyboard shortcut
`;
    }

    if (lowerTitle === 'html quotations') {
      return `# HTML Quotations

Use quotation elements when you are quoting people, books, articles, or any external source.

---

## 1) Inline quotes with \`<q>\`

\`\`\`html
<p>
  The docs say <q cite="https://example.com">avoid div soup</q>.
</p>
\`\`\`

Browsers typically add quotation marks automatically.

---

## 2) Block quotes with \`<blockquote>\`

\`\`\`html
<figure>
  <blockquote cite="https://example.com/article">
    <p>Make it work, make it right, make it fast.</p>
  </blockquote>
  <figcaption>
    — <cite>Kent Beck</cite>
  </figcaption>
</figure>
\`\`\`

Notes:
- Put the text inside a \`<p>\` for better structure.
- Use \`cite\` (URL) when you have a real source.

---

## 3) Other related semantic text elements

\`\`\`html
<p><abbr title="HyperText Markup Language">HTML</abbr> is the web’s markup language.</p>
<address>Support: support@prepwise.com</address>
\`\`\`

---

## 4) Practice

Quote a paragraph from an article using \`<blockquote>\` and cite the source.
`;
    }

    if (lowerTitle === 'html comments') {
      return `# HTML Comments

HTML comments let you annotate markup:

\`\`\`html
<!-- This is a comment -->
\`\`\`

---

## 1) Good uses

- Leave notes for teammates.
- Temporarily disable a block while debugging.
- Mark sections in large HTML files.

---

## 2) Don’ts

- Don’t store secrets in comments (users can view source).
- Don’t over-comment obvious markup.

---

## 3) Gotchas

- Comments **cannot be nested**.
- Old IE conditional comments are obsolete.

---

## 4) Practice

Comment a header section and a main section in a layout template.
`;
    }

    if (lowerTitle === 'html colors') {
      return `# HTML Colors

In practice, “HTML colors” means using **CSS color values**.

---

## 1) Common color formats

### Hex
\`\`\`css
.btn { color: #ffffff; background: #111827; }
\`\`\`

### RGB / RGBA
\`\`\`css
.overlay { background: rgba(0, 0, 0, 0.6); }
\`\`\`

### HSL (great for theming)
\`\`\`css
:root { --brand: hsl(220 90% 56%); }
.link { color: var(--brand); }
\`\`\`

---

## 2) Accessibility: contrast

Make sure text is readable. Don’t rely on color alone to convey meaning.

Example: add icons or text, not just red/green.

---

## 3) Best practice

Use CSS variables for a consistent theme and easier global changes.
`;
    }

    if (lowerTitle === 'html css') {
      return `# HTML CSS

HTML and CSS work together:
- HTML provides structure and meaning
- CSS controls presentation

---

## 1) Add CSS to a page

### External stylesheet (recommended)

\`\`\`html
<link rel="stylesheet" href="/styles.css" />
\`\`\`

### Internal stylesheet

\`\`\`html
<style>
  .card { padding: 16px; }
</style>
\`\`\`

### Inline style (avoid)

\`\`\`html
<div style="padding: 16px">...</div>
\`\`\`

---

## 2) Styling by class

\`\`\`html
<button class="btn btn-primary">Start</button>
\`\`\`

\`\`\`css
.btn { padding: 10px 14px; border-radius: 10px; }
.btn-primary { background: black; color: white; }
\`\`\`

---

## 3) Separation of concerns

Keep HTML semantic. Avoid putting layout meaning into HTML names like \`left\`, \`right\`. Prefer purpose names like \`sidebar\`, \`primary-nav\`.
`;
    }
    if (lowerTitle === 'html forms') {
      return `# HTML Forms

Forms are how users send data to your app: sign-in, search, checkout, feedback, etc.

This topic covers:
- form structure and submission
- input types and validation
- accessibility (labels, errors)
- practical patterns you’ll use in real apps

---

## 1) Basic form structure

\`\`\`html
<form action="/signup" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" autocomplete="email" required />

  <button type="submit">Create account</button>
</form>
\`\`\`

Use \`GET\` for search filters; use \`POST\` for creating/updating data.

---

## 2) Group related controls

\`\`\`html
<fieldset>
  <legend>Choose a plan</legend>

  <label>
    <input type="radio" name="plan" value="free" checked />
    Free
  </label>

  <label>
    <input type="radio" name="plan" value="pro" />
    Pro
  </label>
</fieldset>
\`\`\`

---

## 3) Built-in HTML validation

\`\`\`html
<input
  name="username"
  minlength="3"
  maxlength="20"
  pattern="[a-zA-Z0-9_]+"
  required
/>
\`\`\`

HTML validation is UX. **Server-side validation is still required** for security.

---

## 4) Accessible error message pattern

\`\`\`html
<label for="email">Email</label>
<input
  id="email"
  name="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid="true"
/>
<p id="email-error">Please enter a valid email.</p>
\`\`\`

---

## 5) JS submit handler (optional)

\`\`\`js
const form = document.getElementById('contact');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const res = await fetch('/api/contact', { method: 'POST', body: data });

  if (!res.ok) alert('Failed');
  else alert('Sent!');
});
\`\`\`

---

## 6) Best practices checklist

- Every input has a label
- Use correct \`type\` and \`autocomplete\`
- Use \`fieldset/legend\` for groups
- Validate on the server
- Don’t rely on placeholder as label
`;
    }

    if (lowerTitle.includes('forms')) {
      return `# ${title}

HTML forms are essential for collecting user input on websites. They enable users to submit data to servers for processing, powering everything from login pages to complex multi-step applications. Forms consist of the form element and various input controls like text fields, checkboxes, radio buttons, and submit buttons.

The form element has important attributes including action (the URL to submit data to) and method (HTTP method, typically GET or POST). The name attribute on form controls determines how data is sent to the server. Understanding form submission mechanics is crucial for web development.

Form validation can occur on both client and server sides. HTML5 introduced built-in validation attributes like required, pattern, min, and max. These provide immediate feedback to users without JavaScript, improving user experience. However, server-side validation remains essential for security.

Modern forms require careful attention to accessibility and user experience. Proper labeling, error messaging, and keyboard navigation ensure forms work for all users. Forms are fundamental to interactive web applications, from simple contact forms to complex data entry systems.`;
    }
    if (lowerTitle === 'html favicon') {
      return `# HTML Favicon

A favicon is the small icon shown in the browser tab, bookmarks, and sometimes search results.

---

## 1) Basic favicon

\`\`\`html
<link rel="icon" href="/favicon.ico" />
\`\`\`

---

## 2) Prefer modern formats

You can use PNG or SVG favicons too:

\`\`\`html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
\`\`\`

---

## 3) Common gotcha: caching

Browsers cache favicons aggressively. If changes don’t show:
- hard refresh
- change the filename (version it)

\`\`\`html
<link rel="icon" href="/favicon.v2.ico" />
\`\`\`

---

## 4) Best practice

Keep favicons small and optimized. Test in multiple browsers.
`;
    }

    if (lowerTitle === 'html page title') {
      return `# HTML Page Title

The page title is set using the \`<title>\` element inside \`<head>\`. It appears in:
- browser tab
- bookmarks
- search results

---

## 1) Basic example

\`\`\`html
<head>
  <title>PrepWise — Full Stack Learning</title>
</head>
\`\`\`

---

## 2) Good titles

A good title is:
- specific
- short enough to display
- unique per page

Pattern:
\`\`\`
{Page} — {Product}
\`\`\`

Examples:
- \`HTML Links — PrepWise\`
- \`Dashboard — PrepWise\`

---

## 3) SEO note

Search engines may rewrite titles, but strong titles still improve click-through.

---

## 4) Practice

Write page titles for:
- Learn page
- Interview page
- Resume analyzer page
`;
    }

    if (lowerTitle === 'html tables') {
      return `# HTML Tables

Tables are for **tabular data** (schedules, invoices, comparisons). Do not use tables for page layout.

---

## 1) Basic table

\`\`\`html
<table>
  <caption>Weekly Study Plan</caption>
  <thead>
    <tr>
      <th scope="col">Day</th>
      <th scope="col">Topic</th>
      <th scope="col">Time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Mon</th>
      <td>HTML</td>
      <td>45 min</td>
    </tr>
    <tr>
      <th scope="row">Tue</th>
      <td>CSS</td>
      <td>60 min</td>
    </tr>
  </tbody>
</table>
\`\`\`

---

## 2) Accessibility essentials

- Use \`<caption>\` to describe the table.
- Use \`<th>\` headers.
- Use \`scope\` (\`col\` for column headers, \`row\` for row headers).

---

## 3) Merging cells (use carefully)

\`\`\`html
<td colspan="2">Total</td>
\`\`\`

Overusing \`rowspan/colspan\` makes tables harder for screen readers.

---

## 4) Responsive tables (practical approach)

For small screens:
- allow horizontal scroll

\`\`\`css
.table-wrap { overflow-x: auto; }
table { border-collapse: collapse; min-width: 600px; }
\`\`\`

---

## 5) Practice

Create a comparison table with caption + column headers.
`;
    }
    if (lowerTitle === 'html links') {
      return `# HTML Links

Links connect the web. In HTML, links are created with the \`<a>\` element and an \`href\`.

---

## 1) Basic link

\`\`\`html
<a href="/learn/full-stack">Go to Full Stack</a>
\`\`\`

---

## 2) Absolute vs relative URLs

### Relative (preferred for internal navigation)
\`\`\`html
<a href="/dashboard">Dashboard</a>
\`\`\`

### Absolute (external)
\`\`\`html
<a href="https://developer.mozilla.org/">MDN</a>
\`\`\`

---

## 3) Linking to a section (fragment)

\`\`\`html
<a href="#pricing">Skip to pricing</a>

<section id="pricing">
  <h2>Pricing</h2>
  ...
</section>
\`\`\`

---

## 4) \`target="_blank"\` safely

When opening a new tab, use \`rel\` to avoid security issues:

\`\`\`html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External site
</a>
\`\`\`

---

## 5) Special link types

\`\`\`html
<a href="mailto:support@prepwise.com">Email support</a>
<a href="tel:+15551234567">Call</a>
\`\`\`

Downloads:
\`\`\`html
<a href="/files/guide.pdf" download>Download the guide</a>
\`\`\`

---

## 6) Accessibility best practices

### Use descriptive link text

Bad:
\`\`\`html
<a href="/docs">click here</a>
\`\`\`

Good:
\`\`\`html
<a href="/docs">Read the documentation</a>
\`\`\`

If you must use generic text, add context:
\`\`\`html
<a href="/docs" aria-label="Read the PrepWise documentation">Docs</a>
\`\`\`

---

## 7) Link vs button

- \`<a>\` navigates.
- \`<button>\` performs an action.

This is important for keyboard navigation and screen readers.
`;
    }

    if (lowerTitle === 'html images') {
      return `# HTML Images

Images are embedded using \`<img>\`. The two most important attributes are:
- \`src\`: the file
- \`alt\`: accessible replacement text

---

## 1) Basic image

\`\`\`html
<img src="/images/logo.png" alt="PrepWise logo" />
\`\`\`

---

## 2) \`alt\` text rules (super important)

### Informative image
Describe what it means:

\`\`\`html
<img src="/charts/growth.png" alt="Revenue grew 35% quarter over quarter" />
\`\`\`

### Decorative image
Use empty alt so screen readers skip it:

\`\`\`html
<img src="/ui/sparkle.svg" alt="" />
\`\`\`

---

## 3) Prevent layout shift (CLS)

Set \`width\` and \`height\` when possible:

\`\`\`html
<img
  src="/images/banner.jpg"
  alt="PrepWise dashboard preview"
  width="1200"
  height="600"
  loading="lazy"
/>
\`\`\`

---

## 4) Responsive images with \`srcset\`

\`\`\`html
<img
  src="/images/hero-800.jpg"
  srcset="/images/hero-400.jpg 400w, /images/hero-800.jpg 800w, /images/hero-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px"
  alt="Person practicing interview questions"
/>
\`\`\`

---

## 5) Modern formats

- Photos: WebP/AVIF when supported
- Icons/illustrations: SVG

Use \`<picture>\` for format fallback:

\`\`\`html
<picture>
  <source srcset="/images/photo.avif" type="image/avif" />
  <source srcset="/images/photo.webp" type="image/webp" />
  <img src="/images/photo.jpg" alt="Interview session" />
</picture>
\`\`\`

---

## 6) Captions

\`\`\`html
<figure>
  <img src="/images/setup.png" alt="Microphone setup" />
  <figcaption>Recommended mic placement for clearer audio.</figcaption>
</figure>
\`\`\`

---

## 7) Practice

Add an image with correct alt text and make it responsive with \`srcset\`.
`;
    }
    if (lowerTitle === 'html lists') {
      return `# HTML Lists

Lists group related items. HTML provides:
- unordered lists: \`<ul>\`
- ordered lists: \`<ol>\`
- description lists: \`<dl>\`

---

## 1) Unordered list (bullets)

\`\`\`html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
\`\`\`

---

## 2) Ordered list (numbers)

\`\`\`html
<ol>
  <li>Pick a topic</li>
  <li>Practice exercises</li>
  <li>Review mistakes</li>
</ol>
\`\`\`

---

## 3) Nested lists

\`\`\`html
<ul>
  <li>
    Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </li>
  <li>Backend</li>
</ul>
\`\`\`

---

## 4) Description lists (term → definition)

\`\`\`html
<dl>
  <dt>DOM</dt>
  <dd>Document Object Model</dd>

  <dt>API</dt>
  <dd>Application Programming Interface</dd>
</dl>
\`\`\`

---

## 5) Navigation menus are lists

\`\`\`html
<nav aria-label="Primary">
  <ul>
    <li><a href="/learn">Learn</a></li>
    <li><a href="/interview">Interview</a></li>
  </ul>
</nav>
\`\`\`

---

## 6) Practice

Create a nested list for a course syllabus.
`;
    }

    if (lowerTitle === 'html block & inline') {
      return `# HTML Block & Inline

HTML elements have default display behavior:
- **block**: starts on a new line and usually takes full width
- **inline**: flows inside text

---

## 1) Common block elements

- \`div\`, \`p\`, \`h1-h6\`, \`ul\`, \`ol\`, \`li\`, \`section\`, \`article\`

\`\`\`html
<h2>Title</h2>
<p>Paragraph</p>
\`\`\`

---

## 2) Common inline elements

- \`span\`, \`a\`, \`strong\`, \`em\`, \`code\`, \`img\`

\`\`\`html
<p>
  Read <a href="/docs">docs</a> and write <code>npm run dev</code>.
</p>
\`\`\`

---

## 3) CSS can change display

\`\`\`css
a { display: inline-block; padding: 8px 10px; }
\`\`\`

But changing display does not change semantics.

---

## 4) Practice

Build a horizontal menu from a list using CSS.
`;
    }

    if (lowerTitle === 'html div') {
      return `# HTML Div

\`<div>\` is a generic block container. It has **no semantic meaning**.

Use \`div\` when:
- no semantic element fits
- you need a wrapper for layout/styling

---

## 1) Example

\`\`\`html
<div class="card">
  <h2>Title</h2>
  <p>Description</p>
</div>
\`\`\`

---

## 2) Prefer semantics when available

Instead of \`div\` soup:

\`\`\`html
<div class="top">
  <div class="menu">...</div>
</div>
\`\`\`

Use:

\`\`\`html
<header>
  <nav aria-label="Primary">...</nav>
</header>
\`\`\`

---

## 3) Practice

Rewrite a div-only layout using \`header/nav/main/footer\`.
`;
    }

    if (lowerTitle === 'html classes') {
      return `# HTML Classes

The \`class\` attribute assigns one or more class names to an element.

---

## 1) Single and multiple classes

\`\`\`html
<button class="btn">Save</button>
<button class="btn btn-primary">Start</button>
\`\`\`

Classes are space-separated.

---

## 2) Why classes matter

- primary hook for CSS
- useful for JS selectors (but prefer data attributes for behavior)

\`\`\`html
<button class="btn" data-track="signup">Start</button>
\`\`\`

---

## 3) Naming tips

- Use purpose: \`primary-nav\`, \`card\`, \`btn\`
- Avoid layout-only names: \`left\`, \`blue\`

---

## 4) Practice

Create a card component using classes for structure and modifiers.
`;
    }

    if (lowerTitle === 'html id') {
      return `# HTML Id

\`id\` is a unique identifier for an element on a page.

Rules:
- must be unique in the document
- no spaces

---

## 1) Fragment navigation

\`\`\`html
<a href="#faq">Skip to FAQ</a>
<section id="faq">...</section>
\`\`\`

---

## 2) Forms: \`label\` → \`input\`

\`\`\`html
<label for="email">Email</label>
<input id="email" name="email" type="email" />
\`\`\`

---

## 3) IDs for styling? usually no

Prefer classes for styling to keep CSS maintainable.

---

## 4) Practice

Create a page with a table of contents using fragment links.
`;
    }

    if (lowerTitle === 'html buttons') {
      return `# HTML Buttons

Buttons trigger actions. Use the \`<button>\` element (not a \`div\`).

---

## 1) Button types

\`\`\`html
<button type="button">Open dialog</button>
<button type="submit">Submit form</button>
<button type="reset">Reset</button>
\`\`\`

Default inside a form is \`submit\`, so always set \`type\` explicitly.

---

## 2) Button vs link

- navigation → \`<a href>\`
- action → \`<button>\`

---

## 3) Disabled states

\`\`\`html
<button type="submit" disabled>Saving...</button>
\`\`\`

---

## 4) Accessibility

- text label should be clear
- icon-only buttons need \`aria-label\`

\`\`\`html
<button aria-label="Close">✕</button>
\`\`\`

---

## 5) Practice

Build a login form with submit + disabled loading state.
`;
    }

    if (lowerTitle === 'html iframes') {
      return `# HTML Iframes

An iframe embeds another webpage inside your page.

---

## 1) Basic iframe

\`\`\`html
<iframe
  src="https://example.com"
  title="Example site"
  width="600"
  height="400"
></iframe>
\`\`\`

The \`title\` attribute is important for accessibility.

---

## 2) Security: sandbox

\`\`\`html
<iframe
  src="https://example.com"
  title="Embedded content"
  sandbox
></iframe>
\`\`\`

Sandbox restricts what the embedded page can do.

---

## 3) Permissions with \`allow\`

\`\`\`html
<iframe
  src="https://example.com"
  title="Video"
  allow="autoplay; fullscreen"
></iframe>
\`\`\`

---

## 4) Common limitations

Many sites block being embedded using headers (X-Frame-Options / CSP).

---

## 5) Practice

Embed a map/video and lock it down with \`sandbox\`.
`;
    }

    if (lowerTitle === 'html javascript') {
      return `# HTML JavaScript

HTML + JavaScript is how web pages become interactive.

This topic covers:
- how to include JS in HTML
- script loading strategies (\`defer\`, \`async\`)
- modules
- safe DOM timing
- a few real patterns

---

## 1) Add JavaScript to a page

### External script (recommended)

\`\`\`html
<script src="/app.js" defer></script>
\`\`\`

### Inline script (okay for tiny demos)

\`\`\`html
<script>
  console.log('Hello');
</script>
\`\`\`

---

## 2) \`defer\` vs \`async\`

### \`defer\`
- downloads in parallel
- executes **after HTML is parsed**
- preserves order

Use for app scripts.

### \`async\`
- downloads in parallel
- executes immediately when downloaded
- order is not guaranteed

Use for independent scripts (analytics).

---

## 3) ES Modules

\`\`\`html
<script type="module" src="/main.js"></script>
\`\`\`

In \`main.js\`:

\`\`\`js
import { init } from './init.js';
init();
\`\`\`

Modules are deferred by default.

---

## 4) DOM timing

If you don’t use \`defer\`, your script might run before elements exist.

\`\`\`js
document.addEventListener('DOMContentLoaded', () => {
  // safe to query DOM here
});
\`\`\`

---

## 5) Example: button click

\`\`\`html
<button id="start">Start</button>
<p id="status"></p>
<script src="/app.js" defer></script>
\`\`\`

\`\`\`js
const start = document.getElementById('start');
const status = document.getElementById('status');

start.addEventListener('click', () => {
  status.textContent = 'Interview started';
});
\`\`\`

---

## 6) Best practices

- Prefer external scripts + \`defer\`.
- Don’t write inline \`onclick=...\` handlers.
- Avoid putting secrets in the frontend.
- Validate input on the server (JS can be bypassed).
`;
    }

    if (lowerTitle === 'html file paths') {
      return `# HTML File Paths

File paths in HTML are used in \`href\`, \`src\`, \`srcset\`, \`poster\`, etc.

---

## 1) Relative paths

Relative to the current file URL.

\`\`\`html
<img src="images/logo.png" alt="Logo" />
<script src="js/app.js" defer></script>
\`\`\`

Go up one folder with \`..\`:

\`\`\`html
<img src="../assets/banner.jpg" alt="Banner" />
\`\`\`

---

## 2) Root-relative paths

Start with \`/\` = from site root.

\`\`\`html
<link rel="stylesheet" href="/styles.css" />
<img src="/images/hero.jpg" alt="Hero" />
\`\`\`

Root-relative paths are common in apps because they’re consistent regardless of nesting.

---

## 3) Absolute URLs

\`\`\`html
<script src="https://cdn.example.com/lib.js" defer></script>
\`\`\`

---

## 4) Common mistakes

1. Using Windows paths (\`C:\\...\`) → browsers expect URLs.
2. Wrong assumption about current directory.
3. Forgetting that build tools may rewrite paths.

---

## 5) Quick debugging

Open DevTools → Network → see which URL is requested and if it 404s.
`;
    }

    if (lowerTitle === 'html head') {
      return `# HTML Head

\`<head>\` contains metadata and resources. Users don’t see it directly, but it strongly affects SEO, sharing, and performance.

---

## 1) Common head template

\`\`\`html
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PrepWise — Learn</title>
  <meta name="description" content="Learn full stack development" />

  <link rel="icon" href="/favicon.ico" />
  <link rel="stylesheet" href="/styles.css" />
  <script src="/app.js" defer></script>
</head>
\`\`\`

---

## 2) SEO/share metadata (basics)

Open Graph (social previews):

\`\`\`html
<meta property="og:title" content="PrepWise — Learn" />
<meta property="og:description" content="Full stack notes and interview prep" />
<meta property="og:image" content="/og.png" />
\`\`\`

---

## 3) Performance hints

\`\`\`html
<link rel="preconnect" href="https://fonts.googleapis.com" />
\`\`\`

Use carefully; too many can hurt.

---

## 4) What not to do

- Don’t put visible UI inside \`<head>\`.
- Don’t block rendering with big scripts in head (use \`defer\`).
`;
    }

    if (lowerTitle === 'html layout') {
      return `# HTML Layout

HTML layout is about **document structure**, while CSS is about **visual layout**.

---

## 1) A semantic page skeleton

\`\`\`html
<header>
  <nav aria-label="Primary">...</nav>
</header>

<main>
  <article>
    <h1>Page title</h1>
    <p>Content...</p>
  </article>

  <aside>
    <h2>Related</h2>
  </aside>
</main>

<footer>
  <small>© 2026</small>
</footer>
\`\`\`

---

## 2) Layout is then handled by CSS

\`\`\`css
main {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}
\`\`\`

---

## 3) Practical rules

- Keep HTML semantic.
- Avoid unnecessary wrappers.
- Use \`main\` once.
`;
    }

    if (lowerTitle === 'html responsive') {
      return `# HTML Responsive

Responsive design means the page adapts across screens.

HTML contributes mainly through:
- viewport meta tag
- responsive media (images/video)
- semantic structure that CSS can reflow

---

## 1) Required viewport meta

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1" />
\`\`\`

---

## 2) Responsive images

\`\`\`html
<img
  src="/hero-800.jpg"
  srcset="/hero-400.jpg 400w, /hero-800.jpg 800w, /hero-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px"
  alt="Hero"
/>
\`\`\`

---

## 3) Responsive video container

\`\`\`css
.video {
  aspect-ratio: 16 / 9;
}
.video iframe {
  width: 100%;
  height: 100%;
}
\`\`\`

---

## 4) Practice

Create a page that has a sidebar on desktop and stacks on mobile.
`;
    }

    if (lowerTitle === 'html computercode') {
      return `# HTML Computercode

These elements describe computer-related text:
- \`<code>\` inline code
- \`<pre>\` preformatted text
- \`<kbd>\` keyboard input
- \`<samp>\` sample output
- \`<var>\` variable name

---

## 1) Inline code

\`\`\`html
<p>Run <code>npm run dev</code> to start.</p>
\`\`\`

---

## 2) Code blocks

\`\`\`html
<pre><code>
const x = 1;
console.log(x);
</code></pre>
\`\`\`

---

## 3) Keyboard shortcuts

\`\`\`html
<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.</p>
\`\`\`

---

## 4) Sample output

\`\`\`html
<p>Output: <samp>Server running on 3000</samp></p>
\`\`\`

---

## 5) Practice

Write a short tutorial step using \`code\`, \`pre\`, and \`kbd\` correctly.
`;
    }

    if (lowerTitle === 'html style guide') {
      return `# HTML Style Guide

A style guide keeps markup consistent, readable, and accessible across a team.

---

## 1) Structure rules

- Use semantic elements first.
- One \`main\` per page.
- Headings form an outline.

---

## 2) Attribute conventions

- Use double quotes.
- Keep attributes on one line until they get long.

\`\`\`html
<img src="/hero.jpg" alt="Hero" width="1200" height="600" loading="lazy" />
\`\`\`

Long form:

\`\`\`html
<img
  src="/hero.jpg"
  alt="Hero"
  width="1200"
  height="600"
  loading="lazy"
/>
\`\`\`

---

## 3) Accessibility rules

- Every input has a label.
- Every image has correct \`alt\`.
- Buttons are \`button\`, not \`div\`.

---

## 4) Comments

Use comments to explain WHY, not what.

---

## 5) Practice

Write a consistent layout template following these rules.
`;
    }

    if (lowerTitle === 'html entities') {
      return `# HTML Entities

Entities are how you write reserved characters in HTML safely.

---

## 1) Why entities exist

Some characters are part of HTML syntax:
- \`<\` starts a tag
- \`&\` starts an entity

So to display them as text, escape them.

---

## 2) Common entities

\`\`\`html
&lt;  <!-- < -->
&gt;  <!-- > -->
&amp; <!-- & -->
&quot; <!-- " -->
&apos; <!-- ' -->
\`\`\`

Non-breaking space:

\`\`\`html
Hello&nbsp;World
\`\`\`

---

## 3) Security note

Escaping is critical when rendering untrusted content to avoid HTML injection (XSS).

---

## 4) Practice

Render this string safely in HTML: \`5 < 10 & 10 > 5\`.
`;
    }

    if (lowerTitle === 'html symbols') {
      return `# HTML Symbols

Symbols are typically just Unicode characters. You can include them directly in HTML if your document uses UTF-8.

---

## 1) Ensure UTF-8

\`\`\`html
<meta charset="utf-8" />
\`\`\`

---

## 2) Examples

\`\`\`html
<p>Copyright: ©</p>
<p>Registered: ®</p>
<p>Trademark: ™</p>
<p>Arrow: →</p>
\`\`\`

---

## 3) Accessibility

If a symbol is the only meaning, provide text for screen readers:

\`\`\`html
<span aria-label="Search">🔎</span>
\`\`\`

---

## 4) Practice

Use a symbol next to a label and make it accessible.
`;
    }

    if (lowerTitle === 'html emojis') {
      return `# HTML Emojis

Emojis are Unicode characters. With UTF-8 they work in HTML.

---

## 1) UTF-8 is required

\`\`\`html
<meta charset="utf-8" />
\`\`\`

---

## 2) Example

\`\`\`html
<p>Great job! ✅</p>
\`\`\`

---

## 3) Accessibility

Avoid using emojis as the only indicator.

Bad (color/symbol only):

\`\`\`html
<span>✅</span>
\`\`\`

Good:

\`\`\`html
<span aria-hidden="true">✅</span>
<span>Completed</span>
\`\`\`

---

## 4) Practice

Add success/error messages that don’t rely on emoji alone.
`;
    }

    if (lowerTitle === 'html charsets') {
      return `# HTML Charsets

A character set defines how bytes map to characters. On the web, you almost always want **UTF-8**.

---

## 1) Use UTF-8 (always)

\`\`\`html
<meta charset="utf-8" />
\`\`\`

Why UTF-8:
- supports all languages
- supports emojis
- avoids “weird symbols” (mojibake)

---

## 2) Where charset comes from

Browsers decide encoding using:
1. HTTP header: \`Content-Type: text/html; charset=utf-8\`
2. \`<meta charset="utf-8">\` (early in head)

Best practice: include the meta tag and configure server headers.

---

## 3) Common problems

- Copy/paste text looks broken → missing UTF-8.
- Emojis render as squares → font support issue.

---

## 4) Practice

Create a page that shows Hindi/Arabic/emoji correctly using UTF-8.
`;
    }

    if (lowerTitle === 'html url encode') {
      return `# HTML URL Encode

URL encoding (percent-encoding) represents special characters safely inside URLs.

Example: space becomes \`%20\`.

---

## 1) Why encoding matters

URLs have reserved characters like \`?\`, \`&\`, \`=\`, \`#\`.

If user input contains these characters, it can break query strings unless encoded.

---

## 2) JavaScript helpers

\`encodeURIComponent\` is the common choice for query parameters.

\`\`\`js
const q = 'html & css';
const url = '/search?q=' + encodeURIComponent(q);
// /search?q=html%20%26%20css
\`\`\`

\`encodeURI\` is for encoding a full URL (less aggressive).

---

## 3) Practical example

\`\`\`js
const params = new URLSearchParams({
  q: 'react hooks',
  level: 'beginner'
});

console.log(params.toString());
// q=react+hooks&level=beginner
\`\`\`

---

## 4) Common mistake

Don’t manually replace spaces, and don’t double-encode.

---

## 5) Practice

Build a search link that includes user-entered text safely in the URL.
`;
    }

    if (lowerTitle === 'html vs xhtml') {
      return `# HTML vs XHTML

HTML and XHTML are both markup languages, but they follow different parsing rules.

---

## 1) HTML (what you use today)

- forgiving parser (browsers fix many mistakes)
- HTML5 is the modern standard
- works everywhere

---

## 2) XHTML (HTML as XML)

XHTML is XML-based, so it is **strict**:
- tags must be properly nested
- attributes must be quoted
- element/tag names are case-sensitive in XML context
- some void elements often written self-closing

Example (XHTML style):

\`\`\`html
<img src="logo.png" alt="Logo" />
<br />
\`\`\`

---

## 3) The real-world takeaway

Use **HTML5** unless you have a very specific reason to serve \`application/xhtml+xml\`.

---

## 4) Practice

Write a valid HTML5 document and validate it (W3C validator).
`;
    }

    if (lowerTitle === 'html form attributes') {
      return `# HTML Form Attributes

Form attributes control *where* and *how* data is submitted.

---

## 1) Key attributes

- \`action\`: submission URL
- \`method\`: \`get\` or \`post\`
- \`enctype\`: encoding for POST (important for file uploads)
- \`autocomplete\`: help browsers fill values
- \`novalidate\`: disable built-in HTML validation
- \`target\`: where to open the response

---

## 2) Example

\`\`\`html
<form action="/api/signup" method="post" autocomplete="on">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />

  <button type="submit">Create</button>
</form>
\`\`\`

---

## 3) GET vs POST

- GET: search/filter (data in URL)
- POST: create/update (data in body)

---

## 4) File upload needs enctype

\`\`\`html
<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="resume" accept="application/pdf" />
  <button type="submit">Upload</button>
</form>
\`\`\`

---

## 5) Practice

Create a search form that uses GET and a signup form that uses POST.
`;
    }

    if (lowerTitle === 'html form elements') {
      return `# HTML Form Elements

HTML provides several form controls to collect data:
- \`input\`, \`textarea\`, \`select\`, \`option\`
- \`button\`, \`label\`
- \`fieldset\`, \`legend\`
- \`datalist\`, \`output\`

---

## 1) Label + input association

\`\`\`html
<label for="name">Name</label>
<input id="name" name="name" />
\`\`\`

---

## 2) Select dropdown

\`\`\`html
<label for="role">Role</label>
<select id="role" name="role">
  <option value="frontend">Frontend</option>
  <option value="backend">Backend</option>
  <option value="fullstack">Full Stack</option>
</select>
\`\`\`

---

## 3) Textarea

\`\`\`html
<label for="bio">Bio</label>
<textarea id="bio" name="bio" rows="4"></textarea>
\`\`\`

---

## 4) Grouping related inputs

\`\`\`html
<fieldset>
  <legend>Experience</legend>
  <label><input type="radio" name="exp" value="0-1" /> 0–1</label>
  <label><input type="radio" name="exp" value="2-4" /> 2–4</label>
</fieldset>
\`\`\`

---

## 5) Practice

Build a job application form using input + select + textarea + fieldset.
`;
    }

    if (lowerTitle === 'html input types') {
      return `# HTML Input Types

Input \`type\` changes validation, behavior, and mobile keyboard.

---

## 1) Common types

\`\`\`html
<input type="text" name="name" />
<input type="email" name="email" />
<input type="password" name="password" />
<input type="number" name="age" min="0" max="120" />
<input type="date" name="dob" />
<input type="checkbox" name="terms" />
<input type="radio" name="plan" value="free" />
<input type="file" name="resume" accept="application/pdf" />
<input type="url" name="portfolio" />
<input type="tel" name="phone" />
<input type="search" name="q" />
\`\`\`

---

## 2) Why you should use correct types

- better validation
- better mobile UX (correct keyboard)
- better autocomplete

---

## 3) Remember server-side validation

Browser validation is UX, not security.

---

## 4) Practice

Create a signup form using email/password + required validation.
`;
    }

    if (lowerTitle === 'html input attributes') {
      return `# HTML Input Attributes

Input attributes control validation, behavior, and form submission.

---

## 1) Identity attributes

- \`name\`: becomes the key in form submission
- \`value\`: default value
- \`id\`: ties to \`label for\`

\`\`\`html
<label for="email">Email</label>
<input id="email" name="email" type="email" />
\`\`\`

---

## 2) Validation attributes

\`\`\`html
<input name="username" minlength="3" maxlength="20" required />
<input name="age" type="number" min="0" max="120" />
<input name="code" pattern="[A-Z]{3}-[0-9]{3}" />
\`\`\`

---

## 3) UX helpers

- \`placeholder\` (not a label)
- \`autocomplete\` (helps browsers fill)
- \`inputmode\` (hint keyboard without changing type)

\`\`\`html
<input name="otp" inputmode="numeric" autocomplete="one-time-code" />
\`\`\`

---

## 4) State attributes

\`\`\`html
<input disabled />
<input readonly />
<input required />
\`\`\`

---

## 5) File input extras

\`\`\`html
<input type="file" name="resume" accept="application/pdf" />
\`\`\`

---

## 6) Practice

Build a form input with minlength + pattern + autocomplete.
`;
    }

    if (lowerTitle === 'html input form attributes') {
      return `# HTML Input Form Attributes

Some attributes let a specific submit button override the parent form settings.

These are most useful when one form has multiple submit targets.

---

## 1) The attributes

- \`formaction\`
- \`formmethod\`
- \`formenctype\`
- \`formnovalidate\`
- \`formtarget\`

They are commonly used on \`<button type="submit">\` or \`<input type="submit">\`.

---

## 2) Example: Save vs Publish

\`\`\`html
<form action="/save" method="post">
  <input name="title" />

  <button type="submit">Save Draft</button>
  <button type="submit" formaction="/publish" formmethod="post">
    Publish
  </button>
</form>
\`\`\`

---

## 3) Practice

Create a form with two submit buttons that go to different endpoints.
`;
    }

    if (lowerTitle === 'html graphics') {
      return `# HTML Graphics

“Graphics” in HTML usually refers to using:
- raster images: \`<img>\` (JPG/PNG/WebP/AVIF)
- vector graphics: **SVG**
- programmatic drawing: **Canvas**

---

## 1) When to use what

### \`<img>\`
- photos, static images
- easiest accessibility (alt)

### SVG
- icons, logos, charts
- scales perfectly
- DOM-based (styleable, interactive)

### Canvas
- games, real-time charts, image processing
- pixel-based drawing

---

## 2) Simple SVG inline

\`\`\`html
<svg width="24" height="24" viewBox="0 0 24 24" aria-label="Check">
  <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2" />
</svg>
\`\`\`

---

## 3) Practice

Add an icon (SVG) next to a button label and keep it accessible.
`;
    }

    if (lowerTitle === 'html canvas') {
      return `# HTML Canvas

Canvas provides a pixel drawing surface controlled by JavaScript.

---

## 1) Basic canvas

\`\`\`html
<canvas id="c" width="300" height="150">
  Your browser does not support canvas.
</canvas>
<script src="/canvas.js" defer></script>
\`\`\`

\`\`\`js
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#111827';
ctx.fillRect(10, 10, 100, 60);

ctx.fillStyle = '#ffffff';
ctx.font = '16px sans-serif';
ctx.fillText('PrepWise', 20, 45);
\`\`\`

---

## 2) Animation loop

\`\`\`js
let x = 0;
function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(x, 20, 40, 40);
  x = (x + 2) % canvas.width;
  requestAnimationFrame(tick);
}
tick();
\`\`\`

---

## 3) Accessibility note

Canvas content is not naturally readable by screen readers. Provide:
- fallback text inside \`<canvas>\`
- alternative DOM content when needed

---

## 4) Practice

Draw a bar chart from an array of numbers and animate it.
`;
    }

    if (lowerTitle === 'html svg') {
      return `# HTML SVG

SVG (Scalable Vector Graphics) is vector-based and stays sharp at any size.

Use SVG for:
- icons
- logos
- charts
- illustrations

---

## 1) Inline SVG example

\`\`\`html
<svg width="24" height="24" viewBox="0 0 24 24" aria-label="Check">
  <path
    d="M20 6L9 17l-5-5"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
\`\`\`

Inline SVG can be styled with CSS using \`currentColor\`.

---

## 2) SVG as an image

\`\`\`html
<img src="/icons/check.svg" alt="Check" />
\`\`\`

---

## 3) viewBox matters

\`viewBox\` defines the coordinate system and enables scaling.

---

## 4) Accessibility

- For decorative icons: \`aria-hidden="true"\`
- For meaningful icons: provide \`aria-label\` or surrounding text

---

## 5) Practice

Add an inline SVG icon inside a button and make it accessible.
`;
    }

    if (lowerTitle === 'html media') {
      return `# HTML Media

HTML5 provides native media elements:
- \`<video>\`
- \`<audio>\`

And embedding options:
- \`<iframe>\` (YouTube, etc.)

---

## 1) Why native media is useful

- no plugins needed
- built-in controls
- JS API for custom controls
- better accessibility support (with captions)

---

## 2) Multiple sources

\`\`\`html
<video controls width="640">
  <source src="/clip.webm" type="video/webm" />
  <source src="/clip.mp4" type="video/mp4" />
  Sorry, your browser doesn’t support video.
</video>
\`\`\`

---

## 3) Captions and accessibility

\`\`\`html
<video controls>
  <source src="/talk.mp4" type="video/mp4" />
  <track kind="captions" src="/talk.en.vtt" srclang="en" label="English" default />
</video>
\`\`\`

---

## 4) Practice

Add a video with captions using a \`.vtt\` track.
`;
    }

    if (lowerTitle === 'html video') {
      return `# HTML Video

The \`<video>\` element plays video files directly in the browser.

---

## 1) Basic video

\`\`\`html
<video controls width="720" poster="/poster.jpg">
  <source src="/intro.mp4" type="video/mp4" />
  Your browser does not support video.
</video>
\`\`\`

---

## 2) Useful attributes

- \`controls\`: show default controls
- \`poster\`: thumbnail
- \`preload\`: \`none | metadata | auto\`
- \`muted\`: needed for autoplay policies
- \`playsinline\`: better iOS behavior

---

## 3) Autoplay (policy)

Most browsers allow autoplay only if muted:

\`\`\`html
<video autoplay muted loop playsinline>
  <source src="/bg.mp4" type="video/mp4" />
</video>
\`\`\`

---

## 4) JS control

\`\`\`js
const v = document.querySelector('video');
v.play();
v.pause();
v.currentTime = 0;
\`\`\`

---

## 5) Practice

Create custom Play/Pause buttons using JS.
`;
    }

    if (lowerTitle === 'html audio') {
      return `# HTML Audio

The \`<audio>\` element plays sound.

---

## 1) Basic audio

\`\`\`html
<audio controls>
  <source src="/theme.mp3" type="audio/mpeg" />
  <source src="/theme.ogg" type="audio/ogg" />
  Your browser does not support audio.
</audio>
\`\`\`

---

## 2) Common attributes

- \`controls\`, \`autoplay\`, \`muted\`, \`loop\`, \`preload\`

---

## 3) Web Audio vs <audio>

- \`<audio>\`: simplest playback
- Web Audio API: advanced effects, synthesis, analysis

---

## 4) Practice

Build a playlist UI that changes the \`src\` and plays the new track.
`;
    }

    if (lowerTitle === 'html plug-ins') {
      return `# HTML Plug-ins

Historically, browsers used plugins (Flash, Java applets). Modern web development **does not rely on plugins**.

---

## 1) Why plugins died

- security risks
- poor performance
- poor mobile support
- better native standards (video/audio/canvas/webgl)

---

## 2) Modern replacements

- video: \`<video>\`
- audio: \`<audio>\`
- graphics: SVG/Canvas/WebGL
- documents: PDF viewer (browser) or embed carefully

---

## 3) Embedding external content

Use \`<iframe>\` with sandboxing when possible.

---

## 4) Practice

List 3 old plugin use cases and the modern standard replacement.
`;
    }

    if (lowerTitle === 'html youtube') {
      return `# HTML YouTube

YouTube videos are usually embedded with an \`<iframe>\`.

---

## 1) Basic embed

\`\`\`html
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="YouTube video"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>
\`\`\`

---

## 2) Responsive embed

\`\`\`css
.video {
  aspect-ratio: 16 / 9;
}
.video iframe {
  width: 100%;
  height: 100%;
}
\`\`\`

Wrap:

\`\`\`html
<div class="video">
  <iframe ...></iframe>
</div>
\`\`\`

---

## 3) Privacy

Consider using the \`youtube-nocookie.com\` domain for privacy-friendly embeds.

---

## 4) Practice

Embed a video responsively and add a clear title.
`;
    }

    if (lowerTitle === 'html apis') {
      return `# HTML APIs

“HTML APIs” often means browser features that work with HTML.

Examples:
- Drag and Drop
- Geolocation
- Web Storage
- Media Capture (camera/mic)
- Canvas

---

## 1) API = capability + permission model

Many APIs require user permission (location, camera, mic).

---

## 2) Example: file input (HTML)

\`\`\`html
<input type="file" name="resume" accept="application/pdf" />
\`\`\`

Then handle it with JS on submit.

---

## 3) Practice

Pick one API (storage/geolocation) and build a small demo.
`;
    }

    if (lowerTitle === 'html web apis') {
      return `# HTML Web APIs

Web APIs are built-in browser APIs accessible via JavaScript.

Common examples:
- Fetch API
- DOM API
- Storage APIs (localStorage, sessionStorage, IndexedDB)
- Geolocation
- MediaDevices (camera/mic)
- WebSocket

---

## 1) Fetch example

\`\`\`js
async function load() {
  const r = await fetch('/api/topics');
  if (!r.ok) throw new Error('Failed');
  return await r.json();
}
\`\`\`

---

## 2) Storage example

\`\`\`js
localStorage.setItem('theme', 'dark');
console.log(localStorage.getItem('theme'));
\`\`\`

---

## 3) Security note

Web APIs follow the browser security model:
- same-origin policy
- HTTPS requirements for sensitive APIs
- permissions prompts

---

## 4) Practice

Save a preference to localStorage and restore it on page load.
`;
    }

    if (lowerTitle === 'html geolocation') {
      return `# HTML Geolocation

The Geolocation API returns the device’s approximate position (with permission).

---

## 1) Requesting current position

\`\`\`js
navigator.geolocation.getCurrentPosition(
  (pos) => {
    console.log(pos.coords.latitude, pos.coords.longitude);
  },
  (err) => {
    console.error(err);
  },
  { enableHighAccuracy: true, timeout: 10000 }
);
\`\`\`

---

## 2) Requirements

- HTTPS required in modern browsers
- user permission required

---

## 3) Privacy

Only ask for location when needed and explain why.

---

## 4) Practice

Get the user location and show it on a map link.
`;
    }

    if (lowerTitle === 'html drag and drop') {
      return `# HTML Drag and Drop

Drag and Drop API enables dragging elements and dropping them onto targets.

---

## 1) Make an element draggable

\`\`\`html
<div id="card" draggable="true">Drag me</div>
<div id="drop">Drop here</div>
\`\`\`

---

## 2) Basic JS events

\`\`\`js
const card = document.getElementById('card');
const drop = document.getElementById('drop');

card.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', 'card');
});

drop.addEventListener('dragover', (e) => {
  e.preventDefault(); // required to allow drop
});

drop.addEventListener('drop', (e) => {
  e.preventDefault();
  drop.appendChild(card);
});
\`\`\`

---

## 3) UX tips

- add a visual highlight on \`dragenter\`
- remove it on \`dragleave\` / \`drop\`

---

## 4) Limitations

Mobile support can be inconsistent; many apps use libraries for touch.

---

## 5) Practice

Implement a mini Kanban board with draggable cards.
`;
    }

    if (lowerTitle === 'html web storage') {
      return `# HTML Web Storage

Web Storage is a simple browser API for persisting small amounts of data.

You get two key-value stores:
- \`localStorage\`: persists until user clears it
- \`sessionStorage\`: persists only for the current tab/session

---

## 1) localStorage basics

\`\`\`js
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');
localStorage.removeItem('theme');
\`\`\`

Values are strings.

---

## 2) Store objects safely (JSON)

\`\`\`js
const user = { id: 'u1', name: 'Aman' };
localStorage.setItem('user', JSON.stringify(user));

const stored = localStorage.getItem('user');
const parsed = stored ? JSON.parse(stored) : null;
\`\`\`

---

## 3) sessionStorage

\`\`\`js
sessionStorage.setItem('draft', 'hello');
\`\`\`

Useful for:
- temporary form drafts
- wizard progress

---

## 4) Storage events (multi-tab sync)

\`\`\`js
window.addEventListener('storage', (e) => {
  console.log('Key changed:', e.key, 'new:', e.newValue);
});
\`\`\`

This triggers in other tabs (same origin) when localStorage changes.

---

## 5) Security warning (important)

Never store secrets in localStorage (JWTs, passwords) — XSS can read it.

---

## 6) Practice

Build a theme toggle that saves preference in localStorage and restores it on page load.
`;
    }

    if (lowerTitle === 'html web workers') {
      return `# HTML Web Workers

Web Workers run JavaScript in a background thread, so heavy work doesn’t freeze the UI.

Use cases:
- parsing large JSON
- image processing
- CPU-heavy computations

---

## 1) How workers communicate

Workers can’t access the DOM. They communicate using messages:
- main thread → worker: \`worker.postMessage(...)\`
- worker → main thread: \`postMessage(...)\`

---

## 2) Minimal example

Main thread:

\`\`\`js
const worker = new Worker('/worker.js');

worker.onmessage = (e) => {
  console.log('Result:', e.data);
};

worker.postMessage({ nums: [1, 2, 3, 4] });
\`\`\`

Worker file (\`/worker.js\`):

\`\`\`js
self.onmessage = (e) => {
  const sum = e.data.nums.reduce((a, b) => a + b, 0);
  self.postMessage(sum);
};
\`\`\`

---

## 3) Common limitations

- No DOM access
- Some APIs unavailable
- Data transfer cost (use structured clone; consider Transferable objects)

---

## 4) Web Worker vs Service Worker

- Web Worker: compute off the main thread
- Service Worker: network proxy/offline cache/background sync

---

## 5) Practice

Move a heavy calculation into a worker and show progress updates in the UI.
`;
    }

    if (lowerTitle === 'html sse') {
      return `# HTML SSE (Server-Sent Events)

SSE lets the server push updates to the browser over a single long-lived HTTP connection.

It’s a great fit for:
- live notifications
- job progress updates
- real-time dashboards (one-way updates)

---

## 1) Client: EventSource

\`\`\`js
const es = new EventSource('/api/stream');

es.onmessage = (e) => {
  console.log('Message:', e.data);
};

es.addEventListener('progress', (e) => {
  console.log('Progress:', e.data);
});

es.onerror = () => {
  console.log('SSE connection lost (browser retries)');
};
\`\`\`

---

## 2) Server response format (concept)

SSE is \`text/event-stream\` and sends lines like:

\`\`\`
event: progress
data: 42

data: hello

\`\`\`

---

## 3) SSE vs WebSocket

- SSE: server → client only, simpler, works over HTTP
- WebSocket: bi-directional, more complex

---

## 4) Practice

Build an API that streams progress updates while a long job runs.
`;
    }

    if (lowerTitle === 'html examples') {
      return `# HTML Examples

This section is about putting core HTML concepts together in small, practical snippets.

---

## 1) A semantic article

\`\`\`html
<article>
  <header>
    <h1>How to Practice Interviews</h1>
    <p><time datetime="2026-03-31">Mar 31, 2026</time></p>
  </header>

  <p>Start with fundamentals, then practice consistently.</p>

  <h2>Checklist</h2>
  <ul>
    <li>Use semantic HTML</li>
    <li>Label form controls</li>
    <li>Test keyboard navigation</li>
  </ul>

  <footer>
    <p>Written by <a href="/about">PrepWise</a></p>
  </footer>
</article>
\`\`\`

---

## 2) Accessible form snippet

\`\`\`html
<form>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" autocomplete="email" required />

  <button type="submit">Submit</button>
</form>
\`\`\`

---

## 3) Navigation menu

\`\`\`html
<nav aria-label="Primary">
  <ul>
    <li><a href="/learn">Learn</a></li>
    <li><a href="/interview">Interview</a></li>
    <li><a href="/resume">Resume</a></li>
  </ul>
</nav>
\`\`\`

---

## 4) Practice

Create a single page containing: header/nav, main/article, and footer.
`;
    }

    if (lowerTitle === 'html editor') {
      return `# HTML Editor

You can write HTML in any text editor, but a good editor improves speed and correctness.

---

## 1) Recommended setup (VS Code)

Useful features:
- syntax highlighting
- auto-closing tags
- formatting
- Emmet shortcuts
- live preview (optional)

---

## 2) Emmet essentials

Type and press Tab:

\`\`\`
ul>li*3
\`\`\`

Outputs:

\`\`\`html
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>
\`\`\`

---

## 3) Formatting rules

- Keep indentation consistent (2 spaces is common).
- Put each attribute on a new line when long.
- Keep headings in order.

---

## 4) Practice

Create an HTML template in your editor and validate it using the browser + DevTools.
`;
    }

    if (lowerTitle === 'html quiz') {
      return `# HTML Quiz

Use this quiz to test understanding of HTML fundamentals.

---

## Questions

1) What is the purpose of \`<!doctype html>\`?
2) Difference between \`<a>\` and \`<button>\`?
3) Why is \`alt\` important on images?
4) What is semantic HTML? Give 3 semantic elements.
5) What is invalid about \`<p><div>Hi</div></p>\`?
6) When should you use \`<section>\` vs \`<article>\`?
7) What does \`defer\` do on a script tag?
8) How do you connect a \`label\` to an \`input\`?

---

## Answers (short)

1) Standards mode.
2) Link navigates; button triggers action.
3) Accessibility + SEO; meaningful replacement text.
4) Using meaning-based elements like \`header\`, \`nav\`, \`main\`.
5) \`div\` cannot be inside \`p\`.
6) Article is self-contained; section groups thematic content.
7) Downloads parallel; runs after HTML parse.
8) \`for\` on label matches \`id\` on input.

---

## Practice

Write a semantic page layout and run Lighthouse accessibility audit.
`;
    }

    if (lowerTitle === 'html exercises') {
      return `# HTML Exercises

Complete these exercises to move from “I read it” to “I can build it”.

---

## Exercise 1: Semantic layout

Build a page using:
- \`header\` + \`nav\`
- \`main\`
- \`article\`
- \`footer\`

---

## Exercise 2: Accessible form

Create a signup form with:
- email + password
- required validation
- proper labels
- error message placeholder (ARIA-friendly)

---

## Exercise 3: Media + captions

Embed a video with:\
- poster
- captions track

---

## Exercise 4: Table

Make a table with:\
- caption
- thead/tbody
- th + scope

---

## Exercise 5: Navigation

Build a nav menu as a list and ensure keyboard navigation works.
`;
    }

    if (lowerTitle === 'html website') {
      return `# HTML Website

This topic is about assembling a small multi-section website using clean HTML.

---

## 1) Suggested file structure

\`\`\`
/site
  index.html
  about.html
  contact.html
  /assets
    logo.svg
  /css
    styles.css
\`\`\`

---

## 2) index.html skeleton

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My Website</title>
    <link rel="stylesheet" href="/css/styles.css" />
  </head>
  <body>
    <header>
      <nav aria-label="Primary">
        <a href="/index.html">Home</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
      </nav>
    </header>

    <main>
      <h1>Welcome</h1>
      <p>This is a simple semantic website.</p>
    </main>

    <footer>
      <small>© 2026</small>
    </footer>
  </body>
</html>
\`\`\`

---

## 3) Practice

Build 3 pages and keep navigation consistent on all pages.
`;
    }

    if (lowerTitle === 'html syllabus') {
      return `# HTML Syllabus

This syllabus is a practical order for learning HTML.

---

## Week 1: Core structure

- document skeleton (doctype, head, body)
- elements, attributes
- headings, paragraphs

## Week 2: Semantics + navigation

- semantic elements
- links
- lists
- images (alt)

## Week 3: Forms

- inputs + types
- validation
- accessibility (labels, errors)

## Week 4: Media + advanced topics

- video/audio + captions
- iframes (sandbox)
- SEO basics + head metadata

---

## Practice rule

Every topic should end with building a tiny page that uses it.
`;
    }

    if (lowerTitle === 'html study plan') {
      return `# HTML Study Plan

This is a realistic study plan designed for consistent progress.

---

## Daily plan (45–60 minutes)

1) 10 min reading (concept)
2) 25 min coding (tiny demo)
3) 10 min debugging in DevTools
4) 10 min recap + notes

---

## 7-day plan

Day 1: skeleton + head metadata
Day 2: elements + attributes
Day 3: headings + semantic structure
Day 4: links + lists
Day 5: images + accessibility
Day 6: forms + validation
Day 7: build a 3-page mini-site

---

## Checklist

- Can you write semantic layout without looking it up?
- Can you build an accessible form?
- Do you understand why \`alt\` matters?
`;
    }

    if (lowerTitle === 'html interview prep') {
      return `# HTML Interview Prep

HTML interview questions usually test fundamentals (structure, semantics, forms, accessibility) and your ability to reason about real-world markup.

---

## 1) Core areas to master

- Document structure: \`<!doctype html>\`, \`<html>\`, \`<head>\`, \`<body>\`
- Semantics: \`header/nav/main/article/section/footer\`
- Links vs buttons: navigation vs action
- Forms: labels, validation, input types, autocomplete
- Accessibility: keyboard, focus, alt text, landmarks, ARIA basics
- Performance/SEO basics: metadata, responsive viewport, image sizing

---

## 2) Common interview questions (with short answers)

1) **What does the doctype do?**
   - Enables standards mode.
2) **\`defer\` vs \`async\`?**
   - \`defer\`: runs after parsing, keeps order; \`async\`: runs ASAP, order not guaranteed.
3) **Why semantic HTML?**
   - Better accessibility, SEO, maintainability.
4) **How do you associate a label and input?**
   - \`<label for="id">\` + \`<input id="id">\`.

---

## 3) Mini tasks you should be able to do fast

- Build a semantic layout for a blog page
- Build an accessible login form with validation hints
- Create a table with caption + header cells (scope)

---

## 4) Practice

Take a messy div-based page and refactor it to semantic HTML without changing the visual layout.
`;
    }

    if (lowerTitle === 'html bootcamp') {
      return `# HTML Bootcamp

This is an intensive, project-focused plan to get comfortable with HTML quickly.

---

## 1) Bootcamp goals

- Write clean semantic HTML without Googling basic tags
- Build accessible forms
- Structure multi-page websites
- Debug layout/markup issues using DevTools

---

## 2) 5-day bootcamp schedule

Day 1: skeleton, head metadata, headings, text
Day 2: links, lists, images, file paths
Day 3: semantic layout + navigation
Day 4: forms (types, validation, autocomplete, labels)
Day 5: media, iframes, accessibility checklist + final mini-site

---

## 3) Final project

Build a 3–5 page website with:
- consistent header/nav/footer
- at least one form
- at least one table
- good accessibility basics (labels, alt, landmarks)
`;
    }

    if (lowerTitle === 'html certificate') {
      return `# HTML Certificate

An HTML certificate typically validates fundamentals: structure, semantics, forms, accessibility, and basic web concepts.

---

## 1) What to study

- Core tags and attributes
- Semantic structure
- Forms (input types + validation)
- Media (img/video/audio)
- Tables + lists
- Head metadata (charset, viewport)
- Accessibility fundamentals

---

## 2) How to prepare (practical)

1) Build small pages daily
2) Take quizzes and explain answers
3) Review common mistakes:
   - missing \`alt\`
   - unlabeled inputs
   - invalid nesting (block inside \`p\`)

---

## 3) Practice checklist

- Can you write a full HTML skeleton from memory?
- Can you build a login form with correct input types?
- Can you explain semantic elements and when to use them?
`;
    }

    if (lowerTitle === 'html summary') {
      return `# HTML Summary

HTML is the structure and meaning layer of the web.

---

## Key takeaways

- Use semantic elements to describe meaning, not presentation.
- Prefer links for navigation and buttons for actions.
- Forms must be accessible: labels, correct types, helpful validation.
- Media needs context: \`alt\` for images, captions for video.
- Keep the head correct: charset, viewport, title, description.

---

## Quick checklist (build-ready)

- [ ] Valid document structure
- [ ] Semantic layout
- [ ] Accessible navigation
- [ ] Accessible forms
- [ ] Responsive-friendly images
`;
    }

    if (lowerTitle === 'html accessibility') {
      return `# HTML Accessibility

Accessibility (a11y) means your site works for keyboard users, screen readers, and diverse needs.

---

## 1) Use semantic landmarks

Prefer:
- \`<header> <nav> <main> <footer>\`
- \`<button>\` for actions
- \`<a>\` for navigation

---

## 2) Labels for inputs

\`\`\`html
<label for="email">Email</label>
<input id="email" name="email" type="email" required />
\`\`\`

---

## 3) Images need alt

- Decorative image: \`alt=""\`
- Informational image: meaningful \`alt\`

---

## 4) Keyboard + focus

- Ensure interactive elements are focusable
- Don’t remove focus outline without replacement
- Use \`tabindex\` carefully (prefer native controls)

---

## 5) ARIA (last resort)

Use ARIA only when native HTML can’t express the behavior.

---

## 6) Practice

Run Lighthouse accessibility audit and fix the top 3 issues.
`;
    }

    if (lowerTitle === 'html tag list') {
      return `# HTML Tag List

Instead of memorizing every tag, learn categories and when to use them.

---

## 1) Document + metadata

- \`html\`, \`head\`, \`body\`, \`title\`, \`meta\`, \`link\`, \`script\`

---

## 2) Layout/semantics

- \`header\`, \`nav\`, \`main\`, \`article\`, \`section\`, \`aside\`, \`footer\`

---

## 3) Text

- \`h1..h6\`, \`p\`, \`strong\`, \`em\`, \`small\`, \`code\`, \`pre\`, \`blockquote\`

---

## 4) Lists

- \`ul\`, \`ol\`, \`li\`, \`dl\`, \`dt\`, \`dd\`

---

## 5) Forms

- \`form\`, \`label\`, \`input\`, \`select\`, \`option\`, \`textarea\`, \`button\`

---

## 6) Media

- \`img\`, \`video\`, \`audio\`, \`source\`, \`track\`, \`figure\`, \`figcaption\`

---

## 7) Void elements (no closing tag)

- \`img\`, \`br\`, \`hr\`, \`meta\`, \`link\`, \`input\`
`;
    }

    if (lowerTitle === 'html global attributes') {
      return `# HTML Global Attributes

Global attributes can appear on most HTML elements.

---

## Common global attributes

- \`id\`: unique identifier in the document
- \`class\`: reusable grouping for CSS/JS hooks
- \`style\`: inline CSS (use sparingly)
- \`title\`: tooltip text
- \`hidden\`: hide an element
- \`tabindex\`: keyboard focus order (use carefully)
- \`contenteditable\`: makes content editable
- \`draggable\`: enables drag behavior
- \`data-*\`: custom data attributes
- \`lang\` / \`dir\`: language and direction

---

## data-* example

\`\`\`html
<button data-lesson-id="123" data-level="easy">Start</button>
\`\`\`

\`\`\`js
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-lesson-id]');
  if (!btn) return;
  console.log(btn.dataset.lessonId, btn.dataset.level);
});
\`\`\`

---

## Practice

Add \`data-*\` attributes to identify cards in a list and implement event delegation.
`;
    }

    if (lowerTitle === 'html browser support') {
      return `# HTML Browser Support

Most HTML features are widely supported, but "support" still matters for newer APIs and edge cases.

---

## 1) Progressive enhancement

Build a baseline that works everywhere, then enhance:
- start with semantic HTML
- add CSS for layout
- add JS for interactivity

---

## 2) Feature detection

Prefer feature detection over browser sniffing:

\`\`\`js
if ('geolocation' in navigator) {
  // safe to use
}
\`\`\`

---

## 3) Compatibility checks

- Use caniuse-style research for APIs
- Test on at least: Chrome, Firefox, Safari

---

## 4) Practice

Pick one newer feature (e.g., \`dialog\` element or \`loading="lazy"\`) and implement a fallback.
`;
    }

    if (lowerTitle === 'html events') {
      return `# HTML Events

Events are how the browser notifies your code that something happened: click, input, submit, keydown, load, etc.

---

## 1) Add event listeners

\`\`\`js
const button = document.querySelector('#save');

button.addEventListener('click', () => {
  console.log('Saved');
});
\`\`\`

---

## 2) Prevent default behavior

\`\`\`js
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  // validate + send request
});
\`\`\`

---

## 3) Bubbling + event delegation

Instead of many listeners, attach one on a parent:

\`\`\`js
document.querySelector('#list').addEventListener('click', (e) => {
  const item = e.target.closest('[data-id]');
  if (!item) return;
  console.log('Clicked item', item.dataset.id);
});
\`\`\`

---

## 4) Practice

Build a todo list where clicks on a list container toggle items via delegation.
`;
    }

    if (lowerTitle === 'html canvas reference') {
      return `# HTML Canvas Reference

Canvas provides a 2D drawing context for pixel-based graphics.

---

## 1) Setup

\`\`\`html
<canvas id="c" width="400" height="200"></canvas>
\`\`\`

\`\`\`js
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
\`\`\`

---

## 2) Core drawing APIs

- \`ctx.fillRect(x, y, w, h)\`
- \`ctx.strokeRect(...)\`
- \`ctx.beginPath()\`, \`ctx.moveTo()\`, \`ctx.lineTo()\`, \`ctx.stroke()\`
- \`ctx.arc(x, y, r, start, end)\`
- \`ctx.fillText(text, x, y)\`

---

## 3) State + transforms

- \`ctx.save()\` / \`ctx.restore()\`
- \`ctx.translate()\`, \`ctx.rotate()\`, \`ctx.scale()\`

---

## 4) Animation loop

\`\`\`js
function draw(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect((t / 10) % 400, 50, 50, 50);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
\`\`\`

---

## 5) Practice

Draw a bouncing ball with basic physics (position + velocity) using requestAnimationFrame.
`;
    }

    if (lowerTitle === 'html audio/video') {
      return `# HTML Audio/Video

HTML provides native media playback via \`<video>\` and \`<audio>\`. You can add multiple formats, captions, and control playback with JavaScript.

---

## 1) Basic video

\`\`\`html
<video controls width="640" poster="/assets/cover.jpg">
  <source src="/media/intro.mp4" type="video/mp4" />
  <source src="/media/intro.webm" type="video/webm" />
  Sorry, your browser does not support video.
</video>
\`\`\`

Why multiple \`<source>\`?
- Browsers support different codecs/containers.

---

## 2) Audio

\`\`\`html
<audio controls>
  <source src="/media/theme.mp3" type="audio/mpeg" />
  <source src="/media/theme.ogg" type="audio/ogg" />
</audio>
\`\`\`

---

## 3) Captions/subtitles (accessibility)

\`\`\`html
<video controls width="640">
  <source src="/media/lesson.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="/media/lesson.en.vtt"
    srclang="en"
    label="English"
    default
  />
</video>
\`\`\`

Use WebVTT (\`.vtt\`) for captions.

---

## 4) Autoplay policies (important)

Modern browsers typically block autoplay with sound.

Common pattern:

\`\`\`html
<video autoplay muted playsinline loop>
  <source src="/media/bg.mp4" type="video/mp4" />
</video>
\`\`\`

---

## 5) Control with JavaScript

\`\`\`js
const video = document.querySelector('video');

document.querySelector('#play').addEventListener('click', async () => {
  try {
    await video.play();
  } catch (e) {
    console.log('Play blocked:', e);
  }
});

document.querySelector('#pause').addEventListener('click', () => {
  video.pause();
});
\`\`\`

---

## 6) Practice

Create a video player page with a poster image, captions track, and play/pause buttons.
`;
    }

    if (lowerTitle === 'html doctypes') {
      return `# HTML Doctypes

The doctype tells the browser which HTML standard to use so it renders the page in **standards mode**.

---

## 1) HTML5 doctype (use this)

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Doc</title>
  </head>
  <body></body>
</html>
\`\`\`

It’s intentionally short. You don’t need a DTD in HTML5.

---

## 2) Standards mode vs quirks mode

- **Standards mode**: modern rendering rules.
- **Quirks mode**: legacy behavior for old pages (can break layout and CSS expectations).

Missing/incorrect doctype can trigger quirks mode.

---

## 3) Practice

Open a page with and without doctype and inspect rendering differences (box model/line-height can vary in quirks mode).
`;
    }

    if (lowerTitle === 'html character sets') {
      return `# HTML Character Sets

A character set (encoding) tells the browser how to interpret bytes as text.

In modern web apps, you almost always want **UTF-8**.

---

## 1) Set UTF-8

Put this as early as possible in \`<head>\`:

\`\`\`html
<meta charset="utf-8" />
\`\`\`

---

## 2) What goes wrong without it?

If encoding is wrong, you see “mojibake” (garbled text):
- accents look broken
- emojis become squares
- non-English scripts render incorrectly

---

## 3) HTTP headers also matter

Servers can send encoding in the \`Content-Type\` header, e.g.:

\`\`\`
Content-Type: text/html; charset=utf-8
\`\`\`

Best practice:
- serve UTF-8
- declare in both header and HTML meta

---

## 4) Practice

Create a page with Hindi/emoji text and verify it renders correctly in multiple browsers.
`;
    }

    if (lowerTitle === 'html lang codes') {
      return `# HTML Lang Codes

The \`lang\` attribute declares the language of the page (or a specific part of it). This improves accessibility (screen readers), translation, and typography.

---

## 1) Set page language

\`\`\`html
<html lang="en">
\`\`\`

For regional variants (BCP 47 language tags):

\`\`\`html
<html lang="en-US">
\`\`\`

Examples:
- \`en\`, \`en-GB\`, \`hi-IN\`, \`fr-FR\`

---

## 2) Mixed-language content

\`\`\`html
<p>English text.</p>
<p lang="hi">यह हिंदी है।</p>
\`\`\`

---

## 3) Direction (related)

Use \`dir\` for direction when needed:

\`\`\`html
<p lang="ar" dir="rtl">...</p>
\`\`\`

---

## 4) Practice

Build a page with two languages and confirm a screen reader announces them correctly.
`;
    }

    if (lowerTitle === 'http messages') {
      return `# HTTP Messages

HTTP is the protocol browsers use to communicate with servers. An HTTP message is either a **request** (client → server) or a **response** (server → client).

---

## 1) HTTP request structure

Conceptually:
- start line (method + path + version)
- headers
- optional body

Example:

\`\`\`
POST /api/login HTTP/1.1
Host: example.com
Content-Type: application/json
Accept: application/json

{"email":"a@b.com","password":"secret"}
\`\`\`

---

## 2) HTTP response structure

- status line (version + status code)
- headers
- optional body

Example:

\`\`\`
HTTP/1.1 200 OK
Content-Type: application/json

{"ok":true}
\`\`\`

---

## 3) Important headers to know

- \`Content-Type\`: type of the body you’re sending
- \`Accept\`: what response type you want
- \`Authorization\`: credentials/bearer tokens
- \`Cache-Control\`: caching behavior
- \`Cookie\` / \`Set-Cookie\`: session cookies

---

## 4) Practice

Open DevTools → Network and inspect request/response headers for a form submission.
`;
    }

    if (lowerTitle === 'http methods') {
      return `# HTTP Methods

HTTP methods define the intent of a request.

---

## 1) Common methods

- **GET**: read data (should not change server state)
- **POST**: create or trigger an action
- **PUT**: replace a resource (idempotent)
- **PATCH**: partial update
- **DELETE**: remove a resource
- **HEAD**: like GET but no body (metadata)
- **OPTIONS**: discover server capabilities (CORS preflight)

---

## 2) Safety + idempotency (interview favorite)

- **Safe**: GET/HEAD (should be read-only)
- **Idempotent**: PUT/DELETE (repeat has same effect)
- POST is usually not idempotent

---

## 3) fetch() examples

\`\`\`js
// GET
const res = await fetch('/api/users');

// POST
await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Aman' }),
});

// PATCH
await fetch('/api/users/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Aman Updated' }),
});
\`\`\`

---

## 4) Practice

Design a REST API for \`/todos\` and map CRUD operations to HTTP methods.
`;
    }

    if (lowerTitle === 'px to em converter') {
      return `# PX to EM Converter

Understanding \`px\`, \`em\`, and \`rem\` is key to scalable, accessible UI.

---

## 1) Definitions

- **px**: fixed pixel unit
- **em**: relative to the **current element’s** font-size (or its parent, depending on property)
- **rem**: relative to the **root** (\`html\`) font-size

---

## 2) Core formulas

If base font-size is 16px:

- \`em = px / 16\`
- \`rem = px / 16\`

Examples:
- 24px → 1.5rem
- 12px → 0.75rem

---

## 3) Mini converter snippet

\`\`\`js
function pxToRem(px, base = 16) {
  return px / base;
}

console.log(pxToRem(24) + 'rem'); // 1.5rem
\`\`\`

---

## 4) Practical guidance

- Use \`rem\` for typography spacing that should scale with user settings.
- Use \`em\` for component-local scaling (buttons, badges).

---

## 5) Practice

Convert a design spec from px to rem with a 16px base and verify it scales when root font-size changes.
`;
    }

    if (lowerTitle === 'keyboard shortcuts') {
      return `# Keyboard Shortcuts (HTML + Web Dev)

Keyboard shortcuts speed up HTML development and debugging.

---

## 1) Browser / DevTools (Chrome/Edge common)

- Open DevTools: \`F12\` or \`Ctrl+Shift+I\`
- Element picker: \`Ctrl+Shift+C\`
- Console: \`Ctrl+Shift+J\`
- Search in panel: \`Ctrl+F\`
- Command menu: \`Ctrl+Shift+P\` (inside DevTools)

---

## 2) VS Code essentials

- Command palette: \`Ctrl+Shift+P\`
- Quick open: \`Ctrl+P\`
- Find/Replace: \`Ctrl+F\` / \`Ctrl+H\`
- Multi-cursor: \`Alt+Click\` (or \`Ctrl+Alt+Down/Up\`)

---

## 3) Emmet (HTML)

- \`div.container>ul>li*3\` then Tab
- \`!\` then Tab for HTML boilerplate

---

## 4) Practice

Build a page using Emmet expansions only (no manual tag typing) and debug layout using the element picker.
`;
    }

    if (lowerTitle === 'html semantics') {
      return `# HTML Semantics

Semantic HTML means using elements that **describe meaning** rather than using generic containers.

Why it matters:
- Better **accessibility** (screen readers use landmarks)
- Better **SEO** and content understanding
- Cleaner, more maintainable code

---

## 1) Landmarks (page-level structure)

\`\`\`html
<header>
  <nav aria-label="Primary">
    <a href="/">Home</a>
    <a href="/learn">Learn</a>
    <a href="/interview">Interview</a>
  </nav>
</header>

<main id="content">
  <h1>Page title</h1>
  <p>Page content...</p>
</main>

<footer>
  <small>© 2026 PrepWise</small>
</footer>
\`\`\`

Guidelines:
- Use **one** \`<main>\` per page.
- Use \`<nav>\` for major navigation links.
- Headings should form a logical outline.

---

## 2) \`section\` vs \`article\` vs \`div\`

\`article\`: self-contained content.
\`section\`: thematic grouping (usually with a heading).
\`div\`: only when no semantic element fits.

---

## 3) Buttons vs links

- Use \`<a href>\` for navigation.
- Use \`<button>\` for actions.

\`\`\`html
<a href="/dashboard">Go to dashboard</a>
<button type="button">Save changes</button>
\`\`\`

---

## 4) Practical audit checklist

- Clear landmarks (\`header/nav/main/footer\`)
- Exactly one \`h1\`
- Inputs labeled
- Interactive UI uses real \`button\`/\`a\`
`;
    }

    if (lowerTitle.includes('semantic')) {
      return `# ${title}

Semantic HTML uses elements that clearly describe their meaning to both browsers and developers. Semantic elements like header, nav, main, article, section, aside, and footer replace generic div elements, making code more readable and meaningful. Semantic markup improves accessibility, SEO, and code maintainability.

Semantic elements help assistive technologies understand page structure. Screen readers use semantic landmarks to help users navigate efficiently. Search engines use semantic markup to better understand content hierarchy and importance, potentially improving rankings. Browsers can also apply default styling more intelligently to semantic elements.

Choosing the right semantic element requires understanding each element's purpose. The article element represents self-contained content, section groups related content, aside contains tangentially related content, and nav contains navigation links. Using semantic elements correctly makes HTML more expressive and meaningful.

Modern web development emphasizes semantic HTML as a foundation for accessible, maintainable websites. Semantic markup separates content structure from presentation, allowing CSS to handle styling while HTML focuses on meaning. This separation of concerns creates more flexible, easier to maintain codebases.`;
    }
    if (lowerTitle === 'html styles') {
      return `# ${title}

HTML provides multiple ways to apply CSS styles to elements. The style attribute adds inline styles directly to elements, the style element embeds CSS in the document head, and the link element connects external stylesheets. External stylesheets are generally preferred for separation of concerns and cacheability.

Inline styles using the style attribute have the highest specificity, overriding external and internal styles. While convenient for testing, inline styles harm maintainability by mixing presentation with content. They prevent style reuse and make global design changes difficult. Inline styles should be used sparingly.

The style element in the document head embeds CSS directly in HTML documents. This approach loads styles without additional HTTP requests but prevents caching across pages. Style elements are useful for page-specific CSS but increase HTML file size and can't be shared across site pages.

External stylesheets linked with link elements offer the best separation of concerns. They're cached by browsers, reducing bandwidth usage across site visits. Multiple pages can share stylesheets, ensuring design consistency. Modern web development strongly favors external CSS for its maintainability and performance benefits.`;
    }
    if (lowerTitle.includes('buttons')) {
      return `# ${title}

HTML buttons enable user interactions through the button element. Buttons can submit forms, trigger JavaScript functions, or reset form fields. The type attribute specifies button behavior: "submit" for form submission, "button" for JavaScript interactions, or "reset" to clear form fields.

Buttons differ from links semantically and functionally. Buttons perform actions within the current context, while links navigate to new locations. Using the correct element is important for accessibility - screen readers announce them differently, and keyboard users expect different behaviors. Never use div or span elements styled as buttons.

Button styling and interactivity can be customized extensively with CSS and JavaScript. Buttons support focus, hover, and active states that provide visual feedback. The disabled attribute prevents interaction, useful for form validation. Accessible buttons include appropriate labels and respond to both mouse and keyboard inputs.

Modern web applications rely heavily on buttons for user interactions. They trigger API calls, open modals, toggle UI elements, and control application state. Well-designed buttons with clear labels and appropriate visual feedback create intuitive user interfaces. Button implementation affects both functionality and user experience.`;
    }
    if (lowerTitle.includes('input')) {
      return `# ${title}

HTML input elements collect various types of user data. The type attribute determines input behavior: text, email, password, number, date, checkbox, radio, file, and many others. HTML5 introduced numerous input types that provide built-in validation and specialized interfaces on mobile devices.

Input elements require associated label elements for accessibility. Labels can wrap inputs or use the for attribute matching the input's id. Clear labels help all users understand what information is expected. The placeholder attribute provides example text but shouldn't replace labels.

Input validation improves data quality and user experience. HTML5 validation attributes include required, pattern (regex validation), min, max, minlength, and maxlength. Browser-provided validation messages appear when validation fails. Custom validation styling uses CSS pseudo-classes like :valid and :invalid.

Professional forms use semantic input types that provide appropriate keyboards on mobile devices and built-in validation. Email inputs show @ keys, number inputs show numeric keypads, and date inputs show date pickers. Proper input implementation enhances usability across all devices and user abilities.`;
    }
    if (lowerTitle.includes('canvas')) {
      return `# ${title}

The HTML5 Canvas element provides a drawing surface for creating graphics, animations, and interactive visualizations with JavaScript. Canvas uses a 2D rendering context accessed via getContext('2d'), offering methods for drawing shapes, text, images, and applying transformations. Canvas is essential for game development, data visualization, and image manipulation.

Canvas operates using immediate mode rendering, meaning drawn content isn't stored as objects but rendered directly to pixels. This differs from SVG's retained mode where elements remain as DOM objects. Canvas excels at rendering many objects or frequent updates, while SVG works better for interactive, scalable graphics with fewer elements.

Drawing on canvas involves setting context properties like fillStyle, strokeStyle, lineWidth, and font, then calling drawing methods like fillRect, strokeRect, arc, and fillText. Transformations including rotate, scale, and translate modify the drawing context. The save and restore methods preserve and restore context state.

Professional developers use Canvas for charts, graphs, image filters, games, and real-time animations. Canvas integrates with requestAnimationFrame for smooth animations and supports WebGL for 3D graphics. Canvas content isn't accessible by default, requiring additional ARIA labels and fallback content for screen readers.`;
    }
    if (lowerTitle.includes('svg')) {
      return `# ${title}

SVG (Scalable Vector Graphics) is an XML-based format for defining vector graphics in HTML. Unlike raster images that pixelate when scaled, SVG graphics remain sharp at any size. SVG elements are part of the DOM, making them styleable with CSS and manipulable with JavaScript. SVG is ideal for icons, logos, charts, and interactive graphics.

SVG uses geometric shapes like rect, circle, ellipse, line, polyline, polygon, and path to create graphics. The path element is most powerful, supporting curves and complex shapes with commands like M (move to), L (line to), and C (curve to). SVG supports gradients, patterns, filters, and animations through declarative markup.

SVG elements can be styled with CSS, including :hover states and transitions. SVG supports transformations, clipping paths, and masks. The viewBox attribute defines the coordinate system, enabling responsive scaling. SVG is fully accessible, with text remaining selectable and screen-reader compatible when properly structured.

Modern web development extensively uses SVG for responsive icons, interactive data visualizations, and animated illustrations. SVG sprites combine multiple icons efficiently. SVG animations use SMIL, CSS animations, or JavaScript libraries. Unlike Canvas, SVG maintains element structure, making it superior for interactive, accessible graphics that need to scale perfectly.`;
    }
    if (lowerTitle.includes('video') || lowerTitle.includes('audio') || lowerTitle.includes('media')) {
      return `# ${title}

HTML5 introduced native video and audio elements, eliminating the need for plugins like Flash. The video and audio elements provide built-in controls and JavaScript APIs for custom players. Multiple source elements support different formats, ensuring compatibility across browsers. Media elements revolutionized web content delivery.

The controls attribute displays browser-default playback controls. Attributes include autoplay (starts automatically), loop (repeats continuously), muted (starts muted), preload (hints for loading strategy), and poster (thumbnail for videos). Custom controls use JavaScript APIs like play(), pause(), currentTime, and volume.

Media events like loadedmetadata, canplay, playing, pause, and ended enable interactive experiences. The HTMLMediaElement API provides properties for duration, playback rate, buffered ranges, and more. Media Source Extensions (MSE) enable adaptive bitrate streaming for services like Netflix and YouTube.

Professional video integration requires optimization for web delivery. Modern formats like WebM and MP4 with H.264/H.265 provide good compression. Responsive video uses CSS for sizing and object-fit for aspect ratios. Accessibility requires captions via track elements. Media implementation impacts page performance, requiring lazy loading and appropriate preload strategies.`;
    }
    if (lowerTitle.includes('responsive') || lowerTitle.includes('rwd')) {
      return `# ${title}

Responsive web design creates websites that adapt to different screen sizes and devices. HTML supports responsive design through viewport meta tags, flexible images, and semantic markup. The viewport meta tag controls how mobile browsers render pages, preventing tiny text on small screens. Responsive HTML works with CSS media queries for device-appropriate layouts.

The viewport meta tag uses content="width=device-width, initial-scale=1.0" to match screen width and set initial zoom. Without this tag, mobile browsers render pages at desktop width and scale down. Responsive images use srcset and sizes attributes to serve appropriate image resolutions, reducing bandwidth on mobile devices.

Semantic HTML improves responsive designs by separating content structure from presentation. Elements like nav, article, and aside can be reordered for different layouts using CSS Flexbox or Grid. Mobile-first development starts with mobile designs and progressively enhances for larger screens, ensuring core functionality works everywhere.

Modern responsive development combines HTML viewport settings, CSS media queries, flexible grids, and responsive images. Progressive enhancement ensures basic functionality works without JavaScript. Responsive typography uses relative units like rem and fluid scaling with clamp(). Testing across real devices ensures responsive designs work in practice, not just on desktop simulators.`;
    }
    if (lowerTitle.includes('api') || lowerTitle.includes('web apis')) {
      return `# ${title}

Web APIs provide JavaScript interfaces for browser capabilities beyond basic HTML/CSS. APIs include DOM manipulation, network requests (Fetch, XMLHttpRequest), storage (localStorage, IndexedDB), geolocation, notifications, and device sensors. Modern web applications rely heavily on these APIs to deliver app-like experiences in browsers.

Storage APIs enable offline functionality and state persistence. LocalStorage provides simple key-value storage, SessionStorage maintains data per browser session, and IndexedDB offers structured database storage for large datasets. The Cache API works with Service Workers for offline web applications.

Network APIs handle server communication. The Fetch API provides promise-based HTTP requests, replacing older XMLHttpRequest. WebSocket enables real-time bidirectional communication. Server-Sent Events (SSE) delivers server-to-client event streams. These APIs power modern dynamic web applications.

Device APIs access hardware capabilities. Geolocation provides location coordinates, Media Capture accesses cameras and microphones, Web Bluetooth connects to Bluetooth devices, and Vibration API controls device vibration. Permission APIs protect user privacy by requiring explicit consent for sensitive features.`;
    }
    if (lowerTitle.includes('storage')) {
      return `# ${title}

Web Storage API provides mechanisms for storing data in browsers. LocalStorage persists data indefinitely until explicitly cleared, while SessionStorage maintains data only for the browser session. Both offer simple key-value storage accessible via JavaScript. Storage APIs enable offline functionality and improved user experiences.

Storage uses string key-value pairs accessed via setItem, getItem, removeItem, and clear methods. Complex data requires JSON serialization. Storage capacity typically ranges from 5-10MB per origin. Storage events notify other tabs when storage changes, enabling cross-tab communication.

Unlike cookies, storage data doesn't transfer to servers with every request, reducing bandwidth. However, storage lacks cookies' security features and HTTP-only protection. Storage is vulnerable to XSS attacks, so never store sensitive data like passwords or tokens. Storage is synchronous, potentially blocking main thread for large operations.

Modern applications use storage for user preferences, cached API responses, form data backup, and offline functionality. IndexedDB suits larger, structured datasets requiring queries. Service Workers and Cache API provide more sophisticated offline strategies. Understanding storage limitations and security implications ensures proper implementation.`;
    }
    if (lowerTitle.includes('geolocation')) {
      return `# ${title}

The Geolocation API provides access to device location through GPS, Wi-Fi, IP address, and cell towers. The navigator.geolocation object offers getCurrentPosition for one-time location and watchPosition for continuous tracking. Location data enables mapping, navigation, location-based services, and localized content.

Geolocation requires user permission due to privacy implications. Browsers display permission prompts when websites request location. Users can deny, grant temporarily, or grant permanently. HTTPS is required for geolocation in modern browsers. Successful location requests return latitude, longitude, accuracy, and optionally altitude and speed.

Error handling manages denied permissions, unavailable location services, and timeouts. Options include enableHighAccuracy for GPS precision, timeout for request duration, and maximumAge for cached position validity. High accuracy drains batteries faster, requiring balance between precision and efficiency.

Location services power ride-sharing, food delivery, weather services, and local search. Reverse geocoding converts coordinates to addresses using services like Google Maps API. Privacy-conscious implementations request location only when needed and clearly explain usage. Location tracking raises ethical considerations requiring transparent data handling and user control.`;
    }
    if (lowerTitle.includes('drag') || lowerTitle.includes('drop')) {
      return `# ${title}

The HTML5 Drag and Drop API enables dragging elements between locations in web pages. Elements become draggable with the draggable="true" attribute. Event handlers on drag sources and drop targets control behavior during drag operations. Drag and drop enhances user interfaces for file uploads, list reordering, and content organization.

Drag events include dragstart (drag begins), drag (during drag), dragend (drag finishes), dragenter (enters drop target), dragover (over drop target), dragleave (leaves target), and drop (released on target). The dataTransfer object carries data during drags, supporting multiple MIME types and custom formats.

Implementing drop zones requires preventDefault() on dragover events to enable dropping. The drop event receives dragged data for processing. Visual feedback during drags improves user experience - adding classes on dragover and removing on drop or dragleave. The effectAllowed and dropEffect properties control cursor appearance.

Modern applications use drag and drop for Kanban boards, file uploaders, image galleries, and dashboard customization. Mobile devices don't support drag and drop natively, requiring touch event alternatives or libraries. Accessibility considerations include keyboard alternatives, as drag and drop isn't universally accessible. Libraries like interact.js simplify cross-device drag and drop implementation.`;
    }
    if (lowerTitle.includes('accessibility')) {
      return `# ${title}

Web accessibility ensures people with disabilities can use websites effectively. HTML provides semantic elements, ARIA attributes, and best practices for creating accessible content. Accessibility isn't optional - many countries legally require accessible websites. Accessible sites also benefit SEO and improve usability for everyone.

Semantic HTML forms the accessibility foundation. Using correct elements like button instead of div for buttons, nav for navigation, and heading hierarchy helps assistive technologies understand content structure. Alt text on images, labels on form inputs, and proper heading levels create accessible experiences.

ARIA (Accessible Rich Internet Applications) attributes supplement HTML semantics for complex interfaces. Roles like role="dialog" or role="tablist", states like aria-expanded, and properties like aria-label provide information to assistive technologies. However, proper HTML semantics should always be preferred over ARIA when possible.

Accessibility testing includes keyboard navigation (Tab, Enter, Escape), screen reader compatibility (NVDA, JAWS, VoiceOver), color contrast ratios, and focus management. Tools like Lighthouse, axe, and WAVE identify accessibility issues. Building with accessibility in mind from the start costs less than retrofitting. Inclusive design benefits all users through clearer interfaces and better usability.`;
    }
    if (lowerTitle.includes('events')) {
      return `# ${title}

HTML events enable interactivity by detecting user actions and triggering JavaScript responses. Events include clicks, key presses, form submissions, mouse movements, page loads, and more. Understanding event handling is fundamental to creating dynamic, interactive web applications.

Event listeners attach to elements using addEventListener, which requires an event type and callback function. Events bubble from target elements up through ancestors, allowing parent elements to handle child events. The stopPropagation method prevents bubbling, while preventDefault stops default actions like form submissions or link navigation.

The event object passed to handlers contains information about the event including type, target, currentTarget, timestamp, and event-specific properties. Mouse events provide coordinates, keyboard events provide key codes, and form events provide input values. Event delegation uses bubbling to handle events efficiently on many elements.

Modern applications separate behavior (JavaScript) from structure (HTML) by attaching events programmatically rather than using inline onclick attributes. This separation improves maintainability and security. Custom events enable component communication. Understanding event timing, bubbling, and delegation patterns is essential for building responsive, efficient user interfaces.`;
    }
    return null; // Return null if no specific content found for this HTML topic
  }

  // CSS Topics
  if (category === 'CSS') {
    if (lowerTitle === 'css home') {
      return `# CSS HOME

CSS (Cascading Style Sheets) is how you control **visual design** on the web: spacing, layout, colors, typography, and responsiveness.

This “HOME” topic is your quick orientation so the rest of CSS feels predictable.

---

## 1) The 4 mental models

1) **Cascade**: rules compete; later/more specific rules can win
2) **Specificity**: how “targeted” a selector is
3) **Inheritance**: some properties flow from parent to child
4) **Box model + layout**: every element is a box; Flex/Grid control layout

---

## 2) How CSS is applied

Three common ways:

\`\`\`html
<!-- External (recommended) -->
<link rel="stylesheet" href="/styles.css" />

<!-- Internal -->
<style>
  body { font-family: system-ui; }
</style>

<!-- Inline (avoid for maintainability) -->
<div style="margin: 12px"></div>
\`\`\`

---

## 3) DevTools workflow (fast debugging)

When styles “don’t work”, check:
- Is your selector matching? (Elements → Styles)
- Which rule is crossed out? (cascade/specificity)
- Are you fighting default styles? (user agent stylesheet)
- Is layout controlled by Flex/Grid? (Layout panel)

---

## 4) A tiny starter CSS you can reuse

\`\`\`css
/* predictable sizing */
*, *::before, *::after { box-sizing: border-box; }

/* reasonable defaults */
html, body { height: 100%; }
body {
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  line-height: 1.5;
}
img { max-width: 100%; display: block; }
\`\`\`

---

## 5) Practice

Build a simple page layout (header/content/footer) and use DevTools to answer:
- which rule sets the final font-size?
- why is a rule crossed out?
`;
    }

    if (lowerTitle.includes('introduction') || lowerTitle.includes('home')) {
      return `# CSS Introduction

CSS (Cascading Style Sheets) controls **presentation**: layout, spacing, colors, typography, and responsive behavior.

This topic focuses on the mental models that make CSS predictable:
- cascade + inheritance
- specificity
- the box model
- modern layout primitives (Flexbox/Grid)

---

## 1) CSS rule syntax

\`\`\`css
button.primary {
  background: black;
  color: white;
  padding: 12px 16px;
}
\`\`\`

---

## 2) Which style wins?

When multiple rules apply:
1. \`!important\` (avoid)
2. specificity
3. source order

Specificity cheat sheet:
- inline styles
- \`#id\`
- \`.class\`, \`[attr]\`, \`:pseudo-class\`
- \`element\`, \`::pseudo-element\`

---

## 3) Inheritance

Usually inherits: \`color\`, \`font-family\`.
Usually does not: \`margin\`, \`padding\`, \`background\`.

---

## 4) Box sizing best practice

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

---

## 5) Debug workflow

Use DevTools to inspect:
- matched rules
- computed styles
- layout panels for Flex/Grid
`;
    }

    if (lowerTitle === 'css syntax') {
      return `# CSS Syntax

CSS is made of **rule sets** that map a selector to declarations.

---

## 1) Anatomy of a rule

\`\`\`css
/* selector */
.card {
  /* declarations */
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
\`\`\`

- **Selector**: chooses elements
- **Property**: what you change (\`padding\`)
- **Value**: how you change it (\`16px\`)

---

## 2) Common value types

- lengths: \`px\`, \`rem\`, \`em\`, \`%\`, \`vw\`, \`vh\`
- colors: \`#rrggbb\`, \`rgb()\`, \`hsl()\`
- keywords: \`block\`, \`none\`, \`auto\`
- functions: \`calc()\`, \`clamp()\`, \`var()\`

Example with \`calc\`:

\`\`\`css
.sidebar {
  width: calc(100% - 24px);
}
\`\`\`

---

## 3) Shorthand vs longhand

\`\`\`css
/* shorthand */
.btn { margin: 8px 12px; }

/* longhand */
.btn {
  margin-top: 8px;
  margin-right: 12px;
  margin-bottom: 8px;
  margin-left: 12px;
}
\`\`\`

---

## 4) Comments

\`\`\`css
/* this is a comment */
\`\`\`

---

## 5) Practice

Write 3 rules:
1) style all \`h1\`
2) style elements with class \`.card\`
3) style \`input[type="email"]\`
`;
    }

    if (lowerTitle === 'css how to') {
      return `# CSS How To

This topic is about the practical ways to add CSS to a project and how to keep it maintainable.

---

## 1) Add CSS to HTML

External stylesheet (recommended):

\`\`\`html
<link rel="stylesheet" href="/styles.css" />
\`\`\`

---

## 2) Where to put your CSS

Good patterns:
- one global \`styles.css\` for base rules
- component/page sections separated by comments
- use classes for styling hooks

Avoid:
- huge inline styles
- overly specific selectors (hard to override)

---

## 3) The “why isn’t it applying?” checklist

1) Is the stylesheet loaded? (Network tab)
2) Is the selector matching? (Elements → Styles)
3) Is it overridden by a more specific rule?
4) Is the property valid for this element?
5) Is there a typo? (property/value)

---

## 4) A tiny layout example

\`\`\`html
<header class="header">Header</header>
<main class="main">Content</main>
<footer class="footer">Footer</footer>
\`\`\`

\`\`\`css
body { margin: 0; }
.header, .footer { padding: 16px; background: #111827; color: #fff; }
.main { padding: 16px; }
\`\`\`

---

## 5) Practice

Build a 3-section page and make it look good using only padding, background colors, and typography.
`;
    }

    if (lowerTitle === 'css comments') {
      return `# CSS Comments

CSS comments help you organize styles and explain non-obvious decisions.

---

## 1) Syntax

\`\`\`css
/* single-line comment */

/*
  multi-line comment
  useful for sections
*/
\`\`\`

---

## 2) Practical organization

\`\`\`css
/* ========== Base ========== */
/* ========== Layout ========== */
/* ========== Components ========== */
/* ========== Utilities ========== */
\`\`\`

---

## 3) What to comment

- Why a workaround exists (browser bug)
- Why a specific value exists (design constraint)
- Sections for navigation

Avoid commenting obvious rules like \`color: red\`.

---

## 4) Practice

Take a CSS file and reorganize it into sections with clear comment headings.
`;
    }

    if (lowerTitle === 'css errors') {
      return `# CSS Errors

CSS “errors” usually mean: the browser ignored your rule, or another rule won.

---

## 1) Common causes

- typo in property/value (ignored)
- invalid value (ignored)
- selector doesn’t match anything
- overridden by another rule (specificity/order)
- conflicting layout constraints (Flex/Grid/position)

---

## 2) Debugging in DevTools

In the Elements panel:
- crossed-out declarations = overridden
- warning triangle = invalid property/value
- computed tab = final value after cascade

---

## 3) Specificity example

\`\`\`css
.btn { color: blue; }
button.btn { color: red; } /* more specific */
\`\`\`

---

## 4) Layout “errors”

Sometimes the CSS is valid but results surprise you:
- margin collapsing
- flex items shrinking (need \`min-width: 0\`)
- overflow causing scrollbars

---

## 5) Practice

Create a rule that is overridden on purpose and use DevTools to prove which rule wins.
`;
    }

    if (lowerTitle === 'css colors') {
      return `# CSS Colors

Colors can be expressed in several formats. Understanding them helps with theming, transparency, and accessibility.

---

## 1) Color formats

\`\`\`css
.a { color: #0f172a; }         /* hex */
.b { color: rgb(15 23 42); }    /* rgb */
.c { color: rgba(15, 23, 42, 0.7); } /* rgb + alpha */
.d { color: hsl(222 47% 11%); } /* hsl */
\`\`\`

---

## 2) Transparency

Prefer alpha colors when you want overlays:

\`\`\`css
.overlay { background: rgba(0, 0, 0, 0.6); }
\`\`\`

---

## 3) Theme with CSS variables

\`\`\`css
:root {
  --bg: #0b1020;
  --fg: #e5e7eb;
  --accent: #22c55e;
}

body { background: var(--bg); color: var(--fg); }
a { color: var(--accent); }
\`\`\`

---

## 4) Accessibility (contrast)

Text needs sufficient contrast against background. Test with Lighthouse or a contrast checker.

---

## 5) Practice

Create light/dark themes using CSS variables and toggle by adding a class on \`html\`.
`;
    }

    if (lowerTitle === 'css backgrounds') {
      return `# CSS Backgrounds

Backgrounds let you apply colors, images, gradients, and control sizing/positioning.

---

## 1) Background color

\`\`\`css
.card { background-color: #111827; }
\`\`\`

---

## 2) Background image + cover

\`\`\`css
.hero {
  background-image: url('/assets/hero.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
\`\`\`

---

## 3) Gradients

\`\`\`css
.badge {
  background: linear-gradient(90deg, #22c55e, #3b82f6);
  color: white;
}
\`\`\`

---

## 4) Multiple backgrounds

\`\`\`css
.panel {
  background:
    linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
    url('/assets/bg.jpg');
  background-size: cover;
}
\`\`\`

---

## 5) Practice

Build a hero section with a background image + dark overlay + centered text.
`;
    }

    if (lowerTitle === 'css borders') {
      return `# CSS Borders

Borders define outlines around elements and are commonly combined with radius and shadows.

---

## 1) Border shorthand

\`\`\`css
.card {
  border: 1px solid #e5e7eb;
}
\`\`\`

Per-side borders:

\`\`\`css
.divider { border-bottom: 1px solid #e5e7eb; }
\`\`\`

---

## 2) Rounded corners

\`\`\`css
.pill { border-radius: 999px; }
.soft { border-radius: 12px; }
\`\`\`

---

## 3) Border vs outline

- \`border\` affects layout size (unless border-box)
- \`outline\` does not take up space (great for focus rings)

\`\`\`css
button:focus-visible {
  outline: 2px solid dodgerblue;
  outline-offset: 2px;
}
\`\`\`

---

## 4) Practice

Style a button component with border, radius, hover, and focus-visible outline.
`;
    }

    if (lowerTitle === 'css margins') {
      return `# CSS Margins

Margins create **space outside** an element. They’re the primary tool for spacing between blocks.

---

## 1) Margin basics

\`\`\`css
.card { margin: 16px; }
.stack > * + * { margin-top: 12px; } /* consistent vertical rhythm */
\`\`\`

---

## 2) Shorthand forms

\`\`\`css
/* top right bottom left */
.box { margin: 8px 12px 16px 20px; }

/* vertical horizontal */
.box { margin: 12px 24px; }

/* top horizontal bottom */
.box { margin: 8px 16px 20px; }
\`\`\`

---

## 3) Auto margins (centering)

\`\`\`css
.container {
  width: min(100% - 32px, 960px);
  margin: 0 auto;
}
\`\`\`

---

## 4) Margin collapsing (vertical)

Vertical margins between block elements can **collapse** into one margin (the larger one).

If spacing feels “wrong”, check:
- adjacent block elements
- parent/first-child margins

Quick fix patterns:
- add padding/border to parent
- use Flex/Grid for layout
- use a “stack” pattern (\`.stack > * + *\`)

---

## 5) Practice

Create a blog layout where paragraphs have consistent spacing without adding margin to the first element.
`;
    }

    if (lowerTitle === 'css padding') {
      return `# CSS Padding

Padding creates **space inside** an element (between content and border). It increases click targets and improves readability.

---

## 1) Basics

\`\`\`css
.card { padding: 16px; }
.btn { padding: 10px 14px; }
\`\`\`

---

## 2) Shorthand

\`\`\`css
.box { padding: 8px 12px; }        /* vertical horizontal */
.box { padding: 8px 12px 16px; }   /* top horizontal bottom */
.box { padding: 8px 12px 16px 20px; } /* TRBL */
\`\`\`

---

## 3) Padding and box sizing

With \`box-sizing: border-box\`, padding is included in declared width.

\`\`\`css
*, *::before, *::after { box-sizing: border-box; }
.panel { width: 320px; padding: 16px; } /* stays 320px */
\`\`\`

---

## 4) Practice

Make a button that feels “touch-friendly” (min 44px height) using padding and line-height.
`;
    }

    if (lowerTitle === 'css height/width') {
      return `# CSS Height/Width

Width/height control element sizing, but layout rules (block vs inline, flex/grid, content) matter.

---

## 1) Width basics

\`\`\`css
.card { width: 320px; }
.card { max-width: 100%; }
\`\`\`

Responsive container pattern:

\`\`\`css
.container {
  width: min(100% - 32px, 960px);
  margin: 0 auto;
}
\`\`\`

---

## 2) Height pitfalls

\`height: 100%\` works only if the parent has an explicit height.

Use viewport units when appropriate:

\`\`\`css
.page { min-height: 100vh; }
\`\`\`

---

## 3) Min/max constraints

\`\`\`css
.sidebar { width: clamp(220px, 25vw, 320px); }
\`\`\`

---

## 4) Practice

Create a centered container with max width and a sticky footer layout using \`min-height: 100vh\`.
`;
    }

    if (lowerTitle === 'css outline') {
      return `# CSS Outline

Outline is like a border, but it **doesn’t take up space**. It’s ideal for focus rings.

---

## 1) Focus-visible outline (recommended)

\`\`\`css
button:focus-visible {
  outline: 2px solid dodgerblue;
  outline-offset: 2px;
}
\`\`\`

---

## 2) Outline vs border

- border affects element size (unless border-box)
- outline does not affect layout
- outline can’t be applied per-side like border

---

## 3) Accessibility note

Never remove focus styles without replacing them.

---

## 4) Practice

Add a consistent focus-visible style across links, buttons, and inputs.
`;
    }

    if (lowerTitle === 'css text') {
      return `# CSS Text

Text styling covers readability, spacing, and alignment.

---

## 1) Core properties

\`\`\`css
.content {
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: 0.2px;
  word-break: break-word;
}
\`\`\`

---

## 2) Alignment and decoration

\`\`\`css
h1 { text-align: center; }
a { text-decoration: underline; text-underline-offset: 2px; }
\`\`\`

---

## 3) Truncation (single line)

\`\`\`css
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
\`\`\`

---

## 4) Multi-line clamp (modern)

\`\`\`css
.clamp2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
\`\`\`

---

## 5) Practice

Create a card title that truncates cleanly on one line and a description that clamps to 2 lines.
`;
    }

    if (lowerTitle === 'css fonts') {
      return `# CSS Fonts

Font styling impacts clarity, brand, and accessibility.

---

## 1) Font family and fallbacks

\`\`\`css
body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}
\`\`\`

---

## 2) Weight, style, size

\`\`\`css
h1 { font-size: 2rem; font-weight: 700; }
em { font-style: italic; }
small { font-size: 0.875rem; }
\`\`\`

---

## 3) Web fonts (concept)

Use \`@font-face\` or a provider; prefer:
- limited weights
- modern formats (woff2)
- \`font-display: swap\`

---

## 4) Practice

Create a typography scale using \`rem\` and apply it to headings and paragraphs.
`;
    }

    if (lowerTitle === 'css icons') {
      return `# CSS Icons

Icons are everywhere (buttons, nav, status). The best icon approach is the one that’s:
- crisp on all screens
- easy to color and size
- accessible

---

## 1) Icon delivery options (when to use what)

1) **Inline SVG (recommended)**
- best control (fill/stroke)
- easiest to theme with \`currentColor\`
- scales perfectly

2) **SVG sprite**
- good for many icons with reuse
- typically used with \`<use>\`

3) **Icon fonts**
- legacy approach; can have rendering issues and accessibility pitfalls

4) **Background images**
- ok for decorative icons only (not great for semantics)

---

## 2) Inline SVG: size + color correctly

\`\`\`html
<button class="btn">
  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
    ...
  </svg>
  <span>Search</span>
</button>
\`\`\`

\`\`\`css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.icon {
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
  fill: currentColor;
}
\`\`\`

Using \`1em\` keeps the icon aligned with text sizing.

---

## 3) Stroke-based icons

If your SVG uses strokes:

\`\`\`css
.icon-stroke {
  width: 1em;
  height: 1em;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
}
\`\`\`

---

## 4) Accessibility

- Decorative icon: \`aria-hidden="true"\`
- Meaningful icon: give it an accessible name (often better to put accessible text in the button and keep icon hidden)
- Don’t rely on color alone to communicate status; add text or shape.

---

## 5) Practice

Create:
1) an icon button (only icon) that still has a text label for screen readers (e.g., visually hidden text)
2) a button with icon + text aligned nicely across different font sizes.
`;
    }

    if (lowerTitle === 'css links') {
      return `# CSS Links

Links should look like links. Good link styling improves usability, trust, and accessibility.

---

## 1) Link states (minimum set)

\`\`\`css
a {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 3px;
}

a:visited { color: #7c3aed; }

@media (hover: hover) and (pointer: fine) {
  a:hover { text-decoration-thickness: 2px; }
}

a:focus-visible {
  outline: 3px solid rgba(59,130,246,0.6);
  outline-offset: 2px;
}
\`\`\`

Why keep underlines? Color alone is not enough for many users.

---

## 2) “Button-like” links (when it’s navigation)

Use a link styled as a button when it navigates.

\`\`\`css
.linkButton {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.12);
  text-decoration: none;
}

.linkButton:focus-visible {
  outline: 3px solid rgba(59,130,246,0.6);
  outline-offset: 2px;
}
\`\`\`

---

## 3) Active link styling

Use a class (or \`aria-current="page"\`) to mark the current location:

\`\`\`css
a[aria-current="page"] {
  font-weight: 700;
  text-decoration-thickness: 2px;
}
\`\`\`

---

## 4) Accessibility & UX notes

- Avoid removing link styling inside paragraphs.
- Ensure focus is visible.
- Don’t make the visited color too close to normal text.

---

## 5) Practice

Style a navbar where:
- current page is obvious
- hover effects only apply on hover-capable devices
- focus-visible is clearly visible.
`;
    }

    if (lowerTitle === 'css lists') {
      return `# CSS Lists

Lists are foundational: nav menus, checklists, steps, and document outlines. Good list styling keeps semantics intact while improving readability.

---

## 1) Reset list styles (for navigation)

\`\`\`css
.nav {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 12px;
}
\`\`\`

Keep the HTML as \`<ul>\` for semantics.

---

## 2) Control marker placement

\`\`\`css
ul {
  list-style-position: outside; /* default */
}
\`\`\`

\`inside\` can align markers with wrapped text, but can look odd in some layouts.

---

## 3) Custom markers (prefer ::marker)

\`\`\`css
.checklist {
  padding-left: 1.2rem;
}

.checklist li::marker {
  content: "✓ ";
}
\`\`\`

If you need complex decoration (colored dots), you can use \`::before\`, but \`::marker\` is cleaner when it works.

---

## 4) Nested lists

\`\`\`css
ol { padding-left: 1.4rem; }
ol ol { margin-top: 8px; }
\`\`\`

---

## 5) Practice

Create:
1) a sidebar menu list with hover + focus-visible styles
2) a step-by-step ordered list with nested steps using \`::marker\`.
`;
    }

    if (lowerTitle === 'css tables') {
      return `# CSS Tables

Tables are great for **tabular data** (not layout). Styling tables is about readability and accessibility.

---

## 1) Start with semantic HTML

Use:
- \`<caption>\` for table title
- \`<th scope="col">\` for column headers
- \`<th scope="row">\` for row headers when relevant

---

## 2) Clean, readable table base

\`\`\`css
.tableWrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; /* encourages scroll on small screens */
}

caption {
  text-align: left;
  font-weight: 700;
  padding: 8px 0;
}

th, td {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(0,0,0,0.12);
  text-align: left;
  vertical-align: top;
}

thead th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

tbody tr:nth-child(2n) {
  background: rgba(0,0,0,0.02);
}
\`\`\`

Sticky headers are extremely useful for long tables.

---

## 3) Column sizing: table-layout

\`\`\`css
table.fixed {
  table-layout: fixed;
}

td.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
\`\`\`

---

## 4) Responsive strategies

1) **Horizontal scroll** (most robust)
2) **Hide less important columns** at small widths
3) **Convert to cards** (requires more markup)

---

## 5) Practice

Build a comparison table with:
- caption
- sticky header
- zebra rows
- horizontal scroll on mobile
and verify keyboard focus styles are visible.
`;
    }

    if (lowerTitle === 'css display') {
      return `# CSS Display

The \`display\` property controls an element’s **layout behavior**: whether it’s block-level, inline, or participates in a layout system like Flexbox/Grid.

---

## 1) Common values

- \`block\`: takes full width, starts new line (div, p)
- \`inline\`: flows within text, width/height don’t apply (span)
- \`inline-block\`: inline flow but can size (buttons/images)
- \`flex\`: flex container
- \`grid\`: grid container
- \`none\`: removed from layout (not visible)

---

## 2) Quick examples

\`\`\`css
.hidden { display: none; }
.row { display: flex; gap: 12px; align-items: center; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
\`\`\`

---

## 3) display:none vs visibility:hidden

- \`display: none\`: removed from layout, not focusable
- \`visibility: hidden\`: takes space but invisible

---

## 4) Practice

Build a responsive card grid using \`display: grid\` and switch to 1 column on small screens.
`;
    }

    if (lowerTitle === 'css max-width') {
      return `# CSS Max-width

\`max-width\` prevents elements from becoming too wide (readability + responsive layout).

---

## 1) Classic responsive image

\`\`\`css
img { max-width: 100%; height: auto; }
\`\`\`

---

## 2) Container pattern

\`\`\`css
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
}
\`\`\`

Modern shorthand alternative:

\`\`\`css
.container {
  width: min(100% - 32px, 960px);
  margin: 0 auto;
}
\`\`\`

---

## 3) Practice

Create a readable article layout with max width and comfortable line length.
`;
    }

    if (lowerTitle === 'css position') {
      return `# CSS Position

\`position\` controls how an element is placed relative to normal flow.

---

## 1) Values

- \`static\` (default): normal flow
- \`relative\`: keeps its space, can offset itself
- \`absolute\`: removed from flow, positioned relative to nearest positioned ancestor
- \`fixed\`: relative to viewport
- \`sticky\`: behaves like relative until it “sticks” at a threshold

---

## 2) Relative + absolute pattern (badge)

\`\`\`css
.card { position: relative; }
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
}
\`\`\`

---

## 3) Sticky header

\`\`\`css
.header {
  position: sticky;
  top: 0;
  background: white;
}
\`\`\`

---

## 4) Practice

Build a card with an absolute-positioned “New” badge and a sticky sidebar.
`;
    }

    if (lowerTitle === 'css z-index') {
      return `# CSS Z-index

\`z-index\` controls stacking order **only on positioned elements** (and some stacking contexts).

---

## 1) The basic rule

\`z-index\` works when the element has:
- \`position: relative/absolute/fixed/sticky\` (or forms a stacking context)

\`\`\`css
.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
}
\`\`\`

---

## 2) Stacking contexts (common gotcha)

Some properties create a new stacking context, e.g.:
- \`transform\`
- \`opacity < 1\`
- \`position\` + \`z-index\`

So a child’s huge \`z-index\` can’t escape its parent stacking context.

---

## 3) Practical approach

- Keep a small, documented z-index scale (10, 20, 30…)
- Avoid random huge numbers everywhere

---

## 4) Practice

Create a dropdown that appears above content but below a modal overlay.
`;
    }

    if (lowerTitle === 'css overflow') {
      return `# CSS Overflow

\`overflow\` controls what happens when content doesn’t fit its box.

---

## 1) Values

- \`visible\` (default): spills out
- \`hidden\`: clipped
- \`scroll\`: always shows scrollbars
- \`auto\`: scrollbars only when needed

---

## 2) Horizontal scroll for tables

\`\`\`css
.tableWrap { overflow-x: auto; }
\`\`\`

---

## 3) Text overflow

\`\`\`css
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
\`\`\`

---

## 4) Practice

Build a code block container that scrolls horizontally without breaking the page layout.
`;
    }

    if (lowerTitle === 'css float') {
      return `# CSS Float

\`float\` is a legacy layout technique, historically used for wrapping text around images and building column layouts before Flex/Grid.

Today:
- Use Float for text wrapping.
- Use Flex/Grid for layout.

---

## 1) Text wrap example

\`\`\`css
.avatar {
  float: left;
  margin: 0 12px 12px 0;
  width: 80px;
  height: 80px;
}
\`\`\`

---

## 2) Clearing floats

Floats can cause parent height collapse.

\`\`\`css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
\`\`\`

---

## 3) Practice

Wrap text around an image using float and ensure layout doesn’t break.
`;
    }

    if (lowerTitle === 'css inline-block') {
      return `# CSS Inline-block

\`inline-block\` flows inline like text, but you can set width/height/padding like a block.

---

## 1) Common use

\`\`\`css
.tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
}
\`\`\`

---

## 2) Gotcha: whitespace gaps

Inline-block elements respect whitespace/newlines in HTML, which can create small gaps.

If you need precise layouts, prefer Flex/Grid.

---

## 3) Practice

Create pill tags using inline-block, then rebuild the same UI using Flexbox.
`;
    }

    if (lowerTitle === 'css align') {
      return `# CSS Align

“Align” in CSS depends on the layout system you’re using.

---

## 1) Text alignment

\`\`\`css
h1 { text-align: center; }
\`\`\`

---

## 2) Block centering

\`\`\`css
.box { width: 320px; margin: 0 auto; }
\`\`\`

---

## 3) Flex alignment

\`\`\`css
.row {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

---

## 4) Grid alignment

\`\`\`css
.grid {
  display: grid;
  place-items: center; /* align-items + justify-items */
}
\`\`\`

---

## 5) Practice

Center a login card vertically and horizontally using Flex or Grid (no magic numbers).
`;
    }

    if (lowerTitle === 'css combinators') {
      return `# CSS Combinators

Combinators describe relationships between elements in selectors.

---

## 1) Descendant (space)

\`\`\`css
.card p { color: #334155; }
\`\`\`

Targets any \`p\` inside \`.card\`.

---

## 2) Child (>)

\`\`\`css
.menu > li { padding: 8px; }
\`\`\`

Targets only direct children.

---

## 3) Adjacent sibling (+)

\`\`\`css
h2 + p { margin-top: 0; }
\`\`\`

Targets the first \`p\` immediately after \`h2\`.

---

## 4) General sibling (~)

\`\`\`css
h2 ~ p { color: #64748b; }
\`\`\`

Targets all \`p\` siblings after \`h2\`.

---

## 5) Practice

Style only the first paragraph after each heading using \`+\`.
`;
    }

    if (lowerTitle === 'css pseudo-classes') {
      return `# CSS Pseudo-classes

Pseudo-classes style elements based on **state** or position, without extra classes in HTML.

---

## 1) Interaction states

\`\`\`css
button:hover { filter: brightness(1.05); }
button:active { transform: translateY(1px); }
button:focus-visible { outline: 2px solid dodgerblue; outline-offset: 2px; }
\`\`\`

---

## 2) Form states

\`\`\`css
input:disabled { opacity: 0.6; }
input:required { border-color: #f59e0b; }
input:valid { border-color: #22c55e; }
input:invalid { border-color: #ef4444; }
\`\`\`

---

## 3) Structural pseudo-classes

\`\`\`css
li:first-child { font-weight: 600; }
li:last-child { opacity: 0.8; }
tr:nth-child(2n) { background: rgba(0,0,0,0.02); }
\`\`\`

---

## 4) Practice

Add hover/focus-visible states to a navbar and use \`nth-child\` to zebra-stripe a table.
`;
    }

    if (lowerTitle === 'css pseudo-elements') {
      return `# CSS Pseudo-elements

Pseudo-elements style **part of an element** or generate extra “virtual” content, without adding extra HTML.

---

## 1) Common pseudo-elements

- \`::before\` / \`::after\`
- \`::first-letter\`
- \`::first-line\`
- \`::selection\`
- \`::marker\` (list bullets)

---

## 2) The \`::before\` / \`::after\` pattern

You must set \`content\`.

\`\`\`css
.tag::before {
  content: '#';
  opacity: 0.7;
  margin-right: 4px;
}
\`\`\`

---

## 3) Decorative underline

\`\`\`css
.fancy {
  position: relative;
  display: inline-block;
}

.fancy::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 2px;
  background: currentColor;
  opacity: 0.3;
}
\`\`\`

---

## 4) Practice

Add a small icon before external links using \`a[href^="https://"]::after\` and keep it accessible (don’t replace meaningful text).
`;
    }

    if (lowerTitle === 'css opacity') {
      return `# CSS Opacity

\`opacity\` sets transparency for an element **and all its children**.

---

## 1) Basic usage

\`\`\`css
.muted { opacity: 0.6; }
\`\`\`

---

## 2) Common gotcha (children inherit)

If you set opacity on a parent, the text/icons inside also become transparent.

If you only want a translucent background, use an alpha color instead:

\`\`\`css
.panel { background: rgba(0, 0, 0, 0.08); }
\`\`\`

---

## 3) Opacity can create stacking contexts

\`opacity < 1\` can create a stacking context, affecting \`z-index\` behavior.

---

## 4) Practice

Build a disabled button style using opacity, then improve it using color + cursor + not-allowed for better clarity.
`;
    }

    if (lowerTitle === 'css navigation bars') {
      return `# CSS Navigation Bars

Navbars are a navigation system: they must communicate structure, current location, and be easy to use with keyboard/touch.

---

## 1) Semantic HTML (recommended)

\`\`\`html
<nav class="navbar" aria-label="Primary">
  <a class="brand" href="/">PrepWise</a>
  <ul class="nav">
    <li><a class="nav__link" aria-current="page" href="/">Home</a></li>
    <li><a class="nav__link" href="/learn">Learn</a></li>
    <li><a class="nav__link" href="/dashboard">Dashboard</a></li>
  </ul>
</nav>
\`\`\`

---

## 2) Layout with Flexbox

\`\`\`css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.nav {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.nav__link {
  display: inline-block;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
}

.nav__link[aria-current="page"] {
  font-weight: 700;
  background: rgba(0, 0, 0, 0.06);
}

.nav__link:focus-visible {
  outline: 3px solid rgba(59,130,246,0.6);
  outline-offset: 2px;
}

@media (hover: hover) and (pointer: fine) {
  .nav__link:hover { background: rgba(0, 0, 0, 0.06); }
}
\`\`\`

---

## 3) UX + a11y checklist

- Use \`aria-current="page"\` for the active page.
- Don’t remove focus rings; customize them.
- If you add dropdowns, avoid hover-only activation.

---

## 4) Practice

Build a navbar that:
- wraps cleanly on small screens
- has a strong focus-visible style
- clearly indicates the active route.
`;
    }

    if (lowerTitle === 'css dropdowns') {
      return `# CSS Dropdowns

Dropdowns are deceptively hard: you must support keyboard navigation and avoid hover-only behavior.

---

## 1) Best CSS-only option: \`<details>\` + \`<summary>\`

\`\`\`html
<details class="dropdown">
  <summary class="dropdown__btn">Menu</summary>
  <div class="dropdown__menu" role="menu">
    <a href="/profile" role="menuitem">Profile</a>
    <a href="/settings" role="menuitem">Settings</a>
  </div>
</details>
\`\`\`

---

## 2) Positioning + interaction styles

\`\`\`css
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown__btn {
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 10px;
  list-style: none;
}

.dropdown__btn:focus-visible {
  outline: 3px solid rgba(59,130,246,0.6);
  outline-offset: 2px;
}

.dropdown__menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  padding: 8px;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 12px;
  background: white;
}

.dropdown__menu a {
  display: block;
  padding: 8px 10px;
  border-radius: 10px;
  text-decoration: none;
}

.dropdown__menu a:focus-visible {
  outline: 3px solid rgba(59,130,246,0.6);
  outline-offset: 2px;
}

@media (hover: hover) and (pointer: fine) {
  .dropdown__menu a:hover { background: rgba(0, 0, 0, 0.06); }
}
\`\`\`

---

## 3) Reduced motion

If you animate the menu, respect \`prefers-reduced-motion\`.

---

## 4) Practice

Create a dropdown that:
- opens/closes via keyboard
- has a visible focus ring
- doesn’t rely on hover-only interaction.
`;
    }

    if (lowerTitle === 'css pagination') {
      return `# CSS Pagination

Pagination is a navigation pattern. A good pagination UI:
- indicates current page
- supports keyboard navigation
- handles disabled prev/next states

---

## 1) Semantic HTML

\`\`\`html
<nav class="pagination" aria-label="Pagination">
  <ul>
    <li><a class="page" aria-disabled="true" href="#">Prev</a></li>
    <li><a class="page" aria-current="page" href="#">1</a></li>
    <li><a class="page" href="#">2</a></li>
    <li><a class="page" href="#">3</a></li>
    <li><a class="page" href="#">Next</a></li>
  </ul>
</nav>
\`\`\`

---

## 2) Styling: pill buttons + focus-visible

\`\`\`css
.pagination ul {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.page {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.12);
  text-decoration: none;
}

.page[aria-current="page"] {
  font-weight: 700;
  background: rgba(0,0,0,0.06);
}

.page:focus-visible {
  outline: 3px solid rgba(59,130,246,0.6);
  outline-offset: 2px;
}

.page[aria-disabled="true"] {
  opacity: 0.5;
  pointer-events: none;
}
\`\`\`

---

## 3) Practice

Build pagination for 20 pages:
- show current page
- disable Prev on page 1
- keep it usable on narrow screens.
`;
    }

    if (lowerTitle === 'css image gallery') {
      return `# CSS Image Gallery

Galleries are a great fit for CSS Grid. The key challenges are responsiveness and keeping tiles consistent when images have mixed aspect ratios.

---

## 1) Responsive grid (auto-fit + minmax)

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.galleryItem {
  border-radius: 12px;
  overflow: hidden;
}

.galleryItem img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
\`\`\`

---

## 2) Hover/focus behavior (don’t forget keyboard)

\`\`\`css
.galleryItem {
  position: relative;
}

.galleryItem .caption {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: end;
  padding: 10px;
  color: white;
  background: linear-gradient(to top, rgba(0,0,0,0.55), transparent);
  opacity: 0;
}

@media (hover: hover) and (pointer: fine) {
  .galleryItem:hover .caption { opacity: 1; }
}

.galleryItem:focus-within .caption {
  opacity: 1;
}
\`\`\`

---

## 3) Practice

Build a gallery where each tile:
- stays the same size using \`aspect-ratio\`
- reveals a caption on hover and focus
- remains readable at 200% zoom.
`;
    }

    if (lowerTitle === 'css image sprites') {
      return `# CSS Image Sprites

Sprites combine multiple icons/images into one file to reduce requests.

With modern HTTP/2 and SVG, sprites are less common, but you’ll still see them in older projects and some performance-sensitive UIs.

---

## 1) How sprites work

One sprite image contains many icons. You show one icon by setting:
- \`background-image\`
- \`background-position\`
- element \`width\`/\`height\`

---

## 2) Example mapping

\`\`\`css
.icon {
  width: 24px;
  height: 24px;
  display: inline-block;
  background-image: url('/assets/sprite.png');
  background-repeat: no-repeat;
}

.icon--search { background-position: 0 0; }
.icon--user { background-position: -24px 0; }
.icon--settings { background-position: -48px 0; }
\`\`\`

---

## 3) Retina / 2x sprites

If the source image is 2x (each tile is 48px inside the file but displayed at 24px), you’ll typically scale the background:

\`\`\`css
.icon {
  background-size: 72px 24px; /* total sprite size at 1x display */
}
\`\`\`

---

## 4) Practice

Create a sprite with 6 icons and:
- map each icon to a class
- place icons inside buttons aligned with text
- ensure the UI still makes sense if the icon fails to load.
`;
    }

    if (lowerTitle === 'css attr selectors') {
      return `# CSS Attr Selectors

Attribute selectors target elements by attributes, reducing the need for extra classes.

---

## 1) Common patterns

\`\`\`css
input[type="email"] { border-color: #22c55e; }
a[href^="https://"] { text-decoration: underline; }
a[href$=".pdf"] { font-weight: 600; }
button[disabled] { opacity: 0.6; cursor: not-allowed; }
\`\`\`

---

## 2) Data attributes

\`\`\`css
[data-state="open"] { border-color: dodgerblue; }
\`\`\`

---

## 3) Practice

Style all required inputs with \`[required]\` and invalid ones with \`:invalid\`.
`;
    }

    if (lowerTitle === 'css forms') {
      return `# CSS Forms

Form styling is about readability, spacing, and clear states (focus, error, disabled).

---

## 1) Base input styles

\`\`\`css
input, select, textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font: inherit;
}

input:focus-visible, select:focus-visible, textarea:focus-visible {
  outline: 2px solid dodgerblue;
  outline-offset: 2px;
}
\`\`\`

---

## 2) Error states

\`\`\`css
input:invalid { border-color: #ef4444; }
input:valid { border-color: #22c55e; }
\`\`\`

---

## 3) Layout (label + input)

\`\`\`css
.field { display: grid; gap: 6px; }
.form { display: grid; gap: 12px; }
\`\`\`

---

## 4) Practice

Build a login form with clear focus-visible and invalid styles.
`;
    }

    if (lowerTitle === 'css counters') {
      return `# CSS Counters

CSS counters let you generate automatic numbering for headings, lists, or steps.

---

## 1) Basic counter example (steps)

\`\`\`css
.steps {
  counter-reset: step;
  list-style: none;
  padding-left: 0;
}

.steps li {
  counter-increment: step;
  margin: 8px 0;
}

.steps li::before {
  content: counter(step) '. ';
  font-weight: 600;
}
\`\`\`

---

## 2) Practice

Auto-number sections in a documentation page using counters.
`;
    }

    if (lowerTitle === 'css units') {
      return `# CSS Units

Units control sizing and responsiveness. The most important are \`px\`, \`%\`, \`rem\`, \`em\`, and viewport units.

---

## 1) Recommended defaults

- typography: \`rem\`
- component spacing: \`rem\` (or \`em\` for local scaling)
- layout widths: \`%\`, \`vw\`, \`clamp()\`, \`min()\`, \`max()\`

---

## 2) rem vs em

- \`rem\`: based on root font size (stable)
- \`em\`: based on current element (can compound)

---

## 3) Viewport units

\`\`\`css
.full { min-height: 100vh; }
\`\`\`

---

## 4) Fluid sizing with clamp

\`\`\`css
h1 { font-size: clamp(1.5rem, 2vw + 1rem, 3rem); }
\`\`\`

---

## 5) Practice

Convert a design system’s spacing scale from px to rem and verify it scales by changing root font size.
`;
    }

    if (lowerTitle === 'css inheritance') {
      return `# CSS Inheritance

Inheritance decides which properties flow from parent to child.

---

## 1) Common inherited properties

Usually inherited:
- \`color\`
- \`font-family\`, \`font-size\`, \`line-height\`
- \`text-align\`

Usually NOT inherited:
- \`margin\`, \`padding\`, \`border\`, \`background\`
- \`width\`, \`height\`

---

## 2) The \`inherit\` keyword

You can force inheritance:

\`\`\`css
button {
  font: inherit;
  color: inherit;
}
\`\`\`

This is useful because buttons often have default browser styles.

---

## 3) The \`initial\` and \`unset\` keywords

- \`initial\`: reset to spec default
- \`unset\`: if property inherits → behave like inherit, else → initial

---

## 4) Practice

Build a component where text color is set on a parent and children inherit it. Then override one child using \`color\`.
`;
    }

    if (lowerTitle === 'css specificity') {
      return `# CSS Specificity

Specificity decides which selector wins when multiple rules target the same element.

---

## 1) Specificity order (high → low)

1) inline styles (avoid)
2) IDs (\`#id\`)
3) classes/attributes/pseudo-classes (\`.x\`, \`[a]\`, \`:hover\`)
4) elements/pseudo-elements (\`div\`, \`::before\`)

---

## 2) Example

\`\`\`css
button { color: blue; }
.btn { color: green; }
#save { color: red; }
\`\`\`

If an element matches all three, it becomes red.

---

## 3) Practical rules

- Prefer class-based styling.
- Avoid IDs for styling (hard to override).
- Avoid deep selectors like \`.page .header .nav .item a\`.
- Use utilities or component classes instead.

---

## 4) Debugging specificity

DevTools shows crossed-out rules. That’s your first hint it lost.

---

## 5) Practice

Create two conflicting rules and use DevTools to prove which one wins and why.
`;
    }

    if (lowerTitle === 'css !important') {
      return `# CSS !important

\`!important\` forces a declaration to win in the cascade, but it makes CSS harder to maintain.

---

## 1) How it works

\`\`\`css
.btn { color: blue !important; }
\`\`\`

Now most other color declarations won’t override it, even if they are more specific.

---

## 2) When it’s acceptable

- tiny “utility” overrides in a controlled system
- overriding third-party CSS you cannot change
- debugging temporarily

---

## 3) Better alternatives

- fix selector strategy (component classes)
- reorder stylesheets
- reduce specificity

---

## 4) Practice

Create a style conflict and resolve it without using \`!important\` (prefer ordering or better selectors).
`;
    }

    if (lowerTitle === 'css math functions') {
      return `# CSS Math Functions

CSS has math functions to build fluid, responsive UI without lots of media queries.

---

## 1) calc()

\`\`\`css
.sidebar { width: calc(100% - 280px); }
\`\`\`

---

## 2) min() and max()

\`\`\`css
.container { width: min(100% - 32px, 960px); }
.card { padding: max(12px, 2vw); }
\`\`\`

---

## 3) clamp()

\`\`\`css
h1 { font-size: clamp(1.5rem, 2vw + 1rem, 3rem); }
\`\`\`

Great for fluid typography.

---

## 4) Practice

Implement a responsive container width using \`min()\` and fluid heading sizes using \`clamp()\`.
`;
    }

    if (lowerTitle === 'css optimization') {
      return `# CSS Optimization

CSS performance is mostly about reducing unnecessary work for the browser and keeping styles maintainable.

---

## 1) Common performance issues

- huge CSS bundles (unused styles)
- expensive selectors in massive DOMs
- heavy animations on layout properties

---

## 2) Prefer transform/opacity for animation

Animating layout properties can cause reflow:
- \`width\`, \`height\`, \`top\`, \`left\`

Prefer:
- \`transform\`
- \`opacity\`

\`\`\`css
.toast {
  transform: translateY(0);
  transition: transform 200ms ease, opacity 200ms ease;
}
\`\`\`

---

## 3) Keep selectors simple

Prefer \`.component\` over deeply nested selectors.

---

## 4) Reduce unused CSS

- remove dead rules
- use a utility approach consistently
- in production, ensure your build removes unused CSS (where applicable)

---

## 5) Practice

Pick one page and remove unused selectors; then verify nothing breaks.
`;
    }

    if (lowerTitle === 'css accessibility') {
      return `# CSS Accessibility

Accessible CSS ensures text is readable, focus is visible, and interactions work for keyboard users.

---

## 1) Focus visibility

Never remove focus outlines without replacement:

\`\`\`css
:focus-visible {
  outline: 2px solid dodgerblue;
  outline-offset: 2px;
}
\`\`\`

---

## 2) Color contrast

Ensure sufficient contrast for text and important UI elements. Check with Lighthouse.

---

## 3) Don’t rely only on color

Error state should have more than red border — add text, icons, or patterns.

---

## 4) Motion preferences

Respect reduced motion:

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
\`\`\`

---

## 5) Practice

Run Lighthouse a11y audit and fix: focus indicator issues + contrast issues.
`;
    }

    if (lowerTitle === 'css website layout') {
      return `# CSS Website Layout

Modern layouts use **Grid for the page structure** and **Flexbox for components**.

---

## 1) Page skeleton with CSS Grid

\`\`\`css
.page {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.main {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
  padding: 16px;
}

.content {
  min-width: 0; /* prevents horizontal overflow */
}

@media (max-width: 768px) {
  .main { grid-template-columns: 1fr; }
  .sidebar { display: none; }
}
\`\`\`

Notes:
- \`100dvh\` avoids some mobile browser viewport quirks.
- \`min-width: 0\` is a common fix when content (code blocks, long words) overflows.

---

## 2) Sticky footer pattern

\`grid-template-rows: auto 1fr auto\` keeps the footer at the bottom even when content is short.

---

## 3) Common layout pitfalls

- Avoid using tables for layout.
- Don’t hardcode heights for content areas; prefer flex/grid.
- Use a container (max-width + padding) for readability on wide screens.

---

## 4) Practice

Build a dashboard layout with:
- sidebar + main content
- sticky footer
- responsive collapse on mobile
- no horizontal overflow at 200% zoom.
`;
    }

    if (lowerTitle === 'css rounded corners') {
      return `# CSS Rounded Corners

Rounded corners are controlled by \`border-radius\`.

---

## 1) Common patterns

\`\`\`css
.card { border-radius: 12px; }
.pill { border-radius: 999px; }
.avatar { border-radius: 50%; }
\`\`\`

---

## 2) Per-corner radius

\`\`\`css
.ticket { border-radius: 16px 16px 6px 6px; }
\`\`\`

---

## 3) Practice

Create a card component with consistent rounding across images and containers.
`;
    }

    if (lowerTitle === 'css border images') {
      return `# CSS Border Images

\`border-image\` lets you use an image (or gradient) as the border.

It’s not used every day, but it’s useful for decorative borders.

---

## 1) Concept

You define:
- border thickness (\`border\`)
- the image/gradient
- how to slice and stretch/repeat it

---

## 2) Example

\`\`\`css
.frame {
  border: 8px solid transparent;
  border-image: linear-gradient(90deg, #22c55e, #3b82f6) 1;
  border-radius: 12px;
}
\`\`\`

---

## 3) Practice

Create a gradient border card using \`border-image\` and compare it to the more common background-clip technique.
`;
    }

    if (lowerTitle === 'css backgrounds advanced') {
      return `# CSS Backgrounds Advanced

Advanced background techniques include multiple layers, patterns, attachment, and blending.

---

## 1) Multiple backgrounds (overlay + image)

\`\`\`css
.hero {
  background:
    linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
    url('/assets/hero.jpg');
  background-size: cover;
  background-position: center;
}
\`\`\`

---

## 2) Background attachment

\`\`\`css
.parallaxLike {
  background-attachment: fixed;
}
\`\`\`

Note: \`fixed\` can be inconsistent on mobile.

---

## 3) Background blend modes

\`\`\`css
.blend {
  background-image: url('/assets/texture.png');
  background-color: #3b82f6;
  background-blend-mode: multiply;
}
\`\`\`

---

## 4) Practice

Build a hero with an overlay gradient and test readability (contrast) across different images.
`;
    }
    if (lowerTitle.includes('syntax')) {
      return `# ${title}

CSS syntax consists of selectors, properties, and values organized into rule sets. A rule set begins with a selector identifying which HTML elements to style, followed by curly braces containing property-value pairs called declarations. Each declaration ends with a semicolon, and the last semicolon is optional but recommended.

Selectors can be simple element names, classes, IDs, attributes, or complex combinations. Element selectors like p target all paragraph elements, class selectors like .button target elements with class="button", and ID selectors like #header target the element with id="header". Understanding selector syntax is fundamental to applying styles effectively.

Property-value pairs define specific styles. Properties describe what to change (color, font-size, margin), and values specify how to change it (blue, 16px, 10px). Some properties accept multiple values, like margins that can be specified for each side. Values can be keywords, numbers, percentages, or colors in various formats.

Comments in CSS use /* comment syntax */ and can span multiple lines. Comments help explain complex selectors, document browser-specific hacks, or organize large stylesheets. Well-commented CSS improves maintainability, especially when working in teams or returning to code after time away.`;
    }
    if (lowerTitle === 'css selectors') {
      return `# CSS Selectors

Selectors decide **what** gets styled. Mastering selectors reduces HTML clutter and prevents “why is this rule not applying?” frustration.

---

## 1) Core selectors

\`\`\`css
p { line-height: 1.6; }
.card { padding: 16px; }
#app { min-height: 100vh; }
\`\`\`

Rule of thumb: prefer **classes** over IDs for styling.

---

## 2) Relationship selectors

\`\`\`css
.container p { color: slategray; }      /* descendant */
.container > p { color: red; }         /* child */
h2 + p { margin-top: 0; }              /* adjacent sibling */
h2 ~ p { color: #94a3b8; }             /* general sibling */
\`\`\`

---

## 3) Attribute selectors

\`\`\`css
input[type="email"] { border-color: green; }
a[href^="https://"] { text-decoration: underline; }
a[href$=".pdf"] { font-weight: 600; }
\`\`\`

---

## 4) Pseudo-classes

\`\`\`css
button:hover { filter: brightness(1.05); }
button:focus-visible { outline: 2px solid dodgerblue; }
li:nth-child(2n) { background: rgba(255,255,255,0.05); }
\`\`\`

---

## 5) Practice

1. Style only direct \`li\` children of a menu.
2. Underline only external links.
3. Zebra-strip a table using \`nth-child\`.
`;
    }

    if (lowerTitle === 'css selectors reference') {
      return `# CSS Selectors Reference

This is a practical selector cheat sheet: you use it when you remember *what you want* but not the exact selector.

---

## 1) Everyday selectors

\`\`\`css
/* element */
p { line-height: 1.6; }

/* class */
.btn { padding: 10px 14px; }

/* attribute */
input[type="email"] { border-color: green; }
\`\`\`

Rule of thumb: prefer **classes** for styling hooks.

---

## 2) Combinators (relationships)

\`\`\`css
.nav a { text-decoration: none; }  /* descendant */
.nav > a { padding: 8px 12px; }   /* child */
h2 + p { margin-top: 0; }         /* adjacent sibling */
h2 ~ p { color: #374151; }        /* general sibling */
\`\`\`

---

## 3) Attribute selector operators

\`\`\`css
/* exact */
input[type="password"] {}

/* starts with */
a[href^="https://"] {}

/* ends with */
a[href$=".pdf"] {}

/* contains */
[data-state*="open"] {}
\`\`\`

---

## 4) Pseudo-classes you should know

\`\`\`css
.btn:hover {}
.btn:focus-visible {}

li:first-child {}
li:nth-child(2n) {}

input:required {}
input:invalid {}
\`\`\`

---

## 5) Modern helpers (huge productivity boost)

### \`:is()\` vs \`:where()\`

\`:is()\` keeps the highest specificity of its arguments.
\`:where()\` has **zero specificity** → great for baseline rules.

\`\`\`css
:where(button, a, input, textarea, select) {
  font: inherit;
}

:is(.btn, .link, .chip):focus-visible {
  outline: 3px solid rgba(59,130,246,0.6);
  outline-offset: 2px;
}
\`\`\`

### \`:not()\`

\`\`\`css
.btn:not(:disabled) { cursor: pointer; }
\`\`\`

### \`:has()\` (check support)

\`\`\`css
.field:has(input:invalid) { border-color: #ef4444; }
\`\`\`

---

## 6) Practice

Write selectors for:
- external links only
- direct children only (no nested)
- every odd row in a table
- show an error style when a field contains an invalid input (use \`:has()\` if supported)
`;
    }

    if (lowerTitle === 'css attr selectors') {
      return `# CSS Attr Selectors

Attribute selectors target elements based on attributes (including data attributes and ARIA). They’re powerful for form styling, state styling, and progressive enhancement.

---

## 1) Operators

\`\`\`css
/* exact match */
input[type="email"] {}

/* contains word (space-separated) */
[class~="active"] {}

/* starts with */
a[href^="https://"] {}

/* ends with */
a[href$=".pdf"] {}

/* contains substring */
[data-state*="open"] {}

/* language (rare but useful) */
html[lang|="en"] {}
\`\`\`

---

## 2) Real-world patterns

### Style required fields

\`\`\`css
input[required] { border-color: rgba(0,0,0,0.25); }
input[required]:focus { border-color: #2563eb; }
\`\`\`

### Target ARIA state

\`\`\`css
button[aria-expanded="true"] {
  background: rgba(0,0,0,0.06);
}
\`\`\`

### Data attributes for UI state

\`\`\`css
[data-state="open"] { opacity: 1; }
[data-state="closed"] { opacity: 0; }
\`\`\`

---

## 3) Common mistakes

- Overusing attribute selectors can slow matching in huge DOMs; prefer classes for hot paths.
- Don’t style purely by \`[style]\` or unpredictable attributes.

---

## 4) Practice

Build a tab UI where \`[aria-selected="true"]\` controls the active tab styles.
`;
    }

    if (lowerTitle.includes('selectors') && !lowerTitle.includes('reference') && !lowerTitle.includes('attr')) {
      return `# ${title}

CSS selectors identify which HTML elements to style. Understanding selectors is crucial for efficient CSS development. Selectors range from simple element names to complex combinations using combinators, pseudo-classes, and attribute selectors. Mastering selectors enables precise element targeting without cluttering HTML with classes.

Basic selectors include element (p), class (.classname), ID (#idname), and universal (*) selectors. Class selectors are reusable across multiple elements, while ID selectors target unique elements. The universal selector targets all elements but should be used carefully due to performance implications on large documents.

Combinators create relationships between selectors. Descendant selectors (div p) target all p elements inside div elements. Child selectors (div > p) target only direct children. Adjacent sibling (h1 + p) and general sibling (h1 ~ p) selectors target elements based on their position relative to siblings.

Attribute selectors target elements based on their attributes. [type="text"] targets inputs with type="text", [class^="btn"] targets classes starting with "btn", and [href$=".pdf"] targets links ending with ".pdf". These powerful selectors reduce the need for extra classes in HTML markup.`;
    }
    if (lowerTitle === 'css box model') {
      return `# CSS Box Model

Every element is rendered as a box with:
1. content
2. padding
3. border
4. margin

---

## 1) The sizing surprise

With default \`box-sizing: content-box\`, padding and border add to width.

---

## 2) The #1 pro tip

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

Now \`width\` includes padding + border.

---

## 3) Margin vs padding

- margin: space outside (pushes other elements)
- padding: space inside (increases clickable area)

---

## 4) Margin collapsing (vertical)

Two vertical margins can collapse into one. If spacing looks “wrong”, check collapse.

---

## 5) Practice

Build a card that stays exactly 320px wide while having 16px padding.
`;
    }

    if (lowerTitle.includes('box model')) {
      return `# ${title}

The CSS box model defines how element size is calculated, consisting of content, padding, border, and margin layers. Understanding the box model is fundamental to CSS layout. By default, width and height properties set content box size, with padding and border adding to total element size.

Each layer serves a specific purpose. Content contains text or nested elements, padding creates space inside borders, borders create visible boundaries, and margins create space outside borders. These layers can be controlled independently for each side (top, right, bottom, left) or using shorthand properties.

The box-sizing property controls how browsers calculate element dimensions. The default content-box calculates width as content only, often causing sizing confusion. The border-box value includes padding and border in width calculations, making layouts more predictable. Most modern developers set box-sizing: border-box globally.

Box model understanding prevents common layout issues like unexpected element sizes or broken layouts. Margins collapse between adjacent elements in certain situations, combining rather than adding. Padding never collapses and always creates space between content and borders. Mastering the box model is essential for reliable CSS layouts.`;
    }
    if (lowerTitle === 'css flexbox') {
      return `# CSS Flexbox

Flexbox is a **one-dimensional layout system** (row OR column). It’s great for navbars, alignment, and distributing space.

---

## 1) Container setup

\`\`\`css
.toolbar {
  display: flex;
  align-items: center;      /* cross axis */
  justify-content: space-between; /* main axis */
  gap: 12px;
}
\`\`\`

---

## 2) Fixed sidebar + flexible content

\`\`\`css
.layout { display: flex; }
.sidebar { flex: 0 0 240px; }
.content { flex: 1 1 auto; min-width: 0; }
\`\`\`

---

## 3) Centering

\`\`\`css
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
\`\`\`

---

## 4) Practice

1. Build a responsive header.
2. Make a tag list that wraps with \`flex-wrap\`.
`;
    }

    if (lowerTitle === 'flexbox intro') {
      return `# Flexbox Intro

Flexbox is a **one-dimensional** layout system: it lays items out in a **row** or a **column**. Use it when you care about alignment, spacing, and distributing leftover space.

---

## 1) Key vocabulary

- **Flex container**: the element with \`display: flex\`
- **Flex items**: direct children of the container
- **Main axis**: direction of layout (row/column)
- **Cross axis**: perpendicular direction

---

## 2) Your first flex layout

\`\`\`css
.row {
  display: flex;
  gap: 12px;
  align-items: center;
}
\`\`\`

---

## 3) Common uses

- navigation bars
- input + button rows
- icon + label alignment
- button groups
- chips/tags that wrap

---

## 4) Practice

Create a header with a logo on the left and nav links on the right using \`justify-content: space-between\`.
`;
    }

    if (lowerTitle === 'flex container') {
      return `# Flex Container

Flex container properties control how items are arranged as a group.

---

## 1) Core container properties

\`\`\`css
.container {
  display: flex;
  flex-direction: row;      /* row | column */
  flex-wrap: wrap;          /* nowrap | wrap */
  gap: 12px;

  justify-content: flex-start; /* main axis */
  align-items: stretch;        /* cross axis */
}
\`\`\`

\`justify-content\` (main axis): \`flex-start\`, \`center\`, \`space-between\`, \`space-around\`, \`space-evenly\`

\`align-items\` (cross axis): \`stretch\`, \`center\`, \`flex-start\`, \`flex-end\`, \`baseline\`

---

## 2) Wrapping tag list (classic)

\`\`\`css
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
\`\`\`

---

## 3) Practice

Build a toolbar with items aligned center and pushed apart using \`space-between\`, then add \`gap\` for consistent spacing.
`;
    }

    if (lowerTitle === 'flex items') {
      return `# Flex Items

Flex item properties control how each item grows/shrinks and aligns inside the container.

---

## 1) The \`flex\` shorthand

\`flex: <grow> <shrink> <basis>\`

Examples:
\`\`\`css
.sidebar { flex: 0 0 260px; }
.content { flex: 1 1 auto; min-width: 0; }
\`\`\`

\`min-width: 0\` is a common fix to allow long content to shrink instead of overflowing.

---

## 2) Per-item alignment

\`\`\`css
.item { align-self: center; }
\`\`\`

---

## 3) Reordering (use carefully)

\`\`\`css
.cta { order: -1; }
\`\`\`

Note: reordering can confuse keyboard/screen reader order if overused.

---

## 4) Practice

Create a row with a fixed-width icon, a flexible title, and a fixed-width button.
`;
    }

    if (lowerTitle === 'flex responsive') {
      return `# Flex Responsive

Flexbox is naturally responsive because items can grow, shrink, and wrap. Use these patterns to make layouts work well across screen sizes.

---

## 1) Wrap instead of hard breakpoints

\`\`\`css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 260px; /* grow, shrink, preferred width */
}
\`\`\`

This yields a 1–N column layout depending on available width.

---

## 2) Column on mobile, row on desktop

\`\`\`css
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 900px) {
  .stack { flex-direction: row; }
}
\`\`\`

---

## 3) Practice

Build a responsive “features” section: 1 column on mobile, 2 columns on tablet, 3 on desktop.
`;
    }

    if (lowerTitle === 'grid intro') {
      return `# Grid Intro

CSS Grid is a **two-dimensional** layout system (rows + columns). It’s ideal for page layouts, dashboards, galleries, and any design where you need structured placement.

---

## 1) Your first grid

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
\`\`\`

---

## 2) Responsive columns with \`minmax\`

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
\`\`\`

---

## 3) Practice

Create a responsive gallery that automatically changes the number of columns based on screen size.
`;
    }

    if (lowerTitle === 'grid container') {
      return `# Grid Container

Grid container properties define tracks (rows/columns) and overall alignment.

---

## 1) Defining tracks

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
}
\`\`\`

---

## 2) Named areas (readable layouts)

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
}

.sidebar { grid-area: sidebar; }
.header  { grid-area: header; }
.main    { grid-area: main; }
\`\`\`

---

## 3) Practice

Build an app shell layout (sidebar + header + main) using \`grid-template-areas\`.
`;
    }

    if (lowerTitle === 'grid items') {
      return `# Grid Items

Grid item properties control placement and spanning.

---

## 1) Spanning columns/rows

\`\`\`css
.feature {
  grid-column: 1 / span 2;
}
\`\`\`

---

## 2) Line-based placement

\`\`\`css
.a { grid-column: 1 / 3; }
.b { grid-column: 3 / 5; }
\`\`\`

---

## 3) Alignment

\`\`\`css
.item {
  justify-self: center;
  align-self: start;
}
\`\`\`

---

## 4) Practice

Create a grid where the first card spans 2 columns on desktop but spans 1 column on mobile.
`;
    }

    if (lowerTitle === 'grid 12-column layout') {
      return `# Grid 12-column Layout

A 12-column grid is a common design system pattern. CSS Grid makes it straightforward without a framework.

---

## 1) Define the 12 columns

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}
\`\`\`

---

## 2) Span utilities (example)

\`\`\`css
.span-12 { grid-column: span 12; }
.span-8  { grid-column: span 8; }
.span-6  { grid-column: span 6; }
.span-4  { grid-column: span 4; }

@media (max-width: 900px) {
  .span-8, .span-6, .span-4 { grid-column: span 12; }
}
\`\`\`

---

## 3) Practice

Build a two-column page where the main content spans 8 columns and the sidebar spans 4 on desktop, then collapses to 12 on mobile.
`;
    }

    if (lowerTitle === 'css media queries') {
      return `# CSS Media Queries

Media queries let you apply CSS conditionally based on the user’s device/environment: viewport size, pointer type, hover capability, motion preference, theme, orientation, and more.

The goal is not “design for iPhone vs desktop” — it’s **make the layout adapt to content and constraints**.

---

## 1) Basic syntax

\`\`\`css
/* Mobile-first: base styles for small screens */
.layout { display: grid; gap: 16px; }

/* Enhance for larger screens */
@media (min-width: 900px) {
  .layout { grid-template-columns: 280px 1fr; }
}
\`\`\`

Use **min-width** most of the time (mobile-first). It tends to be easier to reason about and avoids overriding chains.

---

## 2) Choosing breakpoints (content-driven)

Don’t pick breakpoints because “tablet = 768px”. Instead:
- resize the browser
- when the layout looks cramped/broken, add a breakpoint

Example strategy:
- base: single column
- when cards no longer fit nicely: switch to multi-column grid
- when sidebar fits comfortably: add sidebar

---

## 3) More than width: modern queries

### User preferences

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}

@media (prefers-color-scheme: dark) {
  :root { color-scheme: dark; }
}
\`\`\`

### Input types (huge for UX)

\`\`\`css
/* If the device can hover (mouse/trackpad), enable hover-only affordances */
@media (hover: hover) and (pointer: fine) {
  .card:hover { transform: translateY(-2px); }
}
\`\`\`

---

## 4) Pitfalls

- Overlapping rules: keep your query strategy consistent (mostly \`min-width\`).
- Using \`px\` for everything: combine \`rem\`, \`clamp()\`, and fluid grids.
- “Magic breakpoint soup”: fewer breakpoints + more flexible layouts usually wins.
- Forgetting accessibility: ensure focus styles and tap targets work on mobile.

---

## 5) Debug checklist

- Use DevTools device toolbar.
- Inspect computed styles to see which \`@media\` rule is active.
- Test keyboard navigation on all sizes.

---

## 6) Practice

Build a responsive layout:
- mobile: header + main stacked
- desktop: add a 280px sidebar
Use \`min-width\` queries and keep the CSS readable.
`;
    }

    if (lowerTitle === 'css mq examples') {
      return `# CSS MQ Examples

This topic is a set of practical recipes you’ll actually re-use.

---

## 1) Responsive grid without breakpoints

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
\`\`\`

---

## 2) Switch layout at a breakpoint (mobile-first)

\`\`\`css
.shell { display: grid; gap: 16px; }

@media (min-width: 900px) {
  .shell { grid-template-columns: 280px 1fr; }
}
\`\`\`

---

## 3) Fluid typography with clamp

\`\`\`css
h1 {
  font-size: clamp(24px, 3vw + 8px, 44px);
}
\`\`\`

---

## 4) Reduced motion safety net

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  html:focus-within { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
\`\`\`

---

## 5) Hover-only effects on hover-capable devices

\`\`\`css
@media (hover: hover) and (pointer: fine) {
  .btn:hover { transform: translateY(-1px); }
}
\`\`\`

---

## 6) Print stylesheet

\`\`\`css
@media print {
  nav, footer, .no-print { display: none !important; }
  a::after { content: " (" attr(href) ")"; font-size: 0.9em; }
}
\`\`\`

---

## 7) Practice

Implement recipes #1 and #2 for a “course list” page and confirm it looks good at 360px, 768px, and 1280px.
`;
    }

    if (lowerTitle === 'rwd intro') {
      return `# RWD Intro

Responsive Web Design (RWD) is about building layouts that **adapt** to different screens, input types, and user preferences — without maintaining separate sites.

---

## 1) The 3 pillars

1) **Fluid layout**: use flexible sizing (%, fr, minmax)
2) **Flexible media**: images/videos don’t overflow
3) **Media queries**: enhance at breakpoints when needed

---

## 2) Mobile-first is the safest default

Start with a clean single-column layout.
Then add enhancements at \`min-width\` breakpoints.

---

## 3) A minimal responsive skeleton

\`\`\`css
.page {
  display: grid;
  gap: 16px;
}

@media (min-width: 900px) {
  .page {
    grid-template-columns: 280px 1fr;
    align-items: start;
  }
}
\`\`\`

---

## 4) What “responsive” includes in 2026

- reduced motion
- dark mode
- touch vs mouse differences
- readable typography (\`clamp()\`)
- container-based layouts when possible

---

## 5) Practice

Create a page with a sidebar that appears only on wide screens; on mobile it becomes a collapsible section (CSS layout only — no JS required for this exercise).
`;
    }

    if (lowerTitle === 'rwd viewport') {
      return `# RWD Viewport

The viewport is the “layout window” the browser uses for rendering. On mobile, without a correct viewport setting, pages can render zoomed-out and tiny.

---

## 1) The essential meta tag

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1" />
\`\`\`

- \`width=device-width\`: match the device’s screen width
- \`initial-scale=1\`: don’t start zoomed

---

## 2) Don’t disable zoom

Avoid \`user-scalable=no\` — it harms accessibility for users who need to zoom.

---

## 3) Viewport units gotchas

On mobile browsers, classic \`vh\` can be weird due to dynamic address bars.

Prefer modern units when available:
- \`dvh\` (dynamic viewport height)
- \`svh\` (small viewport height)
- \`lvh\` (large viewport height)

Example:

\`\`\`css
.hero {
  min-height: 100dvh;
}
\`\`\`

---

## 4) Practice

Create a full-height hero section that doesn’t jump when the mobile browser UI shows/hides.
`;
    }

    if (lowerTitle === 'rwd grid view') {
      return `# RWD Grid View

“Grid view” usually means a card/gallery layout that adapts the number of columns based on available space.

---

## 1) The modern pattern: auto-fit + minmax

\`\`\`css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
\`\`\`

This is responsive **without** explicit breakpoints.

---

## 2) Keep cards consistent

\`\`\`css
.card {
  display: grid;
  gap: 10px;
}

.card img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 12px;
}
\`\`\`

---

## 3) Practice

Build a responsive “project gallery” grid that looks good from 320px to 1440px with no breakpoints.
`;
    }

    if (lowerTitle === 'rwd media queries') {
      return `# RWD Media Queries

RWD media queries are about **enhancements**, not “device detection”. Use them for meaningful layout changes that flexible layouts can’t solve alone.

---

## 1) Mobile-first breakpoint pattern

\`\`\`css
/* Base: single column */
.layout { display: grid; gap: 16px; }

/* Tablet+ */
@media (min-width: 768px) {
  .layout { grid-template-columns: 1fr 1fr; }
}

/* Desktop+ */
@media (min-width: 1100px) {
  .layout { grid-template-columns: 280px 1fr; }
}
\`\`\`

---

## 2) Consider non-width queries

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}

@media (hover: hover) and (pointer: fine) {
  .menuItem:hover { text-decoration: underline; }
}
\`\`\`

---

## 3) Practice

Create a responsive navigation:
- mobile: stacked links
- desktop: horizontal links with hover underline (only when hover is supported)
`;
    }

    if (lowerTitle === 'rwd images') {
      return `# RWD Images

Responsive images are about **layout safety** (no overflow) and **performance** (don’t ship huge files to mobile).

---

## 1) CSS baseline

\`\`\`css
img {
  max-width: 100%;
  height: auto;
  display: block;
}
\`\`\`

---

## 2) Use srcset + sizes (HTML)

\`\`\`html
<img
  src="/img-800.jpg"
  srcset="/img-400.jpg 400w, /img-800.jpg 800w, /img-1200.jpg 1200w"
  sizes="(min-width: 900px) 33vw, 100vw"
  alt="A dashboard screenshot"
  loading="lazy"
  decoding="async"
/>
\`\`\`

---

## 3) Keep aspect ratios stable

\`\`\`css
.thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
\`\`\`

---

## 4) Modern formats + fallbacks

Use \`<picture>\` when you want AVIF/WebP with fallback.

---

## 5) Practice

Create a card grid where each card image loads lazily, stays 16:9, and never causes layout shift.
`;
    }

    if (lowerTitle === 'rwd videos') {
      return `# RWD Videos

Videos (and embeds like YouTube iframes) need responsive sizing that preserves aspect ratio.

---

## 1) Native video element

\`\`\`css
video {
  max-width: 100%;
  height: auto;
  display: block;
}
\`\`\`

---

## 2) Responsive iframe embeds (modern)

\`\`\`css
.embed {
  aspect-ratio: 16 / 9;
}

.embed iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
\`\`\`

---

## 3) UX + performance tips

- Provide \`poster\` for video.
- Avoid autoplay with sound.
- Consider \`prefers-reduced-motion\` and user bandwidth.

---

## 4) Practice

Create a responsive “lesson video” component that stays 16:9 and fits nicely on mobile and desktop.
`;
    }

    if (lowerTitle === 'rwd frameworks') {
      return `# RWD Frameworks

Responsive frameworks speed up development by providing:
- grid systems / layout primitives
- spacing and typography scales
- responsive utilities and breakpoints

Examples: Bootstrap, Tailwind, Material UI (component framework), etc.

---

## 1) When frameworks help

- teams need consistency fast
- large app with many screens
- you want responsive utilities and design tokens

---

## 2) When to avoid them

- tiny landing page (could be overkill)
- strict performance budgets where unused CSS matters
- you want full custom design with minimal dependencies

---

## 3) Best practices

- Don’t fight the framework: learn its layout model.
- Prefer utility patterns that keep specificity low.
- Audit CSS size (tree-shaking/purge) if available.

---

## 4) Practice

Pick one approach (utility-first or component framework). Build the same responsive layout both ways and compare:
- CSS size
- speed of iteration
- maintainability
`;
    }

    if (lowerTitle === 'rwd templates') {
      return `# RWD Templates

Templates are prebuilt responsive layouts you can adapt quickly. The key is knowing what to change safely:
- spacing scale
- grid/flex structure
- typography
- imagery and content density

---

## 1) A simple responsive template structure

\`\`\`css
.page { display: grid; gap: 16px; }

.header { display: flex; justify-content: space-between; align-items: center; }

.content { display: grid; gap: 16px; }

@media (min-width: 900px) {
  .content { grid-template-columns: 2fr 1fr; }
}
\`\`\`

---

## 2) Template checklist

- Works at 320px, 768px, 1024px, 1440px
- Tap targets are large enough
- Images don’t overflow
- Typography stays readable
- Focus states visible
- Motion respects reduced-motion

---

## 3) Practice

Take a basic blog template (header + post list + sidebar) and make it responsive using only Grid/Flex and 1–2 breakpoints.
`;
    }

    if (lowerTitle === 'sass tutorial') {
      return `# SASS Tutorial

Sass (SCSS) is a CSS preprocessor that adds **structure and reuse**: variables, mixins, functions, partials, and modules.

Important: Sass compiles to plain CSS. It’s best for **build-time** organization. For **runtime theming**, prefer native CSS variables.

---

## 1) SCSS basics

### Variables

\`\`\`scss
$space-2: 8px;
$space-3: 12px;
$radius: 12px;

.card {
  padding: $space-3;
  border-radius: $radius;
}
\`\`\`

### Nesting (use lightly)

\`\`\`scss
.nav {
  display: flex;
  gap: 12px;

  a {
    text-decoration: none;

    &:hover { text-decoration: underline; }
    &:focus-visible { outline: 2px solid currentColor; }
  }
}
\`\`\`

Avoid deep nesting — it increases specificity and becomes hard to override.

---

## 2) Mixins (reuse patterns)

\`\`\`scss
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only { @include visually-hidden; }
\`\`\`

---

## 3) Functions (calculate values)

\`\`\`scss
@function rem($px) {
  @return ($px / 16px) * 1rem;
}

.title { font-size: rem(22px); }
\`\`\`

---

## 4) Modules (recommended)

Modern Sass prefers \`@use\` and \`@forward\` over legacy \`@import\`.

\`\`\`scss
@use "./tokens" as t;

.btn { padding: t.$space-3; }
\`\`\`

---

## 5) Sass + CSS variables (best combo)

Use Sass to generate systems; use CSS variables for runtime theming.

---

## 6) Practice

Create a small SCSS structure:
- \`_tokens.scss\` for spacing/radii
- \`_mixins.scss\` for patterns
- \`buttons.scss\` for .btn variants
Then compile and verify the CSS output stays low-specificity.
`;
    }

    if (lowerTitle === 'css @supports') {
      return `# CSS @supports

\`@supports\` is **feature detection for CSS**. It lets you use modern CSS where supported and provide a fallback where it isn’t.

Use it when:
- you want progressive enhancement (best)
- you need to avoid breaking older browsers

---

## 1) Basic syntax

\`\`\`css
/* Base fallback */
.card { border-radius: 12px; }

/* Enhance only if supported */
@supports (backdrop-filter: blur(8px)) {
  .card {
    backdrop-filter: blur(8px);
    background: rgba(255,255,255,0.6);
  }
}
\`\`\`

---

## 2) Checking multiple conditions

\`\`\`css
@supports (display: grid) and (gap: 16px) {
  .layout { display: grid; gap: 16px; }
}
\`\`\`

---

## 3) A useful real-world pattern

Prefer modern layout (grid) but fallback to flex:

\`\`\`css
.cards { display: flex; flex-wrap: wrap; gap: 16px; }
.card { flex: 1 1 220px; }

@supports (display: grid) {
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
  .card { flex: initial; }
}
\`\`\`

---

## 4) Practice

Create a layout that uses \`position: sticky\` when supported and falls back to a regular sidebar when not.
`;
    }

    if (lowerTitle === 'css at-rules') {
      return `# CSS At-rules

At-rules are instructions to the CSS engine. They often control:
- imports
- media queries
- feature support
- font loading
- animations
- layers

---

## 1) Common at-rules

- \`@media\` — responsive styles
- \`@supports\` — feature detection
- \`@keyframes\` — animations
- \`@font-face\` — custom fonts
- \`@layer\` — cascade layers (modern)
- \`@property\` — typed custom properties (modern)

---

## 2) Example: media + supports together

\`\`\`css
@media (min-width: 900px) {
  @supports (display: grid) {
    .layout { display: grid; grid-template-columns: 280px 1fr; }
  }
}
\`\`\`

---

## 3) Cascade layers (high level)

Layers help you control override order without specificity wars:

\`\`\`css
@layer reset, base, components, utilities;

@layer base {
  body { margin: 0; }
}

@layer utilities {
  .mt-2 { margin-top: 8px; }
}
\`\`\`

---

## 4) Practice

Create a small stylesheet using \`@layer\` where “utilities” always wins over “components” without using \`!important\`.
`;
    }

    if (lowerTitle === 'css functions') {
      return `# CSS Functions

CSS functions compute values. You already use them constantly (\`rgb()\`, \`url()\`). Modern CSS adds powerful layout and color functions.

---

## 1) Layout + sizing functions

- \`calc()\`: combine units
- \`min()\`, \`max()\`: clamp to extremes
- \`clamp(min, preferred, max)\`: fluid sizing

\`\`\`css
.container {
  width: min(1100px, 100% - 32px);
}

h1 {
  font-size: clamp(24px, 3vw + 8px, 44px);
}
\`\`\`

---

## 2) Variable functions

\`\`\`css
:root { --space: 12px; }
.card { padding: var(--space); }
\`\`\`

---

## 3) Colors and gradients

\`\`\`css
.hero {
  background: linear-gradient(135deg, #111827, #2563eb);
}
\`\`\`

---

## 4) Practice

Build a layout with a max width using \`min()\` and make typography fluid using \`clamp()\`.
`;
    }

    if (lowerTitle === 'css templates') {
      return `# CSS Templates

Templates are reusable page skeletons (header, hero, grids, sidebars). This topic focuses on building templates that are:
- responsive
- accessible
- easy to customize

---

## 1) A clean, reusable page template

\`\`\`html
<header class="header">...</header>
<main class="main">
  <section class="hero">...</section>
  <section class="content">...</section>
</main>
<footer class="footer">...</footer>
\`\`\`

\`\`\`css
.header, .footer { padding: 16px; }
.main { display: grid; gap: 24px; padding: 16px; }

.content {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

@media (min-width: 1000px) {
  .main { padding: 24px; }
}
\`\`\`

---

## 2) Template checklist

- uses flexible grid patterns (auto-fit/minmax)
- images are responsive (no overflow)
- focus-visible styles exist
- respects reduced motion

---

## 3) Practice

Create a “dashboard template” with:
- sidebar + topbar
- responsive main grid
Use Grid for the shell and Flex inside components.
`;
    }

    if (lowerTitle === 'css snippets') {
      return `# CSS Snippets

Snippets are small, reusable CSS patterns. The goal is to build a toolkit of “known-good” building blocks.

---

## 1) Centering

\`\`\`css
.center {
  display: grid;
  place-items: center;
}
\`\`\`

---

## 2) Truncate text (single line)

\`\`\`css
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
\`\`\`

---

## 3) Clamp lines (multi-line)

\`\`\`css
.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
\`\`\`

---

## 4) Visually hidden (screen-reader only)

\`\`\`css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
\`\`\`

---

## 5) Practice

Create your own snippet library file and apply 3 snippets to a small UI (card, button row, and title).
`;
    }

    if (lowerTitle === 'css examples') {
      return `# CSS Examples

Examples are where CSS becomes real. Here are a few “mini projects” that cover key layout and styling skills.

---

## 1) Card component

\`\`\`css
.card {
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 12px;
  padding: 16px;
  display: grid;
  gap: 10px;
}
\`\`\`

---

## 2) Responsive grid

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
\`\`\`

---

## 3) Navbar

\`\`\`css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
\`\`\`

---

## 4) Practice

Build a “pricing section” with 3 plans in a responsive grid and add hover/focus states for the buttons.
`;
    }

    if (lowerTitle === 'css editor') {
      return `# CSS Editor

This topic is about setting up a workflow where writing and debugging CSS is fast and predictable.

You can write CSS in any editor, but professional CSS work usually relies on:
- fast feedback (hot reload)
- linting/formatting
- browser DevTools for debugging

---

## 1) The “must-have” editor features

Look for:
- CSS syntax highlighting
- autocomplete for properties/values
- jump-to-definition for class names (when supported)
- quick rename of symbols
- formatting (Prettier)

---

## 2) Formatting + consistency

CSS becomes unmaintainable when everyone formats differently.

Baseline rules that keep teams sane:
- 2-space indent
- one declaration per line
- keep selectors shallow
- group related declarations

Example style:

\`\`\`css
.card {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
}
\`\`\`

---

## 3) Linting (catch mistakes early)

CSS mistakes are often silent (the browser just ignores invalid values). A linter helps catch:
- typos (\`backgroud\`)
- invalid values
- duplicated properties
- risky patterns

Common rule of thumb: lint in CI (or at least pre-commit) so broken CSS never ships.

---

## 4) The real CSS “editor”: DevTools

When CSS is confusing, DevTools is the truth.

### What to check first

1) **Is the selector matching?**
2) **Which rule is winning?** (crossed-out rules = overridden)
3) **What is the computed value?** (Computed tab)
4) **Which layout mode are you in?** (Flex/Grid overlays)

### Common debugging patterns

- Toggle rules on/off to isolate the cause.
- Use the box model inspector to see padding/border/margin.
- Temporarily add \`outline: 2px solid hotpink\` to see element boundaries.

---

## 5) A “safe starter” stylesheet

\`\`\`css
*, *::before, *::after { box-sizing: border-box; }
html, body { height: 100%; }
body {
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  line-height: 1.5;
}
img { max-width: 100%; display: block; }
\`\`\`

---

## 6) Practice

1) Pick a component (button/card/form field) and style it.
2) Use DevTools to answer: *why is a rule crossed out?*
3) Rewrite 2 selectors to reduce specificity (fewer nested selectors).
`;
    }

    if (lowerTitle === 'css quiz') {
      return `# CSS Quiz

Use this quiz to check your CSS fundamentals. Try answering without running code first.

---

## 1) Cascade + specificity

### Q1

Which color wins?

\`\`\`css
p { color: blue; }
.note p { color: green; }
#main .note p { color: red; }
\`\`\`

\`\`\`html
<div id="main">
  <div class="note">
    <p>Hello</p>
  </div>
</div>
\`\`\`

---

### Q2

True/false: \`!important\` is a good fix for “CSS not applying”.

---

## 2) Box model

### Q3

What is the total rendered width?

\`\`\`css
.box {
  width: 300px;
  padding: 20px;
  border: 5px solid black;
  box-sizing: content-box;
}
\`\`\`

---

### Q4

Same question, but \`box-sizing: border-box\`.

---

## 3) Layout

### Q5

You need a 3-column grid that becomes 1 column on small screens. Which layout tool is best?
- A) floats
- B) flexbox
- C) grid

---

## 4) Animation performance

### Q6

Which is usually smoother to animate?
- A) \`top\`
- B) \`transform: translateY(...)\`

---

## 5) Answers (check yourself)

- A1: **red** (ID selector is strongest here)
- A2: **false** (it’s a last resort; fix specificity/structure instead)
- A3: **350px** (300 + 40 padding + 10 border)
- A4: **300px** (padding/border included in width)
- A5: **C** (Grid is simplest for 2D layout)
- A6: **B** (transform usually avoids layout thrash)
`;
    }

    if (lowerTitle === 'css exercises') {
      return `# CSS Exercises

These exercises are designed to build real-world CSS skill: layout, spacing, typography, motion, and debugging.

---

## 1) Spacing scale

Create a spacing system and apply it consistently.

\`\`\`css
:root {
  --s-1: 4px;
  --s-2: 8px;
  --s-3: 12px;
  --s-4: 16px;
  --s-6: 24px;
  --s-8: 32px;
}
\`\`\`

Task: build a card list where every gap/padding is from the scale.

---

## 2) Buttons (states)

Build a button component with:
- default
- hover
- active
- focus-visible
- disabled

Extra: ensure colors have good contrast.

---

## 3) Responsive grid

Build a responsive layout using Grid:
- cards auto-fit between 220px and 1fr
- consistent gaps
- no overflow on small screens

---

## 4) Navbar

Build a navbar using Flexbox:
- logo left
- links right
- collapses cleanly on small widths

---

## 5) Modal overlay

Build a modal overlay:
- centered content
- backdrop behind
- click-through decorative layer uses \`pointer-events: none\`
- focus styles still visible

---

## 6) Debug challenge

Intentionally break something:
- set \`box-sizing\` wrong
- add an overly specific selector
- create an overflow issue

Then fix it using DevTools (inspect computed styles, see winning rules).
`;
    }

    if (lowerTitle === 'css website') {
      return `# CSS Website

This topic is a guided mini-project: build a small, responsive website with clean CSS.

---

## 1) What you’re building

Pages/sections:
- header (nav)
- hero
- features grid
- testimonials
- footer

Constraints:
- mobile-first
- accessible focus states
- no fixed heights for content sections

---

## 2) Suggested structure

\`\`\`html
<header class="header">...</header>
<main class="main">
  <section class="hero">...</section>
  <section class="features">...</section>
  <section class="testimonials">...</section>
</main>
<footer class="footer">...</footer>
\`\`\`

---

## 3) Layout approach

Use Grid for overall sections, Flex within components.

\`\`\`css
.main {
  display: grid;
  gap: 32px;
  padding: clamp(16px, 3vw, 40px);
}

.features {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
\`\`\`

---

## 4) Typography (readability)

Aim for:
- comfortable line-height
- readable line length (max-width in \`ch\`)

\`\`\`css
.prose {
  max-width: 70ch;
  line-height: 1.6;
}
\`\`\`

---

## 5) Interaction polish

- Use \`:focus-visible\` for keyboard users
- Keep hover and focus states aligned

\`\`\`css
a:focus-visible,
button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
\`\`\`

---

## 6) Practice checklist

- No horizontal scroll at 360px width
- All interactive elements have focus styles
- Images don’t overflow their containers
- Grid adapts without extra breakpoints
`;
    }

    if (lowerTitle === 'css syllabus') {
      return `# CSS Syllabus

This syllabus is a practical roadmap of CSS skills from fundamentals → advanced layout → production quality.

---

## 1) Foundations

- Syntax, selectors, cascade
- Specificity + inheritance
- Box model
- Units (px/rem/em/%/vw/vh)

---

## 2) Layout core

- Display types (block/inline/inline-block)
- Positioning + z-index
- Overflow
- Flexbox (container/items)
- Grid (tracks/areas)

---

## 3) Styling + UI

- Typography
- Colors (RGB/HSL), gradients
- Borders, shadows
- Forms + focus states
- Responsive images + object-fit

---

## 4) Motion

- Transitions
- Transforms (2D/3D)
- Animations
- Animatable properties + performance

---

## 5) Modern CSS

- Custom properties (CSS variables)
- \`@supports\` for progressive enhancement
- Responsive design + media queries
- Accessibility considerations

---

## 6) Outcome

By the end, you should be able to build:
- a responsive layout without “CSS hacks”
- a small design system (tokens + components)
- accessible focus/hover states
- smooth, performant micro-interactions
`;
    }

    if (lowerTitle === 'css study plan') {
      return `# CSS Study Plan

This plan assumes ~45–60 minutes/day. Adjust pace as needed.

---

## Week 1 — Core mental models

- Day 1: selectors + specificity drills
- Day 2: cascade + DevTools “why did this win?”
- Day 3: box model + box-sizing
- Day 4: units (rem/em/%/vw/vh) + fluid sizing
- Day 5: typography + readable layouts (\`ch\`, line-height)

---

## Week 2 — Layout

- Day 1–2: Flexbox (navbars, alignment, wrapping)
- Day 3–4: Grid (auto-fit/minmax, template areas)
- Day 5: responsive patterns (no overflow at 360px)

---

## Week 3 — Production CSS

- forms + focus-visible
- accessibility basics
- performance: animating transform/opacity
- progressive enhancement with \`@supports\`

---

## Week 4 — Build a mini project

Build a small marketing site:
- hero + features + pricing + FAQ
- responsive grid
- interactive states
- optional light/dark theme via CSS variables

---

## Daily habit

Spend 10 minutes in DevTools inspecting real sites: identify layout mode (flex/grid), spacing scale, and typography choices.
`;
    }

    if (lowerTitle === 'css interview prep') {
      return `# CSS Interview Prep

Interview CSS usually tests: fundamentals (cascade/specificity), layout (flex/grid), and practical debugging.

---

## 1) High-frequency questions

1) Explain the box model. What does \`box-sizing: border-box\` change?
2) Why is a CSS rule crossed out in DevTools?
3) Specificity: which selector wins and why?
4) Flex vs Grid: when do you choose each?
5) Centering: 3 ways to center (block, flex, grid)
6) Positioning: absolute vs fixed vs sticky
7) Stacking context: why does z-index “not work” sometimes?
8) Responsive images: \`max-width: 100%\`, \`object-fit\`
9) Accessibility: focus states and reduced motion
10) Performance: why animate transform/opacity?

---

## 2) Practical whiteboard tasks

- Build a navbar with right-aligned links
- Create a responsive card grid (auto-fit/minmax)
- Make a tooltip appear on hover + focus (keyboard friendly)
- Implement a modal overlay with click-through decoration (\`pointer-events\`)

---

## 3) Debugging mindset

When something breaks, talk through:
1) selector match
2) cascade/specificity
3) computed styles
4) layout context (flex/grid/position)

---

## 4) Practice

Pick one UI component per day and rebuild it from scratch using only semantic HTML + CSS. Explain your choices out loud.
`;
    }

    if (lowerTitle === 'css bootcamp') {
      return `# CSS Bootcamp

This is an intensive “crash course” sequence to level up quickly.

---

## Day 1 — Fundamentals + debugging

- selectors + specificity drills
- box model
- DevTools: computed styles + box model inspector

Deliverable: rebuild a card + button set.

---

## Day 2 — Layout

- Flexbox: alignment, wrapping
- Grid: auto-fit/minmax + template areas

Deliverable: navbar + responsive feature grid.

---

## Day 3 — UI polish

- typography
- forms + focus-visible
- hover/active/disabled states

Deliverable: pricing section + form.

---

## Day 4 — Motion + modern CSS

- transitions vs animations
- animatable properties + performance
- CSS variables for tokens/themes
- progressive enhancement with @supports

Deliverable: themed landing page with smooth interactions.

---

## Bootcamp rule

Every time you get stuck: open DevTools and prove why a rule isn’t applied.
`;
    }

    if (lowerTitle === 'css certificate') {
      return `# CSS Certificate

Treat “certificate prep” as structured review + projects. The goal isn’t trivia—it’s building reliable CSS under pressure.

---

## 1) What you must be able to do quickly

- Explain cascade/specificity/inheritance
- Build layouts with Flex/Grid
- Debug overrides in DevTools
- Create accessible focus states
- Avoid common responsive bugs (overflow, fixed heights)

---

## 2) Suggested practice format

### Timed drills (20–30 minutes)

- Build a navbar
- Build a responsive grid
- Build a modal
- Build a tooltip

### Review (10 minutes)

- Identify what you would refactor (selector depth, tokenization, repeated values)

---

## 3) Self-check rubric

- Does it work at 360px and 1440px?
- Are all interactive elements keyboard accessible?
- Are animations smooth on low-end devices?
- Is the CSS readable and override-friendly?

---

## 4) Practice

Pick one UI a day and build it from scratch. Save screenshots and keep a checklist of recurring mistakes.
`;
    }

    if (lowerTitle === 'css optimization') {
      return `# CSS Optimization

CSS performance issues usually come from:
- layout thrash (animating layout properties)
- expensive paints (heavy shadows/filters)
- huge CSS bundles and unused styles
- overly complex selectors

---

## 1) Prefer GPU-friendly animations

Animate:
- \`transform\`
- \`opacity\`

Avoid animating layout triggers like \`width\`, \`height\`, \`top\`, \`left\`.

---

## 2) Reduce unnecessary paint

- Use subtle shadows (avoid giant blur radius everywhere)
- Be careful with filters on large elements
- Don’t animate box-shadow if you can use transform/opacity instead

---

## 3) Keep CSS maintainable

- keep specificity low
- avoid deep selector chains
- prefer component boundaries
- consider layering (\`@layer\`) or a utility approach

---

## 4) Shipping less CSS

If you use a framework/utility system, ensure unused CSS is removed (purge/tree-shaking).

---

## 5) Practice

Take a button hover effect that changes \`top\` and rewrite it to use \`transform\`. Compare smoothness in DevTools Performance.
`;
    }

    if (lowerTitle === 'css accessibility') {
      return `# CSS Accessibility

CSS impacts accessibility through focus styles, contrast, motion, readable typography, and hit targets.

---

## 1) Don’t remove focus outlines

Use \`:focus-visible\` to show focus for keyboard users:

\`\`\`css
.btn:focus-visible {
  outline: 3px solid rgba(59,130,246,0.6);
  outline-offset: 2px;
}
\`\`\`

---

## 2) Respect reduced motion

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
\`\`\`

---

## 3) Contrast + readable text

- ensure sufficient contrast for text
- avoid tiny font sizes
- use comfortable line-height (around 1.4–1.7)

---

## 4) Touch targets

Keep tap targets large enough. Padding matters for accessibility.

---

## 5) Practice

Audit a small UI:
- can you tab through it?
- are focus indicators obvious?
- is motion reduced?
- do hover-only cues also work on focus?
`;
    }

    if (lowerTitle === 'css reference') {
      return `# CSS Reference

This is your “index” topic: where to look when you forget syntax or want a quick reminder.

---

## 1) How to use a CSS reference effectively

- Start from the goal (layout? typography? animation?)
- Find the relevant properties
- Confirm browser support / fallbacks when needed
- Test quickly in DevTools

---

## 2) High-value properties to memorize

Layout:
- \`display\`, \`position\`, \`z-index\`, \`overflow\`
- \`flex\` and grid properties

Sizing:
- \`box-sizing\`, \`width/height\`, \`min/max-*\`, \`aspect-ratio\`

Typography:
- \`font\`, \`line-height\`, \`letter-spacing\`, \`text-overflow\`

Motion:
- \`transition\`, \`transform\`, \`animation\`

---

## 3) Debug flow

- Inspect element → see which rule wins
- Check computed styles
- Confirm layout context (flex/grid)

---

## 4) Practice

Pick 5 properties you use weekly and write tiny “memory examples” for each.
`;
    }

    if (lowerTitle === 'css web safe fonts') {
      return `# CSS Web Safe Fonts

Web safe fonts are font families that are likely to exist on the user’s device, so they render instantly without downloads.

In modern apps, many teams prefer **system font stacks** for performance and native look.

---

## 1) Recommended system font stack

\`\`\`css
body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", "Liberation Sans", sans-serif;
}
\`\`\`

Why this works:
- picks the OS UI font first
- falls back to common cross-platform fonts
- ends with a generic \`sans-serif\` for safety

---

## 2) Serif and monospace stacks

\`\`\`css
.serif {
  font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
\`\`\`

---

## 3) Web fonts vs web safe fonts

If you use custom web fonts, use \`font-display: swap\` for better perceived performance:

\`\`\`css
@font-face {
  font-family: "Brand";
  src: url("/fonts/brand.woff2") format("woff2");
  font-display: swap;
}
\`\`\`

---

## 4) Practice

Pick a UI font stack for your app and test it on Windows + macOS + Android (or simulators). Confirm headings and code blocks use the right stacks.
`;
    }

    if (lowerTitle === 'css animatable') {
      return `# CSS Animatable

Not every CSS property can be smoothly animated. Understanding what’s “animatable” helps you build motion that is smooth and performant.

---

## 1) Prefer animating transform + opacity

These are usually the smoothest:
- \`transform\`
- \`opacity\`

Example:

\`\`\`css
.card {
  transition: transform 160ms ease, opacity 160ms ease;
}

.card:hover {
  transform: translateY(-2px);
}
\`\`\`

---

## 2) Be careful animating layout

Animating \`width\`, \`height\`, \`top\`, \`left\`, \`margin\` can cause layout recalculation and feel janky on weaker devices.

---

## 3) Discrete vs interpolated properties

Some values can interpolate (numbers, colors). Some switch discretely (e.g., many \`display\` changes) and won’t “animate” the way you expect.

---

## 4) \`will-change\` (use sparingly)

\`\`\`css
.animating {
  will-change: transform;
}
\`\`\`

Use it only during active animations; leaving it everywhere can hurt memory/perf.

---

## 5) Practice

Take an interaction that changes \`top\` on hover and rewrite it to use \`transform: translateY\` instead. Compare smoothness in DevTools.
`;
    }

    if (lowerTitle === 'css units reference') {
      return `# CSS Units Reference

CSS units control sizing across typography, spacing, and layout. Here’s a practical reference with “when to use what.”

---

## 1) Absolute units

- \`px\`: most common “absolute-ish” unit on screens (still affected by device pixel ratio)

Use \`px\` for:
- borders
- hairline separators
- tiny shadows

---

## 2) Relative units (recommended)

- \`rem\`: relative to root font-size (best for typography + spacing scales)
- \`em\`: relative to element font-size (useful for components)
- \`%\`: relative to parent

\`\`\`css
:root { font-size: 16px; }

.card { padding: 1rem; }
.small { font-size: 0.875rem; }
\`\`\`

---

## 3) Viewport units

- \`vw\`, \`vh\`: viewport width/height
- modern: \`dvh\`, \`svh\`, \`lvh\` (better on mobile)

---

## 4) Content-based units

- \`ch\`: width of “0” glyph (useful for text measure)

\`\`\`css
.prose { max-width: 70ch; }
\`\`\`

---

## 5) Practice

Convert a page’s spacing from \`px\` to \`rem\` and set a readable text width using \`ch\`.
`;
    }

    if (lowerTitle === 'css colors reference') {
      return `# CSS Colors Reference

CSS color is more than “pick a hex.” This reference summarizes formats and useful keywords.

---

## 1) Common color formats

- Hex: \`#0ea5e9\`
- RGB(A): \`rgb(14 165 233 / 0.85)\`
- HSL(A): \`hsl(199 89% 48% / 0.85)\`

---

## 2) Keywords

- \`transparent\`
- \`currentColor\` (inherits the element’s \`color\`)

\`\`\`css
.icon {
  color: #111827;
  fill: currentColor;
}
\`\`\`

---

## 3) Gradients are colors too

\`\`\`css
.bg {
  background: linear-gradient(135deg, #111827, #2563eb);
}
\`\`\`

---

## 4) Accessibility reminder

Ensure sufficient contrast for text against backgrounds (don’t rely on color alone to convey meaning).

---

## 5) Practice

Define a small color token set using CSS variables and apply it to buttons (default/hover/disabled).
`;
    }

    if (lowerTitle === 'css color values') {
      return `# CSS Color Values

Color values appear in many properties: \`color\`, \`background\`, \`border-color\`, \`box-shadow\`, \`outline-color\`, etc.

---

## 1) Hex

\`\`\`css
.a { color: #111827; }
.b { color: #fff; } /* shorthand */
\`\`\`

---

## 2) RGB / RGBA (modern syntax)

\`\`\`css
.overlay { background: rgb(0 0 0 / 0.55); }
\`\`\`

---

## 3) HSL (great for design systems)

\`\`\`css
:root {
  --brand: hsl(220 90% 56%);
  --brand-weak: hsl(220 90% 92%);
}
\`\`\`

---

## 4) \`currentColor\`

Great for icons so they follow text color:

\`\`\`css
svg { fill: currentColor; }
\`\`\`

---

## 5) Practice

Build an alert component that uses HSL-based tokens for info/success/warn/error states.
`;
    }

    if (lowerTitle === 'css default values') {
      return `# CSS Default Values

Every CSS property has a default (its **initial** value). Understanding defaults helps you debug “why does it look like that?”

---

## 1) The keyword toolbox

- \`initial\`: set to the property’s spec-defined initial value
- \`inherit\`: force inheritance from parent
- \`unset\`: \`inherit\` if inheritable, otherwise \`initial\`
- \`revert\`: revert to the value from the user-agent/previous cascade origin
- \`revert-layer\`: revert to previous cascade layer

---

## 2) Example: resetting a component

\`\`\`css
.btn {
  font: inherit;
  color: inherit;
  background: transparent;
  border: 0;
}
\`\`\`

---

## 3) Common defaults to remember

- \`display\`: many elements are \`block\` or \`inline\` by default depending on tag
- \`margin\`: headings/paragraphs often have default margins
- \`box-sizing\`: default is \`content-box\`

---

## 4) Practice

Take a button styled by browser defaults and reset it to a clean base using \`font: inherit\`, \`background\`, \`border\`, and \`appearance\`.
`;
    }

    if (lowerTitle === 'css browser support') {
      return `# CSS Browser Support

Browser support is about shipping features safely across:
- different browsers (Chromium, Firefox, Safari)
- different OS versions (especially mobile Safari)

---

## 1) Progressive enhancement

Start with a working baseline. Enhance with modern features when supported.

\`\`\`css
.panel { background: rgba(0,0,0,0.6); }

@supports (backdrop-filter: blur(10px)) {
  .panel { backdrop-filter: blur(10px); }
}
\`\`\`

---

## 2) Vendor prefixes

Some features need prefixes in certain browsers (commonly Safari). Tooling like Autoprefixer can help in build pipelines.

---

## 3) Avoid “works on my machine”

- Test on mobile Safari (real device if possible)
- Use DevTools emulation cautiously (it’s not perfect)
- Check support tables for new features

---

## 4) Practice

Pick one modern feature (e.g., \`gap\` in flex layouts, \`aspect-ratio\`, or \`dvh\`) and implement a safe fallback using \`@supports\`.
`;
    }

    if (lowerTitle === 'css selectors reference') {
      return `# CSS Selectors Reference

Selectors determine *what* you style. This reference summarizes the selector families you’ll use most.

---

## 1) Basic selectors

- element: \`button\`
- class: \`.btn\`
- id: \`#header\` (avoid in scalable CSS)
- attribute: \`input[type="email"]\`

---

## 2) Combinators

- descendant: \`.nav a\`
- child: \`.nav > a\`
- adjacent sibling: \`h2 + p\`
- general sibling: \`h2 ~ p\`

---

## 3) Modern helpers

### \`:is()\` and \`:where()\`

\`\`\`css
:is(.btn, .link, .chip) { cursor: pointer; }
:where(.btn, .link, .chip) { font: inherit; } /* low specificity */
\`\`\`

### \`:not()\`

\`\`\`css
.btn:not(:disabled) { cursor: pointer; }
\`\`\`

### \`:has()\` (powerful; check support)

\`\`\`css
.field:has(input:invalid) { border-color: red; }
\`\`\`

---

## 4) Specificity reminder

Prefer classes and keep selectors shallow to avoid override battles.

---

## 5) Practice

Write selectors for:
- all buttons inside a navbar
- the first card in a list
- inputs that are required and invalid
`;
    }

    if (lowerTitle === 'css combinators reference') {
      return `# CSS Combinators Reference

Combinators describe relationships between elements.

---

## 1) Descendant (space)

\`\`\`css
.nav a { text-decoration: none; }
\`\`\`

Matches any \`a\` anywhere inside \`.nav\`.

---

## 2) Child (>)

\`\`\`css
.nav > a { padding: 8px 12px; }
\`\`\`

Matches only direct children.

---

## 3) Adjacent sibling (+)

\`\`\`css
h2 + p { margin-top: 0; }
\`\`\`

Matches the first \`p\` immediately after an \`h2\`.

---

## 4) General sibling (~)

\`\`\`css
h2 ~ p { color: #374151; }
\`\`\`

Matches all \`p\` siblings after \`h2\`.

---

## 5) Practice

Use combinators to:
- style only top-level nav links (not nested dropdown items)
- remove top margin on the first paragraph after headings
`;
    }

    if (lowerTitle === 'css pseudo-classes reference') {
      return `# CSS Pseudo-classes Reference

Pseudo-classes select elements by state, position, or form validity.

---

## 1) Interaction

- \`:hover\`
- \`:active\`
- \`:focus\` / \`:focus-visible\`

\`\`\`css
.btn:focus-visible {
  outline: 3px solid rgba(59,130,246,0.6);
  outline-offset: 2px;
}
\`\`\`

---

## 2) Structure

- \`:first-child\`, \`:last-child\`
- \`:nth-child(n)\`

\`\`\`css
.list > li:nth-child(odd) { background: rgba(0,0,0,0.03); }
\`\`\`

---

## 3) Forms

- \`:required\`, \`:optional\`
- \`:valid\`, \`:invalid\`
- \`:checked\`, \`:disabled\`

\`\`\`css
input:invalid { border-color: #ef4444; }
input:valid { border-color: #22c55e; }
\`\`\`

---

## 4) Modern helpers

- \`:is()\`, \`:where()\`, \`:not()\`
- \`:has()\` (check support)

---

## 5) Practice

Style a form so invalid fields turn red only after the user interacts (hint: use \`:user-invalid\` where supported or a class toggle).
`;
    }

    if (lowerTitle === 'css pseudo-elements reference') {
      return `# CSS Pseudo-elements Reference

Pseudo-elements let you style “parts” of an element or generate decorative content without extra HTML.

---

## 1) The big ones

- \`::before\`, \`::after\` — generated boxes
- \`::first-letter\`, \`::first-line\`
- \`::placeholder\` (inputs)
- \`::selection\` (highlighted text)
- \`::marker\` (list bullets)

---

## 2) \`::before\` / \`::after\` essentials

They require \`content\`.

\`\`\`css
.tag {
  position: relative;
  padding-left: 18px;
}

.tag::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: currentColor;
  transform: translateY(-50%);
}
\`\`\`

---

## 3) Accessibility & semantics

- Generated content is often not announced by screen readers.
- Don’t put critical text only in \`content: ...\`.

---

## 4) \`::placeholder\` example

\`\`\`css
input::placeholder {
  color: rgba(0,0,0,0.5);
}
\`\`\`

---

## 5) Practice

Create a badge component with a colored dot using \`::before\`, and ensure the meaning is still conveyed without the dot.
`;
    }

    if (lowerTitle === 'css px-em converter') {
      return `# CSS PX-EM Converter

This topic explains conversion so you can choose units intentionally.

---

## 1) px vs em vs rem

- \`px\`: fixed-ish units (good for borders/shadows)
- \`em\`: relative to the **current element** font-size
- \`rem\`: relative to the **root** font-size (usually best for consistent spacing/typography)

---

## 2) The conversion formula

If root font-size is 16px:

$$rem = \frac{px}{16}$$

Examples:
- 16px → 1rem
- 24px → 1.5rem
- 12px → 0.75rem

---

## 3) Practical recommendations

- Use \`rem\` for font sizes and spacing scale so user zoom/font settings are respected.
- Use \`em\` for component-local sizing (e.g., icon size relative to button text).

---

## 4) Practice

Take a small card design built with \`px\` and convert spacing + font sizes to \`rem\` (leave border/shadow in \`px\`).
`;
    }

    if (lowerTitle === 'css forms') {
      return `# CSS Forms

Form styling is tricky because browsers apply default styles and some controls are hard to fully customize. The goal is:
- consistent spacing and typography
- clear focus states
- obvious validation states
- accessibility preserved

---

## 1) Baseline: inherit typography

\`\`\`css
input, select, textarea, button {
  font: inherit;
  color: inherit;
}
\`\`\`

---

## 2) Focus-visible (keyboard users)

\`\`\`css
.field:focus-visible {
  outline: 3px solid rgba(59,130,246,0.6);
  outline-offset: 2px;
}
\`\`\`

---

## 3) Validation styling

\`\`\`css
input:invalid { border-color: #ef4444; }
input:valid { border-color: #22c55e; }
\`\`\`

Tip: in real apps, you often delay showing invalid styles until the field is touched.

---

## 4) Checkboxes/radios (modern)

\`\`\`css
input[type="checkbox"], input[type="radio"] {
  accent-color: #2563eb;
}
\`\`\`

---

## 5) Practice

Build a login form with:
- consistent spacing
- clear focus ring
- invalid state styles
- larger tap targets for mobile
`;
    }

    if (lowerTitle === 'css counters') {
      return `# CSS Counters

CSS counters generate automatic numbering using \`counter-reset\`, \`counter-increment\`, and \`counter()\`.

---

## 1) Basic numbering (like ordered lists)

\`\`\`css
.steps {
  counter-reset: step;
}

.steps li {
  counter-increment: step;
}

.steps li::before {
  content: counter(step) ". ";
  font-weight: 700;
}
\`\`\`

---

## 2) Nested counters

Use \`counters()\` for nested numbering:

\`\`\`css
ol {
  counter-reset: item;
}

li {
  counter-increment: item;
}

li::before {
  content: counters(item, ".") ") ";
}
\`\`\`

---

## 3) Practice

Create a documentation sidebar where headings are numbered (1, 1.1, 1.2…) using counters.
`;
    }

    if (lowerTitle === 'css box sizing') {
      return `# CSS Box Sizing

\`box-sizing\` controls how \`width\` and \`height\` are calculated.

---

## 1) Two modes

- \`content-box\` (default): width = content only; padding/border add extra
- \`border-box\`: width includes padding + border

---

## 2) The recommended global reset

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

This makes layout math predictable.

---

## 3) Why it matters (practical example)

If a card is \`width: 320px\` and you add \`padding: 16px\`:
- with \`content-box\`, total becomes 352px
- with \`border-box\`, total stays 320px

---

## 4) Practice

Build a 3-column layout with fixed card widths and padding. Toggle \`box-sizing\` and observe the difference.
`;
    }

    if (lowerTitle === 'css multiple columns') {
      return `# CSS Multiple Columns

Multi-column layout lets text flow into columns like a newspaper.

---

## 1) Core properties

\`\`\`css
.article {
  column-count: 3;
  column-gap: 24px;
  column-rule: 1px solid rgba(0,0,0,0.15);
}
\`\`\`

You can also use \`column-width\` to let the browser choose the count.

---

## 2) Prevent awkward breaks

\`\`\`css
.card {
  break-inside: avoid;
}
\`\`\`

---

## 3) When to use it

- long-form text
- magazine-like layouts

For UI grids, prefer CSS Grid.

---

## 4) Practice

Create a “news article” layout that uses 1 column on mobile, 2 on tablet, 3 on desktop.
`;
    }

    if (lowerTitle === 'css user interface') {
      return `# CSS User Interface

CSS “UI” properties are small but high-impact: they change how an interface *feels* (click/drag/selection/focus/touch). Most of these are easy to sprinkle in late, but the best results come from using them intentionally.

---

## 1) Cursor: communicate affordance

Use the cursor to make actions obvious. Don’t use \`pointer\` for everything—reserve it for clickable controls.

\`\`\`css
.btn { cursor: pointer; }
.disabled { cursor: not-allowed; }
.draggable { cursor: grab; }
.draggable:active { cursor: grabbing; }
.code { cursor: text; }
\`\`\`

---

## 2) Text selection: allow copy, prevent accidental selection

\`user-select\` is useful for UI chrome (buttons, icons), but avoid applying it broadly to content.

\`\`\`css
.iconButton { user-select: none; }
.article { user-select: text; } /* default, but explicit can be helpful */
\`\`\`

---

## 3) Pointer events: click-through overlays

Great for decorative layers, gradients, and overlays that should never “eat” clicks.

\`\`\`css
.card {
  position: relative;
}

.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(0,0,0,0.08), transparent 55%);
  pointer-events: none;
}
\`\`\`

---

## 4) Resize: control resizable elements

Only \`textarea\` is resizable by default in many browsers. You can control the direction.

\`\`\`css
textarea {
  resize: vertical; /* none | both | horizontal | vertical */
}
\`\`\`

---

## 5) Accent color: native controls that match your theme

\`accent-color\` is the fastest way to theme checkboxes/radios/range controls without rebuilding them.

\`\`\`css
:root { --brand: #2563eb; }

input[type="checkbox"],
input[type="radio"],
input[type="range"] {
  accent-color: var(--brand);
}
\`\`\`

---

## 6) appearance: reset form controls for custom UI

When you truly need custom styling (not just theming), you often start with \`appearance: none\`.

\`\`\`css
select.custom {
  appearance: none;
  padding-right: 2.25rem;
  background:
    linear-gradient(45deg, transparent 50%, currentColor 50%) right 0.9rem center / 8px 8px no-repeat,
    linear-gradient(-45deg, transparent 50%, currentColor 50%) right 0.6rem center / 8px 8px no-repeat;
}
\`\`\`

Keep accessibility in mind: ensure focus styles, hit targets, and keyboard behavior still work.

---

## 7) Focus styles: don’t remove outlines

Use \`:focus-visible\` so mouse users don’t see focus rings, but keyboard users do.

\`\`\`css
.btn:focus { outline: none; }

.btn:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
\`\`\`

---

## 8) Touch/tap behavior (mobile)

\`touch-action\` can reduce unwanted gestures on interactive UI. Use sparingly and test.

\`\`\`css
.btn {
  touch-action: manipulation;
}
\`\`\`

---

## 9) Scrollbar stability (avoid layout shift)

If your layout jumps when content becomes scrollable, \`scrollbar-gutter\` can help.

\`\`\`css
.panel {
  overflow: auto;
  scrollbar-gutter: stable;
}
\`\`\`

---

## 10) Practice

1) Create a card with a decorative overlay that doesn’t block clicks (use \`pointer-events\`).
2) Build a custom \`select\` arrow using \`appearance: none\` and \`currentColor\`.
3) Add accessible focus styles using \`:focus-visible\` and \`outline-offset\`.
`;
    }

    if (lowerTitle === 'css variables') {
      return `# CSS Variables (Custom Properties)

CSS variables (officially **custom properties**) let you store values like colors, spacing, and sizes and reuse them across your stylesheet. Unlike Sass variables, custom properties are **runtime**, which means they can change based on the DOM (themes, component overrides, user settings).

---

## 1) Define and read a variable

Custom properties start with \`--\` and are read with \`var()\`.

\`\`\`css
:root {
  --brand: #2563eb;
  --radius: 12px;
  --space-4: 16px;
}

.card {
  border-radius: var(--radius);
  padding: var(--space-4);
  border: 1px solid color-mix(in srgb, var(--brand) 30%, transparent);
}
\`\`\`

If a variable is missing, the whole property can become invalid. Use a fallback when appropriate:

\`\`\`css
.badge {
  background: var(--badge-bg, #111827);
  color: var(--badge-fg, white);
}
\`\`\`

---

## 2) Scope + cascade (the real superpower)

Variables follow the cascade. You can define defaults globally, then override them for a subtree.

\`\`\`css
:root { --brand: #2563eb; }

.marketing { --brand: #db2777; }

.btn {
  background: var(--brand);
  color: white;
}
\`\`\`

Any \`.btn\` inside \`.marketing\` automatically picks up the new \`--brand\`.

---

## 3) Inheritance: variables “flow down” by default

Custom properties inherit by default, which makes them perfect for component “APIs”. You can expose knobs like padding, radius, and colors.

\`\`\`css
.button {
  --btn-bg: #2563eb;
  --btn-fg: white;
  --btn-radius: 10px;

  background: var(--btn-bg);
  color: var(--btn-fg);
  border-radius: var(--btn-radius);
  padding: 10px 14px;
}

.button.danger {
  --btn-bg: #ef4444;
}
\`\`\`

---

## 4) Theme tokens (light/dark) with variables

One of the best uses: define a tiny set of tokens and switch them by changing an attribute/class.

\`\`\`css
:root {
  --bg: white;
  --fg: #111827;
  --muted: #6b7280;
  --surface: #f3f4f6;
}

[data-theme="dark"] {
  --bg: #0b1220;
  --fg: #e5e7eb;
  --muted: #9ca3af;
  --surface: rgba(255,255,255,0.06);
}

body {
  background: var(--bg);
  color: var(--fg);
}

.card {
  background: var(--surface);
  color: var(--fg);
}
\`\`\`

---

## 5) Variables inside functions (\`calc/min/max/clamp\`)

Variables are especially powerful when combined with math functions.

\`\`\`css
:root {
  --page-pad: clamp(16px, 3vw, 40px);
  --max: 1100px;
}

.page {
  width: min(var(--max), 100%);
  margin: 0 auto;
  padding: var(--page-pad);
  box-sizing: border-box;
}
\`\`\`

Note: CSS math support evolves; when in doubt, keep variables “already unit-ed” (e.g. store \`32px\` not \`32\`).

---

## 6) JavaScript interop (read/write at runtime)

\`\`\`js
// read
const value = getComputedStyle(document.documentElement)
  .getPropertyValue("--brand")
  .trim();

// write
document.documentElement.style.setProperty("--brand", "#7c3aed");
\`\`\`

Often the cleanest approach is to toggle \`data-theme\` or a class and let CSS do the rest.

---

## 7) Common pitfalls

- **Missing var breaks the property**: use \`var(--x, fallback)\` for optional values.
- **Units matter**: store \`16px\`, \`0.875rem\`, \`40%\` rather than raw numbers unless you know the target property accepts a number.
- **Cyclic dependencies**: \`--a: var(--b)\` and \`--b: var(--a)\` makes both invalid.
- **Over-tokenizing**: variables should reduce repetition and improve theming—not hide every constant.

---

## 8) Practice

1) Create a light/dark theme using \`data-theme\` and 6–10 tokens (bg/fg/surface/muted/brand/radius).
2) Build a \`.button\` component that exposes \`--btn-bg\`, \`--btn-fg\`, and \`--btn-radius\` and customize it in two contexts.
3) Add fluid spacing with \`clamp()\` and verify from 360px → 1440px.
`;
    }

    if (lowerTitle === 'css @property') {
      return `# CSS @property

\`@property\` lets you register **typed custom properties**. The key benefit: when a custom property is typed (\`<length>\`, \`<color>\`, \`<percentage>\`, \`<angle>\`, etc.), the browser can **interpolate** it smoothly during transitions/animations.

Without registration, custom properties are effectively “untyped strings”, so animations often become **discrete jumps**.

---

## 1) Anatomy of an \`@property\` rule

\`\`\`css
@property --progress {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}
\`\`\`

- \`syntax\`: the type the browser should parse and animate
- \`inherits\`: whether the property inherits (custom props normally do)
- \`initial-value\`: required; used when nothing sets the variable

---

## 2) Example: animate a progress bar smoothly

\`\`\`css
@property --progress {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}

.progressTrack {
  height: 10px;
  background: rgba(0,0,0,0.12);
  border-radius: 999px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  width: var(--progress);
  background: #2563eb;
  border-radius: inherit;
}

.progressTrack.isLoading .progressFill {
  animation: load 1.2s ease-in-out forwards;
}

@keyframes load {
  to { --progress: 100%; }
}
\`\`\`

---

## 3) Example: animate an angle in a gradient

\`\`\`css
@property --a {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.card {
  background: conic-gradient(from var(--a), #2563eb, #22c55e, #2563eb);
  animation: spin 2.2s linear infinite;
}

@keyframes spin {
  to { --a: 360deg; }
}
\`\`\`

---

## 4) JS alternative: \`CSS.registerProperty\`

In JavaScript, you can register typed custom properties at runtime (useful if you want to gate behavior based on support).

\`\`\`js
if (CSS.registerProperty) {
  CSS.registerProperty({
    name: "--progress",
    syntax: "<percentage>",
    inherits: false,
    initialValue: "0%",
  });
}
\`\`\`

---

## 5) Progressive enhancement mindset

Even if \`@property\` isn’t supported, your UI should still render. The worst-case fallback is usually that animations become discrete (jump) instead of smooth.

Design your components so that:
- the static state looks correct without animation
- animation is a nice-to-have enhancement

---

## 6) Gotchas

- \`initial-value\` is required in \`@property\`.
- Choose the right \`syntax\`: if you pick \`"*"\`, you won’t get typed interpolation.
- If you set \`inherits: true\`, remember that values can “flow down” unexpectedly.

---

## 7) Practice

1) Implement a progress bar that animates \`--progress\` from \`0%\` to \`100%\`.
2) Create a loading skeleton or border effect driven by an animated \`<angle>\` custom property.
3) Add a JS feature check with \`CSS.registerProperty\` and keep a clean fallback.
`;
    }

    if (lowerTitle === 'css math functions') {
      return `# CSS Math Functions

CSS math functions let you compute values directly in CSS (often replacing lots of breakpoints).

---

## 1) The essentials

- \`calc()\`
- \`min()\`
- \`max()\`
- \`clamp()\`

\`\`\`css
.container {
  width: min(1100px, 100% - 32px);
}

.title {
  font-size: clamp(24px, 3vw + 8px, 44px);
}
\`\`\`

---

## 2) Common patterns

### Fluid spacing

\`\`\`css
.section {
  padding: clamp(16px, 4vw, 48px);
}
\`\`\`

### Keep a sidebar sane

\`\`\`css
.sidebar {
  width: clamp(220px, 25vw, 320px);
}
\`\`\`

---

## 3) Support notes

\`calc/min/max/clamp\` are widely supported. Newer math functions exist in specs; check support before relying on them.

---

## 4) Practice

Build fluid typography (h1, h2, body) using \`clamp()\` and verify it looks good from 360px to 1440px.
`;
    }

    if (lowerTitle.includes('flexbox') || lowerTitle.includes('flex')) {
      return `# ${title}

Flexbox is a one-dimensional layout system for arranging elements in rows or columns. It provides powerful alignment, distribution, and ordering capabilities that were difficult or impossible with older CSS techniques. Flexbox revolutionized CSS layout by solving common problems like vertical centering and equal-height columns.

Flexbox requires a flex container (display: flex) holding flex items. The flex-direction property controls whether items arrange horizontally (row) or vertically (column). Container properties like justify-content align items along the main axis, while align-items aligns items along the cross axis. These properties create flexible, responsive layouts with minimal code.

Flex items can grow, shrink, and set base sizes using flex-grow, flex-shrink, and flex-basis properties, often combined in the shorthand flex property. This flexibility allows items to adapt to available space, creating responsive layouts without media queries. The order property reorders items visually without changing HTML.

Modern web layouts extensively use Flexbox for navigation bars, card layouts, form controls, and centering content. Flexbox works exceptionally well for components where items arrange in a single direction. For two-dimensional layouts, CSS Grid is preferred, but Flexbox and Grid often work together in complex layouts.`;
    }
    if (lowerTitle.includes('grid')) {
      return `# ${title}

CSS Grid is a two-dimensional layout system for creating complex grid-based layouts. Unlike Flexbox's one-dimensional approach, Grid handles both rows and columns simultaneously, making it ideal for page layouts and components requiring precise positioning in both dimensions. Grid has become the standard for modern web layouts.

Grid containers (display: grid) define rows and columns using grid-template-rows and grid-template-columns properties. The fr (fraction) unit distributes available space proportionally, while other units like px, %, and auto offer precise control. The gap property creates spacing between grid tracks without affecting outer margins.

Grid items can span multiple rows or columns using grid-column and grid-row properties. Named grid lines and areas make complex layouts more readable and maintainable. The grid-template-areas property creates visual grid templates directly in CSS, making layouts self-documenting and easy to modify.

Professional developers use Grid for page layouts, dashboards, galleries, and any interface requiring two-dimensional control. Grid combines with Flexbox - Grid for overall layout and Flexbox for components within grid cells. Understanding Grid enables creating complex, responsive layouts previously requiring complicated float or position hacks.`;
    }
    if (lowerTitle.includes('position')) {
      return `# ${title}

The CSS position property controls how elements are positioned in documents. Values include static (default), relative, absolute, fixed, and sticky. Understanding positioning is essential for creating layered layouts, tooltips, modals, navigation bars, and other sophisticated UI components.

Relative positioning moves elements from their normal position using top, right, bottom, and left properties. The element's original space remains reserved, and other elements aren't affected. Relative positioning often serves as a reference point for absolutely positioned children.

Absolute positioning removes elements from normal document flow and positions them relative to the nearest positioned ancestor (any ancestor with position other than static). If no positioned ancestor exists, absolute positioning uses the document body. This enables overlays, tooltips, and dropdown menus that appear above other content.

Fixed positioning removes elements from document flow and positions them relative to the viewport. Fixed elements remain visible when users scroll, making them ideal for persistent headers, navigation bars, or back-to-top buttons. Sticky positioning combines relative and fixed behaviors, switching modes based on scroll position.`;
    }
    if (lowerTitle.includes('media queries')) {
      return `# ${title}

Media queries enable responsive design by applying styles based on device characteristics like screen width, height, resolution, and orientation. They're essential for creating websites that work well on devices from small phones to large desktop monitors. Media queries are the foundation of mobile-first responsive design.

Media query syntax uses @media followed by media type (screen, print) and conditions. The most common queries test viewport width with min-width and max-width. Multiple conditions combine with and, or, or not operators. Modern best practice starts with mobile styles and progressively enhances for larger screens with min-width queries.

Common breakpoints target typical device sizes: 640px for small tablets, 768px for tablets, 1024px for laptops, and 1280px for desktops. However, breakpoints should be chosen based on design needs rather than specific devices. Content should determine where layouts need to change, not arbitrary device dimensions.

Responsive design requires more than just media queries. Developers combine fluid layouts, flexible images, responsive typography, and touch-friendly interfaces. Modern CSS features like Grid and Flexbox reduce media query needs by adapting automatically. However, media queries remain essential for major layout changes and device-specific optimizations.`;
    }

    if (lowerTitle === 'css colors advanced') {
      return `# CSS Colors Advanced

Beyond basic hex/RGB, “advanced” color work is about **systems**: tokens, states, contrast, and predictable manipulation.

---

## 1) Prefer HSL for design tweaks

HSL makes it easier to create lighter/darker variants while keeping the same hue.

\`\`\`css
:root {
  --brand-h: 220;
  --brand-s: 90%;
  --brand-l: 56%;

  --brand: hsl(var(--brand-h) var(--brand-s) var(--brand-l));
  --brand-weak: hsl(var(--brand-h) var(--brand-s) 92%);
  --brand-strong: hsl(var(--brand-h) var(--brand-s) 40%);
}
\`\`\`

---

## 2) Alpha channels (don’t fade children by accident)

Use alpha colors for overlays instead of \`opacity\` on a parent.

\`\`\`css
.overlay {
  background: rgba(0, 0, 0, 0.55);
}
\`\`\`

---

## 3) \`currentColor\` (huge for icons)

\`\`\`css
.icon { fill: currentColor; }
.danger { color: #ef4444; }
\`\`\`

Now icons follow text color automatically.

---

## 4) Theme tokens with CSS variables

Build tokens once, swap values per theme:

\`\`\`css
:root {
  --bg: #0b1020;
  --panel: rgba(255, 255, 255, 0.06);
  --text: #e5e7eb;
  --muted: rgba(229, 231, 235, 0.75);
  --border: rgba(229, 231, 235, 0.15);
  --accent: #22c55e;
}

html.light {
  --bg: #ffffff;
  --panel: rgba(0, 0, 0, 0.04);
  --text: #0f172a;
  --muted: rgba(15, 23, 42, 0.75);
  --border: rgba(15, 23, 42, 0.12);
  --accent: #2563eb;
}
\`\`\`

---

## 5) Contrast (accessibility)

Rule of thumb:
- body text must be highly readable on its background
- focus rings must be obvious

Use Lighthouse or a contrast checker; don’t rely on “looks fine”.

---

## 6) Practice

Create a token-based color system with:
- default + hover + active + disabled states for a button
- light + dark themes
- visible focus ring
`;
    }

    if (lowerTitle === 'css color keywords') {
      return `# CSS Color Keywords

CSS includes named colors like \`red\`, \`tomato\`, \`rebeccapurple\`. They’re great for quick prototyping, but for real design systems, prefer tokens (variables) and explicit formats.

---

## 1) Examples

\`\`\`css
.danger { color: red; }
.fun { color: rebeccapurple; }
.muted { color: gray; }
\`\`\`

---

## 2) Pros / cons

Pros:
- fast to type
- readable

Cons:
- not tied to a brand palette
- different monitors interpret them differently
- hard to define consistent variants (hover/active)

---

## 3) Practical approach

Use keywords for:
- debugging (temporary outlines)
- demos

Use variables for real UI:

\`\`\`css
:root { --danger: #ef4444; }
.danger { color: var(--danger); }
\`\`\`

---

## 4) Practice

Prototype using keywords, then “graduate” to variables: map each keyword to a token.
`;
    }

    if (lowerTitle === 'css gradients') {
      return `# CSS Gradients

Gradients are generated images. They’re powerful for backgrounds, overlays, badges, and subtle depth.

---

## 1) Linear gradient

\`\`\`css
.banner {
  background: linear-gradient(90deg, #22c55e, #3b82f6);
  color: white;
}
\`\`\`

---

## 2) Radial gradient

\`\`\`css
.spotlight {
  background: radial-gradient(circle at top left, rgba(59,130,246,0.35), transparent 55%);
}
\`\`\`

---

## 3) Conic gradient (great for charts/rings)

\`\`\`css
.ring {
  background: conic-gradient(#22c55e 0 70%, rgba(255,255,255,0.15) 0 100%);
  border-radius: 50%;
}
\`\`\`

---

## 4) Gradient overlay on image

\`\`\`css
.hero {
  background:
    linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.15)),
    url('/assets/hero.jpg');
  background-size: cover;
  background-position: center;
}
\`\`\`

---

## 5) Gradient “border” (common pattern)

\`\`\`css
.gradBorder {
  border-radius: 14px;
  padding: 1px;
  background: linear-gradient(90deg, #22c55e, #3b82f6);
}

.gradBorder > .inner {
  border-radius: 13px;
  background: var(--bg, #0b1020);
  padding: 16px;
}
\`\`\`

---

## 6) Practice

Build a hero section with a background image + overlay gradient + readable text and buttons.
`;
    }

    if (lowerTitle === 'css shadows') {
      return `# CSS Shadows

Shadows add depth, focus, and separation. Use them subtly; heavy shadows feel dated.

---

## 1) box-shadow basics

\`\`\`css
.card {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
\`\`\`

Format:
\`offset-x offset-y blur spread color\`

---

## 2) Multiple shadows (more realistic)

\`\`\`css
.card {
  box-shadow:
    0 1px 2px rgba(0,0,0,0.10),
    0 10px 30px rgba(0,0,0,0.12);
}
\`\`\`

---

## 3) Inset shadow

\`\`\`css
.input {
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.12);
}
\`\`\`

---

## 4) text-shadow (use sparingly)

\`\`\`css
.title {
  text-shadow: 0 2px 10px rgba(0,0,0,0.45);
}
\`\`\`

---

## 5) filter: drop-shadow (good for PNG/SVG)

\`\`\`css
.logo {
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.25));
}
\`\`\`

---

## 6) Practice

Define a 3-level shadow scale (sm/md/lg) as CSS variables and apply consistently across cards/modals.
`;
    }

    if (lowerTitle === 'css text effects') {
      return `# CSS Text Effects

Text effects are about readability and polish: truncation, spacing, decoration, and subtle emphasis.

---

## 1) Truncation (ellipsis)

\`\`\`css
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
\`\`\`

---

## 2) Multi-line clamp

\`\`\`css
.clamp3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
\`\`\`

---

## 3) Underline styling

\`\`\`css
a {
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 2px;
}
\`\`\`

---

## 4) Better readability

\`\`\`css
.article {
  line-height: 1.7;
  letter-spacing: 0.2px;
}
\`\`\`

---

## 5) Hyphenation (optional)

\`\`\`css
.article {
  hyphens: auto;
}
\`\`\`

---

## 6) Practice

Make a card layout where the title is single-line ellipsis and description is clamped to 2–3 lines.
`;
    }

    if (lowerTitle === 'css custom fonts') {
      return `# CSS Custom Fonts

Custom fonts can elevate design, but they can also slow pages if misused. The goal: **good typography with minimal performance cost**.

---

## 1) Use a strong fallback stack

\`\`\`css
body {
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}
\`\`\`

---

## 2) @font-face (recommended: woff2)

\`\`\`css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
\`\`\`

\`font-display: swap\` avoids invisible text (FOIT) by showing fallback first.

---

## 3) Reduce font payload

- load only required weights
- prefer variable fonts when possible
- subset fonts (latin only, etc.)

---

## 4) Preload critical fonts (if appropriate)

\`\`\`html
<link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin />
\`\`\`

---

## 5) Practice

Add one custom font with \`font-display: swap\`, then measure Lighthouse performance before/after.
`;
    }

    if (lowerTitle === 'css 2d transforms') {
      return `# CSS 2D Transforms

2D transforms change how an element is rendered without affecting document flow (great for animation).

---

## 1) Common transform functions

\`\`\`css
.move { transform: translate(12px, 6px); }
.scale { transform: scale(1.05); }
.rotate { transform: rotate(8deg); }
.skew { transform: skewX(8deg); }
\`\`\`

Transforms can be combined:

\`\`\`css
.combo { transform: translateY(-2px) scale(1.02); }
\`\`\`

---

## 2) Transform origin

\`\`\`css
.needle {
  transform-origin: left center;
  transform: rotate(25deg);
}
\`\`\`

---

## 3) Hover micro-interactions

\`\`\`css
.card {
  transition: transform 180ms ease;
}

.card:hover {
  transform: translateY(-2px);
}
\`\`\`

---

## 4) Practice

Create a card hover effect (lift + subtle scale) that feels fast and smooth.
`;
    }

    if (lowerTitle === 'css 3d transforms') {
      return `# CSS 3D Transforms

3D transforms add depth using perspective and rotations around X/Y/Z axes.

---

## 1) Perspective

\`\`\`css
.scene { perspective: 900px; }
\`\`\`

Perspective is usually set on a parent.

---

## 2) Card flip example

\`\`\`css
.scene { perspective: 900px; }

.card3d {
  position: relative;
  width: 240px;
  height: 140px;
  transform-style: preserve-3d;
  transition: transform 300ms ease;
}

.card3d:hover { transform: rotateY(180deg); }

.face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}

.back { transform: rotateY(180deg); }
\`\`\`

---

## 3) Motion preference

Always respect reduced motion:

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  .card3d { transition: none; }
  .card3d:hover { transform: none; }
}
\`\`\`

---

## 4) Practice

Build a flip card with front/back content and ensure it still works for keyboard users (no hover-only navigation).
`;
    }

    if (lowerTitle === 'css transitions') {
      return `# CSS Transitions

Transitions animate property changes caused by state updates (hover, focus, class changes). They’re best for subtle UI feedback.

---

## 1) Recommended pattern

\`\`\`css
.btn {
  transition: transform 160ms ease, background-color 160ms ease, color 160ms ease;
}

.btn:hover { transform: translateY(-1px); }
\`\`\`

Avoid \`transition: all\` — it often causes unexpected animations.

---

## 2) Timing functions

- \`ease\`: general UI
- \`linear\`: progress bars
- \`cubic-bezier(...)\`: custom “snappy” feels

---

## 3) Performance tip

Prefer animating:
- \`transform\`
- \`opacity\`

Avoid heavy layout animation (\`width\`, \`height\`, \`top\`, \`left\`).

---

## 4) Reduced motion

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}
\`\`\`

---

## 5) Practice

Add hover + focus-visible transitions to a navbar and ensure it still feels responsive.
`;
    }

    if (lowerTitle === 'css animations') {
      return `# CSS Animations

Animations run over time using \`@keyframes\`. Use them to guide attention, show progress, or add polish — not to distract.

---

## 1) Keyframes

\`\`\`css
@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.03); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

.badge {
  animation: pulse 1.2s ease-in-out infinite;
}
\`\`\`

---

## 2) A simple spinner

\`\`\`css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255,255,255,0.25);
  border-top-color: rgba(255,255,255,0.9);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
\`\`\`

---

## 3) Animation properties (shorthand)

\`\`\`css
.toast {
  animation: slideIn 220ms ease-out both;
}
\`\`\`

\`both\` is \`animation-fill-mode\` so it keeps the initial/final keyframe values.

---

## 4) Respect reduced motion

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}
\`\`\`

---

## 5) Practice

Create a toast notification that slides in/out using animation + prefers-reduced-motion fallback.
`;
    }

    if (lowerTitle === 'css tooltips') {
      return `# CSS Tooltips

A tooltip is a small piece of contextual text shown near a trigger (icon, word, button). Good tooltips are:
- short (1–2 lines)
- shown on **hover and focus**
- not required to complete key tasks (don’t hide essential info)

---

## 1) A practical (CSS-first) tooltip pattern

Use an attribute (like \`data-tooltip\`) and a relatively positioned wrapper.

\`\`\`html
<button class="tip" data-tooltip="Saved settings">Save</button>
\`\`\`

\`\`\`css
.tip {
  position: relative;
}

.tip::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%);

  padding: 6px 10px;
  border-radius: 8px;
  white-space: nowrap;

  background: rgba(0,0,0,0.85);
  color: white;
  font-size: 12px;
  line-height: 1.2;

  opacity: 0;
  pointer-events: none;
  transition: opacity 140ms ease, transform 140ms ease;
}

.tip:hover::after,
.tip:focus-visible::after {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}
\`\`\`

---

## 2) Accessibility notes (important)

- Tooltips should also work on keyboard: use \`:focus-visible\`.
- If the tooltip contains critical info, don’t rely on hover-only.
- For “true” accessible tooltips, you typically add markup and link it with \`aria-describedby\` and a \`role="tooltip"\` element.

---

## 3) Common issues

- Tooltip gets cut off: a parent might have \`overflow: hidden\`.
- Tooltip behind other elements: ensure \`z-index\` and a positioned ancestor.
- Mobile: hover doesn’t exist; prefer tap-to-toggle with JS for complex cases.

---

## 4) Practice

Build a tooltip for an “info” icon that shows on hover + focus, and make sure it doesn’t overlap the icon on small screens.
`;
    }

    if (lowerTitle === 'css image styling') {
      return `# CSS Image Styling

Image styling in CSS is mostly about three goals:
1) **Responsiveness** (no overflow)
2) **Consistency** (aspect ratios, alignment)
3) **Polish** (rounded corners, shadows, effects)

---

## 1) The responsive image baseline

\`\`\`css
img {
  max-width: 100%;
  height: auto;
  display: block;
}
\`\`\`

Why \`display: block\`? It removes the “baseline gap” that often appears under inline images.

---

## 2) Rounded corners + shadows

\`\`\`css
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 9999px;
  object-fit: cover;
}

.card-img {
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
}
\`\`\`

---

## 3) Consistent aspect ratios

\`\`\`css
.thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
\`\`\`

---

## 4) Images vs background-images

Use \`<img>\` when the image is content (SEO/accessibility). Use \`background-image\` when it’s decoration.

---

## 5) Practice

Create a “blog card” image that always stays 16:9, crops nicely, and has rounded corners.
`;
    }

    if (lowerTitle === 'css image modal') {
      return `# CSS Image Modal

An image modal (lightbox) shows a larger version of an image on top of the page.

Pure CSS can create the *visual* overlay, but a production modal usually needs JS for:
- focus trapping
- ESC to close
- preventing background scroll

---

## 1) The overlay layout

\`\`\`html
<div class="overlay" aria-hidden="true">
  <figure class="modal">
    <img src="/photo.jpg" alt="Mountain at sunset" />
    <figcaption>Mountain at sunset</figcaption>
  </figure>
</div>
\`\`\`

\`\`\`css
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: grid;
  place-items: center;
  padding: 24px;
}

.modal {
  max-width: min(900px, 100%);
  max-height: 100%;
  margin: 0;
}

.modal img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
}
\`\`\`

---

## 2) Z-index + scroll

- Ensure the overlay is on top (often \`z-index: 50\` or similar).
- Consider disabling background scroll when open (JS: \`document.body.style.overflow = 'hidden'\`).

---

## 3) Practice

Create a modal layout that centers a large image and keeps it within the viewport on small screens.
`;
    }

    if (lowerTitle === 'css image centering') {
      return `# CSS Image Centering

Centering images depends on what “center” means:
- centered horizontally in a column
- centered both horizontally + vertically in a fixed box
- centered while cropping (like a cover photo)

---

## 1) Center a block image horizontally

\`\`\`css
img.logo {
  display: block;
  margin: 0 auto;
}
\`\`\`

---

## 2) Center inside a container (both axes)

\`\`\`css
.frame {
  width: 240px;
  height: 160px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(0,0,0,0.15);
}
\`\`\`

---

## 3) Center while cropping (cover)

\`\`\`css
.hero {
  width: 100%;
  height: 320px;
}

.hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
\`\`\`

---

## 4) Practice

Build a fixed-size thumbnail grid where each image is perfectly centered and cropped consistently.
`;
    }

    if (lowerTitle === 'css image filters') {
      return `# CSS Image Filters

CSS filters apply visual effects like blur, grayscale, and contrast.

---

## 1) Basic filter examples

\`\`\`css
.muted { filter: grayscale(1) contrast(0.9) brightness(0.95); }
.soft  { filter: blur(2px); }
.pop   { filter: saturate(1.3) contrast(1.1); }
\`\`\`

Common functions:
- \`blur(px)\`
- \`brightness(n)\`
- \`contrast(n)\`
- \`grayscale(n)\`
- \`hue-rotate(deg)\`
- \`invert(n)\`
- \`saturate(n)\`
- \`sepia(n)\`
- \`drop-shadow(...)\`

---

## 2) Hover effects (subtle)

\`\`\`css
.card img {
  transition: filter 180ms ease, transform 180ms ease;
}

.card:hover img {
  filter: saturate(1.15) contrast(1.05);
  transform: scale(1.01);
}
\`\`\`

---

## 3) Performance considerations

Filters can be expensive on large images, especially when animated. Prefer:
- small images/thumbnails
- small durations
- not applying filters to huge full-screen images continuously

---

## 4) Practice

Create a gallery where images are grayscale by default and become full-color on hover/focus.
`;
    }

    if (lowerTitle === 'css image shapes') {
      return `# CSS Image Shapes

“Image shapes” typically means cropping an image to a circle, rounded rectangle, polygon, or custom silhouette.

---

## 1) Circle / rounded shapes (simple)

\`\`\`css
.circle {
  width: 96px;
  height: 96px;
  border-radius: 9999px;
  object-fit: cover;
}
\`\`\`

---

## 2) Clip-path shapes (advanced)

\`\`\`css
.hex {
  width: 220px;
  aspect-ratio: 1;
  object-fit: cover;
  clip-path: polygon(
    25% 6.7%, 75% 6.7%,
    100% 50%,
    75% 93.3%, 25% 93.3%,
    0% 50%
  );
}
\`\`\`

---

## 3) Shape-outside (text wrapping)

Use \`shape-outside\` when you want text to wrap around a floated image.

---

## 4) Practice

Create an avatar that is circular on mobile and becomes a rounded rectangle on desktop using media queries.
`;
    }

    if (lowerTitle === 'css object-fit') {
      return `# CSS object-fit

\`object-fit\` controls how an image (or video) fills its box when you set both width and height.

---

## 1) When it matters

\`object-fit\` only has a visible effect when the element’s box size differs from its intrinsic aspect ratio.

\`\`\`css
.thumb {
  width: 260px;
  height: 160px;
  object-fit: cover; /* crop nicely */
}
\`\`\`

---

## 2) Common values

- \`cover\`: fill the box, crop overflow (best for thumbnails)
- \`contain\`: fit fully, may leave letterboxing
- \`fill\`: stretch (usually undesirable)
- \`none\`: don’t resize
- \`scale-down\`: smaller of \`none\` and \`contain\`

---

## 3) Pair with aspect-ratio

\`\`\`css
.thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
\`\`\`

---

## 4) Practice

Build a card list where every thumbnail is the same size and uses \`cover\` without distortion.
`;
    }

    if (lowerTitle === 'css object-position') {
      return `# CSS object-position

\`object-position\` controls the alignment of an image inside its box (especially useful with \`object-fit: cover\`).

---

## 1) Focal point positioning

\`\`\`css
.banner img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  object-position: 50% 25%; /* center horizontally, higher vertically */
}
\`\`\`

---

## 2) Keywords and values

- keywords: \`top\`, \`bottom\`, \`left\`, \`right\`, \`center\`
- lengths/percentages: \`20px 10%\`

---

## 3) Practice

Use \`object-position\` to keep a face centered in a profile image thumbnail.
`;
    }

    if (lowerTitle === 'css masking') {
      return `# CSS Masking

CSS masking lets you “cut out” parts of an element using an image, SVG, or gradient mask.

---

## 1) Gradient mask example

\`\`\`css
.fade {
  mask-image: linear-gradient(to bottom, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent);
}
\`\`\`

Black areas remain visible; transparent areas become hidden.

---

## 2) Controlling the mask

\`\`\`css
.masked {
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}
\`\`\`

---

## 3) When to use masking

- soft fades on images
- shaped reveals (logos, blobs)
- advanced effects that \`clip-path\` can’t do (soft edges)

Note: masking support can vary; include fallbacks (e.g., \`clip-path\` or simple rounded corners).

---

## 4) Practice

Create an image that fades out at the bottom using a linear-gradient mask.
`;
    }

    if (lowerTitle === 'css buttons') {
      return `# CSS Buttons

Buttons are one of the highest-impact UI elements. A good button system includes:
- consistent padding/sizing
- hover + active feedback
- focus-visible styles (keyboard)
- disabled state

---

## 1) A solid button base

\`\`\`css
.btn {
  appearance: none;
  border: 0;
  border-radius: 10px;
  padding: 10px 14px;
  font: inherit;
  line-height: 1;
  cursor: pointer;
  transition: transform 140ms ease, opacity 140ms ease;
}

.btn:active { transform: translateY(1px); }

.btn:focus-visible {
  outline: 3px solid rgba(59,130,246,0.6);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
\`\`\`

---

## 2) Variants

\`\`\`css
.btn-primary { background: #111827; color: white; }
.btn-primary:hover { opacity: 0.92; }

.btn-ghost { background: transparent; border: 1px solid rgba(0,0,0,0.15); }
.btn-ghost:hover { background: rgba(0,0,0,0.04); }
\`\`\`

---

## 3) Common mistakes

- Styling \`div\` as a button: use \`<button>\` for semantics and keyboard support.
- Removing outline without a replacement: breaks accessibility.
- Using only color to indicate state: add text/icon changes when important.

---

## 4) Practice

Create Primary / Secondary / Danger button variants and make them keyboard-accessible with \`:focus-visible\`.
`;
    }

    if (lowerTitle.includes('animation')) {
      return `# ${title}

CSS animations create sophisticated motion effects without JavaScript. Animations are defined using @keyframes rules that specify style changes at various points during the animation. The animation property applies these keyframes to elements, controlling duration, timing, delay, iteration, and direction.

Keyframes define animation stages using percentages or from/to keywords. At each stage, specify CSS properties that should change. The browser smoothly interpolates between keyframes, creating fluid motion. Animations can change any animatable CSS property including transforms, opacity, colors, and dimensions.

The animation property is shorthand for animation-name, animation-duration, animation-timing-function, animation-delay, animation-iteration-count, animation-direction, animation-fill-mode, and animation-play-state. Understanding each sub-property provides fine control over animation behavior. Timing functions like ease, linear, and cubic-bezier control acceleration and deceleration.

Professional animations enhance user experience without causing distraction or performance issues. Excessive animation can make interfaces feel sluggish or overwhelming. Respect user preferences with prefers-reduced-motion media queries, which disable animations for users who find them disorienting. Well-crafted animations guide attention, provide feedback, and create delightful interactions.`;
    }
    if (lowerTitle.includes('variables') || lowerTitle.includes('custom properties')) {
      return `# ${title}

CSS custom properties (CSS variables) store reusable values that can be referenced throughout stylesheets. Variables are defined with -- prefix and accessed using the var() function. They enable dynamic theming, reduce repetition, and make stylesheets more maintainable. Unlike preprocessor variables, CSS variables update live in the browser.

Variables are declared within selectors, typically :root for global scope. For example, --primary-color: #3498db defines a color variable. Variables can store any CSS value including colors, dimensions, fonts, or complex values like gradients. Scoped variables in specific selectors override global ones, enabling component-specific customization.

The var() function retrieves variable values and accepts fallback values if variables are undefined. For example, var(--primary-color, blue) uses blue if --primary-color isn't defined. This fallback mechanism ensures styles degrade gracefully. Variables can reference other variables, creating hierarchical theming systems.

Modern web applications use CSS variables extensively for theming, component customization, and responsive design. JavaScript can read and modify CSS variables, enabling dynamic theme switching and state-dependent styling. While Sass variables compile to static values, CSS variables provide runtime flexibility essential for modern interactive applications.`;
    }
    if (lowerTitle.includes('transitions')) {
      return `# ${title}

CSS transitions create smooth animations when property values change. Unlike animations that run automatically, transitions activate when triggered by state changes like hover, focus, or JavaScript modifications. Transitions enhance user experience by making changes feel smooth and natural rather than jarring and instant.

The transition property is shorthand for transition-property (what to animate), transition-duration (how long), transition-timing-function (acceleration curve), and transition-delay (wait time). For example, transition: background-color 0.3s ease creates a 0.3-second background color transition with ease timing.

Timing functions control how transitions progress over time. Linear timing creates consistent speed, ease starts slow then speeds up and slows down, and cubic-bezier enables custom curves. The transition-property can target specific properties or use all to transition everything. Multiple transitions can be comma-separated for different properties.

Effective transitions provide visual feedback for user interactions. Buttons change color on hover, form fields highlight on focus, and menus animate open and closed. Transitions should be quick enough to feel responsive but not so fast users miss them. Durations between 200-400ms work well for most interface transitions, creating polished, professional user experiences.`;
    }
    if (lowerTitle.includes('specificity')) {
      return `# ${title}

CSS specificity determines which styles apply when multiple rules target the same element. Specificity is calculated based on selector types: inline styles have highest specificity, followed by IDs, classes/attributes/pseudo-classes, and finally elements/pseudo-elements. Understanding specificity prevents styling conflicts and reduces !important usage.

Specificity is calculated as a three-part number (inline, IDs, classes+attributes+pseudo-classes, elements). For example, #header .nav li has specificity (0,1,1,1) - one ID, one class, one element. More specific selectors override less specific ones. Equal specificity uses source order - later rules win.

The !important declaration overrides normal specificity rules, making styles difficult to override. !important creates maintenance problems and should be avoided except for utility classes or third-party style overrides. Refactoring specificity issues by increasing selector specificity is preferable to !important.

Professional CSS maintainability requires managing specificity consciously. Methodologies like BEM keep specificity low and consistent. Avoiding deeply nested selectors and ID selectors maintains flexibility. CSS architecture balancing specificity and maintainability produces scalable, conflict-free stylesheets.`;
    }
    if (lowerTitle.includes('pseudo-class')) {
      return `# ${title}

CSS pseudo-classes style elements based on their state or position rather than attributes. Common pseudo-classes include :hover, :focus, :active, :visited, :first-child, :last-child, :nth-child, and :not. Pseudo-classes enable dynamic styling without JavaScript, creating interactive, context-aware designs.

State pseudo-classes respond to user interactions. :hover applies when users point at elements, :focus when elements receive keyboard or programmatic focus, and :active during clicks. :visited styles visited links differently. These pseudo-classes create interactive feedback without JavaScript.

Structural pseudo-classes select elements by position. :first-child and :last-child target first and last children, :nth-child(n) uses formulas for patterns, :only-child targets solitary children. These selectors eliminate the need for classes on every element, producing cleaner HTML.

Form pseudo-classes style inputs based on state: :valid, :invalid, :required, :optional, :checked, :disabled. These provide visual feedback during form interactions. Modern pseudo-classes like :is(), :where(), and :has() offer powerful selection capabilities. Understanding pseudo-classes enables sophisticated styling with minimal markup.`;
    }
    if (lowerTitle.includes('pseudo-element')) {
      return `# ${title}

CSS pseudo-elements style specific parts of elements or insert generated content. Using double-colon syntax (::before, ::after, ::first-line, ::first-letter), pseudo-elements create visual effects without extra HTML. Pseudo-elements are essential for decorative effects, icons, and special typography.

::before and ::after pseudo-elements insert content before or after element content. They require the content property, which can be text, images, or empty strings for styling purposes. These pseudo-elements are inline by default but accept display changes. They're commonly used for icons, decorative elements, and clearfix hacks.

::first-letter and ::first-line style initial letters and lines, enabling drop caps and special formatting. ::selection styles text users select. ::marker customizes list markers. Modern pseudo-elements like ::placeholder style form placeholders. Pseudo-elements expand styling possibilities beyond HTML structure.

Professional designs use pseudo-elements for decorative effects, reducing HTML clutter. Icon fonts and symbols often use ::before and ::after. Quotation marks, tooltips, and badges commonly use pseudo-elements. Understanding pseudo-elements enables cleaner markup and reusable styling patterns. However, pseudo-element content isn't selectable or accessible to screen readers.`;
    }
    if (lowerTitle.includes('colors')) {
      return `# ${title}

CSS supports multiple color formats including named colors, hexadecimal, RGB, RGBA, HSL, and HSLA. Modern CSS adds color functions for manipulation and relative colors. Understanding color formats enables precise color control and theming systems. Color choice significantly impacts design aesthetics and accessibility.

Hexadecimal colors use # followed by six (or three for shorthand) digits representing red, green, blue values. RGB/RGBA uses rgb(r, g, b) or rgba(r, g, b, a) functions with values 0-255 for colors and 0-1 for alpha transparency. HSL/HSLA specifies hue, saturation, lightness, enabling intuitive color variations.

Modern CSS includes currentColor keyword inheriting text color, transparent for fully transparent colors, and color() function for wide-gamut colors. Custom properties store colors for theming. Color-contrast() and color-mix() functions (where supported) enable dynamic color calculations.

Accessible color usage requires sufficient contrast between text and backgrounds. WCAG AA requires 4.5:1 ratio for normal text, 3:1 for large text. Tools like Contrast Checker validate accessibility. Color shouldn't convey information alone - combine with text or patterns. Understanding color psychology, cultural associations, and accessibility ensures effective design.`;
    }
    if (lowerTitle.includes('transform')) {
      return `# ${title}

CSS transforms alter element appearance through rotation, scaling, skewing, and translation without affecting document flow. Transform functions include rotate(), scale(), translateX/Y/Z(), skew(), and matrix() for simultaneous transformations. Transforms are hardware-accelerated, making them performant for animations.

2D transforms operate in two dimensions. translate(x, y) moves elements, scale(x, y) changes size, rotate(deg) rotates, and skew(deg) slants. Multiple transforms can be chained: transform: rotate(45deg) scale(1.2). Transform-origin controls the point around which transformations occur, defaulting to element center.

3D transforms add depth using perspective and Z-axis. perspective() creates 3D space, translateZ() moves on Z-axis, rotateX/Y/Z() rotates in 3D. The transform-style: preserve-3d property maintains 3D positioning for child elements. Backface-visibility controls whether element backs show during 3D rotations.

Transforms enable sophisticated visual effects - rotating cards, scaling on hover, creating 3D flips, and parallax scrolling. Transforms combined with transitions create smooth interactive effects. Unlike modifying top/left, transforms don't trigger layout recalculation, making them efficient for animations. Modern UI animations extensively rely on transform properties.`;
    }
    if (lowerTitle.includes('units')) {
      return `# ${title}

CSS units measure sizes, distances, and time in stylesheets. Understanding units is fundamental to responsive design and precise layouts. Units divide into absolute (fixed size) and relative (proportional size). Choosing appropriate units affects accessibility, maintainability, and responsive behavior.

Absolute units include px (pixels), pt (points), cm, mm, and in (inches). Pixels are most common for absolute sizing. While absolute sizing seems precise, it doesn't respond to user preferences or viewport changes. Absolute units suit specific cases like borders or shadows but generally should be avoided for layout and typography.

Relative units scale based on context. em sizes relative to parent element font-size, rem relative to root element, % relative to parent size. vw/vh size relative to viewport width/height, vmin/vmax relative to smaller/larger viewport dimension. Relative units create flexible, accessible designs adapting to different contexts.

Modern best practices favor rem for typography (respects user font preferences), % or vw/vh for layouts, and px for small fixed values like borders. The ch unit sizes relative to "0" character width, useful for text-based sizing. The clamp() function combines min, preferred, and max values for fluid typography. Choosing appropriate units is essential for responsive, accessible web design.`;
    }
    if (lowerTitle.includes('sass') || lowerTitle.includes('scss')) {
      return `# ${title}

Sass (Syntactically Awesome Style Sheets) is a CSS preprocessor adding features like variables, nesting, mixins, functions, and inheritance. Sass extends CSS with programming capabilities, improving maintainability for large projects. Sass compiles to standard CSS before deployment.

Variables in Sass store reusable values like colors, fonts, or dimensions using $ syntax. Unlike CSS custom properties, Sass variables compile to static values. Nesting mirrors HTML structure, improving readability but requiring care to avoid excessive specificity. Partial files and @import organize stylesheets into manageable modules.

Mixins are reusable style blocks accepting arguments, eliminating repetition. @extend shares styles between selectors. Functions perform calculations and return values. Control directives like @if, @each, and @for enable conditional and iterative styling. These features reduce code duplication and improve maintainability.

Modern development often pairs Sass with CSS custom properties - Sass for build-time logic, CSS properties for runtime theming. Build tools like webpack, Vite, or Parcel compile Sass automatically. While native CSS has adopted some Sass features (variables, nesting proposal), Sass remains valuable for complex projects requiring advanced preprocessing capabilities.`;
    }
    if (lowerTitle.includes('responsive') || (lowerTitle.includes('rwd') && !lowerTitle.includes('keyword'))) {
      return `# ${title}

Responsive web design (RWD) creates websites that adapt gracefully to different devices and screen sizes. RWD combines fluid grids, flexible images, and media queries to deliver optimal experiences from phones to large monitors. Mobile traffic dominates the web, making responsive design essential rather than optional.

Fluid grids use relative units like percentages instead of fixed pixels, allowing layouts to scale proportionally. Modern CSS Grid and Flexbox create sophisticated responsive layouts with minimal code. Container queries (emerging feature) enable components to respond to parent size rather than viewport, improving modularity.

Media queries apply styles based on device characteristics. Mobile-first approaches start with mobile styles and enhance for larger screens using min-width queries. Common breakpoints target tablets (768px) and desktops (1024px), but content should dictate breakpoints. Media queries also detect orientation, resolution, and user preferences like dark mode or reduced motion.

Responsive images use srcset and sizes attributes to serve appropriately sized images, reducing bandwidth. The picture element provides more control with multiple sources and art direction. CSS object-fit controls image scaling within containers. Combining responsive HTML, CSS, and performance optimization creates fast, adaptive websites that work everywhere.`;
    }
    if (lowerTitle.includes('border') && !lowerTitle.includes('image')) {
      return `# ${title}

CSS borders create visible boundaries around elements using border-width, border-style, and border-color properties. The border shorthand combines these: border: 1px solid #000. Borders can be set individually for each side (top, right, bottom, left) or applied uniformly. Borders affect box model dimensions unless box-sizing: border-box is set.

Border styles include solid, dashed, dotted, double, groove, ridge, inset, and outset. Border width accepts thin, medium, thick keywords or specific values. Border color accepts any CSS color format. Individual sides use border-top, border-right, etc. The border-radius property creates rounded corners.

Modern borders include border-image for complex borders using images, and outline for focus indicators that don't affect layout. Box-shadow creates drop shadows and multiple borders without affecting layout. Border-radius creates rounded corners, accepting different values for each corner for elliptical rounding.

Professional designs use borders for visual separation, focus indicators, and decorative effects. Subtle borders prevent harsh edges, while prominent borders create emphasis. Borders on form fields indicate interactivity. Focus indicators (outlines or border changes) are essential for keyboard accessibility. Borders are fundamental to visual design and UI clarity.`;
    }
    if (lowerTitle.includes('margin') || lowerTitle.includes('padding')) {
      return `# ${title}

Margins and padding create space around and within elements. Margins create external space between elements, while padding creates internal space between content and borders. Understanding these spacing properties is fundamental to layout control and visual hierarchy. Proper spacing improves readability and visual appeal.

Both properties accept one to four values setting all sides, vertical/horizontal pairs, or individual sides. For example, margin: 10px applies to all sides, margin: 10px 20px sets vertical and horizontal, margin: 10px 20px 30px 40px sets top, right, bottom, left. Shorthand reduces code and improves maintainability.

Margin collapse occurs when vertical margins between adjacent elements combine rather than add. The larger margin wins, not the sum. Padding never collapses. Understanding collapse prevents unexpected spacing. Margin auto centers block elements with defined width. Negative margins pull elements closer or create overlaps.

Best practices use consistent spacing scales (8px, 16px, 24px) for visual harmony. Modern spacing utilities and custom properties centralize spacing values. Maintaining consistent spacing throughout designs creates professional, polished interfaces. Proper spacing improves scannability, groups related content, and creates visual rhythm.`;
    }
    if (lowerTitle.includes('display')) {
      return `# ${title}

The CSS display property controls how elements generate boxes in the layout. Values include block, inline, inline-block, flex, grid, none, and many others. Understanding display is fundamental to CSS layout. Display determines element sizing, positioning, and interaction with siblings.

Block elements (div, p, h1) start on new lines and take full available width. Inline elements (span, a, strong) flow within text and size to content. Inline-block combines inline flow with block sizing capabilities. Display: none removes elements completely from layout, unlike visibility: hidden which reserves space.

Display: flex creates flex containers enabling flexbox layout. Display: grid creates grid containers for two-dimensional layouts. These modern display modes revolutionized CSS layout, replacing float-based designs. Display: contents removes the element's box, promoting children to the parent's level in layout.

Modern layouts extensively use flex and grid display modes. Display: table and related values create table-like layouts without HTML tables. Display impacts accessibility - screen readers may announce elements differently based on display. Understanding display behavior enables creating any layout from simple stacks to complex grids and flexible components.`;
    }
    if (lowerTitle.includes('float')) {
      return `# ${title}

The float property moves elements to the left or right, allowing text and inline elements to wrap around them. Originally designed for magazine-style text wrapping, floats became the primary layout technique before Flexbox and Grid emerged. Understanding floats remains relevant for wrapping text around images and understanding legacy code.

Float values include left (moves element left), right (moves element right), and none (default). Floated elements are removed from normal document flow but remain affecting surrounding content. Text and inline elements wrap around floated elements. Multiple floats stack horizontally until width is insufficient.

Clearing floats prevents content from wrapping. The clear property with left, right, or both values moves elements below floats. Container collapse occurs when all children are floated - the clearfix hack or overflow: auto solves this. Modern layouts often use display: flow-root for float containment.

While Flexbox and Grid replaced floats for layout, floats remain useful for text wrapping around images - their original purpose. Legacy codebases extensively use floats. Understanding float behavior helps maintain older code and implement specific wrapping effects. For new projects, prefer modern layout methods over float-based designs.`;
    }
    if (lowerTitle.includes('overflow')) {
      return `# ${title}

The overflow property controls how content behaves when it exceeds element boundaries. Values include visible (default, content overflows), hidden (clips overflow), scroll (adds scrollbars), and auto (scrollbars only when needed). Overflow management is essential for constrained layouts, scrollable regions, and preventing layout breaks.

Overflow-x and overflow-y control horizontal and vertical overflow independently. Overflow: hidden clips content, useful for clearing floats, preventing margin collapse, or creating specific effects. Overflow: scroll always shows scrollbars even when unnecessary, while auto shows them only when content overflows.

Modern overflow values include overflow: clip (hard clipping without scrolling), overlay (deprecated, scrollbars over content), and scroll-behavior: smooth for smooth scrolling. The overflow-wrap and word-break properties control text overflow behavior. Text-overflow: ellipsis adds ... for truncated text.

Professional designs use overflow carefully. Scrollable regions require sufficient contrast for scrollbars and keyboard accessibility. Overflow: hidden prevents layout breaks but hides content. Touch devices need sufficient scroll target sizes. Understanding overflow behavior prevents layout issues and creates controlled scrolling experiences.`;
    }
    return null; // Return null if no specific content found for this CSS topic
  }

  // JavaScript Topics
  if (category === 'JavaScript') {
    if (lowerTitle.includes('tutorial') || lowerTitle.includes('intro')) {
      if (lowerTitle === 'js tutorial') {
        return `# JS Tutorial (JavaScript Foundations)

JavaScript powers:
- browser interactivity (DOM + events)
- server-side APIs (Node.js)
- tooling (bundlers, linters, CLIs)

This tutorial focuses on the foundations you must be comfortable with before React/Node.

---

## 1) Variables: \`const\` and \`let\`

Use \`const\` by default:

\`\`\`js
const name = 'Yash';
const nums = [1, 2, 3];

nums.push(4); // OK: const prevents reassignment, not mutation
\`\`\`

Use \`let\` when reassignment is needed:

\`\`\`js
let count = 0;
count += 1;
\`\`\`

---

## 2) Types (practical)

\`\`\`js
typeof 'hi'      // 'string'
typeof 42        // 'number'
typeof null      // 'object' (historic quirk)
Array.isArray([]) // true
\`\`\`

---

## 3) Functions

\`\`\`js
function add(a, b) {
  return a + b;
}

const add2 = (a, b) => a + b;
\`\`\`

---

## 4) Arrays you’ll use daily

\`\`\`js
const nums2 = [1, 2, 3, 4];
const evens = nums2.filter((n) => n % 2 === 0);
const squares = nums2.map((n) => n * n);
const sum = nums2.reduce((acc, n) => acc + n, 0);
\`\`\`

---

## 5) Async JavaScript

\`\`\`js
async function load() {
  const r = await fetch('/api/data');
  if (!r.ok) throw new Error('Request failed');
  return await r.json();
}

load().then(console.log).catch(console.error);
\`\`\`

---

## 6) DOM + events (browser)

\`\`\`html
<button id="btn">Click</button>
<p id="out"></p>
\`\`\`

\`\`\`js
const btn = document.getElementById('btn');
const out = document.getElementById('out');

btn.addEventListener('click', () => {
  out.textContent = 'Clicked!';
});
\`\`\`

---

## 7) Practice

1. Build a counter (+, -, reset).
2. Fetch JSON and render a list.
3. Write small utilities: \`debounce\`, \`groupBy\`.
`;
      }

      return `# ${title}

JavaScript is the programming language of the web, enabling interactive, dynamic web pages and applications. Originally created for browser environments, JavaScript now powers servers (Node.js), mobile apps (React Native), and desktop applications (Electron). JavaScript is essential for modern web development.

JavaScript executes in the browser, responding to user interactions and manipulating page content. Variables store data, functions encapsulate logic, and objects organize code. JavaScript is dynamically typed, meaning variable types are determined at runtime. Modern JavaScript (ES6+) includes powerful features like arrow functions, destructuring, and modules.

JavaScript interacts with HTML and CSS through the DOM (Document Object Model). The DOM represents page structure as objects JavaScript can modify. Event listeners respond to user actions. Modern JavaScript development uses frameworks like React, Vue, and Angular that abstract DOM manipulation into component-based architectures.

Professional JavaScript requires understanding scope, closures, asynchronous programming, and design patterns. JavaScript powers everything from simple form validation to complex single-page applications.`;
    }

    if (lowerTitle === 'js syntax') {
      return `# JS Syntax

JavaScript syntax is the set of rules for writing valid code. In practice, “knowing syntax” means you can **read code confidently**, understand common patterns, and avoid subtle mistakes.

---

## 1) Statements vs expressions

- **Statement**: performs an action (\`if\`, \`for\`, \`return\`, \`throw\`)
- **Expression**: produces a value (\`2 + 2\`, \`fn()\`, \`condition ? a : b\`)

You’ll feel this most in callbacks:

\`\`\`js
const nums = [1, 2, 3];
const doubled = nums.map((n) => n * 2); // expression returns a value
\`\`\`

---

## 2) Blocks create scope

\`\`\`js
if (true) {
  const inside = 'ok';
}

// inside is not defined here
\`\`\`

---

## 3) Truthy / falsy (the ones that surprise people)

Falsy values:
- \`false\`, \`0\`, \`-0\`, \`0n\`, \`''\`, \`null\`, \`undefined\`, \`NaN\`

Everything else is truthy (including \`[]\` and \`{}\`).

---

## 4) Template literals (readable strings)

\`\`\`js
const name = 'Sam';
const msg = \`Hello \${name}\`;
\`\`\`

---

## 5) Practice

1) Rewrite 5 nested \`if\` blocks into early returns.
2) Write a helper \`isEmpty(value)\` that treats \`''\`, \`null\`, \`undefined\` as empty.
`;
    }

    if (lowerTitle === 'js variables') {
      return `# JS Variables

Variables store values. Modern JavaScript uses **\`const\` and \`let\`**.

Rule of thumb:
- Use \`const\` by default.
- Use \`let\` only when you need reassignment.
- Avoid \`var\` in modern code.

---

## 1) \`const\` vs \`let\`

\`\`\`js
const apiUrl = '/api/users';

let page = 1;
page += 1;
\`\`\`

\`const\` prevents reassignment, not mutation:

\`\`\`js
const arr = [1, 2];
arr.push(3); // OK

// arr = [1, 2, 3]; // NOT OK
\`\`\`

---

## 2) Scope + the “temporal dead zone”

\`let\`/\`const\` are block-scoped. Using them before initialization throws:

\`\`\`js
// console.log(x); // ReferenceError
const x = 123;
\`\`\`

---

## 3) Destructuring (clean variable creation)

\`\`\`js
const user = { id: 'u1', name: 'Mina', role: 'admin' };
const { id, role } = user;

const nums = [10, 20];
const [a, b] = nums;
\`\`\`

---

## 4) Defaults + rest

\`\`\`js
function greet(name = 'friend') {
  return \`Hello \${name}\`;
}

function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
\`\`\`

---

## 5) Practice

1) Refactor a small file: replace \`let\` with \`const\` wherever possible.
2) Write \`pick(obj, keys)\` that returns a new object with only those keys.
3) Write \`omit(obj, keys)\` that returns a new object without those keys.
`;
    }

    if (lowerTitle === 'js functions') {
      return `# JS Functions

Functions are reusable blocks of behavior. In modern JS you’ll commonly use:
- function declarations
- arrow functions
- callbacks and higher-order helpers

---

## 1) Declarations vs arrows

\`\`\`js
function add(a, b) {
  return a + b;
}

const add2 = (a, b) => a + b;
\`\`\`

---

## 2) Default params + guards

\`\`\`js
function toSlug(text = '') {
  const trimmed = text.trim();
  if (!trimmed) return '';
  return trimmed
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, '')
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-');
}
\`\`\`

---

## 3) Higher-order functions

\`\`\`js
function once(fn) {
  let called = false;
  let value;
  return (...args) => {
    if (!called) {
      called = true;
      value = fn(...args);
    }
    return value;
  };
}
\`\`\`

---

## 4) \`this\` (practical warning)

Arrow functions don’t bind their own \`this\`. That’s often helpful for callbacks, but don’t blindly convert object methods to arrows without understanding the impact.

---

## 5) Practice

1) Implement \`debounce(fn, ms)\`.
2) Implement \`memoize(fn)\` for a single-argument pure function.
3) Refactor a long function into 3 small pure helpers.
`;
    }

    if (lowerTitle === 'js arrays') {
      return `# JS Arrays

Arrays are ordered collections. Most real-world JS work involves transforming arrays clearly.

---

## 1) The “daily” methods

\`\`\`js
const nums = [1, 2, 3, 4];

const doubled = nums.map((n) => n * 2);
const evens = nums.filter((n) => n % 2 === 0);
const firstBig = nums.find((n) => n > 2);
\`\`\`

---

## 2) Mutating vs non-mutating

Mutating (changes original): \`push\`, \`pop\`, \`splice\`, \`sort\`, \`reverse\`

Non-mutating: \`map\`, \`filter\`, \`slice\`, \`concat\`

Rule of thumb: avoid mutation in UI state (React), but mutation can be fine in isolated code.

---

## 3) Common patterns

### Remove one item by id

\`\`\`js
function removeById(items, id) {
  return items.filter((x) => x.id !== id);
}
\`\`\`

### Update one item by id

\`\`\`js
function updateById(items, id, patch) {
  return items.map((x) => (x.id === id ? { ...x, ...patch } : x));
}
\`\`\`

---

## 4) Practice

1) Write \`groupBy(arr, keyFn)\`.
2) Write \`uniqueBy(arr, keyFn)\`.
3) Given an array of orders, compute revenue by day.
`;
    }

    if (lowerTitle === 'js events') {
      return `# JS Events

Events are how the browser tells your code: “something happened” (click, input, keydown, submit, etc.).

---

## 1) Add an event listener

\`\`\`js
const btn = document.querySelector('#btn');

btn.addEventListener('click', (e) => {
  console.log('clicked', e.target);
});
\`\`\`

---

## 2) \`preventDefault\` and \`stopPropagation\`

\`preventDefault\` stops the default browser action (like form submit navigation).

\`\`\`js
form.addEventListener('submit', (e) => {
  e.preventDefault();
});
\`\`\`

\`stopPropagation\` stops bubbling (use sparingly).

---

## 3) Bubbling + delegation (high leverage)

Instead of attaching listeners to every child, attach one to a parent and inspect \`e.target\`.

\`\`\`js
list.addEventListener('click', (e) => {
  const item = e.target.closest('[data-id]');
  if (!item) return;
  console.log('clicked item', item.dataset.id);
});
\`\`\`

---

## 4) Keyboard accessibility

If you build custom UI, support keyboard interaction.

\`\`\`js
el.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    el.click();
  }
});
\`\`\`

---

## 5) Practice

1) Build a todo list using event delegation.
2) Add keyboard support (Enter to add, Delete to remove).
3) Implement a dropdown: click to open, click outside to close.
`;
    }

    if (lowerTitle === 'js asynchronous') {
      return `# JS Asynchronous

Async JS is how you handle work that takes time (network, timers) without blocking the UI.

---

## 1) Promises

\`\`\`js
fetch('/api/data')
  .then((r) => {
    if (!r.ok) throw new Error('Request failed');
    return r.json();
  })
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
\`\`\`

---

## 2) \`async/await\`

\`\`\`js
async function load() {
  const r = await fetch('/api/data');
  if (!r.ok) throw new Error('Request failed');
  return await r.json();
}
\`\`\`

---

## 3) Parallel vs sequential

\`\`\`js
const [a, b] = await Promise.all([
  fetch('/a').then((r) => r.json()),
  fetch('/b').then((r) => r.json()),
]);
\`\`\`

---

## 4) Practice

1) Build a page that fetches 2 endpoints in parallel and renders combined results.
2) Add loading + error states.
3) Implement retry (max 3 tries).
`;
    }

    if (lowerTitle === 'js modules') {
      return `# JS Modules

Modules let you split code into files and explicitly import/export what you need. This is the foundation for scalable apps.

---

## 1) Named exports

\`\`\`js
// math.js
export function add(a, b) { return a + b; }
export function sub(a, b) { return a - b; }
\`\`\`

\`\`\`js
// app.js
import { add } from './math.js';
console.log(add(2, 3));
\`\`\`

---

## 2) Default export

\`\`\`js
// logger.js
export default function log(msg) {
  console.log(msg);
}
\`\`\`

\`\`\`js
import log from './logger.js';
log('hi');
\`\`\`

---

## 3) CommonJS vs ESM (Node)

You’ll see both:
- CommonJS: \`require\` / \`module.exports\`
- ESM: \`import\` / \`export\`

---

## 4) Practice

1) Split a small app into \`api.js\`, \`dom.js\`, \`state.js\`, \`index.js\`.
2) Ensure each file exports only what callers need.
3) Avoid circular imports by extracting shared helpers.
`;
    }

    if (lowerTitle === 'js operators') {
      return `# JS Operators

Operators are how you *combine*, *compare*, and *control* values. Interviews and real bugs often come down to a few operator details.

---

## 1) Equality: use \`===\` (almost always)

\`==\` does type coercion. Prefer strict equality.

\`\`\`js
0 == false;     // true  (coerces)
0 === false;    // false (different types)

null == undefined;  // true
null === undefined; // false
\`\`\`

Rule of thumb: use \`===\` and \`!==\` unless you *intentionally* want coercion (rare).

---

## 2) Logical operators and short-circuiting

\`&&\` and \`||\` return one of the operands (not necessarily boolean).

\`\`\`js
const user = null;

// "||" picks the right side when left is falsy
const name1 = user?.name || 'Anonymous';

// "&&" picks the right side when left is truthy
const maybe = user && user.name; // null
\`\`\`

---

## 3) Nullish coalescing (\`??\`) vs OR (\`||\`)

\`??\` only falls back for \`null\` or \`undefined\`.

\`\`\`js
0 || 10;     // 10  (because 0 is falsy)
0 ?? 10;     // 0   (0 is a valid value)

'' || 'x';   // 'x'
'' ?? 'x';   // ''
\`\`\`

Use \`??\` for defaults when \`0\` / \`''\` are legitimate.

---

## 4) Optional chaining (\`?.\`)

Safely access nested properties.

\`\`\`js
const city = user?.address?.city; // undefined if missing
\`\`\`

---

## 5) Common operator gotchas

- \`+\` does number addition *or* string concatenation

\`\`\`js
1 + 2;       // 3
'1' + 2;     // '12'
Number('1') + 2; // 3
\`\`\`

- Precedence can surprise you; add parentheses when clarity helps.

---

## 6) Practice

1) Implement \`getDisplayName(user)\` where \`''\` is allowed, but \`null/undefined\` should fall back.
2) Rewrite a nested \`if\` using \`?.\` and \`??\`.
3) Explain why \`'5' - 1\` works but \`'5' + 1\` doesn’t behave the same.
`;
    }

    if (lowerTitle === 'js if conditions') {
      return `# JS If Conditions

Conditionals control flow. The difference between clean code and spaghetti is usually **guard clauses** and **clear conditions**.

---

## 1) Basic \`if/else\`

\`\`\`js
if (score >= 90) {
  grade = 'A';
} else if (score >= 80) {
  grade = 'B';
} else {
  grade = 'C';
}
\`\`\`

---

## 2) Guard clauses (preferred)

Guards reduce nesting and make intent obvious.

\`\`\`js
function checkout(cart) {
  if (!cart) throw new Error('cart missing');
  if (cart.items.length === 0) return { ok: false, reason: 'empty' };
  return { ok: true };
}
\`\`\`

---

## 3) Ternary for simple cases

Use ternary for short expressions, not for deeply nested logic.

\`\`\`js
const label = isAdmin ? 'Admin' : 'User';
\`\`\`

---

## 4) \`switch\` (when you have many discrete cases)

\`\`\`js
switch (status) {
  case 'idle':
    break;
  case 'loading':
    break;
  case 'error':
    break;
  default:
    throw new Error('unknown status');
}
\`\`\`

---

## 5) Practice

1) Convert a nested \`if\` into guard clauses.
2) Write \`canAccess(user, resource)\` with clear early returns.
3) Rewrite a \`switch\` as an object lookup map (and compare readability).
`;
    }

    if (lowerTitle === 'js loops') {
      return `# JS Loops

Loops repeat work. Modern JS code uses loops *and* array iteration methods. Knowing when to use which matters.

---

## 1) \`for\` (maximum control)

\`\`\`js
for (let i = 0; i < items.length; i++) {
  const item = items[i];
}
\`\`\`

---

## 2) \`for...of\` (clean iteration)

\`\`\`js
for (const item of items) {
  // item is the value
}
\`\`\`

---

## 3) \`for...in\` (objects; be careful)

\`for...in\` iterates enumerable keys (including inherited ones). Prefer \`Object.keys\` for plain objects.

\`\`\`js
for (const key of Object.keys(obj)) {
  console.log(key, obj[key]);
}
\`\`\`

---

## 4) \`break\` and \`continue\`

\`\`\`js
for (const n of nums) {
  if (n < 0) continue;
  if (n === 0) break;
}
\`\`\`

---

## 5) Async loops (common pitfall)

\`await\` inside \`forEach\` does **not** behave like you think.

Prefer:

\`\`\`js
for (const url of urls) {
  const r = await fetch(url);
}

// or parallel
await Promise.all(urls.map((u) => fetch(u)));
\`\`\`

---

## 6) Practice

1) Given a list of users, find the first admin (use \`for...of\` and break).
2) Fetch 5 URLs sequentially and then in parallel; measure the difference.
3) Convert a \`for\` loop into \`map/filter/reduce\` when appropriate.
`;
    }

    if (lowerTitle === 'js strings') {
      return `# JS Strings

Strings are immutable sequences of characters. Real-world string work is about **parsing**, **formatting**, and **sanitizing**.

---

## 1) Common operations

\`\`\`js
const s = '  Hello World  ';

s.trim();
s.toLowerCase();
s.includes('World');
s.startsWith('Hello');
s.slice(2, 7);
\`\`\`

---

## 2) Replace patterns

\`\`\`js
const input = 'a  b   c';

// normalize whitespace
const normalized = input.trim().replace(/\s+/g, ' ');
\`\`\`

---

## 3) Template literals (string interpolation)

\`\`\`js
const name = 'Mina';
const msg = \`Hello \${name}\`;
\`\`\`

---

## 4) Unicode note (practical)

Some characters are represented by multiple code units. For most UI tasks you can treat strings normally, but for emoji-heavy cases, be careful with naive indexing.

---

## 5) Practice

1) Write \`toTitleCase(str)\` (handle extra spaces).
2) Write \`stripNonDigits(str)\` to normalize phone input.
3) Write \`safeSlug(str)\` (lowercase, spaces to hyphens, remove punctuation).
`;
    }

    if (lowerTitle === 'js numbers') {
      return `# JS Numbers

JavaScript numbers are mostly floating-point (IEEE 754). That’s why \`0.1 + 0.2\` isn’t exactly \`0.3\`.

---

## 1) Floating-point precision

\`\`\`js
0.1 + 0.2; // 0.30000000000000004
\`\`\`

For money, prefer integer cents or use formatting + careful rounding.

---

## 2) Parsing numbers

\`\`\`js
Number('42');     // 42
Number('42px');   // NaN

parseInt('42px', 10); // 42
parseFloat('3.14px'); // 3.14
\`\`\`

---

## 3) NaN and checks

\`\`\`js
Number.isNaN(NaN);       // true
Number.isNaN('nope');    // false
\`\`\`

---

## 4) Rounding

\`\`\`js
Math.round(1.5); // 2
Math.floor(1.9); // 1
Math.ceil(1.1);  // 2
\`\`\`

---

## 5) Safe integers + BigInt

\`\`\`js
Number.isSafeInteger(9007199254740991); // true

// BigInt for very large integers
const big = 9007199254740991n;
\`\`\`

---

## 6) Formatting for UI

\`\`\`js
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(1234.5);
\`\`\`

---

## 7) Practice

1) Implement \`toCents(amountString)\` and \`fromCents(cents)\`.
2) Implement \`clamp(n, min, max)\` and test edge cases.
3) Build a price formatter with \`Intl.NumberFormat\`.
`;
    }

    if (lowerTitle === 'js scope') {
      return `# JS Scope

Scope answers: “Where can this variable be used?” Most JS bugs around scope come from shadowing, closures, and \`var\`.

---

## 1) Block scope (\`let\` / \`const\`)

\`\`\`js
if (true) {
  const x = 1;
}
// x is not defined here
\`\`\`

---

## 2) Function scope (and why \`var\` is risky)

\`\`\`js
function demo() {
  if (true) {
    var a = 1;
  }
  return a; // 1 (var leaks out of the block)
}
\`\`\`

---

## 3) Closures (the superpower)

Functions remember variables from the scope they were created in.

\`\`\`js
function makeCounter() {
  let n = 0;
  return () => {
    n += 1;
    return n;
  };
}

const c = makeCounter();
c(); // 1
c(); // 2
\`\`\`

---

## 4) Shadowing

Avoid reusing variable names in nested scopes.

---

## 5) Practice

1) Write \`once(fn)\` using a closure.
2) Explain why \`var\` inside \`for\` loops caused bugs historically.
3) Refactor a function to remove variable shadowing.
`;
    }

    if (lowerTitle === 'js data types') {
      return `# JS Data Types

JavaScript has **primitives** and **objects**.

---

## 1) Primitives

- string
- number
- boolean
- null
- undefined
- symbol
- bigint

---

## 2) Objects (reference types)

Objects include:
- plain objects (\`{}\`)
- arrays
- functions
- dates
- maps/sets

Objects are compared by reference:

\`\`\`js
{} === {}; // false
\`\`\`

---

## 3) \`typeof\` quirks

\`\`\`js
typeof null;        // 'object' (historic bug)
typeof (() => {});  // 'function'
\`\`\`

Use these helpers:

\`\`\`js
Array.isArray([]); // true
\`\`\`

---

## 4) Equality and coercion

Prefer \`===\` (strict). Learn the big coercion cases (\`0\`, \`''\`, \`null\`/\`undefined\`).

---

## 5) Practice

1) Write \`getType(value)\` that returns: 'array', 'null', or typeof.
2) Write \`isPlainObject(value)\`.
3) Explain when \`??\` is better than \`||\`.
`;
    }

    if (lowerTitle === 'js errors') {
      return `# JS Errors

Errors are part of normal control flow in real apps (network failures, invalid input, unexpected states). The key skill is **making failures explicit** and **handling them consistently**.

---

## 1) Throwing errors

\`\`\`js
function parseAge(input) {
  const n = Number(input);
  if (!Number.isFinite(n)) {
    throw new Error('Age must be a number');
  }
  return n;
}
\`\`\`

---

## 2) \`try/catch/finally\`

\`\`\`js
try {
  const age = parseAge('nope');
  console.log(age);
} catch (e) {
  console.error('Invalid age', e);
} finally {
  // cleanup
}
\`\`\`

---

## 3) Async error handling

Promises need \`.catch\` or \`try/catch\` in an \`async\` function.

\`\`\`js
async function load() {
  const r = await fetch('/api/data');
  if (!r.ok) throw new Error('Request failed');
  return await r.json();
}

try {
  await load();
} catch (e) {
  console.error(e);
}
\`\`\`

---

## 4) Error shape (helpful messages)

Good errors:
- say what failed
- include context (id, url) when safe
- are easy to search in logs

---

## 5) Practice

1) Write \`assert(condition, message)\`.
2) Wrap fetch in \`fetchJson(url)\` that throws on non-2xx.
3) Add a retry helper that retries on network errors.
`;
    }

    if (lowerTitle === 'js sets') {
      return `# JS Sets

\`Set\` stores **unique values**. Use it for deduping and fast membership checks.

---

## 1) Basics

\`\`\`js
const s = new Set();
s.add('a');
s.add('a');
s.has('a'); // true
s.size;     // 1
\`\`\`

---

## 2) Deduplicate an array

\`\`\`js
const nums = [1, 1, 2, 3, 3];
const unique = [...new Set(nums)];
\`\`\`

---

## 3) Set operations (pattern)

\`\`\`js
function intersection(a, b) {
  const bs = new Set(b);
  return a.filter((x) => bs.has(x));
}
\`\`\`

---

## 4) Practice

1) Implement \`difference(a, b)\`.
2) Use a Set to validate unique usernames.
3) Use Set membership checks instead of \`array.includes\` in a hot path.
`;
    }

    if (lowerTitle === 'js maps') {
      return `# JS Maps

\`Map\` stores key/value pairs where keys can be **any type** (not just strings).

---

## 1) Why Map over object?

- keys can be objects
- predictable iteration order
- built-in \`size\`

\`\`\`js
const m = new Map();
m.set('a', 1);
m.set({ id: 1 }, 'value');

m.get('a');
m.has('a');
\`\`\`

---

## 2) Counting occurrences

\`\`\`js
function countBy(items, keyFn) {
  const m = new Map();
  for (const item of items) {
    const k = keyFn(item);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}
\`\`\`

---

## 3) Practice

1) Implement \`groupByMap(items, keyFn)\` returning a Map.
2) Convert Map results to an array for rendering.
3) Compare performance of object vs Map for frequent \`get\`/\`set\`.
`;
    }

    if (lowerTitle === 'js iterations') {
      return `# JS Iterations

Iteration is how you process collections: arrays, strings, maps, sets, and any iterable.

---

## 1) Iterables and \`for...of\`

\`for...of\` works with **iterables** (Array, String, Map, Set).

\`\`\`js
for (const ch of 'abc') {
  console.log(ch);
}
\`\`\`

---

## 2) Array iteration methods

Use these when you want clarity:
- \`map\` (transform)
- \`filter\` (select)
- \`find\` (first match)
- \`reduce\` (accumulate)

---

## 3) Iterating Maps

\`\`\`js
const m = new Map([['a', 1], ['b', 2]]);

for (const [k, v] of m) {
  console.log(k, v);
}
\`\`\`

---

## 4) Practice

1) Convert a \`for\` loop into \`map/filter\` when it improves readability.
2) Iterate a Map of counts and render sorted output.
3) Implement \`take(iterable, n)\`.
`;
    }

    if (lowerTitle === 'js math') {
      return `# JS Math

JavaScript math is mostly \`Math\` plus good numeric hygiene (clamping, rounding, handling NaN).

---

## 1) Common Math utilities

\`\`\`js
Math.max(1, 5, 2);  // 5
Math.min(1, 5, 2);  // 1
Math.abs(-3);       // 3
Math.random();      // 0..1
\`\`\`

---

## 2) Clamp helper (use constantly)

\`\`\`js
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
\`\`\`

---

## 3) Rounding strategies

- \`Math.round\` normal rounding
- \`Math.floor\` always down
- \`Math.ceil\` always up

---

## 4) Practice

1) Implement \`lerp(a, b, t)\`.
2) Implement \`roundTo(n, decimals)\`.
3) Build a progress bar function that maps values to 0–100.
`;
    }

    if (lowerTitle === 'js regexp') {
      return `# JS RegExp

Regular expressions help with pattern matching in strings (validation, parsing, normalization). The goal is to keep regex readable and tested.

---

## 1) Basics

\`\`\`js
const hasNumber = /\d/;
hasNumber.test('abc1'); // true
\`\`\`

---

## 2) Replace with regex

\`\`\`js
const input = 'a  b   c';
const normalized = input.trim().replace(/\s+/g, ' ');
\`\`\`

---

## 3) Capture groups

\`\`\`js
const m = '2026-03-31'.match(/^(\d{4})-(\d{2})-(\d{2})$/);
if (m) {
  const [_, y, mo, d] = m;
}
\`\`\`

---

## 4) Practice

1) Validate a simple username: letters, numbers, underscore, 3–16 chars.
2) Extract domain from an email.
3) Write tests for your regex (good habit).
`;
    }

    if (lowerTitle === 'js dates') {
      return `# JS Dates

Dates are tricky because of time zones, parsing differences, and formatting. The key rule: **use ISO strings** and be explicit about what your date represents.

---

## 1) Creating dates

\`\`\`js
const now = new Date();
const fromIso = new Date('2026-03-31T12:34:56Z');
\`\`\`

Avoid ambiguous non-ISO parsing if possible.

---

## 2) Common operations

\`\`\`js
const d = new Date();
const ms = d.getTime();

// add 7 days
const next = new Date(ms + 7 * 24 * 60 * 60 * 1000);
\`\`\`

---

## 3) Formatting (UI)

\`\`\`js
const formatted = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date());
\`\`\`

---

## 4) Practice

1) Build \`formatDate(iso)\` using \`Intl.DateTimeFormat\`.
2) Build \`daysBetween(aIso, bIso)\`.
3) Explain the difference between “date only” and “timestamp”.
`;
    }

    if (lowerTitle === 'js temporal dates') {
      return `# JS Temporal Dates

Temporal is a newer JavaScript date/time API designed to fix common \`Date\` problems (time zones, date-only values, safer parsing).

Important: availability depends on your runtime. If \`Temporal\` isn’t available yet, you may need a polyfill or a date library.

---

## 1) Mental model

- **Instant**: a point in time (timestamp)
- **PlainDate**: a calendar date with no time zone (e.g., birthday)
- **ZonedDateTime**: date/time in a specific time zone

---

## 2) Example usage (conceptual)

\`\`\`js
// Pseudocode-style examples (check runtime support):
// const d = Temporal.PlainDate.from('2026-03-31');
// const now = Temporal.Now.instant();
\`\`\`

---

## 3) When to use what

- Use “date-only” types for due dates, birthdays, calendar days
- Use timestamps for logs, events, auditing

---

## 4) Practice

1) Identify 3 places your app uses dates and classify them as date-only vs timestamp.
2) Write a wrapper \`formatLocal(iso)\` and keep time zone handling explicit.
`;
    }

    if (lowerTitle === 'js html dom') {
      return `# JS HTML DOM

The DOM is how JavaScript reads and changes HTML at runtime.

---

## 1) Select elements

\`\`\`js
const title = document.querySelector('h1');
const items = document.querySelectorAll('.item');
\`\`\`

---

## 2) Read and write content

\`\`\`js
title.textContent = 'New title';
\`\`\`

Prefer \`textContent\` for user text. Avoid \`innerHTML\` unless you sanitize.

---

## 3) Classes and attributes

\`\`\`js
el.classList.add('active');
el.classList.toggle('open');

el.setAttribute('aria-expanded', 'true');
\`\`\`

---

## 4) Create elements

\`\`\`js
const li = document.createElement('li');
li.textContent = 'Item';
list.appendChild(li);
\`\`\`

---

## 5) Practice

1) Render a list of items from an array.
2) Build a tab UI that updates aria attributes.
3) Add event delegation for list item clicks.
`;
    }

    if (lowerTitle === 'js dom navigation') {
      return `# JS DOM Navigation

DOM navigation is about moving around the DOM tree: parents, children, siblings, and finding relevant ancestors.

---

## 1) Parent/children/siblings

\`\`\`js
el.parentElement;
el.children;
el.firstElementChild;
el.nextElementSibling;
el.previousElementSibling;
\`\`\`

---

## 2) \`closest\` (extremely useful)

\`\`\`js
const card = e.target.closest('.card');
if (!card) return;
\`\`\`

---

## 3) \`matches\` + delegation

\`\`\`js
root.addEventListener('click', (e) => {
  if (e.target.matches('[data-action="delete"]')) {
    // ...
  }
});
\`\`\`

---

## 4) Practice

1) Implement a list where clicking a button removes its parent row (use \`closest\`).
2) Add delegation for 100 list items with only 1 listener.
3) Build a “click outside to close” dropdown.
`;
    }

    if (lowerTitle === 'js objects') {
      return `# JS Objects

Objects are the core data structure in JavaScript: a mapping from **keys → values**, where values can be primitives, functions (methods), or other objects.

---

## 1) Create objects (and when)

\`\`\`js
const user = {
  id: 'u1',
  name: 'Ava',
  isAdmin: false,
};
\`\`\`

Use objects for *named* fields. Use arrays for ordered collections.

---

## 2) Read/write properties: dot vs bracket

\`\`\`js
user.name;           // dot
user['name'];        // bracket

const key = 'isAdmin';
user[key] = true;    // dynamic access
\`\`\`

Bracket notation matters for dynamic keys and keys with special characters.

---

## 3) Destructuring (clean data extraction)

\`\`\`js
const { id, name } = user;
const { name: displayName = 'Anonymous' } = user;
\`\`\`

---

## 4) Copying and merging (shallow!)

Spread makes a **shallow copy**.

\`\`\`js
const a = { x: 1, nested: { y: 2 } };
const b = { ...a, x: 2 };

b.nested === a.nested; // true (same nested reference)
\`\`\`

For deep copies, prefer \`structuredClone\` when available, or design data to avoid deep mutation.

---

## 5) Iterating objects

\`\`\`js
const obj = { a: 1, b: 2 };

Object.keys(obj);    // ['a','b']
Object.values(obj);  // [1,2]

for (const [k, v] of Object.entries(obj)) {
  console.log(k, v);
}
\`\`\`

---

## 6) Optional chaining + nullish defaults

\`\`\`js
const city = user.address?.city ?? 'Unknown';
\`\`\`

---

## 7) Practical patterns

- **Lookup maps** (fast): \`const byId = { [id]: value }\`
- **Safe dictionaries**: \`Object.create(null)\` to avoid prototype keys

\`\`\`js
const dict = Object.create(null);
dict['__proto__'] = 'safe key';
\`\`\`

---

## 8) Practice

1) Write \`pick(obj, keys)\` and \`omit(obj, keys)\`.
2) Write \`deepGet(obj, path)\` using optional chaining style logic.
3) Implement \`mergeDefaults(userConfig, defaults)\` using \`??\`.
`;
    }

    if (lowerTitle === 'js functions advanced') {
      return `# JS Functions Advanced

Advanced function skills are where JavaScript starts to feel “powerful”: higher-order functions, \`this\` binding, partial application, and performance-friendly patterns.

---

## 1) Declaration vs expression vs arrow

\`\`\`js
function declared() {}

const expressed = function () {};
const arrow = () => {};
\`\`\`

Key differences:
- declarations are hoisted
- arrows don’t have their own \`this\` / \`arguments\`

---

## 2) Default params + rest params

\`\`\`js
function greet(name = 'Anonymous') {
  return \`Hello \${name}\`;
}

function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
\`\`\`

---

## 3) Higher-order functions

Functions can accept functions and return functions.

\`\`\`js
function withTiming(fn) {
  return (...args) => {
    const t0 = performance.now();
    const out = fn(...args);
    const t1 = performance.now();
    console.log('took', t1 - t0);
    return out;
  };
}
\`\`\`

---

## 4) Closures: state without classes

\`\`\`js
function memoize(fn) {
  const cache = new Map();
  return (arg) => {
    if (cache.has(arg)) return cache.get(arg);
    const res = fn(arg);
    cache.set(arg, res);
    return res;
  };
}
\`\`\`

---

## 5) \`this\`, \`call\`, \`apply\`, \`bind\`

\`this\` depends on how a function is called.

\`\`\`js
const obj = {
  x: 10,
  getX() { return this.x; },
};

const fn = obj.getX;
fn();               // undefined in strict mode
fn.call(obj);       // 10

const bound = fn.bind(obj);
bound();            // 10
\`\`\`

---

## 6) Common interview-level patterns

- \`once(fn)\`
- \`debounce(fn, ms)\`
- \`throttle(fn, ms)\`
- \`compose(...fns)\` / \`pipe(...fns)\`

---

## 7) Practice

1) Implement \`debounce\` and \`throttle\`.
2) Implement \`compose\` and explain left-to-right vs right-to-left.
3) Fix a bug caused by losing \`this\` when passing a method as a callback.
`;
    }

    if (lowerTitle === 'js objects advanced') {
      return `# JS Objects Advanced

“Advanced objects” usually means understanding **the prototype chain**, **property descriptors**, **symbols**, and how enumeration actually works.

---

## 1) Prototype chain (the real inheritance)

Every object has an internal prototype that it can fall back to for missing properties.

\`\`\`js
const a = { x: 1 };
const b = Object.create(a);
b.y = 2;

b.x; // 1 (from prototype)
\`\`\`

---

## 2) Enumeration: what shows up in loops

\`for...in\` walks enumerable keys **including inherited** ones.

Prefer:

\`\`\`js
Object.keys(obj);
Object.entries(obj);
\`\`\`

---

## 3) Property descriptors (fine control)

\`\`\`js
const o = {};
Object.defineProperty(o, 'id', {
  value: 'u1',
  writable: false,
  enumerable: true,
  configurable: false,
});
\`\`\`

Descriptors matter for libraries, frameworks, and “why won’t this show up in JSON?” type bugs.

---

## 4) Getters and setters

\`\`\`js
const person = {
  first: 'Ada',
  last: 'Lovelace',
  get fullName() {
    return this.first + ' ' + this.last;
  },
};
\`\`\`

---

## 5) Symbols (avoid key collisions)

\`\`\`js
const internal = Symbol('internal');
const obj = { [internal]: 123 };
\`\`\`

---

## 6) Freeze/seal (shallow)

- \`Object.freeze\` prevents adding/removing/changing *top-level* props
- nested objects can still mutate

---

## 7) Practice

1) Explain why \`for...in\` can be dangerous.
2) Build an object with a non-enumerable property and show how to access it.
3) Use \`Object.create(null)\` and compare it to a normal object.
`;
    }

    if (lowerTitle === 'js classes') {
      return `# JS Classes

Classes are syntax sugar over prototypes. They’re great for organizing state + behavior, but you should still understand what’s happening underneath.

---

## 1) Basic class

\`\`\`js
class Counter {
  constructor() {
    this.value = 0;
  }

  inc() {
    this.value += 1;
  }
}

const c = new Counter();
c.inc();
\`\`\`

---

## 2) Public fields and private fields

\`\`\`js
class User {
  role = 'user';
  #token = null;

  setToken(t) {
    this.#token = t;
  }
}
\`\`\`

---

## 3) Static methods

\`\`\`js
class Id {
  static next() {
    return crypto.randomUUID();
  }
}
\`\`\`

---

## 4) Inheritance (use carefully)

\`\`\`js
class Animal {
  speak() { return '...'; }
}

class Dog extends Animal {
  speak() { return 'woof'; }
}
\`\`\`

Prefer composition in many app-level designs.

---

## 5) Common pitfall: losing \`this\`

\`\`\`js
class Button {
  constructor(el) {
    this.el = el;
    this.onClick = this.onClick.bind(this);
    el.addEventListener('click', this.onClick);
  }

  onClick() {
    console.log('clicked', this.el);
  }
}
\`\`\`

---

## 6) Practice

1) Create a \`TodoStore\` class with \`add\`, \`remove\`, \`toggle\`.
2) Refactor to composition (store + pure reducers) and compare.
3) Explain what “classes are prototypes underneath” means.
`;
    }

    if (lowerTitle === 'js meta & proxy') {
      return `# JS Meta & Proxy

Proxies let you intercept operations on an object (get/set/call/etc.). Combined with \`Reflect\`, they power advanced patterns like validation, logging, reactive state, and safe APIs.

---

## 1) Proxy basics

\`\`\`js
const target = { count: 0 };

const p = new Proxy(target, {
  get(obj, prop) {
    console.log('get', prop);
    return Reflect.get(obj, prop);
  },
  set(obj, prop, value) {
    console.log('set', prop, value);
    return Reflect.set(obj, prop, value);
  },
});

p.count;
p.count = 1;
\`\`\`

---

## 2) Validation with a proxy

\`\`\`js
function validatedUser(user) {
  return new Proxy(user, {
    set(obj, prop, value) {
      if (prop === 'age' && (!Number.isFinite(value) || value < 0)) {
        throw new Error('invalid age');
      }
      return Reflect.set(obj, prop, value);
    },
  });
}
\`\`\`

---

## 3) Reflect (why use it?)

\`Reflect\` mirrors default behavior with correct return values and fewer edge cases.

---

## 4) Meta-programming symbols you’ll see

- \`Symbol.iterator\` (iterables)
- \`Symbol.toStringTag\`
- \`Symbol.toPrimitive\` (coercion)

---

## 5) Practical caution

- Proxies can make debugging harder.
- Performance can be affected in hot paths.

---

## 6) Practice

1) Build a proxy that logs unknown property reads.
2) Build a proxy that prevents deleting properties.
3) Implement a read-only wrapper and compare to \`Object.freeze\`.
`;
    }

    if (lowerTitle === 'js typed arrays') {
      return `# JS Typed Arrays

Typed arrays represent binary data. They’re used for file processing, networking protocols, crypto, canvas/WebGL, and performance-sensitive code.

---

## 1) The building blocks

- \`ArrayBuffer\`: raw bytes
- typed views like \`Uint8Array\`, \`Int32Array\`, \`Float64Array\`
- \`DataView\`: flexible read/write with endianness control

---

## 2) Example: allocate and write bytes

\`\`\`js
const buf = new ArrayBuffer(4);
const u8 = new Uint8Array(buf);

u8[0] = 255;
u8[1] = 1;
\`\`\`

---

## 3) Text encoding/decoding

\`\`\`js
const enc = new TextEncoder();
const dec = new TextDecoder();

const bytes = enc.encode('hello');
dec.decode(bytes); // 'hello'
\`\`\`

---

## 4) Common gotchas

- Typed arrays have fixed length.
- Slicing can share memory depending on method (understand views vs copies).

---

## 5) Practice

1) Encode JSON to bytes and back.
2) Use \`DataView\` to read/write an int32.
3) Explain the difference between \`ArrayBuffer\` and \`Uint8Array\`.
`;
    }

    if (lowerTitle === 'js windows') {
      return `# JS Windows

In browsers, \`window\` is the global object for the page. You’ll interact with it for location/navigation, history, storage, timers, and environment checks.

---

## 1) The global scope

\`window\` exists in browsers, but **not** in Node.js and not during SSR.

\`\`\`js
if (typeof window !== 'undefined') {
  // safe in browser
}
\`\`\`

---

## 2) Location + navigation

\`\`\`js
window.location.href;
window.location.pathname;
\`\`\`

---

## 3) History

\`\`\`js
history.pushState({}, '', '/new-path');
history.back();
\`\`\`

---

## 4) Timers and animation

\`\`\`js
const id = setTimeout(() => console.log('later'), 500);
clearTimeout(id);

requestAnimationFrame(() => {
  // next paint
});
\`\`\`

---

## 5) Practice

1) Guard a browser-only API so it doesn’t crash in SSR.
2) Build a simple “copy link” feature using \`location.href\`.
3) Use \`requestAnimationFrame\` to animate a value smoothly.
`;
    }

    if (lowerTitle === 'js web apis') {
      return `# JS Web APIs

Web APIs are browser-provided capabilities that JavaScript can use: DOM, Fetch, Storage, Clipboard, WebSocket, Notifications, and more.

---

## 1) Common Web APIs you’ll use daily

- DOM APIs (\`document.querySelector\`, \`classList\`)
- Fetch API (HTTP)
- URL + URLSearchParams
- Storage (localStorage/sessionStorage)
- History + Location
- WebSocket
- Clipboard (permissions-dependent)

---

## 2) Permissions + secure contexts

Some APIs require:
- HTTPS
- explicit user gesture
- permissions (e.g., clipboard, notifications)

---

## 3) URL helpers

\`\`\`js
const url = new URL('https://example.com/search?q=js');
url.searchParams.get('q'); // 'js'
\`\`\`

---

## 4) Practice

1) Parse query params using \`URL\` and \`URLSearchParams\`.
2) Store a theme preference in \`localStorage\` safely.
3) Build a tiny “copy to clipboard” feature with fallbacks.
`;
    }

    if (lowerTitle === 'js ajax') {
      return `# JS AJAX

AJAX means making HTTP requests from the browser without full page reloads. Modern JS uses **Fetch**; older code uses **XMLHttpRequest**.

---

## 1) Fetch (modern)

\`\`\`js
async function fetchJson(url) {
  const r = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return await r.json();
}
\`\`\`

---

## 2) AbortController (cancel requests)

\`\`\`js
const controller = new AbortController();

const p = fetch('/api/data', { signal: controller.signal });
controller.abort();
\`\`\`

---

## 3) XHR (legacy but still appears)

\`\`\`js
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/data');
xhr.onload = () => console.log(xhr.responseText);
xhr.send();
\`\`\`

---

## 4) Real-world concerns

- CORS
- credentials/cookies (\`credentials: 'include'\`)
- timeouts/retries
- consistent error handling

---

## 5) Practice

1) Implement \`fetchJson\` and \`postJson\`.
2) Add retry with backoff for flaky requests.
3) Handle 401/403 responses consistently.
`;
    }

    if (lowerTitle === 'js json') {
      return `# JS JSON

JSON is a text format for data exchange. In JavaScript, JSON is handled by \`JSON.parse\` and \`JSON.stringify\`.

---

## 1) Serialize and parse

\`\`\`js
const obj = { id: 'u1', roles: ['user'] };

const text = JSON.stringify(obj);
const back = JSON.parse(text);
\`\`\`

---

## 2) Formatting and stability

\`\`\`js
JSON.stringify(obj, null, 2); // pretty print
\`\`\`

---

## 3) Common gotchas

- JSON can’t represent \`undefined\`, functions, or Symbols
- Dates become strings (you must re-hydrate)
- BigInt is not supported by JSON
- Circular references throw

---

## 4) Reviver for dates (pattern)

\`\`\`js
const revived = JSON.parse(text, (k, v) => {
  if (k === 'createdAt' && typeof v === 'string') return new Date(v);
  return v;
});
\`\`\`

---

## 5) Practice

1) Build \`safeJsonParse(str)\` that returns \`{ ok, value }\`.
2) Serialize an object with a Date and restore it.
3) Explain why JSON is not a good cache format for functions.
`;
    }

    if (lowerTitle === 'js conventions') {
      return `# JS Conventions

Conventions are what make a codebase readable at scale. The best teams reduce “style debates” by adopting tools and consistent patterns.

---

## 1) Naming

- \`camelCase\` for variables/functions
- \`PascalCase\` for classes/types
- \`SCREAMING_SNAKE_CASE\` for constants (optional)
- Boolean names read like predicates: \`isOpen\`, \`hasAccess\`, \`canEdit\`

---

## 2) Prefer \`const\` by default

Use \`const\` unless reassignment is required (then \`let\`). Avoid \`var\`.

---

## 3) Early returns and small functions

Guards reduce nesting and improve clarity.

---

## 4) Data handling patterns

- Avoid mutating inputs (especially in helpers)
- Prefer \`map/filter/reduce\` when it’s clearer
- Use \`??\` for defaults when \`0\` / \`''\` are valid

---

## 5) Tooling conventions

- ESLint for correctness
- Prettier for formatting
- TypeScript (or JSDoc) for large codebases

---

## 6) Practice

1) Refactor a nested function using early returns.
2) Rename variables in a snippet to improve clarity.
3) Write a tiny style guide for your project (5 rules).
`;
    }

    if (lowerTitle === 'js projects') {
      return `# JS Projects

Projects are how you turn syntax into skill. The key is to build *small*, finishable apps that force you to practice data flow, UI state, and error handling.

---

## 1) How to choose a good project

Pick something that requires:
- input validation
- state updates
- async requests
- rendering a list
- handling errors/loading

---

## 2) Strong beginner → intermediate project ideas

1) **Todo + persistence** (localStorage)
2) **Search UI** (debounced input + fetch)
3) **Weather app** (API + error states)
4) **Mini Kanban board** (drag/drop optional)
5) **Realtime chat mock** (WebSocket or simulated)

---

## 3) Project structure (simple)

- \`/api\` layer (request helpers)
- \`/state\` (store/reducers)
- \`/ui\` (render + events)

---

## 4) Checklist (ship quality)

- Loading + error states
- Empty states
- Accessible forms/buttons
- Basic tests for pure logic helpers

---

## 5) Practice

1) Pick one project and write the UI states (loading/error/empty/success).
2) Identify the core data model and operations.
3) Build a minimal v1 and add features only after it’s stable.
`;
    }

    if (lowerTitle === 'js references') {
      return `# JS References

In JavaScript, “references” usually means: **how objects are stored and shared**, why mutations leak across variables, and why copying is often shallow.

This topic is crucial for debugging state bugs (especially in React), writing safe utility functions, and avoiding accidental mutation.

---

## 1) Value vs reference (the mental model)

- **Primitives** (string/number/boolean/null/undefined/symbol/bigint) behave like values.
- **Objects** (objects/arrays/functions/dates/maps/sets) are held by reference.

\`\`\`js
let a = 1;
let b = a;
b = 2;
// a is still 1

const o1 = { x: 1 };
const o2 = o1;
o2.x = 99;
// o1.x is now 99 (same object)
\`\`\`

---

## 2) Equality checks

Object equality checks identity (same reference), not structure.

\`\`\`js
{ } === { }; // false

const a1 = { x: 1 };
const a2 = a1;
a1 === a2; // true
\`\`\`

---

## 3) Shallow copies: spread and \`Object.assign\`

\`\`\`js
const original = { a: 1, nested: { b: 2 } };
const copy = { ...original };

copy.nested.b = 999;
// original.nested.b is also 999 (nested reference shared)
\`\`\`

Shallow copy changes top-level only.

---

## 4) Deep copy options

- Prefer designing data so deep copying is rarely needed
- Use \`structuredClone\` when available
- Use JSON copy *only* for plain JSON data (no Dates/BigInt/functions)

\`\`\`js
const deep = structuredClone(original);
\`\`\`

---

## 5) References in function calls

Parameters are passed by value, but for objects the “value” is the reference.

\`\`\`js
function mutate(user) {
  user.role = 'admin';
}

const u = { role: 'user' };
mutate(u);
// u.role is 'admin'
\`\`\`

---

## 6) Immutable update patterns (real-world)

Instead of mutating, create new structures.

\`\`\`js
const state = { user: { name: 'Ava', flags: { beta: false } } };

const next = {
  ...state,
  user: {
    ...state.user,
    flags: {
      ...state.user.flags,
      beta: true,
    },
  },
};
\`\`\`

---

## 7) Practice

1) Given an array of todos, toggle one todo **immutably**.
2) Explain why \`Array.prototype.sort\` can cause bugs in React if you sort state directly.
3) Write \`deepFreeze(obj)\` (recursive) and explain why it’s mostly for dev/debugging.
`;
    }

    if (lowerTitle === 'js ecmascript 2026') {
      return `# JS ECMAScript 2026

ECMAScript is the standardized spec behind JavaScript. Each year, a new edition is finalized (ES2020, ES2021, ...). “ECMAScript 2026” refers to that yearly edition.

Because runtimes ship features at different times, the practical skill is **tracking feature readiness and runtime support**, not memorizing a year label.

---

## 1) What you should know (practical)

- Features come from **TC39 proposals** that move through stages (idea → draft → candidate → finished).
- “In the spec” does not automatically mean “available everywhere.”
- You often need **transpilation** (Babel/TypeScript) or **polyfills** for older environments.

---

## 2) How to decide if you can use a feature

1) Identify your target runtimes: browsers + Node version(s).
2) Check if your build pipeline transpiles it.
3) Write a small runtime check / test in your environment.

---

## 3) Runtime feature detection (pattern)

\`\`\`js
// Example pattern: guard a feature to avoid hard crash
if (typeof globalThis !== 'undefined' && 'structuredClone' in globalThis) {
  // use structuredClone
}
\`\`\`

---

## 4) "Modern JS" vs "ES2026"

Most teams think in terms of:
- “modern enough for our Browserslist”
- “supported by our Node LTS”
- “safe behind a transpile step”

---

## 5) Practice

1) Write down your project’s supported browser list + Node version.
2) Pick 2 features you want to use and verify support in your runtime.
3) Add a fallback/guard for a browser-only API to keep SSR safe.
`;
    }

    if (lowerTitle === 'js versions') {
      return `# JS Versions

JavaScript evolves through ECMAScript editions. The confusing part is naming: ES6 is the same as ES2015; afterwards, editions are labeled by year.

The useful skill: understand what your runtime supports and how to ship code safely across environments.

---

## 1) Key era summary (high-level)

- **ES5**: the “old baseline” (still relevant for legacy)
- **ES2015 (ES6)**: \`let/const\`, arrow functions, classes, modules, promises, template literals
- Yearly ES editions after that add improvements and new APIs

---

## 2) Why versions matter

- Your Node version determines server-side support.
- Browser support varies.
- Build tools (TypeScript/Babel) can transpile syntax.
- Polyfills may be needed for missing APIs.

---

## 3) Transpile vs polyfill

- **Transpile**: converts new syntax to older syntax
- **Polyfill**: adds missing runtime APIs (e.g., \`Promise\` in old environments)

---

## 4) Shipping strategy (practical)

1) Decide targets (Node + browsers)
2) Configure your bundler and TypeScript target
3) Avoid relying on "it works on my machine"

---

## 5) Practice

1) Identify a syntax feature and an API feature; explain which needs transpile vs polyfill.
2) Pick your app’s Node version and list 3 features you can use confidently.
3) Add a runtime guard for a browser-only global (\`window\`, \`document\`).
`;
    }

    if (lowerTitle === 'js jquery') {
      return `# JS jQuery

jQuery is a classic library that made DOM manipulation, events, and AJAX easier—especially before modern browsers standardized many APIs.

You’ll still encounter it in legacy codebases. Knowing the mental model helps you maintain old apps and migrate toward modern JS.

---

## 1) Core idea: select elements, then chain actions

\`\`\`js
// Select by CSS selector
const $items = $('.item');

// Chain actions
$items.addClass('active').attr('aria-hidden', 'false');
\`\`\`

---

## 2) DOM ready

\`\`\`js
$(function () {
  // DOM is ready
});
\`\`\`

---

## 3) Events

\`\`\`js
$('#save').on('click', function (e) {
  e.preventDefault();
});

// Delegation (important for dynamic lists)
$(document).on('click', '.delete', function () {
  // ...
});
\`\`\`

---

## 4) AJAX

\`\`\`js
$.get('/api/data').done(function (data) {
  console.log(data);
}).fail(function (xhr) {
  console.error('error', xhr.status);
});
\`\`\`

Modern equivalent: \`fetch\` + \`async/await\`.

---

## 5) Migrating mindset (legacy → modern)

- \`$('.x')\` → \`document.querySelectorAll('.x')\`
- \`.on('click')\` → \`addEventListener('click')\`
- \`$.ajax\` → \`fetch\`

---

## 6) Practice

1) Rewrite a small jQuery snippet using modern DOM APIs.
2) Replace a \`$.get\` call with \`fetchJson\`.
3) Add event delegation for a dynamically rendered list.
`;
    }

    if (lowerTitle === 'js graphics') {
      return `# JS Graphics

JavaScript graphics usually means **Canvas**, **SVG**, and sometimes **WebGL**. The key difference:

- **Canvas**: draw pixels (great for games, dynamic charts)
- **SVG**: draw vector elements in the DOM (great for icons, diagrams)

---

## 1) Canvas basics (2D)

\`\`\`js
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.fillRect(10, 10, 100, 50);

ctx.beginPath();
ctx.arc(80, 80, 20, 0, Math.PI * 2);
ctx.fill();
\`\`\`

---

## 2) Animation loop (\`requestAnimationFrame\`)

\`\`\`js
let x = 0;

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(x, 10, 20, 20);
  x = (x + 2) % canvas.width;
  requestAnimationFrame(tick);
}

tick();
\`\`\`

---

## 3) High-DPI (retina) note

For crisp canvas on high-DPI screens, scale by \`devicePixelRatio\` (common source of blurry canvas).

---

## 4) SVG (DOM-based graphics)

SVG elements are in the DOM, so you can style them with CSS and attach events.

\`\`\`js
const circle = document.querySelector('svg circle');
circle.addEventListener('click', () => {
  circle.classList.toggle('active');
});
\`\`\`

---

## 5) WebGL (very high-level)

WebGL is GPU-based rendering. It’s powerful but complex; most apps use libraries.

---

## 6) Practice

1) Draw a simple bar chart on canvas.
2) Build an SVG icon button with hover/focus styles.
3) Animate a canvas object with \`requestAnimationFrame\` and pause/resume controls.
`;
    }

    if (lowerTitle === 'js examples') {
      return `# JS Examples

Examples are where everything clicks. Below are “small but real” snippets that show common patterns you’ll reuse constantly.

---

## 1) Safe JSON parsing

\`\`\`js
function safeJsonParse(str) {
  try {
    return { ok: true, value: JSON.parse(str) };
  } catch {
    return { ok: false, value: null };
  }
}
\`\`\`

---

## 2) Fetch JSON with consistent errors

\`\`\`js
async function fetchJson(url, init) {
  const r = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return await r.json();
}
\`\`\`

---

## 3) Debounce (UI inputs)

\`\`\`js
function debounce(fn, ms) {
  let t = null;
  return (...args) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
\`\`\`

---

## 4) Event delegation (lists)

\`\`\`js
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action="remove"]');
  if (!btn) return;
  const row = btn.closest('[data-row]');
  row?.remove();
});
\`\`\`

---

## 5) Immutable update example

\`\`\`js
function toggleTodo(todos, id) {
  return todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}
\`\`\`

---

## 6) Practice

1) Extend \`fetchJson\` to support timeouts with \`AbortController\`.
2) Modify \`debounce\` to return a cancel function.
3) Write a \`throttle\` version and compare behavior.
`;
    }

    if (lowerTitle === 'js reference') {
      return `# JS Reference

This is a practical “reach for it fast” reference: common syntax, operators, and the most-used APIs.

---

## 1) Quick syntax

\`\`\`js
// variables
const x = 1;
let y = 2;

// functions
const add = (a, b) => a + b;

// destructuring
const { id } = { id: 'u1' };
const [first] = [10, 20];
\`\`\`

---

## 2) Equality and defaults

- Prefer \`===\`
- Use \`??\` when \`0\`/\`''\` are valid values

\`\`\`js
const name = input ?? 'Anonymous';
\`\`\`

---

## 3) Arrays

Most used methods:
- \`map\`, \`filter\`, \`find\`, \`some\`, \`every\`, \`reduce\`
- \`slice\` (non-mutating)
- \`sort\` (mutating)

---

## 4) Objects

\`\`\`js
Object.keys(obj);
Object.values(obj);
Object.entries(obj);
\`\`\`

---

## 5) Async

\`\`\`js
async function load() {
  const r = await fetch('/api');
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return await r.json();
}
\`\`\`

---

## 6) DOM

\`\`\`js
const el = document.querySelector('#app');
el?.classList.add('ready');
\`\`\`

---

## 7) Debugging checklist

1) Log inputs/outputs at boundaries
2) Confirm types (\`typeof\`, \`Array.isArray\`)
3) Reduce to a minimal reproduction

---

## 8) Practice

1) Write a quick sheet of “mutates vs does not mutate” for array methods.
2) Build a tiny helper library: \`clamp\`, \`debounce\`, \`fetchJson\`.
3) Explain when to use \`Map\` vs plain objects.
`;
    }
    if (lowerTitle.includes('variable')) {
      return `# ${title}

JavaScript variables store data values that can be referenced and manipulated throughout code. Modern JavaScript provides three keywords for declaring variables: let (block-scoped, mutable), const (block-scoped, immutable reference), and var (function-scoped, legacy). Understanding variable declaration and scoping is fundamental to JavaScript development.

Variable names must start with letters, underscores, or dollar signs, followed by letters, digits, underscores, or dollar signs. Naming conventions include camelCase for variables and functions, PascalCase for classes. Descriptive names improve code readability. Reserved keywords cannot be used as variable names.

Let and const introduced in ES6 provide block scoping, preventing many bugs caused by var's function scoping and hoisting behavior. Const prevents reassignment but doesn't make objects immutable - object properties can still change. Developers prefer const by default, using let only when reassignment is necessary, and avoiding var entirely.

Variable scope determines where variables are accessible. Block scope confines let and const to the nearest curly braces, function scope applies to var. Global variables are accessible everywhere but should be minimized to prevent conflicts. Understanding scope and the temporal dead zone prevents common JavaScript errors.`;
    }
    if (lowerTitle.includes('function')) {
      return `# ${title}

JavaScript functions are reusable blocks of code that perform specific tasks. Functions encapsulate logic, accept parameters, return values, and create modular, maintainable code. Functions are first-class objects in JavaScript, meaning they can be assigned to variables, passed as arguments, and returned from other functions.

Function declarations use the function keyword: function name(params) {}. Function expressions assign functions to variables: const name = function(params) {}. Arrow functions introduced in ES6 provide concise syntax: const name = (params) => {}. Arrow functions have different this binding behavior, important for object methods and callbacks.

Parameters pass data into functions. Default parameters provide fallback values. Rest parameters (...args) collect multiple arguments into an array. Return statements send values back to callers. Functions without explicit returns return undefined. Higher-order functions accept or return other functions, enabling powerful functional programming patterns.

Modern JavaScript extensively uses functions for callbacks, promises, event handlers, and component logic. Pure functions return the same output for the same input without side effects, improving testability and predictability. Understanding function scope, closures, and this binding is essential for effective JavaScript development.`;
    }
    if (lowerTitle.includes('objects')) {
      return `# ${title}

JavaScript objects are collections of key-value pairs representing entities with properties and methods. Objects organize related data and functionality, forming the foundation of JavaScript programming. Object literals use curly braces: {key: value}. Properties store data, methods are functions attached to objects.

Properties are accessed using dot notation (obj.property) or bracket notation (obj['property']). Bracket notation allows dynamic property names and properties with special characters. Methods are functions that belong to objects, accessing object data via this keyword. Object constructors and classes create multiple instances with shared structure.

Modern JavaScript includes powerful object features. Destructuring extracts properties: const {name, age} = person. Spread operator copies objects: {...obj}. Object.keys(), Object.values(), and Object.entries() enable iteration. Property shorthand, computed property names, and method syntax improve readability and flexibility.

Objects model real-world entities in code - users, products, orders. Object-oriented programming organizes code around objects. JSON (JavaScript Object Notation) uses object-like syntax for data interchange. Understanding objects, prototypes, and this binding is fundamental to JavaScript mastery.`;
    }
    if (lowerTitle.includes('array')) {
      return `# ${title}

JavaScript arrays store ordered collections of values accessible by numeric indices. Arrays can contain any data type, including mixed types. Array methods provide powerful data manipulation capabilities. Arrays are fundamental to JavaScript programming, used for lists, collections, and data processing.

Arrays are created with square brackets: [1, 2, 3] or new Array(). Indices start at zero. Arrays have a length property tracking element count. Common methods include push (add to end), pop (remove from end), shift (remove from start), and unshift (add to start). These methods mutate the array.

Higher-order array methods enable functional programming. map() transforms elements, filter() selects elements, reduce() accumulates values, forEach() iterates elements. These methods don't mutate original arrays (except forEach), returning new arrays instead. find(), some(), and every() search arrays.

Modern JavaScript includes array destructuring, spread operator for copying/concatenating, and Array.from() for creating arrays from iterables. Understanding array methods, immutability, and functional patterns is crucial for data manipulation. Arrays power most list-based UI components in modern frameworks.`;
    }
    if (lowerTitle.includes('async') || lowerTitle.includes('promise')) {
      return `# ${title}

Asynchronous JavaScript handles operations that take time without blocking code execution. Callbacks, Promises, and async/await manage asynchronous operations like network requests, file operations, and timers. Understanding asynchronous patterns is essential for modern JavaScript development.

Promises represent eventual completion or failure of asynchronous operations. Promises have three states: pending (initial), fulfilled (successful), or rejected (failed). The then() method handles success, catch() handles errors. Promises chain operations elegantly, avoiding callback hell from nested callbacks.

Async/await syntax introduced in ES8 makes asynchronous code look synchronous. Async functions return promises implicitly. The await keyword pauses execution until promises resolve, making code more readable. Try/catch blocks handle errors with async/await. Async/await is now the preferred asynchronous pattern.

Modern web applications heavily rely on asynchronous operations for API calls, database queries, and real-time updates. Fetch API uses promises for HTTP requests. Understanding promise chaining, error handling, parallel execution with Promise.all(), and async/await patterns is crucial for building responsive applications.`;
    }
    if (lowerTitle.includes('dom')) {
      return `# ${title}

The DOM (Document Object Model) is a programming interface representing HTML documents as a tree structure. JavaScript manipulates the DOM to dynamically update content, structure, and styling. Understanding DOM manipulation is fundamental to interactive web development, though modern frameworks often abstract this complexity.

Element selection uses methods like getElementById(), getElementsByClassName(), querySelector(), and querySelectorAll(). querySelector uses CSS selectors for flexible element selection. Once elements are selected, JavaScript can read and modify properties including textContent, innerHTML, style, className, and attributes.

Creating and modifying elements involves createElement(), appendChild(), insertBefore(), and removeChild(). Event listeners attach to elements using addEventListener(), responding to clicks, input changes, keyboard presses, and more. Modern best practices favor event delegation - attaching listeners to parent elements rather than many children.

While frameworks like React abstract DOM manipulation, understanding the DOM remains valuable. Direct DOM manipulation is sometimes necessary for integration with third-party libraries or performance optimization. DOM performance impacts page responsiveness - batch DOM updates, use documentFragment for bulk insertions, and avoid layout thrashing.`;
    }
    if (lowerTitle.includes('class') && !lowerTitle.includes('pseudo')) {
      return `# ${title}

JavaScript classes introduced in ES6 provide cleaner syntax for object-oriented programming. Classes are syntactic sugar over JavaScript's existing prototype-based inheritance but offer more familiar syntax for developers from class-based languages. Classes organize code around blueprints for creating objects with shared structure and behavior.

Class syntax includes a constructor method for initialization and method definitions for behavior. The new keyword creates class instances. Classes support inheritance via extends keyword, enabling subclasses to inherit parent properties and methods. The super keyword accesses parent class constructors and methods.

Class fields and methods can be public or private (prefixed with #). Static methods belong to the class rather than instances. Getters and setters provide controlled property access. Classes can include computed property names and method shorthand. Understanding class features enables clean object-oriented JavaScript.

Modern JavaScript frameworks use classes extensively, especially React class components (though hooks are now preferred). Classes organize related functionality, model domain entities, and structure complex applications. While functional programming is popular in JavaScript, classes remain valuable for certain OOP patterns and framework requirements.`;
    }
    if (lowerTitle.includes('modules')) {
      return `# ${title}

JavaScript modules organize code into reusable, maintainable files. ES6 modules use import and export statements to share code between files. Modules have their own scope, preventing global namespace pollution. Modern JavaScript development is built on modules, enabling large-scale application architecture.

The export keyword makes functions, objects, classes, or variables available to other modules. Named exports: export const func, default exports: export default func. Import statements bring exports into files: import {func} from './file' for named exports, import func from './file' for default exports. Star imports import everything: import * as name.

Modules load dependencies, organize features, and enable code splitting. Build tools like webpack, Rollup, and Vite bundle modules for browsers. Dynamic imports (import()) load modules on demand, improving initial load times. Module formats include ES6 modules (ESM), CommonJS (Node.js), AMD, and UMD.

Professional JavaScript applications organize code into modules by feature or layer. Module organization affects maintainability, testability, and bundle size. Tree-shaking removes unused exports from production bundles. Understanding modules, circular dependencies, and module resolution enables scalable application architecture.`;
    }
    if (lowerTitle.includes('json')) {
      return `# ${title}

JSON (JavaScript Object Notation) is a lightweight data interchange format using JavaScript object syntax. JSON represents structured data as text, making it ideal for transmitting data between servers and web applications. Nearly all modern APIs use JSON for data exchange. Understanding JSON is essential for web development.

JSON supports objects, arrays, strings, numbers, booleans, and null. JSON syntax resembles JavaScript objects but requires double quotes for strings and keys. JSON.parse() converts JSON strings to JavaScript objects. JSON.stringify() converts JavaScript objects to JSON strings. These methods enable data serialization and deserialization.

APIs return data as JSON. Fetch requests receive JSON responses parsed into JavaScript objects. JSON configuration files store application settings. JSON is human-readable and language-independent, supported by virtually all programming languages. The simplicity and ubiquity of JSON drove its adoption over XML.

Working with JSON involves parsing responses, extracting data, and validating structure. JSON doesn't support functions, undefined, or dates (requires string conversion). Deep copying requires JSON.parse(JSON.stringify(obj)). Understanding JSON structure, parsing, and stringifying is fundamental to API integration and data persistence.`;
    }
    return null; // Return null if no specific content found for JavaScript
  }

  // React Topics
  if (category === 'React') {
    if (lowerTitle.includes('intro') || lowerTitle.includes('home')) {
      return `# ${title}

React is a JavaScript library for building user interfaces, created and maintained by Meta. React enables creating interactive, dynamic web applications through component-based architecture. React's virtual DOM efficiently updates only changed parts of pages. React has become the most popular front-end library in web development.

React applications are built from components - reusable, self-contained pieces of UI. Components receive data through props and manage local state. JSX syntax combines JavaScript and HTML-like markup in the same file. React updates the DOM efficiently by comparing virtual DOM snapshots and applying minimal necessary changes.

React's declarative nature means developers describe what UI should look like for given states, and React handles updates. This contrasts with imperative DOM manipulation. React ecosystem includes React Router for navigation, Redux or Context for state management, and countless libraries. React Native extends React to mobile development.

Professional React development requires understanding components, props, state, lifecycle, hooks, and performance optimization. React powers applications for Facebook, Netflix, Airbnb, and countless others. React skills are highly demanded in the job market. Learning React enables building modern, performant web applications.`;
    }
    if (lowerTitle.includes('jsx')) {
      return `# ${title}

JSX (JavaScript XML) is a syntax extension for JavaScript that looks like HTML but works in JavaScript files. JSX makes React components more readable by combining markup and logic. JSX isn't required for React but is standard practice. Babel compiles JSX to React.createElement() calls.

JSX elements use HTML-like tags but with key differences. className replaces class (reserved JavaScript keyword), htmlFor replaces for, and inline styles use objects with camelCase properties. JSX expressions embed JavaScript in curly braces: {variable}. JSX supports all JavaScript expressions including conditionals and function calls.

JSX must return a single parent element, often using fragments (<>...</>) to avoid unnecessary divs. Self-closing tags require slashes: <img />. JSX passes props to components like HTML attributes but can pass any JavaScript type including functions and objects. JSX compiles to JavaScript, enabling all JavaScript capabilities within markup.

Understanding JSX enables writing React components naturally. JSX improves readability by colocating markup and behavior. JSX is type-safe with TypeScript. While JSX looks like HTML, it's JavaScript, so understanding differences prevents common mistakes. JSX is fundamental to React development and similar libraries like Vue JSX.`;
    }
    if (lowerTitle.includes('component')) {
      return `# ${title}

React components are the building blocks of React applications. Components are JavaScript functions or classes that return JSX describing UI. Components can be composed together, reused across applications, and tested independently. Component-based architecture makes complex UIs manageable by breaking them into small, focused pieces.

Functional components are JavaScript functions returning JSX. Class components extend React.Component and use render methods. Modern React favors functional components with hooks over class components. Components accept props (properties) as arguments, enabling parent components to pass data to children. Components manage their own state for local data.

Components should be focused on a single responsibility. Breaking UIs into small components improves reusability and testability. Components can be pure (same props produce same output) or side-effectful. Component naming conventions use PascalCase. Files typically export one main component with possible helper components.

Professional React development emphasizes component composition over inheritance. Container/presentational patterns separate data logic from UI rendering. Higher-order components and render props share logic across components. React's component model enables building complex UIs from simple, reusable pieces. Understanding components is fundamental to React mastery.`;
    }
    if (lowerTitle.includes('props')) {
      return `# ${title}

Props (properties) pass data from parent components to child components in React. Props are read-only in child components, enforcing unidirectional data flow. Props can be any JavaScript type - primitives, objects, arrays, or functions. Props make components reusable by customizing behavior without changing code.

Props are accessed as function parameters in functional components or via this.props in class components. Destructuring props improves readability: function Component({name, age}). Default props provide fallback values. Prop spreading (...props) passes all props to children. Children prop contains elements between component opening and closing tags.

Props validation through PropTypes (separate package) or TypeScript ensures components receive expected data types. This catches bugs early and documents component APIs. Required props, custom validators, and shape definitions describe component contracts. TypeScript provides superior type checking for props.

Understanding props flow, immutability, and composition patterns is essential for React. Props enable component reusability and declarative programming. Callback props enable child-to-parent communication. Props drilling (passing props through many levels) indicates potential state management needs. Props are fundamental to React's component model.`;
    }
    if (lowerTitle.includes('state')) {
      return `# ${title}

State represents data that changes over time within React components. Unlike props (received from parents), state is owned and managed by components. State changes trigger re-renders, updating the UI. The useState hook manages state in functional components, while class components use this.state and this.setState.

useState returns current state and a setter function: const [value, setValue] = useState(initialValue). Calling the setter with a new value triggers re-render. State updates are asynchronous and batched for performance. Functional updates (setValue(prev => prev + 1)) ensure correct values when updates depend on previous state.

State should contain minimal data needed for rendering. Derived values should be computed during render rather than stored in state. State updates are shallow merges in class components but replacements in hooks. Immutable updates are crucial - never mutate state directly. State changes should create new objects or arrays.

Managing state effectively is crucial for React applications. Local state suffices for component-specific data, while global state requires Context or libraries like Redux. Understanding when to lift state vs keep it local, batching updates, and avoiding unnecessary state improves application performance and maintainability.`;
    }
    if (lowerTitle.includes('useeffect')) {
      return `# ${title}

The useEffect hook handles side effects in React functional components. Side effects include data fetching, subscriptions, timers, and DOM manipulation. useEffect runs after render by default, preventing blocking. Understanding useEffect is crucial for managing component lifecycle and side effects in modern React.

useEffect accepts a function containing side effect code and an optional dependency array. Without dependencies, effects run after every render. Empty dependency array [] runs effects once on mount. Specific dependencies cause effects to run when those values change. Return cleanup functions for subscriptions or timers.

Common useEffect patterns include fetching data on mount, subscribing to WebSocket connections, setting timers, and updating document titles. Effects should be focused on single concerns. Multiple useEffect calls separate different side effects. Dependency array must include all used external values to prevent stale closures.

Professional useEffect usage involves understanding dependency arrays, cleanup functions, and effect timing. Missing dependencies cause bugs, while unnecessary dependencies cause performance issues. ESLint plugin react-hooks/exhaustive-deps warns about dependency issues. useEffect replaced class lifecycle methods, providing more declarative side effect management.`;
    }
    if (lowerTitle.includes('hooks')) {
      return `# ${title}

React Hooks are functions that enable using state and other React features in functional components. Hooks were introduced in React 16.8, allowing functional components to match class component capabilities. Hooks include useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef, and custom hooks. Hooks fundamentally changed React development.

Hook rules require calling hooks at the top level of components, never inside conditionals or loops. Hooks must be called in the same order every render. This ensures React correctly associates hook state between renders. The ESLint plugin eslint-plugin-react-hooks enforces these rules.

Built-in hooks cover most needs. useState manages component state, useEffect handles side effects, useContext accesses context values, useReducer manages complex state logic, useCallback memoizes functions, useMemo memoizes values, and useRef persists values between renders without causing re-renders.

Custom hooks extract reusable logic into functions. Custom hooks enable sharing stateful logic across components without render props or HOCs. Custom hooks follow naming convention use*. Understanding hooks, their rules, and when to use each hook is essential for modern React development.`;
    }
    if (lowerTitle.includes('router')) {
      return `# ${title}

React Router enables navigation and routing in single-page React applications. React Router manages URL changes, renders appropriate components, and provides navigation APIs. Client-side routing delivers fast transitions without full page reloads. React Router is the standard routing solution for React applications.

React Router uses components like BrowserRouter (HTML5 history), Routes (route container), Route (individual routes), and Link or NavLink (navigation links). Routes match URL patterns to components. Dynamic segments (:id) capture URL parameters accessible via useParams hook. Nested routes enable complex route hierarchies.

Navigation methods include Link components for declarative navigation and useNavigate hook for programmatic navigation. Route guards and protected routes implement authentication. Redirect component or useNavigate enable conditional redirects. URL parameters pass data between routes. Location state passes data without showing in URLs.

Modern React applications require sophisticated routing for multi-page experiences. React Router v6 simplified API and improved performance. Understanding routing, nested routes, route parameters, and programmatic navigation is essential for complex React applications. React Router enables creating applications that feel native while remaining single-page apps.`;
    }
    return null; // Return null if no specific content found for React
  }

  // Node.js Topics
  if (category === 'Node.js') {
    if (lowerTitle === 'node home') {
      return `# Node HOME

Node.js lets you run JavaScript outside the browser. The key idea is not “JS on the server” — it’s **an event-driven runtime with non-blocking I/O**, a rich standard library, and a huge ecosystem.

---

## What Node.js is (in one paragraph)

- **Runtime**: Node executes JS using the V8 engine.
- **I/O model**: most I/O is async; the event loop schedules work.
- **Standard library**: files, networking, crypto, streams, processes.
- **Ecosystem**: npm packages, tooling, frameworks.

---

## What you’ll build with Node

- REST APIs and web servers
- CLI tools (code generators, linters, scripts)
- background workers / cron jobs
- realtime services (WebSocket)
- build tooling (bundlers, compilers)

---

## Core concepts to master early

1) Event loop and async patterns
2) Modules (CommonJS vs ESM)
3) npm and package.json
4) HTTP basics + Express/Fastify
5) Error handling + logging
6) Environment variables + config

---

## Practice

1) Create a tiny HTTP server.
2) Read a file and return it over HTTP.
3) Build a CLI that parses args and prints JSON.
`;
    }

    if (lowerTitle === 'node intro') {
      return `# Node Intro

Node.js is a JavaScript runtime built on V8. It’s single-threaded at the JS level, but can handle many concurrent requests because I/O is asynchronous.

---

## 1) The “why”

- Great for I/O-heavy services (APIs, realtime, streaming)
- One language across frontend + backend
- Fast iteration and a massive package ecosystem

---

## 2) The “how” (high-level)

- Your JS runs on a single thread
- File/network I/O is delegated to the system + libuv
- When I/O completes, callbacks/promises resume via the event loop

---

## 3) A minimal server

\`\`\`js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('hello');
});

server.listen(3000);
\`\`\`

---

## 4) Practice

1) Add routing: \`/health\`, \`/time\`.
2) Log method + url for each request.
3) Return JSON with \`res.end(JSON.stringify(...))\`.
`;
    }

    if (lowerTitle === 'node get started') {
      return `# Node Get Started

This is the quickest path from “installed Node” to “shipping code”.

---

## 1) Verify your install

\`\`\`bash
node -v
npm -v
\`\`\`

---

## 2) Run a file

\`\`\`bash
node index.js
\`\`\`

\`\`\`js
// index.js
console.log('Node is running');
\`\`\`

---

## 3) Initialize a project

\`\`\`bash
npm init -y
\`\`\`

Create a script:

\`\`\`json
{
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js"
  }
}
\`\`\`

---

## 4) Install a dependency

\`\`\`bash
npm i express
\`\`\`

---

## 5) Practice

1) Create \`/health\` endpoint.
2) Read \`PORT\` from env and default to 3000.
3) Add a simple request logger.
`;
    }

    if (lowerTitle === 'node js requirements') {
      return `# Node JS Requirements

“Requirements” here means the baseline setup you need for reliable Node development.

---

## 1) Pick a Node version (important)

Prefer an LTS version for production projects. Align:
- your local Node
- CI Node
- production Node

---

## 2) Package manager

- npm is included
- Yarn/pnpm are alternatives

Consistency matters: don’t mix lockfiles in one repo.

---

## 3) Dev tooling baseline

- ESLint + Prettier
- dotenv (or platform env vars)
- nodemon (optional) for auto-restart
- test runner (Jest/Vitest)

---

## 4) Production considerations

- set \`NODE_ENV=production\`
- enable structured logging
- handle process signals (SIGTERM)
- do not store secrets in git

---

## 5) Practice

1) Write down the exact Node version your app supports.
2) Add a \`start\` script and run it in CI.
3) Add a \`health\` endpoint and a graceful shutdown handler.
`;
    }

    if (lowerTitle === 'node.js vs browser') {
      return `# Node.js vs Browser

Both run JavaScript, but the **environment** is different.

---

## 1) What’s available

Browser:
- \`window\`, \`document\`, DOM APIs
- sandboxed filesystem/network rules

Node:
- \`process\`, \`Buffer\`, \`fs\`, \`net\`, \`http\`
- direct filesystem access

---

## 2) Module systems

- Browser bundlers often output ESM
- Node supports CommonJS and ESM (with rules)

---

## 3) Globals and APIs

\`fetch\` exists in modern Node, but older Node required libraries.

---

## 4) Security mindset shift

- Server code must treat all input as untrusted
- Secrets must never reach the client bundle

---

## 5) Practice

1) Write code that checks \`typeof window\` and behaves differently.
2) Compare \`console.log(globalThis)\` in Node vs browser.
3) Explain why reading files is fine in Node but not in browsers.
`;
    }

    if (lowerTitle === 'node cmd line') {
      return `# Node Cmd Line

Node is excellent for CLIs: scripts, generators, and automation.

---

## 1) Read arguments

\`\`\`js
// node cli.js --name Ava
const args = process.argv.slice(2);
console.log(args);
\`\`\`

---

## 2) A tiny flag parser (pattern)

\`\`\`js
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      out[key] = val;
    }
  }
  return out;
}

console.log(parseArgs(process.argv.slice(2)));
\`\`\`

---

## 3) Exit codes

\`\`\`js
process.exitCode = 1; // indicate failure
\`\`\`

---

## 4) Practice

1) Build \`node todo.js add "task"\` that writes to a JSON file.
2) Support \`--json\` output.
3) Add \`--help\`.
`;
    }

    if (lowerTitle === 'node v8 engine') {
      return `# Node V8 Engine

V8 is the JavaScript engine that compiles and runs JS. Node embeds V8 and adds system APIs (fs/network/process) via C++ bindings and libuv.

---

## 1) What V8 does

- parses JS
- compiles to machine code (JIT)
- manages garbage collection

---

## 2) Why it matters in Node

- performance characteristics (hot functions)
- memory usage (GC pauses)
- stack traces and debugging

---

## 3) Practical advice

- avoid huge synchronous loops on the event loop
- stream large data instead of loading it all
- measure before optimizing

---

## 4) Practice

1) Write a script that allocates many objects; observe memory usage.
2) Replace a “read entire file” approach with streams.
3) Learn how to start Node with \`--inspect\`.
`;
    }

    if (lowerTitle === 'node architecture') {
      return `# Node Architecture

Node’s architecture is essentially: **V8 (JS)** + **libuv (async I/O + event loop)** + **native bindings** + **standard library**.

---

## 1) Key components

- V8: executes JS
- libuv: event loop, thread pool for some tasks
- Node core modules: fs/http/crypto/stream/etc.

---

## 2) Concurrency model

- JS runs on a single thread
- many concurrent I/O operations can be in-flight
- CPU-bound work blocks the event loop

---

## 3) When to use worker threads

- CPU heavy: image processing, crypto loops, large JSON transforms
- don’t block requests

---

## 4) Practice

1) Create a server endpoint that intentionally blocks (tight loop) and observe latency.
2) Move CPU work to a worker (conceptually) and compare.
3) Add basic instrumentation: request timing logs.
`;
    }

    if (lowerTitle === 'node event loop') {
      return `# Node Event Loop

The event loop schedules JS callbacks as I/O completes. It’s why Node can handle many concurrent connections without spawning a thread per request.

---

## 1) Two queues to remember

- **microtasks**: Promises, \`queueMicrotask\`
- **macrotasks**: timers, I/O callbacks, \`setImmediate\`

Microtasks run before the event loop continues to the next phase.

---

## 2) Why blocking code is deadly

Any long synchronous work prevents:
- handling new requests
- finishing responses
- running timers

---

## 3) Quick example

\`\`\`js
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('sync');
\`\`\`

Expected order: sync → promise → timeout.

---

## 4) Practice

1) Add a big synchronous loop and observe how it delays timers.
2) Rewrite CPU-heavy work to run in chunks (setImmediate) or a worker.
3) Explain the difference between \`setTimeout(fn, 0)\` and \`setImmediate(fn)\`.
`;
    }

    if (lowerTitle === 'node async') {
      return `# Node Async

Most Node work is async: filesystem, network, database calls. Clean async code is a core Node skill.

---

## 1) Prefer async/await

\`\`\`js
async function load() {
  const data = await fetch('https://example.com');
  return data;
}
\`\`\`

---

## 2) Parallel vs sequential

\`\`\`js
// parallel
const [a, b] = await Promise.all([taskA(), taskB()]);

// sequential
const x = await taskA();
const y = await taskB();
\`\`\`

---

## 3) Don’t forget timeouts + cancellation

In production, always think about what happens when an upstream never responds.

---

## 4) Practice

1) Fetch 5 URLs in parallel with \`Promise.all\`.
2) Add error handling so one failure doesn’t crash the whole process.
3) Add retries with backoff (carefully).
`;
    }

    if (lowerTitle === 'node promises') {
      return `# Node Promises

Promises represent a future value (resolve/reject). They are the foundation of async/await.

---

## 1) Promise basics

\`\`\`js
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

delay(100).then(() => console.log('done'));
\`\`\`

---

## 2) Error propagation

\`\`\`js
doWork()
  .then(step2)
  .catch((e) => {
    console.error('failed', e);
  });
\`\`\`

---

## 3) Promise combinators

- \`Promise.all\` (fails fast)
- \`Promise.allSettled\` (collect outcomes)
- \`Promise.race\` (first result)

---

## 4) Practice

1) Implement a timeout wrapper using \`Promise.race\`.
2) Use \`Promise.allSettled\` to fetch multiple URLs and keep partial success.
3) Convert a callback API to promises.
`;
    }

    if (lowerTitle === 'node async/await') {
      return `# Node Async/Await

Async/await is syntax on top of promises. It makes async code easier to read and centralizes error handling.

---

## 1) Basic pattern

\`\`\`js
async function handler(req, res) {
  try {
    const data = await loadData();
    res.end(JSON.stringify(data));
  } catch (e) {
    res.statusCode = 500;
    res.end('error');
  }
}
\`\`\`

---

## 2) Common pitfall: forgetting \`await\`

If you forget \`await\`, you may return a promise and never catch failures.

---

## 3) Practice

1) Wrap an async route handler so errors are always forwarded to one place.
2) Write \`withRetries(fn, n)\` that retries on thrown errors.
3) Identify which tasks should run in parallel vs sequential.
`;
    }

    if (lowerTitle === 'node errors handling') {
      return `# Node Errors Handling

Error handling in Node is about: **fail fast**, **return meaningful responses**, **log context**, and **avoid crashing the process**.

---

## 1) Types of failures

- programmer errors (bugs)
- operational errors (network, timeouts, invalid input)

---

## 2) Pattern: consistent error response

\`\`\`js
function sendError(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: false, error: message }));
}
\`\`\`

---

## 3) Unhandled rejections

Always observe and handle promise rejections.

---

## 4) Practice

1) Implement \`assert\` helper and use it in a route.
2) Add a request id and include it in error logs.
3) Add a global error handler in Express.
`;
    }

    if (lowerTitle === 'node modules') {
      return `# Node Modules

Modules let you split code into files. Historically Node used **CommonJS** (\`require\`, \`module.exports\`). Modern Node also supports **ES Modules** (\`import\`, \`export\`).

---

## 1) CommonJS

\`\`\`js
// math.js
module.exports = { add: (a, b) => a + b };

// index.js
const { add } = require('./math');
\`\`\`

---

## 2) Module resolution

Node resolves:
1) built-ins (fs, http)
2) relative files (./x)
3) packages in node_modules

---

## 3) Practice

1) Create a \`/lib\` folder with pure helpers.
2) Export only what callers need.
3) Avoid circular imports by extracting shared code.
`;
    }

    if (lowerTitle === 'node es modules') {
      return `# Node ES Modules

ES Modules (ESM) are the standard JS module system (\`import\`/\`export\`). Node supports ESM with specific rules.

---

## 1) Enable ESM

Common approaches:
- \`"type": "module"\` in package.json
- or use \`.mjs\` files

---

## 2) Import/export

\`\`\`js
// math.js
export function add(a, b) { return a + b; }

// index.js
import { add } from './math.js';
\`\`\`

---

## 3) Interop gotchas

- default exports vs named exports
- \`require\` isn’t available in ESM without workarounds

---

## 4) Practice

1) Convert a small CommonJS project to ESM.
2) Fix an import path issue (extensions matter in ESM).
3) Explain how \`type: module\` changes behavior.
`;
    }

    if (lowerTitle === 'node npm') {
      return `# Node NPM

npm is the package manager bundled with Node. It installs dependencies, runs scripts, and publishes packages.

---

## 1) Install dependencies

\`\`\`bash
npm i express
npm i -D eslint
\`\`\`

---

## 2) Version ranges

- \`^1.2.3\`: allow minor+patch upgrades
- \`~1.2.3\`: allow patch upgrades

Lockfiles keep installs consistent.

---

## 3) Security basics

- audit dependencies
- avoid unmaintained packages
- keep Node and dependencies updated

---

## 4) Practice

1) Add a dependency and explain what changed in package-lock.
2) Create scripts for \`dev\`, \`start\`, \`test\`.
3) Remove an unused dependency and verify it’s gone.
`;
    }

    if (lowerTitle === 'node package.json') {
      return `# Node package.json

\`package.json\` is the manifest for a Node project: name, scripts, dependencies, and config.

---

## 1) Core fields

- \`name\`, \`version\`
- \`scripts\`
- \`dependencies\` / \`devDependencies\`
- \`type\` (CommonJS vs ESM)

---

## 2) Scripts

\`\`\`json
{
  "scripts": {
    "dev": "node index.js",
    "start": "node index.js"
  }
}
\`\`\`

---

## 3) Practical tips

- keep scripts simple
- document required env vars
- pin Node version via engines (optional)

---

## 4) Practice

1) Add a \`lint\` script.
2) Add \`type: module\` and fix imports.
3) Add an \`engines\` field and align CI.
`;
    }

    if (lowerTitle === 'node npm scripts') {
      return `# Node NPM Scripts

Scripts are how teams standardize commands: dev server, tests, lint, build, migrations.

---

## 1) Common scripts

\`\`\`json
{
  "scripts": {
    "dev": "node index.js",
    "start": "node index.js",
    "test": "node --test",
    "lint": "eslint ."
  }
}
\`\`\`

---

## 2) Script chaining

Prefer explicit scripts over complicated one-liners.

---

## 3) Practice

1) Add a \`seed\` script and run it.
2) Add \`prestart\` or \`postinstall\` carefully (understand impact).
3) Make \`npm run dev\` the single entrypoint for local dev.
`;
    }

    if (lowerTitle === 'node process') {
      return `# Node Process

\`process\` gives you runtime information and control: env vars, args, signals, exit codes.

---

## 1) Environment variables

\`\`\`js
const port = Number(process.env.PORT ?? 3000);
\`\`\`

---

## 2) Arguments

\`\`\`js
console.log(process.argv);
\`\`\`

---

## 3) Exit codes

\`\`\`js
process.exitCode = 1;
\`\`\`

---

## 4) Signals and graceful shutdown

\`\`\`js
process.on('SIGTERM', () => {
  // close server, flush logs, disconnect db
});
\`\`\`

---

## 5) Practice

1) Implement graceful shutdown in an HTTP server.
2) Validate \`PORT\` and fail fast with a clear message.
3) Add a \`--json\` flag and parse it.
`;
    }

    if (lowerTitle === 'http module') {
      return `# HTTP Module

The built-in \`http\` module is the foundation of Node web servers. Frameworks like Express build on these primitives.

---

## 1) Create a server

\`\`\`js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  res.writeHead(404);
  res.end('not found');
});

server.listen(3000);
\`\`\`

---

## 2) Streaming responses

\`\`\`js
res.write('chunk 1');
res.write('chunk 2');
res.end();
\`\`\`

---

## 3) Practice

1) Add JSON routing for \`/time\`.
2) Parse request bodies for POST (careful: streams).
3) Add basic request timeouts.
`;
    }

    if (lowerTitle === 'file system (fs)') {
      return `# File System (fs)

The \`fs\` module reads/writes files and directories. In servers, prefer async APIs to avoid blocking the event loop.

---

## 1) Read/write files (promises)

\`\`\`js
const fs = require('fs/promises');

const text = await fs.readFile('data.txt', 'utf8');
await fs.writeFile('out.txt', text.toUpperCase());
\`\`\`

---

## 2) Streams for large files

\`\`\`js
const fs2 = require('fs');
const r = fs2.createReadStream('big.bin');
const w = fs2.createWriteStream('copy.bin');
r.pipe(w);
\`\`\`

---

## 3) Practice

1) Build a CLI that reads a file and prints stats.
2) Serve a static file over HTTP.
3) Use streams to avoid loading the whole file.
`;
    }

    if (lowerTitle === 'path module') {
      return `# Path Module

\`path\` helps build safe cross-platform file paths (Windows vs POSIX differences).

---

## 1) Join and resolve

\`\`\`js
const path = require('path');

const file = path.join(__dirname, 'data', 'file.txt');
const abs = path.resolve('data', 'file.txt');
\`\`\`

---

## 2) Parse paths

\`\`\`js
path.extname('a/b/c.txt'); // '.txt'
path.basename('/a/b/c.txt'); // 'c.txt'
\`\`\`

---

## 3) Practice

1) Build a \`getUploadPath(filename)\` helper.
2) Validate extension safely.
3) Explain why string concatenation for paths is risky.
`;
    }

    if (lowerTitle === 'os module') {
      return `# OS Module

\`os\` gives system information: platform, CPU, memory. Useful for diagnostics and adaptive behavior.

---

## 1) Common usage

\`\`\`js
const os = require('os');

os.platform();
os.cpus().length;
os.totalmem();
os.freemem();
\`\`\`

---

## 2) Practice

1) Print system info in a CLI.
2) Add a health endpoint that includes process uptime.
3) Use OS info for debugging production issues.
`;
    }

    if (lowerTitle === 'url module') {
      return `# URL Module

The \`URL\` and \`URLSearchParams\` APIs help parse and build URLs reliably.

---

## 1) Parse URLs

\`\`\`js
const u = new URL('https://example.com/search?q=node&sort=asc');

u.pathname; // '/search'
u.searchParams.get('q'); // 'node'
\`\`\`

---

## 2) Build URLs

\`\`\`js
const u = new URL('https://example.com');
u.pathname = '/api/items';
u.searchParams.set('page', '2');
u.toString();
\`\`\`

---

## 3) Practice

1) Write \`getQuery(reqUrl)\` that returns an object.
2) Build pagination links using \`URL\`.
3) Explain why manual string parsing is error-prone.
`;
    }

    if (lowerTitle === 'stream module') {
      return `# Stream Module

Streams let you process data incrementally (great for large files, HTTP bodies, compression). They reduce memory usage and improve performance.

---

## 1) Types of streams

- Readable
- Writable
- Duplex
- Transform

---

## 2) Pipe data

\`\`\`js
const fs = require('fs');
const zlib = require('zlib');

fs.createReadStream('in.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('in.txt.gz'));
\`\`\`

---

## 3) Practice

1) Stream a file to the browser without buffering.
2) Create a transform stream that uppercases text.
3) Explain backpressure in your own words.
`;
    }

    if (lowerTitle === 'buffer module') {
      return `# Buffer Module

\`Buffer\` is Node’s way to handle raw bytes (binary data). You’ll see it in networking, files, crypto, and streams.

---

## 1) Create buffers

\`\`\`js
const b1 = Buffer.from('hello', 'utf8');
const b2 = Buffer.alloc(10);
\`\`\`

---

## 2) Convert buffer ↔ string

\`\`\`js
const b = Buffer.from('hello');
b.toString('utf8');
\`\`\`

---

## 3) Practice

1) Read a file as a Buffer and print its length.
2) Compare Buffer vs Typed Arrays.
3) Explain why encoding matters (utf8 vs base64).
`;
    }

    if (lowerTitle === 'crypto module') {
      return `# Crypto Module

The \`crypto\` module provides hashing, HMAC, random bytes, and other primitives. Use it for secure tokens and hashing (but know when to rely on high-level libraries).

---

## 1) Random IDs

\`\`\`js
const crypto = require('crypto');

const id = crypto.randomBytes(16).toString('hex');
\`\`\`

---

## 2) Hashing

\`\`\`js
const hash = crypto.createHash('sha256').update('data').digest('hex');
\`\`\`

---

## 3) Practice

1) Generate a secure token for password reset.
2) Hash a file stream and output checksum.
3) Explain why passwords should be hashed with specialized algorithms (not sha256).
`;
    }

    if (lowerTitle.includes('intro') || lowerTitle.includes('home')) {
      return `# ${title}

Node.js is a JavaScript runtime environment that executes JavaScript outside browsers. Built on Chrome's V8 engine, Node.js enables server-side JavaScript development. Node.js uses an event-driven, non-blocking I/O model making it efficient for data-intensive real-time applications. Node.js revolutionized JavaScript by extending it beyond browsers.

Node.js enables full-stack JavaScript development - the same language for frontend and backend. Node.js includes npm (Node Package Manager), the world's largest software registry. Node.js APIs provide file system access, networking, process management, and more. Node.js powers servers, CLI tools, build tools, and microservices.

Node.js excels at I/O-bound applications - web servers, APIs, real-time applications, and streaming services. The non-blocking model handles many concurrent connections efficiently. However, CPU-intensive tasks can block the event loop. Understanding Node.js async patterns is crucial for effective development.

Professional Node.js development requires understanding async/await, streams, buffers, event emitters, and modules. Major companies including Netflix, LinkedIn, and PayPal use Node.js for scalability and performance. Node.js skills are highly valued in modern development. Learning Node.js enables building complete applications with JavaScript.`;
    }
    if (lowerTitle.includes('event loop')) {
      return `# ${title}

The Node.js event loop is the mechanism that handles asynchronous operations. Node.js is single-threaded but processes many operations concurrently through the event loop. Understanding the event loop is crucial for writing performant Node.js applications and diagnosing performance issues.

The event loop phases include timers (setTimeout, setInterval callbacks), pending callbacks (I/O callbacks), idle/prepare (internal), poll (retrieve new I/O events), check (setImmediate callbacks), and close callbacks. The event loop processes each phase's queue before moving to the next phase.

Node.js offloads blocking I/O operations to the system kernel or worker pool, keeping the event loop free. When operations complete, callbacks are queued for execution. Process.nextTick and Promise callbacks have higher priority, executing before the next event loop phase. Understanding this timing is crucial for correct async behavior.

Professional Node.js development requires understanding event loop behavior to avoid blocking operations. Long-running synchronous code blocks the event loop, degrading performance. CPU-intensive work should use worker threads. Monitoring event loop lag helps identify performance bottlenecks. Understanding the event loop enables writing efficient, scalable Node.js applications.`;
    }
    if (lowerTitle.includes('modules') || lowerTitle.includes('npm')) {
      return `# ${title}

Node.js modules organize code into reusable files. CommonJS modules use require() to import and module.exports to export. ES modules use import/export syntax. Understanding modules is fundamental to Node.js development. NPM (Node Package Manager) distributes packages that can be used as modules in applications.

Package.json defines project metadata, dependencies, scripts, and configuration. Dependencies install via npm install, creating node_modules folder. Dev dependencies support development but aren't needed in production. Semantic versioning (^, ~) controls update ranges. Package-lock.json ensures consistent dependency versions across installs.

NPM scripts automate common tasks - testing, building, starting servers. Scripts run via npm run scriptName (or npm start/test shortcuts). NPM registry hosts over 1 million packages. Popular packages include Express (web framework), Lodash (utilities), and Axios (HTTP client). NPM alternatives include Yarn and pnpm.

Professional Node.js projects carefully manage dependencies, minimize package sizes, audit security vulnerabilities, and lock dependency versions. Understanding npm, package.json, module resolution, and publishing packages is essential. Well-structured modules improve code organization, reusability, and maintainability.`;
    }
    if (lowerTitle.includes('express')) {
      return `# ${title}

Express.js is a minimal, flexible Node.js web application framework. Express simplifies building APIs and web servers with routing, middleware, and template support. Express is the most popular Node.js framework, powering millions of applications. Understanding Express is essential for Node.js backend development.

Express applications use app.get(), app.post(), etc. for routing. Routes handle HTTP requests and send responses. Middleware functions process requests before reaching route handlers. Middleware can parse JSON, handle CORS, log requests, authenticate users, and more. Middleware chains via next() calls.

Express routing supports route parameters (:id), query strings, and pattern matching. Router objects organize routes into modules. Response methods include res.send(), res.json(), res.status(), res.redirect(). Request objects provide access to headers, body, parameters, and more. Error-handling middleware has four parameters.

Professional Express applications use middleware for cross-cutting concerns, implement RESTful API design, validate inputs, handle errors gracefully, and structure routes logically. Express is unopinionated, allowing flexible architecture. Understanding Express architecture, middleware, routing, and error handling enables building scalable Node.js backends.`;
    }
    if (lowerTitle.includes('async') || lowerTitle.includes('promise')) {
      return `# ${title}

Asynchronous programming is essential in Node.js due to its non-blocking I/O model. Callbacks, Promises, and async/await manage asynchronous operations. Node.js APIs primarily use callbacks historically, but modern development favors Promises and async/await for cleaner code.

Node.js I/O operations like file reading, database queries, and HTTP requests are asynchronous by default. Callback patterns use error-first callbacks: (err, result). Callback hell occurs when nesting many callbacks. Promises and async/await flatten this structure, improving readability and error handling.

Async/await syntax makes asynchronous code look synchronous. Async functions return promises, and await pauses execution until promises resolve. Try/catch blocks handle async errors. Promise.all() runs multiple async operations in parallel. Understanding promise chaining, error propagation, and async patterns prevents common mistakes.

Professional Node.js development extensively uses async/await for I/O operations, API calls, and database queries. Understanding event loop timing, promise microtasks, and error handling is crucial. Async patterns enable building responsive applications that handle many concurrent operations efficiently.`;
    }
    if (lowerTitle.includes('file system') || lowerTitle.includes('fs')) {
      return `# ${title}

The Node.js File System (fs) module provides APIs for interacting with the file system. The fs module can read, write, delete, and manipulate files and directories. Understanding fs APIs is fundamental for Node.js server development, build tools, and CLI applications.

The fs module offers both synchronous and asynchronous APIs. Asynchronous methods use callbacks or promises (fs.promises). Async methods prevent blocking the event loop, crucial for server applications. Synchronous methods are acceptable for CLI tools or initialization code but should be avoided in servers.

Common fs operations include reading files (readFile, readFileSync), writing files (writeFile), creating directories (mkdir), deleting files (unlink), checking existence (access), and watching files (watch). Streams (createReadStream, createWriteStream) efficiently handle large files without loading entire content into memory.

Professional Node.js applications use fs for server-side file operations, build tools, log management, and asset processing. Always handle errors, use async APIs in servers, and prefer streams for large files. Understanding fs permissions, paths, and stream concepts enables building file-based features reliably.`;
    }
    if (lowerTitle.includes('http') || lowerTitle.includes('server')) {
      return `# ${title}

The Node.js HTTP module creates web servers and makes HTTP requests. The http.createServer() method creates servers that listen for requests and send responses. Understanding Node's HTTP module is fundamental, though most developers use frameworks like Express that build on it.

HTTP servers created with createServer accept callback functions receiving request and response objects. Request objects provide HTTP method, URL, headers, and body. Response objects write status codes, headers, and body content. The server.listen() method starts listening on specified ports.

HTTP modules support both servers and clients. The http.request() method makes outbound HTTP requests. Modern alternatives like axios or fetch (available in recent Node.js) provide more convenient APIs. The HTTPS module provides secure HTTPS servers and clients.

Professional Node.js servers usually use Express or similar frameworks rather than raw HTTP. However, understanding underlying HTTP concepts helps debug issues and optimize performance. Modern practices include connection pooling, keep-alive, request timeouts, and proper header management. HTTP/2 and HTTP/3 support exists through specific modules.`;
    }
    if (lowerTitle.includes('rest api')) {
      return `# ${title}

REST (Representational State Transfer) APIs are the standard architecture for web services. RESTful APIs use HTTP methods (GET, POST, PUT, DELETE) to perform CRUD operations on resources. Understanding REST principles is essential for building backend APIs that frontend applications consume.

REST APIs use URL paths to represent resources (/users, /products/:id). HTTP methods indicate operations: GET retrieves, POST creates, PUT/PATCH updates, DELETE removes. Status codes communicate results: 200 success, 201 created, 400 bad request, 401 unauthorized, 404 not found, 500 server error. JSON is the standard data format.

RESTful design principles include statelessness (each request contains all needed information), resource-based URLs, proper HTTP method usage, and meaningful status codes. Versioning (v1, v2 in URLs or headers) manages API evolution. Pagination, filtering, and sorting handle large datasets. CORS enables cross-origin requests.

Professional REST API development includes input validation, authentication (JWT, OAuth), authorization, rate limiting, error handling, documentation (Swagger/OpenAPI), and testing. APIs should be consistent, predictable, and well-documented. Understanding REST principles, HTTP semantics, and security best practices enables building production-ready APIs.`;
    }
    return null; // Return null if no specific content found for Node.js
  }

  // Next.js Topics
  if (category === 'Next.js') {
    if (lowerTitle.includes('intro') || lowerTitle.includes('what is') || lowerTitle.includes('home')) {
      return `# ${title}

Next.js is a React framework for building production-ready web applications. Created by Vercel, Next.js adds server-side rendering, static site generation, API routes, and optimized performance to React. Next.js simplifies complex configurations, providing excellent defaults and developer experience. Next.js has become the leading React framework.

Next.js supports multiple rendering strategies in one application. Pages can be server-rendered (SSR), statically generated (SSG), incrementally regenerated (ISR), or client-rendered. This flexibility enables optimizing each page for its specific needs. The App Router (Next.js 13+) introduces React Server Components and improved routing.

Next.js includes built-in optimizations: image optimization, font loading, code splitting, prefetching, and more. API routes enable building full-stack applications without separate backend servers. File-based routing creates routes from file structure. TypeScript, CSS modules, and Tailwind work out of the box.

Professional Next.js development delivers fast, SEO-friendly applications with excellent user experience. Companies like TikTok, Twitch, and Nike use Next.js. Understanding Next.js rendering strategies, data fetching, and optimization features enables building modern, performant web applications. Next.js skills are highly valuable in React ecosystem.`;
    }
    if (lowerTitle.includes('app router')) {
      return `# ${title}

The Next.js App Router, introduced in Next.js 13, revolutionizes routing with React Server Components, layouts, and improved data fetching. The App Router lives in the app directory, offering more features and better performance than the older Pages Router. Understanding the App Router is essential for modern Next.js development.

App Router uses file-system routing where folders define routes and special files define UI. page.js defines route segments, layout.js defines shared UI, loading.js provides loading states, and error.js handles errors. Nested folders create nested routes. Route groups (folder) organize routes without affecting URLs.

Server Components are default in App Router, rendering on the server for better performance and SEO. Client Components (marked with 'use client') enable interactivity. Server Actions enable server mutations without API routes. Parallel routes and intercepting routes enable advanced patterns like modals and multi-section layouts.

Professional Next.js applications leverage App Router's features for better performance, SEO, and developer experience. Understanding Server Components, data fetching patterns, and new Router features enables building cutting-edge applications. While Pages Router remains supported, App Router represents Next.js's future direction.`;
    }
    if (lowerTitle.includes('ssr') || lowerTitle.includes('server-side rendering')) {
      return `# ${title}

Server-Side Rendering (SSR) generates HTML on servers for each request. Next.js sends fully-rendered HTML to browsers, improving initial load performance and SEO. SSR enables dynamic content while maintaining SEO benefits. Understanding SSR tradeoffs helps choose appropriate rendering strategies for different pages.

In Next.js Pages Router, getServerSideProps fetches data on each request. In App Router, Server Components render on the server by default. SSR provides fresh data on each request but increases server load and response time compared to static generation. SSR is ideal for personalized or frequently-changing content.

SSR improves perceived performance and SEO compared to client-side rendering. Search engines receive fully-rendered HTML. Users see content immediately without waiting for JavaScript to load and fetch data. However, SSR requires server infrastructure and increases complexity compared to static sites.

Professional applications use SSR for authenticated pages, personalized content, or real-time data. Balancing SSR with caching, CDN, and performance optimization ensures fast response times. Understanding when to use SSR vs SSG vs ISR optimizes performance, costs, and user experience. Next.js makes SSR accessible without manual server setup.`;
    }
    if (lowerTitle.includes('ssg') || lowerTitle.includes('static')) {
      return `# ${title}

Static Site Generation (SSG) pre-renders pages at build time, creating static HTML files served from CDNs. SSG provides maximum performance and scalability - pages load instantly and handle unlimited traffic. Next.js makes SSG simple while maintaining dynamic capabilities. SSG is ideal for content that doesn't change per request.

In Pages Router, getStaticProps fetches data at build time. For dynamic routes, getStaticPaths defines which paths to generate. In App Router, pages are statically generated by default unless they use dynamic features. generateStaticParams creates static dynamic routes.

SSG benefits include instant page loads, low hosting costs, excellent SEO, and maximum scalability. CDN distribution serves pages globally with minimal latency. However, SSG requires rebuilding to update content and doesn't support per-request personalization. Incremental Static Regeneration (ISR) addresses some limitations.

Professional sites use SSG for marketing pages, blogs, documentation, and content that updates infrequently. Combining SSG with client-side data fetching enables dynamic features on static pages. Understanding SSG tradeoffs and implementation patterns enables building fast, scalable sites with Next.js.`;
    }
    if (lowerTitle.includes('isr') || lowerTitle.includes('incremental')) {
      return `# ${title}

Incremental Static Regeneration (ISR) combines SSG's performance with dynamic data's freshness. ISR regenerates static pages in background after specified intervals, keeping cache fresh without full rebuilds. ISR enables scaling to millions of pages while maintaining up-to-date content.

ISR uses revalidate option in getStaticProps or Next.js App Router revalidation. When revalidation interval passes, the next request triggers background regeneration. Users always receive cached pages instantly, while fresh content generates in background. Subsequent requests receive updated content.

ISR benefits include SSG performance, manageable build times, and fresh content without full rebuilds. ISR works with CDNs supporting stale-while-revalidate. On-demand revalidation enables updating specific pages programmatically. ISR scales to sites with thousands of pages without long build times.

Professional applications use ISR for product catalogs, news sites, and content platforms needing balance between performance and freshness. Understanding ISR caching, revalidation timing, and fallback behavior optimizes user experience. ISR is a Next.js differentiating feature enabling new architectural patterns.`;
    }
    if (lowerTitle.includes('server actions')) {
      return `# ${title}

Server Actions enable calling server functions from client components without building API routes. Marked with 'use server', Server Actions run on the server, accessing databases and secrets securely. Server Actions simplify full-stack development by eliminating API boilerplate.

Server Actions are defined in Server Components or separate files with 'use server'. Actions receive FormData or serializable arguments. Forms can call actions via action prop, enabling progressive enhancement - forms work without JavaScript. useFormState and useFormStatus hooks provide form state on client.

Server Actions handle mutations - creating, updating, or deleting data. Actions validate inputs, perform operations, and revalidate pages. Actions integrated with React's Suspense and transitions provide optimistic UI updates. Error handling uses try/catch, returning error messages to client.

Professional Next.js applications use Server Actions for form submissions, data mutations, and server operations. Server Actions reduce code, improve security by keeping sensitive logic server-side, and enable progressive enhancement. Understanding Server Actions patterns enables building modern, full-stack applications within Next.js.`;
    }
    if (lowerTitle.includes('middleware')) {
      return `# ${title}

Next.js Middleware runs code before requests are completed, enabling request modification, response rewriting, redirects, and header manipulation. Middleware executes on the edge, close to users, providing low-latency logic execution. Middleware is powerful for authentication, redirects, and request customization.

Middleware is defined in middleware.ts at the project root or in route folders. Middleware receives request and event objects, returning responses or calling next(). Middleware can rewrite URLs (showing different content at same URL), redirect, set headers, or return early responses. Matcher config controls which routes run middleware.

Common middleware use cases include authentication (checking tokens, redirecting unauthorized users), A/B testing, internationalization, bot detection, and feature flags. Middleware runs on every request to matched routes before rendering, enabling centralized logic execution. Middleware can read cookies, headers, and URL parameters.

Professional Next.js applications use middleware for cross-cutting concerns affecting many routes. Middleware is efficient, running on edge networks close to users. Understanding middleware capabilities, limitations (no file system access), and performance implications enables building sophisticated routing logic and authentication systems.`;
    }
    if (lowerTitle.includes('api routes')) {
      return `# ${title}

Next.js API Routes enable building backend APIs within Next.js applications. API Routes are serverless functions handling HTTP requests, eliminating the need for separate backend servers. API Routes simplify full-stack development by keeping frontend and backend in one project.

In Pages Router, files in pages/api become API endpoints. In App Router, route.ts files in app directories define API routes. API handlers export functions for HTTP methods (GET, POST). Request and response objects handle inputs and outputs. API Routes can access environment variables, databases, and external services.

API Routes suit building APIs consumed by the same application, server-side logic, webhooks, and integrations. For production APIs at scale, dedicated API servers may be more appropriate. API Routes run in serverless environments with cold starts and execution time limits.

Professional Next.js applications use API Routes for form handlers, authentication endpoints, database operations, and third-party integrations. Understanding request handling, error responses, CORS, and serverless limitations enables building robust APIs. API Routes with Server Actions provide flexible options for backend logic in Next.js.`;
    }
    return null; // Return null if no specific content found for Next.js
  }

  // Databases Topics
  if (category === 'Databases') {
    if (lowerTitle.includes('sql') || lowerTitle.includes('mysql') || lowerTitle.includes('postgresql')) {
      return `# ${title}

SQL (Structured Query Language) is the standard language for relational database management. SQL databases like MySQL and PostgreSQL organize data into tables with defined schemas. Understanding SQL is fundamental for backend development, as most applications require persistent data storage with ACID guarantees.

SQL operations include SELECT (retrieve data), INSERT (add records), UPDATE (modify records), and DELETE (remove records). WHERE clauses filter results, JOIN combines tables, GROUP BY aggregates data, and ORDER BY sorts results. SQL databases ensure data integrity through constraints, foreign keys, and transactions.

Relational databases excel at structured data with relationships between entities. Strong typing, normalization, and ACID properties ensure data consistency. SQL databases scale vertically and support complex queries. PostgreSQL adds advanced features like JSON columns, full-text search, and custom types.

Professional applications use SQL databases for transactional data, user accounts, orders, and relational data. Understanding schema design, indexing, query optimization, and transaction management is crucial. SQL skills are essential for backend developers. ORMs like Prisma abstract SQL but understanding underlying concepts remains important.`;
    }
    if (lowerTitle.includes('mongodb') || lowerTitle.includes('nosql')) {
      return `# ${title}

MongoDB is a NoSQL document database storing data in JSON-like documents. MongoDB provides flexibility with schema-less design, horizontal scalability, and natural data modeling. Understanding MongoDB is valuable for applications requiring flexible schemas, rapid development, or massive scalability.

MongoDB stores documents in collections (similar to tables). Documents are JSON objects with nested structures and arrays. MongoDB queries use JavaScript-like syntax. CRUD operations include insertOne, find, updateMany, and deleteOne. Aggregation pipelines process data through multiple stages.

MongoDB excels at flexible data models, horizontal scaling (sharding), and development speed. Document model matches application objects naturally. However, MongoDB trades strong consistency guarantees for scalability and flexibility. Multi-document transactions are supported but less efficient than SQL.

Professional applications use MongoDB for content management, catalogs, user profiles, and real-time analytics. Understanding document design, indexing, aggregation, and replication is crucial. Combining MongoDB with SQL databases (polyglot persistence) leverages each database's strengths for different data types.`;
    }
    if (lowerTitle.includes('prisma') || lowerTitle.includes('orm')) {
      return `# ${title}

Prisma is a modern ORM (Object-Relational Mapping) tool for Node.js and TypeScript. Prisma provides type-safe database access, automatic migrations, and intuitive query API. Prisma simplifies database operations while maintaining performance and flexibility. Prisma has become the leading ORM for modern TypeScript applications.

Prisma schema defines data models in readable syntax. Prisma generates type-safe client code matching schema exactly. Migrations handle database schema changes. Prisma Client provides chainable query API: prisma.user.findMany(). Relations, filtering, sorting, and pagination are elegant and type-safe.

Prisma supports PostgreSQL, MySQL, SQLite, SQL Server, and MongoDB. Prisma Migrate handles schema changes and version control. Prisma Studio provides visual database browser. Type safety prevents runtime errors from typos or schema mismatches. Generated types integrate seamlessly with TypeScript.

Professional TypeScript applications prefer Prisma for database access. Prisma balances abstraction with control, supports raw SQL when needed, and optimizes queries automatically. Understanding Prisma schema, migrations, and query API enables building database-backed applications efficiently with excellent developer experience and type safety.`;
    }
    if (lowerTitle.includes('index') || lowerTitle.includes('optimization')) {
      return `# ${title}

Database indexes dramatically improve query performance by enabling fast data lookup without scanning entire tables. Indexes work like book indexes, pointing to data locations. Understanding indexing is crucial for building performant applications. Poorly indexed databases cause slow queries and scalability issues.

Indexes are created on frequently queried columns. B-tree indexes (default) efficiently support equality and range queries. Unique indexes enforce uniqueness constraints. Composite indexes cover multiple columns. Full-text indexes enable text search. Each database system offers specialized index types.

Indexes speed reads but slow writes (indexes must be updated on inserts/updates). Over-indexing wastes space and degrades write performance. Analyzing query patterns identifies beneficial indexes. EXPLAIN commands show whether queries use indexes. Covering indexes include all queried columns, avoiding table lookups.

Professional database design carefully balances read and write performance through strategic indexing. Monitoring slow queries, analyzing execution plans, and adding appropriate indexes optimizes performance. Understanding index types, when to use them, and their tradeoffs is essential for scalable applications handling significant data volumes.`;
    }
    if (lowerTitle.includes('transaction')) {
      return `# ${title}

Database transactions are sequences of operations that execute as single units, ensuring data consistency. Transactions provide ACID properties: Atomicity (all-or-nothing), Consistency (valid state), Isolation (concurrent transactions don't interfere), and Durability (committed data persists). Understanding transactions is crucial for maintaining data integrity.

Transactions begin with BEGIN or START TRANSACTION, execute operations, then COMMIT (save changes) or ROLLBACK (undo changes). All operations within transactions succeed together or fail together. Transactions prevent partial updates that could corrupt data. Banking transfers, order processing, and multi-step operations require transactions.

Isolation levels control how transactions interact: Read Uncommitted (dirty reads possible), Read Committed (prevents dirty reads), Repeatable Read (prevents non-repeatable reads), Serializable (full isolation). Higher isolation prevents more anomalies but reduces concurrency. Choosing appropriate isolation balances consistency and performance.

Professional applications use transactions for operations affecting multiple tables or requiring atomicity. Transactions prevent race conditions, ensure data consistency, and enable recovery from failures. Understanding transaction scope, deadlocks, and isolation levels prevents data corruption and optimizes concurrent access to shared data.`;
    }
    if (lowerTitle.includes('join')) {
      return `# ${title}

SQL joins combine rows from multiple tables based on related columns. Joins enable retrieving related data in single queries rather than multiple queries. Understanding joins is fundamental to working with relational databases. Proper join usage significantly affects query performance and result accuracy.

INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all left table rows plus matches from right (null for non-matches). RIGHT JOIN reverses LEFT JOIN. FULL OUTER JOIN returns all rows from both tables. CROSS JOIN returns cartesian products. Self-joins join tables to themselves.

Joins use ON clauses specifying join conditions, typically foreign key relationships. Multiple joins combine data from many tables. Join order affects query performance - query planners optimize automatically but understanding helps with complex queries. Subqueries sometimes replace joins for specific patterns.

Professional database queries extensively use joins to retrieve related data efficiently. Understanding join types, performance characteristics, and when to use each enables writing efficient queries. Complex business logic often requires multi-table joins. Properly designed schemas with appropriate foreign keys make joins natural and performant.`;
    }
    return null; // Return null if no specific content found for Databases
  }

  // Backend Architecture Topics
  if (category === 'Backend Architecture') {
    if (lowerTitle.includes('mvc')) {
      return `# ${title}

MVC (Model-View-Controller) is a design pattern separating applications into three components: Models (data and business logic), Views (presentation), and Controllers (handle requests, coordinate models and views). MVC remains popular for organizing web applications, though modern frameworks adapt the pattern.

Models represent data and business logic, handling database operations and validation. Controllers receive requests, process inputs, call appropriate models, and return responses. Views render HTML or JSON for clients. Clear separation enables independent development and testing of each layer.

MVC promotes organized, maintainable code by separating concerns. However, strict MVC can be limiting - real applications often need additional layers like services or repositories. Many frameworks loosely follow MVC, adapting to modern patterns like API-first development where views are frontend applications.

Professional backend development uses MVC-influenced architectures for organization. Understanding separation of concerns, layer responsibilities, and communication patterns enables building maintainable applications. While pure MVC is less common in APIs, the principles of separating data, logic, and presentation remain valuable.`;
    }
    if (lowerTitle.includes('microservices') || lowerTitle.includes('monolith')) {
      return `# ${title}

Monolithic architectures deploy applications as single units, while microservices split applications into small, independent services communicating via APIs. Each approach has tradeoffs. Understanding when to use each is crucial for architectural decisions. Many successful applications start monolithic and migrate to microservices as needed.

Monoliths are simpler to develop, deploy, and debug. All code shares the same database and runs in one process. Monoliths suit small teams, early-stage products, and applications with tight coupling. Downsides include scaling entire application for one busy component and deployment coupling all code.

Microservices enable independent scaling, deployment, and technology choices per service. Teams work independently on separate services. Microservices suit large organizations and complex domains. However, microservices increase operational complexity, network latency, and distributed system challenges like consistency and debugging.

Professional architectural decisions consider team size, domain complexity, and scalability needs. Starting with well-organized monoliths and extracting microservices as needed balances simplicity and scalability. Understanding tradeoffs, communication patterns, and operational overhead guides appropriate architecture choices for specific contexts.`;
    }
    if (lowerTitle.includes('repository pattern')) {
      return `# ${title}

The Repository Pattern abstracts data access logic into repository classes, separating business logic from database operations. Repositories provide collection-like interfaces for accessing domain objects. This pattern enables changing datastores without affecting business logic and improves testability through mocking.

Repositories encapsulate queries, inserts, updates, and deletes for specific entity types. Business logic calls repository methods like userRepository.findById() without knowing whether data comes from SQL, MongoDB, or APIs. Repositories can combine multiple data sources or implement caching transparently.

Repository patterns work well with dependency injection, enabling replacing implementations for testing or different environments. Generic repositories provide common operations, while specific repositories add specialized queries. However, repositories can become anemic when they simply wrap ORMs without adding value.

Professional applications use repositories to decouple business logic from data access. Understanding when repositories add value vs adding unnecessary abstraction is important. Repositories shine when data access is complex, multiple data sources exist, or testing requires mocking data. ORMs like Prisma sometimes make repositories less necessary.`;
    }
    if (lowerTitle.includes('service layer')) {
      return `# ${title}

Service layers contain business logic, coordinating between controllers and data access. Services encapsulate complex operations, validation, and business rules. Service layers enable reusing logic across different controllers or consumers. Understanding service layers is essential for organizing backend applications.

Services are typically classes with methods representing business operations. Controllers call services to perform operations, keeping controllers thin. Services coordinate multiple repositories, implement transactions, and enforce business rules. Services should be independent of HTTP concerns, enabling reuse in queues, CLI, or other contexts.

Service layer patterns enable testing business logic independently of web framework or database. Services can call other services, creating hierarchical operations. However, excessive service layers can lead to over-engineering. Balance service abstraction with practical simplicity.

Professional backend applications separate controllers (HTTP handling), services (business logic), and repositories (data access) for maintainability and testability. Understanding these layers, their responsibilities, and communication patterns enables building organized, scalable backend applications. Service layers become essential as applications grow in complexity.`;
    }
    if (lowerTitle.includes('clean architecture')) {
      return `# ${title}

Clean Architecture, proposed by Robert Martin, organizes code around business logic independent of frameworks, databases, or UI. Core principle is dependency inversion - dependencies point inward toward business logic, not outward to external concerns. Clean Architecture maximizes maintainability and testability.

Clean Architecture layers include Entities (business objects), Use Cases (application logic), Interface Adapters (controllers, presenters), and Frameworks (web, database). Inner layers know nothing about outer layers. Outer layers depend on inner layers through interfaces. This prevents business logic depending on implementation details.

Benefits include easier testing (mock external dependencies), framework flexibility (swap databases or web frameworks), and postponed infrastructure decisions. Downsides include increased complexity and abstraction. Clean Architecture suits complex domains but may be overkill for simple CRUD applications.

Professional teams adopt Clean Architecture principles selectively based on domain complexity. Understanding dependency inversion, boundaries, and layered architecture guides building maintainable systems. While pure Clean Architecture is rare, its principles inform better architectural decisions and more testable, flexible code.`;
    }
    if (lowerTitle.includes('event driven')) {
      return `# ${title}

Event-Driven Architecture decouples components by communicating through events rather than direct calls. Components publish events when actions occur, and interested components subscribe to events. Event-driven systems enable scalability, flexibility, and loose coupling. Understanding event-driven patterns is valuable for distributed systems.

Event-driven systems use message buses or event streams (Kafka, RabbitMQ, AWS EventBridge). Producers emit events, consumers process them asynchronously. Events represent facts (UserRegistered, OrderPlaced). Multiple consumers can process same events for different purposes. Events enable building systems that react to changes.

Benefits include loose coupling, independent scaling, and temporal decoupling (consumers process events later). Event sourcing stores events as source of truth, enabling time travel and audit logs. However, event-driven systems increase complexity, debugging difficulty, and eventual consistency challenges.

Professional applications use events for integration between services, handling long-running processes, and building reactive systems. Understanding when events add value vs adding complexity is important. Event-driven architectures suit domains with complex workflows, many integrations, or requirements for audit trails and flexibility.`;
    }
    if (lowerTitle.includes('cqrs')) {
      return `# ${title}

CQRS (Command Query Responsibility Segregation) separates read and write operations into different models. Commands modify state, queries retrieve data. Separating these concerns enables optimizing each independently. CQRS is powerful for complex domains but adds complexity inappropriate for simple applications.

Write models (commands) enforce business rules, validate inputs, and update data. Read models (queries) provide efficient data retrieval, often denormalized for fast reads. Separate databases can serve reads and writes, scaled independently. Event sourcing commonly pairs with CQRS.

Benefits include independent optimization of reads and writes, simplified business logic, and better scalability. Challenges include complexity, eventual consistency between read and write models, and increased infrastructure. CQRS suits complex domains with different read and write patterns but is overkill for CRUD applications.

Professional systems use CQRS selectively for parts requiring independent read/write scaling or complex business logic. Understanding when CQRS solves real problems vs adding unnecessary complexity is crucial. CQRS combined with event sourcing enables powerful audit capabilities but requires significant investment in infrastructure and learning.`;
    }
    return null; // Return null if no specific content found for Backend Architecture
  }

  // DevOps Topics
  if (category === 'DevOps') {
    if (lowerTitle.includes('docker')) {
      return `# ${title}

Docker is a containerization platform packaging applications with their dependencies into portable containers. Containers run consistently across development, testing, and production environments, solving "works on my machine" problems. Understanding Docker is essential for modern application deployment and development workflows.

Docker images are templates containing application code, runtime, libraries, and dependencies. Images build from Dockerfiles specifying layered instructions. Containers are running instances of images, isolated from host systems and other containers. Docker Hub hosts public images for popular software.

Docker benefits include consistent environments, simplified deployment, efficient resource usage, and isolating applications. Developers run production-like environments locally. CI/CD pipelines build and test in containers. Containers start quickly and use fewer resources than virtual machines.

Professional development extensively uses Docker for local development, testing, and production deployment. Understanding Dockerfile best practices, multi-stage builds, volume management, and networking enables leveraging Docker effectively. Docker is fundamental to modern DevOps practices and cloud-native development.`;
    }
    if (lowerTitle.includes('kubernetes')) {
      return `# ${title}

Kubernetes (K8s) is a container orchestration platform automating deployment, scaling, and management of containerized applications. Kubernetes handles container scheduling, load balancing, self-healing, and rolling updates. Understanding Kubernetes is increasingly important as organizations adopt cloud-native architectures.

Kubernetes core concepts include Pods (smallest deployable units), Deployments (manage Pod replicas), Services (expose Pods network), and Namespaces (multi-tenancy). Kubernetes schedules Pods across cluster nodes, restarts failed containers, scales Pods based on load, and performs zero-downtime deployments.

Kubernetes configuration uses YAML files declaring desired state. Kubernetes continuously reconciles actual state with desired state. ConfigMaps and Secrets manage configuration and sensitive data. Ingress controllers handle HTTP routing. Persistent Volumes provide storage for stateful applications.

Professional organizations use Kubernetes for managing microservices, ensuring availability, and enabling scalable infrastructure. Kubernetes is complex - managed services like EKS, GKE, and AKS simplify operations. Understanding Kubernetes architecture, resources, and deployment patterns enables building cloud-native applications at scale.`;
    }
    if (lowerTitle.includes('ci cd') || lowerTitle.includes('ci/cd')) {
      return `# ${title}

CI/CD (Continuous Integration/Continuous Deployment) automates software delivery from code commit to production deployment. CI frequently merges code changes, running automated tests to catch issues early. CD automatically deploys passing builds to production. CI/CD enables fast, reliable software delivery at scale.

CI involves committing code multiple times daily, triggering automated builds and tests. Failed builds stop the pipeline, preventing broken code from reaching production. Unit tests, integration tests, and linting run automatically. Fast feedback loops catch bugs when context is fresh.

CD extends CI by automatically deploying to staging and production environments. CD requires comprehensive testing, feature flags, and monitoring. Deployment strategies include blue-green deployments, canary releases, and rolling updates. Infrastructure as Code ensures environment consistency.

Professional development teams use CI/CD for faster releases, reduced manual errors, and improved code quality. Popular CI/CD tools include GitHub Actions, GitLab CI, Jenkins, and CircleCI. Understanding pipeline design, testing strategies, and deployment patterns enables building reliable automated delivery pipelines.`;
    }
    if (lowerTitle.includes('github actions')) {
      return `# ${title}

GitHub Actions provides CI/CD automation directly in GitHub repositories. Actions run workflows triggered by repository events like pushes, pull requests, or schedules. GitHub Actions simplifies automation without external CI services. Understanding GitHub Actions enables building sophisticated automation workflows.

Workflows are YAML files in .github/workflows defining jobs, steps, and triggers. Jobs run on GitHub-hosted or self-hosted runners. Actions (reusable units) perform specific tasks - checkout code, setup Node.js, run tests. Marketplace offers thousands of pre-built actions.

Common workflows include testing on pull requests, building and publishing Docker images, deploying to cloud platforms, and automating releases. Matrix strategies test across multiple platforms and versions. Secrets store sensitive credentials securely. Workflow status badges show build health.

Professional repositories use GitHub Actions for automated testing, deployment, code quality checks, and dependency updates. GitHub Actions integrates seamlessly with GitHub features like pull request status checks. Understanding workflow syntax, action composition, and best practices enables powerful automation directly in code repositories.`;
    }
    if (lowerTitle.includes('nginx')) {
      return `# ${title}

Nginx is a high-performance web server, reverse proxy, and load balancer. Nginx efficiently handles static files, proxies requests to application servers, and balances load across multiple servers. Understanding Nginx is valuable for deploying production web applications and configuring infrastructure.

As a reverse proxy, Nginx receives client requests and forwards them to backend servers, returning responses to clients. This enables SSL termination, caching, load balancing, and protecting backend servers. Nginx configuration uses declarative syntax defining server blocks, locations, and upstream servers.

Nginx excels at serving static files, SSL/TLS termination, request compression, and handling thousands of concurrent connections efficiently. Nginx can load balance across multiple application instances. Nginx Plus adds advanced features like health checks and dynamic reconfiguration.

Professional deployments use Nginx as reverse proxy for Node.js applications, API gateways, and load balancers. Nginx configuration handles redirects, rewrites, rate limiting, and security headers. Understanding Nginx configuration, performance tuning, and common patterns enables building robust production infrastructure.`;
    }
    if (lowerTitle.includes('linux')) {
      return `# ${title}

Linux is the dominant operating system for servers, cloud infrastructure, and development environments. Understanding Linux fundamentals is essential for backend developers and DevOps engineers. Linux knowledge enables managing servers, debugging production issues, and automating infrastructure operations.

Essential Linux concepts include file system hierarchy, permissions (chmod, chown), processes (ps, top, kill), package management (apt, yum), and shell scripting. Common commands include ls, cd, grep, find, ssh, and systemctl. Understanding pipes, redirects, and command chaining enables powerful command-line workflows.

Linux servers require managing users, permissions, security, and services. SSH provides secure remote access. Systemd manages services and startup. Cron schedules tasks. Log files in /var/log contain diagnostic information. Understanding these systems enables maintaining production servers.

Professional developers use Linux for servers, containers, and development. Understanding Linux fundamentals, shell scripting, and system administration enables effective work in modern development environments. While GUI tools exist, command-line proficiency remains essential for efficient server management and automation.`;
    }
    if (lowerTitle.includes('docker compose')) {
      return `# ${title}

Docker Compose defines and runs multi-container applications using YAML configuration. Compose simplifies managing applications requiring multiple services - web servers, databases, caches. Single commands start entire stacks with proper networking and volumes. Docker Compose is essential for local development environments.

Compose files define services (containers), networks, and volumes. Services specify images, ports, environment variables, and dependencies. Networks enable service communication. Volumes persist data across container restarts. docker-compose up starts all services, docker-compose down stops them. Scaling services uses replicas.

Compose benefits include declarative configuration, easy multi-service management, and consistent environments across team members. Compose files document application architecture. Compose simplifies local development requiring multiple services. Compose works for development and simple deployments but Kubernetes handles production at scale.

Professional teams use Compose for development environments, ensuring developers run identical stacks. Compose configurations often mirror production architectures. Understanding Compose syntax, service dependencies, and networking enables building complex development environments. Docker Compose bridges the gap between local development and production deployments.`;
    }
    return null; // Return null if no specific content found for DevOps
  }

  // Cloud Topics
  if (category === 'Cloud') {
    if (lowerTitle.includes('aws')) {
      return `# ${title}

Amazon Web Services (AWS) is the leading cloud platform offering computing, storage, databases, networking, and hundreds of other services. AWS enables building scalable applications without managing physical infrastructure. Understanding AWS fundamentals is valuable for modern application development and deployment.

Core AWS services include EC2 (virtual servers), S3 (object storage), RDS (managed databases), Lambda (serverless functions), and VPC (networking). AWS provides global infrastructure spanning regions and availability zones ensuring high availability. IAM manages permissions and access control.

AWS benefits include pay-as-you-go pricing, global scale, extensive service catalog, and reliability. However, AWS complexity can be overwhelming. Understanding which services solve which problems is crucial. Cost management and security require careful attention.

Professional applications leverage AWS for scalable, reliable infrastructure. Major companies including Netflix, Airbnb, and NASA use AWS. Understanding AWS core services, pricing models, and architecture patterns enables building cloud-native applications. AWS skills are highly valued in the job market.`;
    }
    if (lowerTitle.includes('ec2')) {
      return `# ${title}

EC2 (Elastic Compute Cloud) provides resizable virtual servers in AWS. EC2 instances run Linux or Windows with configurable CPU, memory, storage, and networking. Understanding EC2 enables running applications on AWS infrastructure with flexible scaling and pricing options.

EC2 instances launch from AMIs (Amazon Machine Images) - templates including operating systems and software. Instance types optimize for different workloads - compute-optimized, memory-optimized, storage-optimized. Security groups control inbound and outbound traffic. Elastic IPs provide static IP addresses.

EC2 pricing includes On-Demand (pay by hour), Reserved (commitment discounts), and Spot (unused capacity at lower prices). Auto Scaling automatically adjusts instance count based on demand. Load Balancers distribute traffic across instances. EBS volumes provide persistent storage.

Professional applications use EC2 for web servers, application servers, and batch processing. While containers and serverless reduce EC2 usage, EC2 remains relevant for specific workloads, legacy applications, or cost optimization. Understanding EC2 fundamentals is essential for AWS architecture decisions.`;
    }
    if (lowerTitle.includes('s3')) {
      return `# ${title}

S3 (Simple Storage Service) provides object storage for any amount of data. S3 stores files (objects) in buckets with 99.999999999% durability. S3 is fundamental to AWS architecture, used for backups, static websites, data lakes, and application storage.

Objects have keys (filenames), data (file content), and metadata. Buckets are containers for objects with configurable permissions, versioning, and lifecycle policies. S3 supports server-side encryption, access logging, and event notifications. Pre-signed URLs provide temporary access to private objects.

S3 storage classes optimize for different access patterns: Standard (frequent access), Intelligent-Tiering (automatic optimization), Infrequent Access (cheaper for rarely accessed data), Glacier (archival). S3 Transfer Acceleration speeds uploads for global users. CloudFront CDN delivers S3 content globally.

Professional applications use S3 for user uploads, backups, static assets, logs, and data lakes. S3 integrates with AWS services like Lambda and Athena. Understanding S3 features, storage classes, and security enables efficient, cost-effective storage solutions. S3 is one of AWS's most fundamental services.`;
    }
    if (lowerTitle.includes('vercel')) {
      return `# ${title}

Vercel is a deployment platform optimized for frontend frameworks, especially Next.js (created by Vercel). Vercel provides zero-config deployments, automatic scaling, CDN distribution, and preview deployments. Vercel simplifies deploying modern web applications with excellent developer experience.

Vercel deploys via Git integration - push to GitHub triggers automatic deployments. Preview deployments create unique URLs for each pull request, enabling testing before merging. Production deployments update live sites. Vercel handles SSL certificates, CDN distribution, and caching automatically.

Vercel specializes in Next.js but supports React, Vue, Angular, and static sites. Serverless Functions enable backend APIs. Edge Functions run code close to users globally. Analytics and Web Vitals monitoring provide insights. Vercel integrates with Headless CMSs and databases.

Professional teams use Vercel for marketing sites, web applications, and documentation. Git-based workflows, automatic previews, and zero-config deployment accelerate development. Understanding Vercel's features, pricing, and optimization techniques enables maximizing platform benefits. Vercel abstracts infrastructure complexity while maintaining flexibility.`;
    }
    if (lowerTitle.includes('firebase')) {
      return `# ${title}

Firebase is Google's Backend-as-a-Service platform providing databases, authentication, hosting, and more. Firebase enables building full-stack applications without backend server code. Real-time Database and Firestore provide NoSQL databases with real-time synchronization. Firebase accelerates development for web and mobile applications.

Firebase services include Authentication (user management), Firestore (document database), Realtime Database (JSON database), Storage (file storage), Hosting (static hosting), and Functions (serverless backend). Firebase provides SDKs for web, iOS, and Android with consistent APIs.

Firebase benefits include rapid development, real-time capabilities, automatic scaling, and Google Cloud integration. Firebase handles infrastructure, security rules control access, and offline support syncs data when connections restore. However, Firebase costs can escalate with usage and vendor lock-in concerns exist.

Professional applications use Firebase for prototypes, real-time features, and mobile backends. Understanding Firebase services, security rules, and pricing enables building applications quickly. Firebase suits small to medium applications and teams wanting fast development without backend infrastructure management.`;
    }
    if (lowerTitle.includes('lambda') || lowerTitle.includes('serverless')) {
      return `# ${title}

AWS Lambda runs code without managing servers (serverless computing). Lambda executes functions in response to events - HTTP requests, file uploads, database changes. Lambda automatically scales, runs functions only when triggered, and charges only for execution time. Understanding Lambda enables building cost-effective, scalable applications.

Lambda functions are code responding to triggers. Common triggers include API Gateway (HTTP), S3 (file events), DynamoDB (database changes), and EventBridge (scheduled events). Functions have configurable memory, timeout, and environment variables. Lambda supports multiple languages including Node.js, Python, and Java.

Lambda benefits include no server management, automatic scaling, pay-per-use pricing, and built-in availability. However, Lambda has cold starts (initial delays), execution time limits, and stateless nature requiring external storage. Lambda suits event-driven, unpredictable workloads but may not be cost-effective for consistent high traffic.

Professional applications use Lambda for APIs, data processing, automation, and event handling. Lambda combines with other AWS services to build serverless architectures. Understanding Lambda limits, best practices, and cost optimization enables leveraging serverless computing effectively. Serverless represents a paradigm shift in application architecture.`;
    }
    return null; // Return null if no specific content found for Cloud
  }

  // System Design Topics
  if (category === 'System Design') {
    if (lowerTitle.includes('scalability')) {
      return `# ${title}

Scalability is a system's ability to handle growing workload by adding resources. Vertical scaling adds resources to single servers (more CPU, RAM), while horizontal scaling adds more servers. Understanding scalability is crucial for building systems supporting business growth without complete rewrites.

Scalability challenges include database bottlenecks, stateful sessions, file storage, and consistency across distributed systems. Solutions include database sharding, stateless architecture, distributed caching, and CDNs. Load balancers distribute requests across servers. Microservices enable independent scaling of different features.

Horizontal scaling provides better fault tolerance and allows scaling beyond single-server limits. However, horizontal scaling increases complexity - distributed systems face network latency, partial failures, and consistency challenges. Understanding CAP theorem helps make tradeoffs between consistency, availability, and partition tolerance.

Professional systems plan for scale from the start through proper architecture. Premature optimization wastes resources, but fundamental design decisions affect scalability dramatically. Understanding bottlenecks, measuring performance, and scaling strategically enables supporting growing user bases. Scalability is essential for successful applications.`;
    }
    if (lowerTitle.includes('load balancer')) {
      return `# ${title}

Load balancers distribute incoming traffic across multiple servers, improving availability and scalability. Load balancers prevent single servers from becoming overwhelmed and enable horizontal scaling. Understanding load balancing is essential for building highly available, scalable applications.

Load balancing algorithms include Round Robin (equal distribution), Least Connections (route to least busy server), IP Hash (consistent routing per client), and Weighted (servers handle proportional load based on capacity). Health checks ensure traffic only routes to healthy servers.

Load balancers operate at different layers - Layer 4 (TCP/UDP) and Layer 7 (HTTP/HTTPS). Layer 7 balancers enable routing based on URLs, headers, or cookies. SSL termination at load balancers offloads encryption from application servers. Session persistence ensures requests from same client reach the same server when needed.

Professional applications use load balancers for high availability, zero-downtime deployments, and horizontal scaling. Cloud providers offer managed load balancers (AWS ELB, Azure Load Balancer). Understanding load balancing strategies, health checks, and session management enables building resilient, scalable systems.`;
    }
    if (lowerTitle.includes('caching')) {
      return `# ${title}

Caching stores frequently accessed data in fast storage to reduce latency and database load. Caches significantly improve performance and scalability. Understanding caching strategies, invalidation, and tradeoffs is crucial for optimizing application performance.

Cache locations include client-side (browser cache), CDN (static assets), application cache (Redis, Memcached), and database cache. Cache-aside (lazy loading) loads data on cache miss. Write-through writes to cache and database simultaneously. Write-behind writes to cache immediately, database asynchronously.

Cache invalidation is famously difficult - determining when to remove or update cached data. TTL (Time To Live) expires cache after set duration. Cache keys must uniquely identify data. Cache stampede occurs when many requests simultaneously miss cache, overwhelming database. Solutions include locking and early expiration.

Professional applications strategically cache database queries, API responses, computed results, and static assets. Cache hit rates measure effectiveness. Understanding what, where, and how long to cache requires balancing freshness and performance. Caching is one of the most effective performance optimizations.`;
    }
    if (lowerTitle.includes('cdn')) {
      return `# ${title}

Content Delivery Networks (CDNs) distribute static content across geographically distributed servers, delivering files from servers closest to users. CDNs dramatically reduce latency, improve load times, and reduce origin server load. Understanding CDNs is essential for optimizing global application performance.

CDNs cache static assets like images, CSS, JavaScript, and videos at edge locations worldwide. When users request content, CDN serves from nearest edge location. Cache misses fetch from origin servers then cache for future requests. CDNs handle traffic spikes by distributing load across many servers.

CDN features include SSL/TLS termination, DDoS protection, image optimization, and compression. CDN providers include Cloudflare, AWS CloudFront, and Fastly. Cache control headers configure caching behavior. Purge APIs invalidate cached content when updated.

Professional applications use CDNs for static assets, improving performance globally. CDNs are especially beneficial for media-heavy sites, global audiences, and traffic spikes. Understanding CDN configuration, caching strategies, and cost optimization ensures maximum benefit. CDNs are fundamental to modern web performance.`;
    }
    if (lowerTitle.includes('rate limiting')) {
      return `# ${title}

Rate limiting controls request frequency from clients, preventing abuse, protecting resources, and ensuring fair usage. Rate limits are expressed as requests per time window (e.g., 100 requests per minute). Understanding rate limiting is essential for building robust, secure APIs.

Rate limiting strategies include fixed window (simple but allows bursts), sliding window (smoother but more complex), token bucket (allows bursts up to bucket size), and leaky bucket (constant rate). Rate limits can be per IP, per user, or global. Different endpoints may have different limits.

Rate limit responses include 429 Too Many Requests status, Retry-After headers indicating wait time, and current limit status headers. Graceful degradation serves cached or reduced functionality when limits reached. Rate limits protect against DDoS attacks, scraping, and buggy clients.

Professional APIs implement rate limiting to ensure stability and fair resource usage. Rate limiting prevents single clients from monopolizing resources. Understanding rate limiting algorithms, storage (Redis), and user experience enables balancing security and usability. Rate limiting is essential for production APIs.`;
    }
    if (lowerTitle.includes('message queue')) {
      return `# ${title}

Message queues enable asynchronous communication between services by buffering messages in reliable queues. Producers send messages, consumers process them independently. Message queues decouple services, enable load leveling, and improve system resilience. Understanding message queues is valuable for distributed systems.

Popular message queue systems include RabbitMQ, AWS SQS, and Redis. Queues store messages durably, delivering them to consumers when ready. Dead letter queues handle failed messages. Priority queues process high-priority messages first. Message acknowledgment ensures reliable processing.

Message queues enable background job processing, microservice communication, and handling traffic spikes. Long-running tasks move to queues, responding immediately to users. Queues buffer between fast producers and slow consumers. Multiple consumers process queues in parallel, enabling horizontal scaling.

Professional applications use queues for email sending, image processing, report generation, and service integration. Understanding queue patterns (point-to-point vs pub/sub), message durability, and error handling enables building resilient asynchronous systems. Message queues are fundamental to scalable architectures.`;
    }
    if (lowerTitle.includes('cap theorem')) {
      return `# ${title}

CAP theorem states distributed systems can provide only two of three guarantees: Consistency (all nodes see same data), Availability (every request receives response), and Partition Tolerance (system works despite network failures). Understanding CAP guides distributed system design decisions.

In practice, partition tolerance is required (networks fail), forcing choices between consistency and availability. CP systems (e.g., MongoDB with strong consistency) sacrifice availability during partitions. AP systems (e.g., Cassandra) sacrifice consistency, allowing divergent data. Different consistency levels provide flexibility.

Consistency models include strong consistency (immediate consistency), eventual consistency (converges eventually), and bounded staleness (consistent within time bound). Many systems offer tunable consistency, allowing applications to choose per operation. Understanding tradeoffs enables appropriate choices for different data types.

Professional distributed systems carefully consider CAP tradeoffs. Critical data may require consistency (financial transactions), while less critical data may prefer availability (social media feeds). Understanding CAP theorem, consistency models, and database characteristics enables making informed architecture decisions for distributed systems.`;
    }
    return null; // Return null if no specific content found for System Design
  }

  // Security Topics
  if (category === 'Security') {
    if (lowerTitle.includes('https') || lowerTitle.includes('ssl') || lowerTitle.includes('tls')) {
      return `# ${title}

HTTPS encrypts communication between browsers and servers using TLS (Transport Layer Security, formerly SSL). HTTPS prevents eavesdropping, tampering, and ensures server identity. HTTPS is now standard for web security - modern browsers warn users about insecure HTTP sites.

HTTPS uses certificates issued by Certificate Authorities (CAs) verifying server identity. Browsers trust specific CAs, rejecting certificates from untrusted sources. Let's Encrypt provides free certificates with automated renewal. Certificate validity periods and renewal are critical operational concerns.

HTTPS encrypts data in transit, protecting passwords, personal information, and session tokens. HTTP/2 and HTTP/3 require HTTPS. HTTPS prevents man-in-the-middle attacks where attackers intercept traffic. Mixed content (HTTPS pages loading HTTP resources) creates vulnerabilities browsers block.

Professional websites exclusively use HTTPS for security and user trust. Understanding certificate management, TLS configuration, and common issues enables maintaining secure connections. HTTPS is legally required for handling sensitive data in many jurisdictions. Security-conscious development requires HTTPS everywhere.`;
    }
    if (lowerTitle.includes('cors')) {
      return `# ${title}

CORS (Cross-Origin Resource Sharing) allows servers to specify which origins can access resources. Browsers block cross-origin requests by default for security. CORS headers enable legitimate cross-origin access while preventing unauthorized access. Understanding CORS is essential for API development.

CORS involves preflight requests (OPTIONS) for complex requests. Servers respond with Access-Control-Allow-Origin specifying allowed origins, Access-Control-Allow-Methods specifying allowed HTTP methods, and Access-Control-Allow-Headers specifying allowed custom headers. Credentials require Access-Control-Allow-Credentials.

Common CORS issues include misconfigured headers, missing OPTIONS handlers, and wildcard with credentials (not allowed). CORS errors appear in browser console. During development, proxies or browser extensions bypass CORS, but production requires proper configuration.

Professional APIs configure CORS appropriately - specific origins for production, wildcards for public APIs. Understanding same-origin policy, preflight requests, and CORS headers prevents security issues while enabling legitimate cross-origin access. Overly permissive CORS creates security vulnerabilities.`;
    }
    if (lowerTitle.includes('csrf')) {
      return `# ${title}

CSRF (Cross-Site Request Forgery) tricks authenticated users into executing unwanted actions. Attackers create requests that browsers automatically include authentication cookies. CSRF can change passwords, transfer funds, or perform actions without user consent. Understanding CSRF prevents serious security vulnerabilities.

CSRF protection uses tokens that attackers cannot access. Synchronizer tokens embed unpredictable tokens in forms, verified on submission. Double-submit cookies send tokens in both cookie and form, comparing them. SameSite cookies prevent browsers from sending cookies on cross-site requests (modern, effective approach).

CSRF primarily affects state-changing requests (POST, PUT, DELETE). GET requests shouldn't change state (HTTP specification and CSRF defense). AJAX requests can use custom headers - same-origin policy prevents attackers from setting custom headers. Checking Origin and Referer headers provides partial protection.

Professional applications implement CSRF protection on all state-changing endpoints. Modern frameworks often include CSRF protection. Understanding CSRF attack vectors and protection mechanisms prevents unauthorized actions. CSRF protection is critical security requirement for web applications handling authentication.`;
    }
    if (lowerTitle.includes('xss')) {
      return `# ${title}

XSS (Cross-Site Scripting) injects malicious scripts into trusted websites. XSS occurs when applications include untrusted data without proper validation or escaping. XSS enables stealing session cookies, capturing keystrokes, or defacing sites. XSS is among the most common web vulnerabilities.

XSS types include stored XSS (malicious data persists in database, affecting all users), reflected XSS (malicious data immediately reflected, affecting victim user), and DOM-based XSS (vulnerability in client-side code). Prevention requires different approaches for each context - HTML, JavaScript, URLs, CSS.

XSS prevention requires sanitizing user input and escaping output appropriately for context. HTML escape converts &lt;, &gt;, &amp;, quotes to entities. JavaScript context requires different escaping. Content Security Policy (CSP) headers restrict script sources, preventing many XSS attacks even if injection occurs.

Professional development treats all user input as untrusted, validating and sanitizing rigorously. Modern frameworks like React provide automatic HTML escaping. Understanding XSS attack vectors, context-appropriate encoding, and defense-in-depth enables building secure applications. XSS prevention is fundamental to web security.`;
    }
    if (lowerTitle.includes('sql injection')) {
      return `# ${title}

SQL injection injects malicious SQL code through application inputs, manipulating database queries. SQL injection can read sensitive data, modify or delete records, or execute admin operations. SQL injection remains a critical security vulnerability despite being well-understood and preventable.

SQL injection occurs when applications concatenate user input directly into SQL queries. Attackers craft input breaking out of intended query structure. Classic example: username: admin'-- bypasses password checks. More sophisticated attacks extract data, enumerate schema, or achieve remote code execution.

Prevention requires parameterized queries (prepared statements) separating SQL code from data. ORMs like Prisma use parameterized queries by default. Input validation provides defense-in-depth but isn't sufficient alone. Principle of least privilege limits damage from successful attacks. Escaping is context-dependent and error-prone.

Professional development exclusively uses parameterized queries for database access. Understanding SQL injection vectors, testing applications for vulnerabilities, and following secure coding practices prevents this critical vulnerability. SQL injection prevention is non-negotiable for any application with database access.`;
    }
    if (lowerTitle.includes('jwt')) {
      return `# ${title}

JWT (JSON Web Token) is a compact, self-contained token format for transmitting information between parties. JWTs commonly implement authentication - servers issue JWTs after login, clients include JWTs in subsequent requests. Understanding JWTs is essential for modern API authentication.

JWTs consist of three parts: header (algorithm and type), payload (claims like user ID, expiration), and signature (verifies integrity). JWTs are base64-encoded, dot-separated strings. Signature ensures JWTs haven't been tampered with. JWTs are stateless - servers verify signatures without database lookups.

JWT advantages include statelessness, scalability, and cross-domain authentication. However, JWTs can't be invalidated before expiration (use short expiration and refresh tokens). Storing JWTs in localStorage risks XSS attacks; httpOnly cookies are more secure. JWT payload is not encrypted - don't store sensitive data.

Professional applications use JWTs for API authentication, especially microservices and mobile apps. Understanding JWT security considerations, refresh token strategies, and secure storage enables building secure authentication systems. While popular, JWTs aren't always the best choice - consider alternatives like sessions.`;
    }
    if (lowerTitle.includes('oauth')) {
      return `# ${title}

OAuth 2.0 is an authorization framework enabling third-party applications to access user resources without exposing credentials. OAuth powers "Login with Google/GitHub/Facebook" buttons. Understanding OAuth is valuable for implementing social login and building APIs requiring third-party access.

OAuth roles include Resource Owner (user), Client (third-party app), Resource Server (API), and Authorization Server (issues tokens). OAuth flows vary by client type. Authorization Code flow suits server apps, Implicit flow (deprecated) suited browser apps, Client Credentials flow suits machine-to-machine, and PKCE extension secures mobile/SPA apps.

OAuth uses access tokens (short-lived, access resources) and refresh tokens (long-lived, obtain new access tokens). Scopes limit what resources tokens can access. OAuth separates authentication (who you are) from authorization (what you can access). OpenID Connect adds authentication layer on OAuth 2.0.

Professional applications implement OAuth for social login, API integrations, and third-party access. Understanding OAuth flows, security considerations (state parameter prevents CSRF), and token management enables building secure authorization systems. OAuth is standard for authorization in modern web applications.`;
    }
    return null; // Return null if no specific content found for Security
  }

  // Testing Topics
  if (category === 'Testing') {
    if (lowerTitle.includes('unit test')) {
      return `# ${title}

Unit testing verifies individual functions or components in isolation. Unit tests are fast, focused, and numerous. They catch bugs early, document code behavior, and enable confident refactoring. Understanding unit testing is fundamental to professional software development.

Unit tests follow Arrange-Act-Assert pattern: set up data, execute code, verify results. Tests should be independent, repeatable, and fast. Mocking isolates units from dependencies like databases or APIs. Test coverage measures code exercised by tests but high coverage doesn't guarantee quality.

Popular JavaScript testing frameworks include Jest (React standard), Mocha, and Vitest. Test frameworks provide assertions, mocking, and test runners. Good unit tests are readable, focus on behavior not implementation, and test edge cases. TDD (Test-Driven Development) writes tests before code.

Professional development includes unit testing as standard practice. Tests prevent regressions, document expected behavior, and improve design by forcing testable code. Understanding unit testing patterns, mocking, and test organization enables building reliable, maintainable software with confidence.`;
    }
    if (lowerTitle.includes('integration test')) {
      return `# ${title}

Integration testing verifies multiple components working together. Integration tests catch issues at component boundaries and ensure proper integration. They're slower than unit tests but faster than end-to-end tests. Understanding integration testing balances different testing levels.

Integration tests might test API endpoint with real database, multiple components interacting, or service integrations. Tests verify components communicate correctly, data flows properly, and business logic spans components correctly. Integration tests use test databases, mock external services, and clean up state between tests.

Integration testing strategies include bottom-up (test lower-level integrations first), top-down (test high-level flows first), and big bang (test everything together). Balance determines how many integration tests - too few miss integration issues, too many slow development.

Professional development includes integration tests for critical paths and complex interactions. Integration tests provide confidence that components work together correctly. Understanding testing pyramid (many unit tests, fewer integration tests, few E2E tests) optimizes test suite effectiveness and speed.`;
    }
    if (lowerTitle.includes('e2e') || lowerTitle.includes('end-to-end')) {
      return `# ${title}

End-to-end testing verifies complete user workflows in environments resembling production. E2E tests interact with applications like real users - clicking buttons, filling forms, navigating pages. E2E tests catch integration issues but are slowest and most brittle tests.

E2E testing tools include Playwright, Cypress, and Selenium. These tools control real browsers, enabling realistic testing. E2E tests verify critical user journeys - signup, login, checkout. Tests should be stable, maintainable, and provide clear error messages when failing.

E2E test challenges include flakiness (intermittent failures), slow execution, and maintenance burden. Strategies for reliability include proper waits, stable selectors, test isolation, and parallel execution. E2E tests should focus on happy paths and critical flows, not exhaustive scenarios covered by unit tests.

Professional development uses E2E tests sparingly for critical business flows. E2E tests provide confidence that applications work end-to-end but shouldn't replace lower-level tests. Understanding E2E testing tradeoffs, best practices, and maintenance strategies enables effective use without overwhelming teams.`;
    }
    if (lowerTitle.includes('jest')) {
      return `# ${title}

Jest is a JavaScript testing framework created by Meta, widely used especially with React. Jest provides test runner, assertion library, mocking capabilities, and code coverage in one package. Zero-config operation and great developer experience make Jest popular for JavaScript testing.

Jest features include snapshot testing (compare rendered output), parallel test execution, built-in code coverage, mocking (functions, modules, timers), and watch mode (reruns tests on changes). Jest uses describe blocks for grouping and test/it blocks for individual tests. Expect provides assertions.

Jest integrates seamlessly with React via react-testing-library. Snapshot tests capture component output, failing when output changes unexpectedly. Mocking isolates units from dependencies. Jest configuration handles different environments, transforms (TypeScript, JSX), and module resolution.

Professional React and Node.js projects commonly use Jest for testing. Understanding Jest features, best practices, and ecosystem enables comprehensive testing strategies. Jest's rich feature set, community support, and excellent documentation make it the standard choice for JavaScript testing.`;
    }
    if (lowerTitle.includes('playwright') || lowerTitle.includes('cypress')) {
      return `# ${title}

Modern E2E testing frameworks like Playwright and Cypress revolutionized browser testing. Both provide reliable, developer-friendly APIs for testing web applications. Understanding these tools enables building comprehensive E2E test suites with better reliability than traditional Selenium tests.

Playwright supports multiple browsers (Chrome, Firefox, Safari) in one API, runs tests in parallel, and provides powerful automation features. Playwright emphasizes speed, reliability, and multi-browser testing. Auto-waiting, network interception, and context isolation improve test stability.

Cypress runs in browser, providing real-time reloads, time travel debugging, and excellent debugging experience. Cypress emphasizes developer experience but initially only supported Chrome. Cypress Cloud provides test recording and debugging. Both frameworks significantly reduce test flakiness compared to Selenium.

Professional teams adopt Playwright or Cypress for E2E testing. Understanding each tool's strengths - Playwright for multi-browser, Cypress for developer experience - guides selection. Both represent modern E2E testing best practices with better reliability and developer experience than previous generation tools.`;
    }
    return null; // Return null if no specific content found for Testing
  }

  // Performance Topics
  if (category === 'Performance') {
    if (lowerTitle.includes('web vitals')) {
      return `# ${title}

Core Web Vitals are Google's metrics for measuring user experience: Largest Contentful Paint (loading), First Input Delay (interactivity), and Cumulative Layout Shift (visual stability). These metrics affect SEO rankings and user perception. Understanding Web Vitals guides performance optimization priorities.

LCP measures when main content loads (goal: 2.5s or less). FID measures response to first interaction (goal: 100ms or less). CLS measures unexpected layout shifts (goal: 0.1 or less). Additional metrics include FCP (First Contentful Paint) and TTFB (Time To First Byte).

Improving LCP involves optimizing images, reducing render-blocking resources, and server response times. Improving FID requires reducing JavaScript execution time and code splitting. Improving CLS needs size attributes on images, avoiding injecting content above, and using CSS transitions.

Professional development monitors Web Vitals using Lighthouse, PageSpeed Insights, and real user monitoring. Understanding what metrics measure and how to improve them enables building fast, delightful user experiences that rank well in search. Web performance directly impacts business metrics.`;
    }
    if (lowerTitle.includes('lazy loading')) {
      return `# ${title}

Lazy loading defers loading resources until needed, improving initial page load. Images, JavaScript, and routes can be lazy loaded. Lazy loading is fundamental to performance optimization, especially for content-heavy sites. Understanding lazy loading enables faster initial loads and better resource utilization.

Image lazy loading uses native loading="lazy" attribute or Intersection Observer API. Browser loads images only when near viewport. Code splitting lazy loads JavaScript - React.lazy() and dynamic import() load components or modules on demand. Route-based code splitting loads only current route's code.

Lazy loading benefits include faster initial load, reduced bandwidth, and improved performance metrics. However, lazy loading can cause layout shift if not implemented carefully or delay content appearing. Placeholders, skeleton screens, and blur-up techniques improve perceived performance.

Professional applications extensively use lazy loading for images, routes, and components. Understanding when and how to lazy load optimizes performance without harming user experience. Lazy loading combined with proper priorities and critical path optimization creates fast-loading applications.`;
    }
    if (lowerTitle.includes('code splitting')) {
      return `# ${title}

Code splitting breaks JavaScript bundles into smaller chunks loaded on demand. Instead of loading entire application upfront, code splitting loads only necessary code initially, reducing initial load time. Understanding code splitting is crucial for optimizing large application performance.

Code splitting strategies include route-based (split per route), component-based (split heavy components), and vendor (separate third-party code). Webpack, Rollup, and Vite support code splitting via dynamic imports. Modern frameworks like Next.js automatically code split routes.

Code splitting benefits include smaller initial bundles, faster time to interactive, and efficient caching. Shared code moves to common chunks. Lazy loading components or routes loads their split chunks on demand. Prefetching and preloading hints optimize subsequent navigations.

Professional applications strategically code split to balance bundle sizes, number of requests, and caching. Understanding bundler behavior, chunk naming, and loading strategies optimizes performance. Analyzing bundle size, identifying large dependencies, and splitting strategically creates faster applications.`;
    }
    if (lowerTitle.includes('caching')) {
      return `# ${title}

Performance optimization heavily relies on caching at multiple levels. Browser cache, service workers, CDN cache, and server cache all reduce latency and server load. Understanding caching strategies and cache headers enables building fast applications.

Cache-Control headers instruct caching behavior: max-age sets expiration, public allows CDN caching, private restricts to browser cache, no-cache requires revalidation. ETag and Last-Modified enable conditional requests. Immutable indicates resources never change, enabling aggressive caching.

Service workers enable offline functionality and advanced caching strategies. Cache-first serves cached content immediately, network-first fetches fresh content, and stale-while-revalidate balances speed and freshness. Versioned URLs enable long cache times without staleness concerns.

Professional applications optimize caching for static assets (long cache times with versioning), APIs (short cache times or no cache), and HTML (short cache or no cache). Understanding cache invalidation, versioning strategies, and HTTP caching enables maximizing performance benefits.`;
    }
    return null; // Return null if no specific content found for Performance
  }

  // Mobile Topics
  if (category === 'Mobile') {
    if (lowerTitle.includes('react native')) {
      return `# ${title}

React Native enables building native mobile apps using React and JavaScript. React Native renders native components rather than web views, providing native performance and feel. Understanding React Native enables building iOS and Android apps with shared codebase and React knowledge.

React Native components map to native components - View becomes iOS UIView or Android ViewGroup. React Native includes platform-specific code, allowing customization per platform. Metro bundler packages JavaScript. Hot reloading speeds development. Native modules access platform capabilities unavailable in JavaScript.

React Native benefits include code sharing across platforms, React skills reuse, hot reloading, and JavaScript development speed. Challenges include platform differences, native module dependencies, and slightly lower performance than pure native. Expo simplifies React Native development with managed workflow.

Professional mobile development increasingly uses React Native for cross-platform apps. Companies like Facebook, Instagram, and Airbnb use React Native. Understanding React Native architecture, platform differences, and performance optimization enables building quality mobile applications efficiently.`;
    }
    if (lowerTitle.includes('expo')) {
      return `# ${title}

Expo is a framework and platform for React Native, providing managed workflow eliminating native code compilation. Expo includes pre-built native modules, development tools, and build services. Expo dramatically simplifies React Native development, especially for web developers learning mobile.

Expo provides managed and bare workflows. Managed workflow handles native code entirely - developers write only JavaScript. Bare workflow ejects to standard React Native for full native control. EAS (Expo Application Services) handles builds, updates, and app store submissions.

Expo includes pre-built modules for camera, location, notifications, file system, and more. Expo Go app enables testing on physical devices without building. OTA (Over The Air) updates push JavaScript changes without app store submissions. Expo CLI provides development server and commands.

Professional developers start with Expo for rapid development, ejecting to bare workflow if needing custom native code. Understanding Expo limitations, managed vs bare workflows, and EAS services enables making informed choices for mobile development. Expo has become the recommended way to start React Native projects.`;
    }
    return null; // Return null if no specific content found for Mobile
  }

  // Professional Tools Topics
  if (category === 'Professional Tools') {
    if (lowerTitle.includes('git')) {
      return `# ${title}

Git is the distributed version control system used by nearly all developers. Git tracks code changes, enables collaboration, and provides history enabling reverting mistakes. Understanding Git is essential for professional development. Every developer needs Git proficiency.

Core Git concepts include commits (snapshots of changes), branches (parallel development lines), and merges (combining branches). Common commands include git add (stage changes), git commit (save changes), git push (upload to remote), git pull (download from remote), and git merge (combine branches).

Git workflows include feature branches (develop features in separate branches), Git Flow (structured branching model), and trunk-based development (frequent commits to main branch). Pull requests enable code review before merging. Understanding branching, merging, and conflict resolution enables effective collaboration.

Professional development requires Git mastery. Understanding Git internals, advanced commands (rebase, cherry-pick, bisect), and best practices (atomic commits, meaningful messages, frequent commits) enables effective version control. Git is fundamental to modern software development workflows.`;
    }
    if (lowerTitle.includes('rest api') || lowerTitle.includes('restful')) {
      return `# ${title}

REST (Representational State Transfer) APIs are the dominant web service architecture. RESTful principles enable building scalable, maintainable APIs consumed by various clients. Understanding REST is essential for backend development, frontend API integration, and designing API contracts.

REST principles include statelessness, resource-based URLs, standard HTTP methods, and meaningful status codes. Resources are nouns (/users, /products), methods are verbs (GET retrieve, POST create, PUT/PATCH update, DELETE remove). JSON is standard data format. Status codes communicate results (200 OK, 201 Created, 404 Not Found, 500 Server Error).

REST best practices include versioning (v1, v2 in URLs), pagination for large collections, filtering and sorting, consistent error responses, and proper authentication. HATEOAS (Hypermedia as Engine of Application State) provides links for related resources. Caching and idempotency improve reliability.

Professional API development follows REST principles for predictability and maintainability. Understanding Richardson Maturity Model, HTTP semantics, and API design patterns enables building intuitive, developer-friendly APIs. Well-designed REST APIs accelerate frontend development and enable diverse client integrations.`;
    }
    if (lowerTitle.includes('graphql')) {
      return `# ${title}

GraphQL is a query language for APIs enabling clients to request exactly needed data. GraphQL provides single endpoint with flexible queries, contrasting with REST's fixed endpoints. Understanding GraphQL enables building efficient, developer-friendly APIs especially for complex data requirements.

GraphQL schemas define types, queries (read data), mutations (modify data), and subscriptions (real-time updates). Clients send queries specifying desired fields. GraphQL resolvers fetch requested data. GraphQL returns only requested fields, avoiding over-fetching or under-fetching common with REST.

GraphQL benefits include precise data fetching, reduced requests, strong typing, and excellent introspection. Challenges include complexity, n+1 query problems, and caching difficulty. DataLoader solves n+1 problems. Apollo and Relay are popular GraphQL clients.

Professional applications use GraphQL for complex data requirements, mobile apps needing efficient data fetching, or rapidly evolving APIs. Understanding GraphQL schema design, resolver patterns, and performance optimization enables building effective GraphQL APIs. GraphQL shines when data requirements vary significantly across clients.`;
    }
    if (lowerTitle.includes('websocket')) {
      return `# ${title}

WebSockets enable bidirectional, real-time communication between clients and servers. Unlike HTTP's request-response pattern, WebSockets maintain open connections for both parties to send messages anytime. Understanding WebSockets enables building real-time features like chat, notifications, and live updates.

WebSocket connection starts with HTTP handshake, upgrading to WebSocket protocol. Both client and server can send messages independently. WebSockets maintain persistent connections, avoiding repeated connection overhead. Socket.IO abstracts WebSockets, providing fallbacks and additional features.

WebSocket use cases include chat applications, real-time dashboards, collaborative editing, gaming, and notifications. WebSockets are more efficient than polling for frequently updating data. However, WebSockets require careful connection management, reconnection logic, and scalability considerations.

Professional applications use WebSockets sparingly for truly real-time features. Understanding when WebSockets versus polling versus Server-Sent Events is appropriate guides architectural decisions. WebSocket implementations require considering authentication, message formats, connection limits, and horizontal scaling challenges.`;
    }
    if (lowerTitle.includes('redis')) {
      return `# ${title}

Redis is an in-memory data structure store used as database, cache, and message broker. Redis provides extremely fast data access through RAM storage. Understanding Redis enables building high-performance caching layers, session stores, and real-time features.

Redis supports various data structures: strings, hashes, lists, sets, sorted sets, and more. Redis commands manipulate these structures atomically. Pub/Sub enables messaging patterns. Redis persistence options include snapshots and append-only files. Redis Cluster provides horizontal scaling.

Common Redis use cases include caching database queries, session storage, rate limiting, real-time analytics, leaderboards, and message queues. Redis's speed and data structures make it versatile. However, Redis data lives in RAM, limiting dataset size and requiring careful capacity planning.

Professional applications extensively use Redis for caching and real-time features. Understanding Redis data structures, persistence options, and scalability strategies enables leveraging Redis effectively. Redis is fundamental infrastructure for high-performance applications requiring fast data access or real-time capabilities.`;
    }
    return null; // Return null if no specific content found for Professional Tools
  }

  return null; // Return null for categories not yet handled
};

const generateGenericContent = (title, category) => {
  return `# ${title}

This topic covers ${title} in ${category || 'web'} development. ${title} is an important concept that developers encounter regularly when building modern applications. Understanding this topic helps create more effective and maintainable code.

${title} provides specific capabilities that solve common development challenges. Developers use this technology to implement features, improve code organization, and enhance application functionality. This concept builds on foundational knowledge and extends capabilities in meaningful ways.

In professional development environments, ${title} appears frequently in codebases and technical discussions. Teams rely on this knowledge to make architectural decisions and implement solutions. Mastering this topic improves your ability to contribute to projects and understand existing code.

Practical application of ${title} involves understanding both theory and implementation. Developers should know when to apply this concept, how to implement it correctly, and what trade-offs exist. This knowledge enables building robust applications that meet user needs while maintaining code quality.`;
};

// ==============================================================================
// 2. TOPIC DATA (All Sidebar Topics)
// ==============================================================================

const htmlTopics = [
  { title: 'HTML Introduction', href: '/learn/full-stack/html/html-introduction' },
  { title: 'HTML Tutorial', href: '/learn/full-stack/html/html-tutorial' },
  { title: 'HTML Editors', href: '/learn/full-stack/html/html-editors' },
  { title: 'HTML Basic', href: '/learn/full-stack/html/html-basic' },
  { title: 'HTML Elements', href: '/learn/full-stack/html/html-elements' },
  { title: 'HTML Attributes', href: '/learn/full-stack/html/html-attributes' },
  { title: 'HTML Headings', href: '/learn/full-stack/html/html-headings' },
  { title: 'HTML Paragraphs', href: '/learn/full-stack/html/html-paragraphs' },
  { title: 'HTML Styles', href: '/learn/full-stack/html/html-styles' },
  { title: 'HTML Formatting', href: '/learn/full-stack/html/html-formatting' },
  { title: 'HTML Quotations', href: '/learn/full-stack/html/html-quotations' },
  { title: 'HTML Comments', href: '/learn/full-stack/html/html-comments' },
  { title: 'HTML Colors', href: '/learn/full-stack/html/html-colors' },
  { title: 'HTML CSS', href: '/learn/full-stack/html/html-css' },
  { title: 'HTML Links', href: '/learn/full-stack/html/html-links' },
  { title: 'HTML Images', href: '/learn/full-stack/html/html-images' },
  { title: 'HTML Favicon', href: '/learn/full-stack/html/html-favicon' },
  { title: 'HTML Page Title', href: '/learn/full-stack/html/html-page-title' },
  { title: 'HTML Tables', href: '/learn/full-stack/html/html-tables' },
  { title: 'HTML Lists', href: '/learn/full-stack/html/html-lists' },
  { title: 'HTML Block & Inline', href: '/learn/full-stack/html/html-block-inline' },
  { title: 'HTML Div', href: '/learn/full-stack/html/html-div' },
  { title: 'HTML Classes', href: '/learn/full-stack/html/html-classes' },
  { title: 'HTML Id', href: '/learn/full-stack/html/html-id' },
  { title: 'HTML Buttons', href: '/learn/full-stack/html/html-buttons' },
  { title: 'HTML Iframes', href: '/learn/full-stack/html/html-iframes' },
  { title: 'HTML JavaScript', href: '/learn/full-stack/html/html-javascript' },
  { title: 'HTML File Paths', href: '/learn/full-stack/html/html-file-paths' },
  { title: 'HTML Head', href: '/learn/full-stack/html/html-head' },
  { title: 'HTML Layout', href: '/learn/full-stack/html/html-layout' },
  { title: 'HTML Responsive', href: '/learn/full-stack/html/html-responsive' },
  { title: 'HTML Computercode', href: '/learn/full-stack/html/html-computercode' },
  { title: 'HTML Semantics', href: '/learn/full-stack/html/html-semantics' },
  { title: 'HTML Style Guide', href: '/learn/full-stack/html/html-style-guide' },
  { title: 'HTML Entities', href: '/learn/full-stack/html/html-entities' },
  { title: 'HTML Symbols', href: '/learn/full-stack/html/html-symbols' },
  { title: 'HTML Emojis', href: '/learn/full-stack/html/html-emojis' },
  { title: 'HTML Charsets', href: '/learn/full-stack/html/html-charsets' },
  { title: 'HTML URL Encode', href: '/learn/full-stack/html/html-url-encode' },
  { title: 'HTML vs XHTML', href: '/learn/full-stack/html/html-vs-xhtml' },
  { title: 'HTML Forms', href: '/learn/full-stack/html/html-forms' },
  { title: 'HTML Form Attributes', href: '/learn/full-stack/html/html-form-attributes' },
  { title: 'HTML Form Elements', href: '/learn/full-stack/html/html-form-elements' },
  { title: 'HTML Input Types', href: '/learn/full-stack/html/html-input-types' },
  { title: 'HTML Input Attributes', href: '/learn/full-stack/html/html-input-attributes' },
  { title: 'HTML Input Form Attributes', href: '/learn/full-stack/html/html-input-form-attributes' },
  { title: 'HTML Graphics', href: '/learn/full-stack/html/html-graphics' },
  { title: 'HTML Canvas', href: '/learn/full-stack/html/html-canvas' },
  { title: 'HTML SVG', href: '/learn/full-stack/html/html-svg' },
  { title: 'HTML Media', href: '/learn/full-stack/html/html-media' },
  { title: 'HTML Video', href: '/learn/full-stack/html/html-video' },
  { title: 'HTML Audio', href: '/learn/full-stack/html/html-audio' },
  { title: 'HTML Plug-ins', href: '/learn/full-stack/html/html-plug-ins' },
  { title: 'HTML YouTube', href: '/learn/full-stack/html/html-youtube' },
  { title: 'HTML APIs', href: '/learn/full-stack/html/html-apis' },
  { title: 'HTML Web APIs', href: '/learn/full-stack/html/html-web-apis' },
  { title: 'HTML Geolocation', href: '/learn/full-stack/html/html-geolocation' },
  { title: 'HTML Drag and Drop', href: '/learn/full-stack/html/html-drag-drop' },
  { title: 'HTML Web Storage', href: '/learn/full-stack/html/html-web-storage' },
  { title: 'HTML Web Workers', href: '/learn/full-stack/html/html-web-workers' },
  { title: 'HTML SSE', href: '/learn/full-stack/html/html-sse' },
  { title: 'HTML Examples', href: '/learn/full-stack/html/html-examples' },
  { title: 'HTML Editor', href: '/learn/full-stack/html/html-editor' },
  { title: 'HTML Quiz', href: '/learn/full-stack/html/html-quiz' },
  { title: 'HTML Exercises', href: '/learn/full-stack/html/html-exercises' },
  { title: 'HTML Website', href: '/learn/full-stack/html/html-website' },
  { title: 'HTML Syllabus', href: '/learn/full-stack/html/html-syllabus' },
  { title: 'HTML Study Plan', href: '/learn/full-stack/html/html-study-plan' },
  { title: 'HTML Interview Prep', href: '/learn/full-stack/html/html-interview-prep' },
  { title: 'HTML Bootcamp', href: '/learn/full-stack/html/html-bootcamp' },
  { title: 'HTML Certificate', href: '/learn/full-stack/html/html-certificate' },
  { title: 'HTML Summary', href: '/learn/full-stack/html/html-summary' },
  { title: 'HTML Accessibility', href: '/learn/full-stack/html/html-accessibility' },
  { title: 'HTML Tag List', href: '/learn/full-stack/html/html-tag-list' },
  { title: 'HTML Global Attributes', href: '/learn/full-stack/html/html-global-attributes' },
  { title: 'HTML Browser Support', href: '/learn/full-stack/html/html-browser-support' },
  { title: 'HTML Events', href: '/learn/full-stack/html/html-events' },
  { title: 'HTML Canvas Reference', href: '/learn/full-stack/html/html-canvas-reference' },
  { title: 'HTML Audio/Video', href: '/learn/full-stack/html/html-audio-video' },
  { title: 'HTML Doctypes', href: '/learn/full-stack/html/html-doctypes' },
  { title: 'HTML Character Sets', href: '/learn/full-stack/html/html-character-sets' },
  { title: 'HTML Lang Codes', href: '/learn/full-stack/html/html-lang-codes' },
  { title: 'HTTP Messages', href: '/learn/full-stack/html/http-messages' },
  { title: 'HTTP Methods', href: '/learn/full-stack/html/http-methods' },
  { title: 'PX to EM Converter', href: '/learn/full-stack/html/px-to-em-converter' },
  { title: 'Keyboard Shortcuts', href: '/learn/full-stack/html/keyboard-shortcuts' }
];

const cssTopics = [
  { title: 'CSS HOME', href: '/learn/full-stack/css/css-home' },
  { title: 'CSS Introduction', href: '/learn/full-stack/css/css-introduction' },
  { title: 'CSS Syntax', href: '/learn/full-stack/css/css-syntax' },
  { title: 'CSS Selectors', href: '/learn/full-stack/css/css-selectors' },
  { title: 'CSS How To', href: '/learn/full-stack/css/css-how-to' },
  { title: 'CSS Comments', href: '/learn/full-stack/css/css-comments' },
  { title: 'CSS Errors', href: '/learn/full-stack/css/css-errors' },
  { title: 'CSS Colors', href: '/learn/full-stack/css/css-colors' },
  { title: 'CSS Backgrounds', href: '/learn/full-stack/css/css-backgrounds' },
  { title: 'CSS Borders', href: '/learn/full-stack/css/css-borders' },
  { title: 'CSS Margins', href: '/learn/full-stack/css/css-margins' },
  { title: 'CSS Padding', href: '/learn/full-stack/css/css-padding' },
  { title: 'CSS Height/Width', href: '/learn/full-stack/css/css-height-width' },
  { title: 'CSS Box Model', href: '/learn/full-stack/css/css-box-model' },
  { title: 'CSS Outline', href: '/learn/full-stack/css/css-outline' },
  { title: 'CSS Text', href: '/learn/full-stack/css/css-text' },
  { title: 'CSS Fonts', href: '/learn/full-stack/css/css-fonts' },
  { title: 'CSS Icons', href: '/learn/full-stack/css/css-icons' },
  { title: 'CSS Links', href: '/learn/full-stack/css/css-links' },
  { title: 'CSS Lists', href: '/learn/full-stack/css/css-lists' },
  { title: 'CSS Tables', href: '/learn/full-stack/css/css-tables' },
  { title: 'CSS Display', href: '/learn/full-stack/css/css-display' },
  { title: 'CSS Max-width', href: '/learn/full-stack/css/css-max-width' },
  { title: 'CSS Position', href: '/learn/full-stack/css/css-position' },
  { title: 'CSS Z-index', href: '/learn/full-stack/css/css-z-index' },
  { title: 'CSS Overflow', href: '/learn/full-stack/css/css-overflow' },
  { title: 'CSS Float', href: '/learn/full-stack/css/css-float' },
  { title: 'CSS Inline-block', href: '/learn/full-stack/css/css-inline-block' },
  { title: 'CSS Align', href: '/learn/full-stack/css/css-align' },
  { title: 'CSS Combinators', href: '/learn/full-stack/css/css-combinators' },
  { title: 'CSS Pseudo-classes', href: '/learn/full-stack/css/css-pseudo-classes' },
  { title: 'CSS Pseudo-elements', href: '/learn/full-stack/css/css-pseudo-elements' },
  { title: 'CSS Opacity', href: '/learn/full-stack/css/css-opacity' },
  { title: 'CSS Navigation Bars', href: '/learn/full-stack/css/css-navigation-bars' },
  { title: 'CSS Dropdowns', href: '/learn/full-stack/css/css-dropdowns' },
  { title: 'CSS Image Gallery', href: '/learn/full-stack/css/css-image-gallery' },
  { title: 'CSS Image Sprites', href: '/learn/full-stack/css/css-image-sprites' },
  { title: 'CSS Attr Selectors', href: '/learn/full-stack/css/css-attr-selectors' },
  { title: 'CSS Forms', href: '/learn/full-stack/css/css-forms' },
  { title: 'CSS Counters', href: '/learn/full-stack/css/css-counters' },
  { title: 'CSS Units', href: '/learn/full-stack/css/css-units' },
  { title: 'CSS Inheritance', href: '/learn/full-stack/css/css-inheritance' },
  { title: 'CSS Specificity', href: '/learn/full-stack/css/css-specificity' },
  { title: 'CSS !important', href: '/learn/full-stack/css/css-important' },
  { title: 'CSS Math Functions', href: '/learn/full-stack/css/css-math-functions' },
  { title: 'CSS Optimization', href: '/learn/full-stack/css/css-optimization' },
  { title: 'CSS Accessibility', href: '/learn/full-stack/css/css-accessibility' },
  { title: 'CSS Website Layout', href: '/learn/full-stack/css/css-website-layout' },
  { title: 'CSS Rounded Corners', href: '/learn/full-stack/css/css-rounded-corners' },
  { title: 'CSS Border Images', href: '/learn/full-stack/css/css-border-images' },
  { title: 'CSS Backgrounds Advanced', href: '/learn/full-stack/css/css-backgrounds-advanced' },
  { title: 'CSS Colors Advanced', href: '/learn/full-stack/css/css-colors-advanced' },
  { title: 'CSS Color Keywords', href: '/learn/full-stack/css/css-color-keywords' },
  { title: 'CSS Gradients', href: '/learn/full-stack/css/css-gradients' },
  { title: 'CSS Shadows', href: '/learn/full-stack/css/css-shadows' },
  { title: 'CSS Text Effects', href: '/learn/full-stack/css/css-text-effects' },
  { title: 'CSS Custom Fonts', href: '/learn/full-stack/css/css-custom-fonts' },
  { title: 'CSS 2D Transforms', href: '/learn/full-stack/css/css-2d-transforms' },
  { title: 'CSS 3D Transforms', href: '/learn/full-stack/css/css-3d-transforms' },
  { title: 'CSS Transitions', href: '/learn/full-stack/css/css-transitions' },
  { title: 'CSS Animations', href: '/learn/full-stack/css/css-animations' },
  { title: 'CSS Tooltips', href: '/learn/full-stack/css/css-tooltips' },
  { title: 'CSS Image Styling', href: '/learn/full-stack/css/css-image-styling' },
  { title: 'CSS Image Modal', href: '/learn/full-stack/css/css-image-modal' },
  { title: 'CSS Image Centering', href: '/learn/full-stack/css/css-image-centering' },
  { title: 'CSS Image Filters', href: '/learn/full-stack/css/css-image-filters' },
  { title: 'CSS Image Shapes', href: '/learn/full-stack/css/css-image-shapes' },
  { title: 'CSS object-fit', href: '/learn/full-stack/css/css-object-fit' },
  { title: 'CSS object-position', href: '/learn/full-stack/css/css-object-position' },
  { title: 'CSS Masking', href: '/learn/full-stack/css/css-masking' },
  { title: 'CSS Buttons', href: '/learn/full-stack/css/css-buttons' },
  { title: 'CSS Pagination', href: '/learn/full-stack/css/css-pagination' },
  { title: 'CSS Multiple Columns', href: '/learn/full-stack/css/css-multiple-columns' },
  { title: 'CSS User Interface', href: '/learn/full-stack/css/css-user-interface' },
  { title: 'CSS Variables', href: '/learn/full-stack/css/css-variables' },
  { title: 'CSS @property', href: '/learn/full-stack/css/css-property' },
  { title: 'CSS Box Sizing', href: '/learn/full-stack/css/css-box-sizing' },
  { title: 'CSS Media Queries', href: '/learn/full-stack/css/css-media-queries' },
  { title: 'CSS MQ Examples', href: '/learn/full-stack/css/css-mq-examples' },
  { title: 'Flexbox Intro', href: '/learn/full-stack/css/flexbox-intro' },
  { title: 'Flex Container', href: '/learn/full-stack/css/flex-container' },
  { title: 'Flex Items', href: '/learn/full-stack/css/flex-items' },
  { title: 'Flex Responsive', href: '/learn/full-stack/css/flex-responsive' },
  { title: 'Grid Intro', href: '/learn/full-stack/css/grid-intro' },
  { title: 'Grid Container', href: '/learn/full-stack/css/grid-container' },
  { title: 'Grid Items', href: '/learn/full-stack/css/grid-items' },
  { title: 'Grid 12-column Layout', href: '/learn/full-stack/css/grid-12-column-layout' },
  { title: 'CSS @supports', href: '/learn/full-stack/css/css-supports' },
  { title: 'RWD Intro', href: '/learn/full-stack/css/rwd-intro' },
  { title: 'RWD Viewport', href: '/learn/full-stack/css/rwd-viewport' },
  { title: 'RWD Grid View', href: '/learn/full-stack/css/rwd-grid-view' },
  { title: 'RWD Media Queries', href: '/learn/full-stack/css/rwd-media-queries' },
  { title: 'RWD Images', href: '/learn/full-stack/css/rwd-images' },
  { title: 'RWD Videos', href: '/learn/full-stack/css/rwd-videos' },
  { title: 'RWD Frameworks', href: '/learn/full-stack/css/rwd-frameworks' },
  { title: 'RWD Templates', href: '/learn/full-stack/css/rwd-templates' },
  { title: 'SASS Tutorial', href: '/learn/full-stack/css/sass-tutorial' },
  { title: 'CSS Templates', href: '/learn/full-stack/css/css-templates' },
  { title: 'CSS Examples', href: '/learn/full-stack/css/css-examples' },
  { title: 'CSS Editor', href: '/learn/full-stack/css/css-editor' },
  { title: 'CSS Snippets', href: '/learn/full-stack/css/css-snippets' },
  { title: 'CSS Quiz', href: '/learn/full-stack/css/css-quiz' },
  { title: 'CSS Exercises', href: '/learn/full-stack/css/css-exercises' },
  { title: 'CSS Website', href: '/learn/full-stack/css/css-website' },
  { title: 'CSS Syllabus', href: '/learn/full-stack/css/css-syllabus' },
  { title: 'CSS Study Plan', href: '/learn/full-stack/css/css-study-plan' },
  { title: 'CSS Interview Prep', href: '/learn/full-stack/css/css-interview-prep' },
  { title: 'CSS Bootcamp', href: '/learn/full-stack/css/css-bootcamp' },
  { title: 'CSS Certificate', href: '/learn/full-stack/css/css-certificate' },
  { title: 'CSS Reference', href: '/learn/full-stack/css/css-reference' },
  { title: 'CSS Selectors Reference', href: '/learn/full-stack/css/css-selectors-reference' },
  { title: 'CSS Combinators Reference', href: '/learn/full-stack/css/css-combinators-reference' },
  { title: 'CSS Pseudo-classes Reference', href: '/learn/full-stack/css/css-pseudo-classes-reference' },
  { title: 'CSS Pseudo-elements Reference', href: '/learn/full-stack/css/css-pseudo-elements-reference' },
  { title: 'CSS At-rules', href: '/learn/full-stack/css/css-at-rules' },
  { title: 'CSS Functions', href: '/learn/full-stack/css/css-functions' },
  { title: 'CSS Web Safe Fonts', href: '/learn/full-stack/css/css-web-safe-fonts' },
  { title: 'CSS Animatable', href: '/learn/full-stack/css/css-animatable' },
  { title: 'CSS Units Reference', href: '/learn/full-stack/css/css-units-reference' },
  { title: 'CSS PX-EM Converter', href: '/learn/full-stack/css/css-px-em-converter' },
  { title: 'CSS Colors Reference', href: '/learn/full-stack/css/css-colors-reference' },
  { title: 'CSS Color Values', href: '/learn/full-stack/css/css-color-values' },
  { title: 'CSS Default Values', href: '/learn/full-stack/css/css-default-values' },
  { title: 'CSS Browser Support', href: '/learn/full-stack/css/css-browser-support' },
];

const jsTopics = [
  { title: 'JS Tutorial', href: '/learn/full-stack/javascript/js-tutorial' },
  { title: 'JS Syntax', href: '/learn/full-stack/javascript/js-syntax' },
  { title: 'JS Variables', href: '/learn/full-stack/javascript/js-variables' },
  { title: 'JS Operators', href: '/learn/full-stack/javascript/js-operators' },
  { title: 'JS If Conditions', href: '/learn/full-stack/javascript/js-if-conditions' },
  { title: 'JS Loops', href: '/learn/full-stack/javascript/js-loops' },
  { title: 'JS Strings', href: '/learn/full-stack/javascript/js-strings' },
  { title: 'JS Numbers', href: '/learn/full-stack/javascript/js-numbers' },
  { title: 'JS Functions', href: '/learn/full-stack/javascript/js-functions' },
  { title: 'JS Objects', href: '/learn/full-stack/javascript/js-objects' },
  { title: 'JS Scope', href: '/learn/full-stack/javascript/js-scope' },
  { title: 'JS Dates', href: '/learn/full-stack/javascript/js-dates' },
  { title: 'JS Temporal Dates', href: '/learn/full-stack/javascript/js-temporal-dates' },
  { title: 'JS Arrays', href: '/learn/full-stack/javascript/js-arrays' },
  { title: 'JS Sets', href: '/learn/full-stack/javascript/js-sets' },
  { title: 'JS Maps', href: '/learn/full-stack/javascript/js-maps' },
  { title: 'JS Iterations', href: '/learn/full-stack/javascript/js-iterations' },
  { title: 'JS Math', href: '/learn/full-stack/javascript/js-math' },
  { title: 'JS RegExp', href: '/learn/full-stack/javascript/js-regexp' },
  { title: 'JS Data Types', href: '/learn/full-stack/javascript/js-data-types' },
  { title: 'JS Errors', href: '/learn/full-stack/javascript/js-errors' },
  { title: 'JS Conventions', href: '/learn/full-stack/javascript/js-conventions' },
  { title: 'JS References', href: '/learn/full-stack/javascript/js-references' },
  { title: 'JS ECMAScript 2026', href: '/learn/full-stack/javascript/js-ecmascript-2026' },
  { title: 'JS Versions', href: '/learn/full-stack/javascript/js-versions' },
  { title: 'JS HTML DOM', href: '/learn/full-stack/javascript/js-html-dom' },
  { title: 'JS Events', href: '/learn/full-stack/javascript/js-events' },
  { title: 'JS Projects', href: '/learn/full-stack/javascript/js-projects' },
  { title: 'JS Functions Advanced', href: '/learn/full-stack/javascript/js-functions-advanced' },
  { title: 'JS Objects Advanced', href: '/learn/full-stack/javascript/js-objects-advanced' },
  { title: 'JS Classes', href: '/learn/full-stack/javascript/js-classes' },
  { title: 'JS Asynchronous', href: '/learn/full-stack/javascript/js-asynchronous' },
  { title: 'JS Modules', href: '/learn/full-stack/javascript/js-modules' },
  { title: 'JS Meta & Proxy', href: '/learn/full-stack/javascript/js-meta-proxy' },
  { title: 'JS Typed Arrays', href: '/learn/full-stack/javascript/js-typed-arrays' },
  { title: 'JS DOM Navigation', href: '/learn/full-stack/javascript/js-dom-navigation' },
  { title: 'JS Windows', href: '/learn/full-stack/javascript/js-windows' },
  { title: 'JS Web APIs', href: '/learn/full-stack/javascript/js-web-apis' },
  { title: 'JS AJAX', href: '/learn/full-stack/javascript/js-ajax' },
  { title: 'JS JSON', href: '/learn/full-stack/javascript/js-json' },
  { title: 'JS jQuery', href: '/learn/full-stack/javascript/js-jquery' },
  { title: 'JS Graphics', href: '/learn/full-stack/javascript/js-graphics' },
  { title: 'JS Examples', href: '/learn/full-stack/javascript/js-examples' },
  { title: 'JS Reference', href: '/learn/full-stack/javascript/js-reference' },
];

const nodeTopics = [
  { title: 'Node HOME', href: '/learn/full-stack/node/node-home' },
  { title: 'Node Intro', href: '/learn/full-stack/node/node-intro' },
  { title: 'Node Get Started', href: '/learn/full-stack/node/node-get-started' },
  { title: 'Node JS Requirements', href: '/learn/full-stack/node/node-js-requirements' },
  { title: 'Node.js vs Browser', href: '/learn/full-stack/node/nodejs-vs-browser' },
  { title: 'Node Cmd Line', href: '/learn/full-stack/node/node-cmd-line' },
  { title: 'Node V8 Engine', href: '/learn/full-stack/node/node-v8-engine' },
  { title: 'Node Architecture', href: '/learn/full-stack/node/node-architecture' },
  { title: 'Node Event Loop', href: '/learn/full-stack/node/node-event-loop' },
  { title: 'Node Async', href: '/learn/full-stack/node/node-async' },
  { title: 'Node Promises', href: '/learn/full-stack/node/node-promises' },
  { title: 'Node Async/Await', href: '/learn/full-stack/node/node-async-await' },
  { title: 'Node Errors Handling', href: '/learn/full-stack/node/node-errors-handling' },
  { title: 'Node Modules', href: '/learn/full-stack/node/node-modules' },
  { title: 'Node ES Modules', href: '/learn/full-stack/node/node-es-modules' },
  { title: 'Node NPM', href: '/learn/full-stack/node/node-npm' },
  { title: 'Node package.json', href: '/learn/full-stack/node/node-package-json' },
  { title: 'Node NPM Scripts', href: '/learn/full-stack/node/node-npm-scripts' },
  { title: 'Node Manage Dep', href: '/learn/full-stack/node/node-manage-dep' },
  { title: 'Node Publish Packages', href: '/learn/full-stack/node/node-publish-packages' },
  { title: 'HTTP Module', href: '/learn/full-stack/node/http-module' },
  { title: 'HTTPS Module', href: '/learn/full-stack/node/https-module' },
  { title: 'File System (fs)', href: '/learn/full-stack/node/file-system-fs' },
  { title: 'Path Module', href: '/learn/full-stack/node/path-module' },
  { title: 'OS Module', href: '/learn/full-stack/node/os-module' },
  { title: 'URL Module', href: '/learn/full-stack/node/url-module' },
  { title: 'Events Module', href: '/learn/full-stack/node/events-module' },
  { title: 'Stream Module', href: '/learn/full-stack/node/stream-module' },
  { title: 'Buffer Module', href: '/learn/full-stack/node/buffer-module' },
  { title: 'Crypto Module', href: '/learn/full-stack/node/crypto-module' },
  { title: 'Timers Module', href: '/learn/full-stack/node/timers-module' },
  { title: 'DNS Module', href: '/learn/full-stack/node/dns-module' },
  { title: 'Assert Module', href: '/learn/full-stack/node/assert-module' },
  { title: 'Util Module', href: '/learn/full-stack/node/util-module' },
  { title: 'Readline Module', href: '/learn/full-stack/node/readline-module' },
  { title: 'Node ES6+', href: '/learn/full-stack/node/node-es6-plus' },
  { title: 'Node Process', href: '/learn/full-stack/node/node-process' },
  { title: 'Node TypeScript', href: '/learn/full-stack/node/node-typescript' },
  { title: 'Node Adv. TypeScript', href: '/learn/full-stack/node/node-adv-typescript' },
  { title: 'Node Lint & Formatting', href: '/learn/full-stack/node/node-lint-formatting' },
  { title: 'Node Frameworks', href: '/learn/full-stack/node/node-frameworks' },
  { title: 'Express.js', href: '/learn/full-stack/node/expressjs' },
  { title: 'Middleware Concept', href: '/learn/full-stack/node/middleware-concept' },
  { title: 'REST API Design', href: '/learn/full-stack/node/rest-api-design' },
  { title: 'API Authentication', href: '/learn/full-stack/node/api-authentication' },
  { title: 'Node.js with Frontend', href: '/learn/full-stack/node/nodejs-with-frontend' },
  { title: 'MySQL Get Started', href: '/learn/full-stack/node/mysql-get-started' },
  { title: 'MySQL Create Database', href: '/learn/full-stack/node/mysql-create-database' },
  { title: 'MySQL Create Table', href: '/learn/full-stack/node/mysql-create-table' },
  { title: 'MySQL Insert Into', href: '/learn/full-stack/node/mysql-insert-into' },
  { title: 'MySQL Select From', href: '/learn/full-stack/node/mysql-select-from' },
  { title: 'MySQL Where', href: '/learn/full-stack/node/mysql-where' },
  { title: 'MySQL Order By', href: '/learn/full-stack/node/mysql-order-by' },
  { title: 'MySQL Delete', href: '/learn/full-stack/node/mysql-delete' },
  { title: 'MySQL Drop Table', href: '/learn/full-stack/node/mysql-drop-table' },
  { title: 'MySQL Update', href: '/learn/full-stack/node/mysql-update' },
  { title: 'MySQL Limit', href: '/learn/full-stack/node/mysql-limit' },
  { title: 'MySQL Join', href: '/learn/full-stack/node/mysql-join' },
  { title: 'MongoDB Get Started', href: '/learn/full-stack/node/mongodb-get-started' },
  { title: 'MongoDB Create DB', href: '/learn/full-stack/node/mongodb-create-db' },
  { title: 'MongoDB Collection', href: '/learn/full-stack/node/mongodb-collection' },
  { title: 'MongoDB Insert', href: '/learn/full-stack/node/mongodb-insert' },
  { title: 'MongoDB Find', href: '/learn/full-stack/node/mongodb-find' },
  { title: 'MongoDB Query', href: '/learn/full-stack/node/mongodb-query' },
  { title: 'MongoDB Sort', href: '/learn/full-stack/node/mongodb-sort' },
  { title: 'MongoDB Delete', href: '/learn/full-stack/node/mongodb-delete' },
  { title: 'MongoDB Drop Collection', href: '/learn/full-stack/node/mongodb-drop-collection' },
  { title: 'MongoDB Update', href: '/learn/full-stack/node/mongodb-update' },
  { title: 'MongoDB Limit', href: '/learn/full-stack/node/mongodb-limit' },
  { title: 'MongoDB Join', href: '/learn/full-stack/node/mongodb-join' },
  { title: 'GraphQL', href: '/learn/full-stack/node/graphql' },
  { title: 'Socket.IO', href: '/learn/full-stack/node/socketio' },
  { title: 'WebSockets', href: '/learn/full-stack/node/websockets' },
  { title: 'Node Adv. Debugging', href: '/learn/full-stack/node/node-adv-debugging' },
  { title: 'Node Testing Apps', href: '/learn/full-stack/node/node-testing-apps' },
  { title: 'Node Test Frameworks', href: '/learn/full-stack/node/node-test-frameworks' },
  { title: 'Node Test Runner', href: '/learn/full-stack/node/node-test-runner' },
  { title: 'Node Env Variables', href: '/learn/full-stack/node/node-env-variables' },
  { title: 'Node Dev vs Prod', href: '/learn/full-stack/node/node-dev-vs-prod' },
  { title: 'Node CI/CD', href: '/learn/full-stack/node/node-cicd' },
  { title: 'Node Security', href: '/learn/full-stack/node/node-security' },
  { title: 'Node Deployment', href: '/learn/full-stack/node/node-deployment' },
  { title: 'Node Logging', href: '/learn/full-stack/node/node-logging' },
  { title: 'Node Monitoring', href: '/learn/full-stack/node/node-monitoring' },
  { title: 'Node Performance', href: '/learn/full-stack/node/node-performance' },
  { title: 'Child Process Module', href: '/learn/full-stack/node/child-process-module' },
  { title: 'Cluster Module', href: '/learn/full-stack/node/cluster-module' },
  { title: 'Worker Threads', href: '/learn/full-stack/node/worker-threads' },
  { title: 'Microservices', href: '/learn/full-stack/node/microservices' },
  { title: 'Node WebAssembly', href: '/learn/full-stack/node/node-webassembly' },
  { title: 'HTTP2 Module', href: '/learn/full-stack/node/http2-module' },
  { title: 'Perf_hooks Module', href: '/learn/full-stack/node/perf-hooks-module' },
  { title: 'VM Module', href: '/learn/full-stack/node/vm-module' },
  { title: 'TLS/SSL Module', href: '/learn/full-stack/node/tls-ssl-module' },
  { title: 'Net Module', href: '/learn/full-stack/node/net-module' },
  { title: 'Zlib Module', href: '/learn/full-stack/node/zlib-module' },
  { title: 'Real-World Examples', href: '/learn/full-stack/node/real-world-examples' },
  { title: 'RasPi Get Started', href: '/learn/full-stack/node/raspi-get-started' },
  { title: 'RasPi GPIO Introduction', href: '/learn/full-stack/node/raspi-gpio-introduction' },
  { title: 'RasPi Blinking LED', href: '/learn/full-stack/node/raspi-blinking-led' },
  { title: 'RasPi LED & Pushbutton', href: '/learn/full-stack/node/raspi-led-pushbutton' },
  { title: 'RasPi Flowing LEDs', href: '/learn/full-stack/node/raspi-flowing-leds' },
  { title: 'RasPi WebSocket', href: '/learn/full-stack/node/raspi-websocket' },
  { title: 'RasPi RGB LED WebSocket', href: '/learn/full-stack/node/raspi-rgb-led-websocket' },
  { title: 'RasPi Components', href: '/learn/full-stack/node/raspi-components' },
  { title: 'Built-in Modules', href: '/learn/full-stack/node/built-in-modules' },
  { title: 'EventEmitter (events)', href: '/learn/full-stack/node/eventemitter-events' },
  { title: 'Worker (cluster)', href: '/learn/full-stack/node/worker-cluster' },
  { title: 'Cipher (crypto)', href: '/learn/full-stack/node/cipher-crypto' },
  { title: 'Decipher (crypto)', href: '/learn/full-stack/node/decipher-crypto' },
  { title: 'DiffieHellman (crypto)', href: '/learn/full-stack/node/diffiehellman-crypto' },
  { title: 'ECDH (crypto)', href: '/learn/full-stack/node/ecdh-crypto' },
  { title: 'Hash (crypto)', href: '/learn/full-stack/node/hash-crypto' },
  { title: 'Hmac (crypto)', href: '/learn/full-stack/node/hmac-crypto' },
  { title: 'Sign (crypto)', href: '/learn/full-stack/node/sign-crypto' },
  { title: 'Verify (crypto)', href: '/learn/full-stack/node/verify-crypto' },
  { title: 'Socket (dgram, net, tls)', href: '/learn/full-stack/node/socket-dgram-net-tls' },
  { title: 'ReadStream (fs, stream)', href: '/learn/full-stack/node/readstream-fs-stream' },
  { title: 'WriteStream (fs, stream)', href: '/learn/full-stack/node/writestream-fs-stream' },
  { title: 'Server (http, https, net, tls)', href: '/learn/full-stack/node/server-http-https-net-tls' },
  { title: 'Agent (http, https)', href: '/learn/full-stack/node/agent-http-https' },
  { title: 'Request (http)', href: '/learn/full-stack/node/request-http' },
  { title: 'Response (http)', href: '/learn/full-stack/node/response-http' },
  { title: 'Message (http)', href: '/learn/full-stack/node/message-http' },
  { title: 'Interface (readline)', href: '/learn/full-stack/node/interface-readline' },
];

const reactTopics = [
  { title: 'React Home', href: '/learn/full-stack/react/react-home' },
  { title: 'React Intro', href: '/learn/full-stack/react/react-intro' },
  { title: 'React Get Started', href: '/learn/full-stack/react/react-get-started' },
  { title: 'React First App', href: '/learn/full-stack/react/react-first-app' },
  { title: 'React Render HTML', href: '/learn/full-stack/react/react-render-html' },
  { title: 'React Upgrade', href: '/learn/full-stack/react/react-upgrade' },
  { title: 'React ES6', href: '/learn/full-stack/react/react-es6' },
  { title: 'React JSX Intro', href: '/learn/full-stack/react/react-jsx-intro' },
  { title: 'React JSX Expressions', href: '/learn/full-stack/react/react-jsx-expressions' },
  { title: 'React JSX Attributes', href: '/learn/full-stack/react/react-jsx-attributes' },
  { title: 'React JSX If Statements', href: '/learn/full-stack/react/react-jsx-if-statements' },
  { title: 'React Components', href: '/learn/full-stack/react/react-components' },
  { title: 'React Class', href: '/learn/full-stack/react/react-class' },
  { title: 'React Props', href: '/learn/full-stack/react/react-props' },
  { title: 'React Props Destructuring', href: '/learn/full-stack/react/react-props-destructuring' },
  { title: 'React Props Children', href: '/learn/full-stack/react/react-props-children' },
  { title: 'React Events', href: '/learn/full-stack/react/react-events' },
  { title: 'React Conditionals', href: '/learn/full-stack/react/react-conditionals' },
  { title: 'React Lists', href: '/learn/full-stack/react/react-lists' },
  { title: 'React Forms', href: '/learn/full-stack/react/react-forms' },
  { title: 'React Forms Submit', href: '/learn/full-stack/react/react-forms-submit' },
  { title: 'React Textarea', href: '/learn/full-stack/react/react-textarea' },
  { title: 'React Select', href: '/learn/full-stack/react/react-select' },
  { title: 'React Multiple Inputs', href: '/learn/full-stack/react/react-multiple-inputs' },
  { title: 'React Checkbox', href: '/learn/full-stack/react/react-checkbox' },
  { title: 'React Radio', href: '/learn/full-stack/react/react-radio' },
  { title: 'React CSS Styling', href: '/learn/full-stack/react/react-css-styling' },
  { title: 'React CSS Modules', href: '/learn/full-stack/react/react-css-modules' },
  { title: 'React CSS-in-JS', href: '/learn/full-stack/react/react-css-in-js' },
  { title: 'React Sass', href: '/learn/full-stack/react/react-sass' },
  { title: 'React Portals', href: '/learn/full-stack/react/react-portals' },
  { title: 'React Suspense', href: '/learn/full-stack/react/react-suspense' },
  { title: 'React Router', href: '/learn/full-stack/react/react-router' },
  { title: 'React Transitions', href: '/learn/full-stack/react/react-transitions' },
  { title: 'React Forward Ref', href: '/learn/full-stack/react/react-forward-ref' },
  { title: 'React HOC', href: '/learn/full-stack/react/react-hoc' },
  { title: 'What is Hooks?', href: '/learn/full-stack/react/what-is-hooks' },
  { title: 'React useState', href: '/learn/full-stack/react/react-usestate' },
  { title: 'React useEffect', href: '/learn/full-stack/react/react-useeffect' },
  { title: 'React useContext', href: '/learn/full-stack/react/react-usecontext' },
  { title: 'React useRef', href: '/learn/full-stack/react/react-useref' },
  { title: 'React useReducer', href: '/learn/full-stack/react/react-usereducer' },
  { title: 'React useCallback', href: '/learn/full-stack/react/react-usecallback' },
  { title: 'React useMemo', href: '/learn/full-stack/react/react-usememo' },
  { title: 'React Custom Hooks', href: '/learn/full-stack/react/react-custom-hooks' },
  { title: 'React Exercises', href: '/learn/full-stack/react/react-exercises' },
  { title: 'React Compiler', href: '/learn/full-stack/react/react-compiler' },
  { title: 'React Quiz', href: '/learn/full-stack/react/react-quiz' },
  { title: 'React Exercises (Practice)', href: '/learn/full-stack/react/react-exercises-practice' },
  { title: 'React Syllabus', href: '/learn/full-stack/react/react-syllabus' },
  { title: 'React Study Plan', href: '/learn/full-stack/react/react-study-plan' },
  { title: 'React Server', href: '/learn/full-stack/react/react-server' },
  { title: 'React Interview Prep', href: '/learn/full-stack/react/react-interview-prep' },
];

const nextTopics = [
  { title: 'Next Home', href: '/learn/full-stack/next/next-home' },
  { title: 'What is Next', href: '/learn/full-stack/next/what-is-next' },
  { title: 'App Router', href: '/learn/full-stack/next/app-router' },
  { title: 'Pages Router', href: '/learn/full-stack/next/pages-router' },
  { title: 'File Structure', href: '/learn/full-stack/next/file-structure' },
  { title: 'Routing', href: '/learn/full-stack/next/routing' },
  { title: 'Layouts', href: '/learn/full-stack/next/layouts' },
  { title: 'Metadata', href: '/learn/full-stack/next/metadata' },
  { title: 'Fonts', href: '/learn/full-stack/next/fonts' },
  { title: 'Rendering', href: '/learn/full-stack/next/rendering' },
  { title: 'SSR', href: '/learn/full-stack/next/ssr' },
  { title: 'SSG', href: '/learn/full-stack/next/ssg' },
  { title: 'ISR', href: '/learn/full-stack/next/isr' },
  { title: 'Streaming', href: '/learn/full-stack/next/streaming' },
  { title: 'Edge Rendering', href: '/learn/full-stack/next/edge-rendering' },
  { title: 'Fetching', href: '/learn/full-stack/next/fetching' },
  { title: 'Server Actions', href: '/learn/full-stack/next/server-actions' },
  { title: 'API Routes', href: '/learn/full-stack/next/api-routes' },
  { title: 'Middleware', href: '/learn/full-stack/next/middleware' },
  { title: 'Images', href: '/learn/full-stack/next/images' },
  { title: 'Styling', href: '/learn/full-stack/next/styling' },
  { title: 'Tailwind', href: '/learn/full-stack/next/tailwind' },
  { title: 'Shadcn', href: '/learn/full-stack/next/shadcn' },
  { title: 'NextAuth', href: '/learn/full-stack/next/nextauth' },
  { title: 'Next.js JWT', href: '/learn/full-stack/next/nextjs-jwt' },
  { title: 'Middleware Auth', href: '/learn/full-stack/next/middleware-auth' },
  { title: 'Next.js Caching', href: '/learn/full-stack/next/nextjs-caching' },
  { title: 'Revalidation', href: '/learn/full-stack/next/revalidation' },
  { title: 'Parallel Routes', href: '/learn/full-stack/next/parallel-routes' },
  { title: 'Intercepting Routes', href: '/learn/full-stack/next/intercepting-routes' },
  { title: 'Error Handling', href: '/learn/full-stack/next/error-handling' },
];

const databaseTopics = [
  { title: 'SQL Intro', href: '/learn/full-stack/databases/sql-intro' },
  { title: 'MySQL Basics', href: '/learn/full-stack/databases/mysql-basics' },
  { title: 'PostgreSQL', href: '/learn/full-stack/databases/postgresql' },
  { title: 'Tables', href: '/learn/full-stack/databases/tables' },
  { title: 'Joins', href: '/learn/full-stack/databases/joins' },
  { title: 'Indexes', href: '/learn/full-stack/databases/indexes' },
  { title: 'Transactions', href: '/learn/full-stack/databases/transactions' },
  { title: 'Stored Procedures', href: '/learn/full-stack/databases/stored-procedures' },
  { title: 'Optimization', href: '/learn/full-stack/databases/optimization' },
  { title: 'MongoDB Intro', href: '/learn/full-stack/databases/mongodb-intro' },
  { title: 'Collections', href: '/learn/full-stack/databases/collections' },
  { title: 'Aggregation', href: '/learn/full-stack/databases/aggregation' },
  { title: 'Indexing', href: '/learn/full-stack/databases/indexing' },
  { title: 'MongoDB Transactions', href: '/learn/full-stack/databases/mongodb-transactions' },
  { title: 'Prisma', href: '/learn/full-stack/databases/prisma' },
  { title: 'Drizzle', href: '/learn/full-stack/databases/drizzle' },
  { title: 'Sequelize', href: '/learn/full-stack/databases/sequelize' },
  { title: 'TypeORM', href: '/learn/full-stack/databases/typeorm' },
];

const backendArchTopics = [
  { title: 'MVC', href: '/learn/full-stack/backend-architecture/mvc' },
  { title: 'Clean Architecture', href: '/learn/full-stack/backend-architecture/clean-architecture' },
  { title: 'Hexagonal', href: '/learn/full-stack/backend-architecture/hexagonal' },
  { title: 'Repository Pattern', href: '/learn/full-stack/backend-architecture/repository-pattern' },
  { title: 'Service Layer', href: '/learn/full-stack/backend-architecture/service-layer' },
  { title: 'Monolith vs Microservices', href: '/learn/full-stack/backend-architecture/monolith-vs-microservices' },
  { title: 'Event Driven', href: '/learn/full-stack/backend-architecture/event-driven' },
  { title: 'CQRS', href: '/learn/full-stack/backend-architecture/cqrs' },
  { title: 'API Versioning', href: '/learn/full-stack/backend-architecture/api-versioning' },
];

const devopsTopics = [
  { title: 'Linux Basics', href: '/learn/full-stack/devops/linux-basics' },
  { title: 'Docker', href: '/learn/full-stack/devops/docker' },
  { title: 'Docker Compose', href: '/learn/full-stack/devops/docker-compose' },
  { title: 'Kubernetes', href: '/learn/full-stack/devops/kubernetes' },
  { title: 'CI CD', href: '/learn/full-stack/devops/ci-cd' },
  { title: 'GitHub Actions', href: '/learn/full-stack/devops/github-actions' },
  { title: 'Nginx', href: '/learn/full-stack/devops/nginx' },
  { title: 'PM2', href: '/learn/full-stack/devops/pm2' },
];

const cloudTopics = [
  { title: 'AWS Basics', href: '/learn/full-stack/cloud/aws-basics' },
  { title: 'EC2', href: '/learn/full-stack/cloud/ec2' },
  { title: 'S3', href: '/learn/full-stack/cloud/s3' },
  { title: 'RDS', href: '/learn/full-stack/cloud/rds' },
  { title: 'Lambda', href: '/learn/full-stack/cloud/lambda' },
  { title: 'Vercel', href: '/learn/full-stack/cloud/vercel' },
  { title: 'Railway', href: '/learn/full-stack/cloud/railway' },
  { title: 'Render', href: '/learn/full-stack/cloud/render' },
  { title: 'Firebase', href: '/learn/full-stack/cloud/firebase' },
];

const systemDesignTopics = [
  { title: 'Scalability', href: '/learn/full-stack/system-design/scalability' },
  { title: 'Load Balancers', href: '/learn/full-stack/system-design/load-balancers' },
  { title: 'Caching', href: '/learn/full-stack/system-design/caching' },
  { title: 'CDN', href: '/learn/full-stack/system-design/cdn' },
  { title: 'Rate Limiting', href: '/learn/full-stack/system-design/rate-limiting' },
  { title: 'Message Queues', href: '/learn/full-stack/system-design/message-queues' },
  { title: 'Databases at Scale', href: '/learn/full-stack/system-design/databases-at-scale' },
  { title: 'CAP Theorem', href: '/learn/full-stack/system-design/cap-theorem' },
  { title: 'Sharding', href: '/learn/full-stack/system-design/sharding' },
  { title: 'Consistent Hashing', href: '/learn/full-stack/system-design/consistent-hashing' },
];

const securityTopics = [
  { title: 'HTTPS', href: '/learn/full-stack/security/https' },
  { title: 'CORS', href: '/learn/full-stack/security/cors' },
  { title: 'CSRF', href: '/learn/full-stack/security/csrf' },
  { title: 'XSS', href: '/learn/full-stack/security/xss' },
  { title: 'SQL Injection', href: '/learn/full-stack/security/sql-injection' },
  { title: 'OAuth', href: '/learn/full-stack/security/oauth' },
  { title: 'JWT', href: '/learn/full-stack/security/jwt' },
  { title: 'Password Hashing', href: '/learn/full-stack/security/password-hashing' },
  { title: 'Secrets Management', href: '/learn/full-stack/security/secrets-management' },
];

const testingTopics = [
  { title: 'Unit Testing', href: '/learn/full-stack/testing/unit-testing' },
  { title: 'Integration Testing', href: '/learn/full-stack/testing/integration-testing' },
  { title: 'E2E', href: '/learn/full-stack/testing/e2e' },
  { title: 'Jest', href: '/learn/full-stack/testing/jest' },
  { title: 'Playwright', href: '/learn/full-stack/testing/playwright' },
  { title: 'Cypress', href: '/learn/full-stack/testing/cypress' },
  { title: 'Supertest', href: '/learn/full-stack/testing/supertest' },
];

const performanceTopics = [
  { title: 'Web Vitals', href: '/learn/full-stack/performance/web-vitals' },
  { title: 'Lazy Loading', href: '/learn/full-stack/performance/lazy-loading' },
  { title: 'Code Splitting', href: '/learn/full-stack/performance/code-splitting' },
  { title: 'Caching Strategies', href: '/learn/full-stack/performance/caching-strategies' },
  { title: 'Database Optimization', href: '/learn/full-stack/performance/database-optimization' },
  { title: 'Node Profiling', href: '/learn/full-stack/performance/node-profiling' },
];

const mobileTopics = [
  { title: 'React Native Intro', href: '/learn/full-stack/mobile/react-native-intro' },
  { title: 'Expo', href: '/learn/full-stack/mobile/expo' },
  { title: 'Navigation', href: '/learn/full-stack/mobile/navigation' },
  { title: 'State Management', href: '/learn/full-stack/mobile/state-management' },
  { title: 'Native APIs', href: '/learn/full-stack/mobile/native-apis' },
  { title: 'Publishing Apps', href: '/learn/full-stack/mobile/publishing-apps' },
];

const professionalToolsTopics = [
  { title: 'Git', href: '/learn/full-stack/professional-tools/git' },
  { title: 'GitHub', href: '/learn/full-stack/professional-tools/github' },
  { title: 'REST APIs', href: '/learn/full-stack/professional-tools/rest-apis' },
  { title: 'GraphQL APIs', href: '/learn/full-stack/professional-tools/graphql-apis' },
  { title: 'Swagger', href: '/learn/full-stack/professional-tools/swagger' },
  { title: 'Postman', href: '/learn/full-stack/professional-tools/postman' },
  { title: 'Stripe Payments', href: '/learn/full-stack/professional-tools/stripe-payments' },
  { title: 'WebSocket Communication', href: '/learn/full-stack/professional-tools/websocket-communication' },
  { title: 'Redis', href: '/learn/full-stack/professional-tools/redis' },
  { title: 'Cron Jobs', href: '/learn/full-stack/professional-tools/cron-jobs' },
];

// ==========================================
// 3. SEEDING LOGIC
// ==========================================

async function seedFullStack() {
  console.log('🌱 Seeding Full Stack Development curriculum...');

  // 1) Upsert Full Stack Domain (non-destructive)
  const domain = await prisma.learnDomain.upsert({
    where: { slug: 'full-stack' },
    update: { title: 'Full Stack Development' },
    create: { slug: 'full-stack', title: 'Full Stack Development' }
  });

  console.log('✅ Full Stack domain ready');

  // 3. Map Categories to Topic Arrays
  const categoriesData = [
    { title: 'HTML', topics: htmlTopics },
    { title: 'CSS', topics: cssTopics },
    { title: 'JavaScript', topics: jsTopics },
    { title: 'Node.js', topics: nodeTopics },
    { title: 'React', topics: reactTopics },
    { title: 'Next.js', topics: nextTopics },
    { title: 'Databases', topics: databaseTopics },
    { title: 'Backend Architecture', topics: backendArchTopics },
    { title: 'DevOps', topics: devopsTopics },
    { title: 'Cloud', topics: cloudTopics },
    { title: 'System Design', topics: systemDesignTopics },
    { title: 'Security', topics: securityTopics },
    { title: 'Testing', topics: testingTopics },
    { title: 'Performance', topics: performanceTopics },
    { title: 'Mobile', topics: mobileTopics },
    { title: 'Professional Tools', topics: professionalToolsTopics }
  ];

  let categoryOrder = 1;

  for (const catData of categoriesData) {
    console.log(`📂 Processing Category: ${catData.title}`);

    const currentCategoryOrder = categoryOrder++;
    const existingCategory = await prisma.learnCategory.findFirst({
      where: {
        domainId: domain.id,
        title: catData.title
      }
    });

    const category = existingCategory
      ? await prisma.learnCategory.update({
          where: { id: existingCategory.id },
          data: { order: currentCategoryOrder }
        })
      : await prisma.learnCategory.create({
          data: {
            title: catData.title,
            order: currentCategoryOrder,
            domainId: domain.id
          }
        });

    let topicOrder = 1;

    for (const t of catData.topics) {
      const slug = getSlug(t.href);
      const content = generateContent(t.title, catData.title);

      const currentTopicOrder = topicOrder++;

      await prisma.learnTopic.upsert({
        where: { slug },
        update: {
          title: t.title,
          order: currentTopicOrder,
          content,
          categoryId: category.id
        },
        create: {
          title: t.title,
          slug,
          order: currentTopicOrder,
          content,
          categoryId: category.id
        }
      });
    }
  }

  console.log('✅ Full Stack Seeding Complete!');
}

seedFullStack()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });