# Simple Progress Clocks

An interactive, RPG-style progress clock plugin for Obsidian with zero clutter.

## ⚡ Interactions

- **Left-click** on the clock to add 1 slice.
- **Right-click** on the clock to subtract 1 slice (intercepts the browser context menu).
- Saves state changes directly back to your Markdown file in real-time.

---

## 📝 Syntax & Examples

### Single Clock
```clock
name: Escape from Castle
total: 6
value: 2
color: emerald
```

### Side-by-Side Group
Separate your clocks using `---` to display them side-by-side:
```clock
name: Infiltration Phase
total: 4
value: 2
color: violet
---
name: Alarm Level
total: 8
value: 1
color: rose
```

---

## 🎨 Parameters

- **`name`** *(string)*: The title displayed above the clock.
- **`total`** *(number)*: Total slices/segments.
- **`value`** *(number)*: Slices filled (defaults to 0).
- **`color`** *(string, optional)*: Filled slice color. Supports:
  - **Built-in Gradients**: `violet` (default), `emerald`, `amber`, `rose`, `sky`, `cyan`, `gold`.
  - **Custom Colors**: Hex codes (e.g. `"#ea580c"`) or browser names (e.g. `tomato`).
  - **Obsidian Theme Variables**: e.g., `"var(--interactive-accent)"` to match your active theme.

---

## 🚀 Installation

### One-click install (recommended)

1. Go to the latest GitHub **Release**.
2. Download `obsidian-simple-progress-clocks.zip`.
3. Unzip it into your vault's `.obsidian/plugins/` directory.
4. Confirm you now have: `.obsidian/plugins/obsidian-simple-progress-clocks/` containing `main.js`, `manifest.json`, and `styles.css`.
5. Open Obsidian, go to **Settings** -> **Community Plugins**, and enable **Simple Progress Clocks**.
