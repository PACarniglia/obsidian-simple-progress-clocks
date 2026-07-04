# Simple Progress Clocks for Obsidian

A premium, interactive RPG-style progress clocks plugin for Obsidian. Perfect for tabletop roleplaying games (like *Blades in the Dark*, *Apocalypse World*, *Fate*) or tracking milestones, project phases, and personal habits with a gorgeous visual aesthetic.

Unlike other plugins, this is designed with minimalism and performance in mind: **only the clocks, zero clutter, and frictionless click interactions.**

---

## ✨ Features

* 🚀 **Zero-Clutter Interaction**: No ugly button panels. Just click on the clock to increase slices, and right-click to decrease them.
* 🎨 **Premium Aesthetics**: Circular "donut-chart" design featuring beautiful, vibrant linear gradients, subtle shadows, and glassmorphic panels that support both light and dark mode automatically.
* 🌌 **Legible Slices**: Distinct borders separate every slice, making it incredibly clear to see both completed and remaining slices—especially on dark backgrounds.
* 🔗 **Real-Time Note Syncing**: Left or right-clicking dynamically updates the `value:` parameter inside your note's markdown source code block in real-time.
* 🗂️ **Side-by-Side Groups**: Render multiple clocks side-by-side inside a single code block using a simple `---` divider line!
* 🛠️ **Custom Slices**: Support any number of slices (e.g. 4, 6, 8, 10, 12, etc.) dynamically.

---

## 🎨 Customizable Color Themes

You can customize the color of your clock slices inside the code block. Out of the box, we provide stunning predefined dual-color gradients:

| Theme Name | Description |
| :--- | :--- |
| `violet` / `royal` *(default)* | Vibrant violet-to-pink gradient 🌸 |
| `emerald` / `green` | Rich emerald-to-mint gradient 🌿 |
| `amber` / `orange` | Bright amber-to-orange gradient 🍊 |
| `rose` / `red` | Deep rose-to-red gradient 🌹 |
| `sky` / `blue` | Sky-blue-to-deep-blue gradient 🌊 |
| `cyan` / `teal` | Cyan-to-teal gradient ❄️ |
| `gold` / `yellow` | Gold-to-yellow gradient 👑 |

### 🌈 Custom Hex and Dynamic Theme Matching:
* **Custom Colors**: You can supply any custom Hex or CSS color name (e.g., `color: "#ea580c"`, `color: tomato`), and the plugin will dynamically generate a premium gradient for it.
* **Obsidian Adaptive Themes**: Pass Obsidian CSS variables like `color: "var(--interactive-accent)"` or `color: "var(--text-accent)"` so your progress clocks instantly match whatever Obsidian community theme you use!

---

## 📝 Usage & Code Block Examples

### 1. Single Progress Clock
To create a simple progress clock, define a code block with language `clock` or `progress-clock`:

```yaml
```clock
name: Escape from Castle
total: 6
value: 2
color: emerald
```
```

### 2. Side-by-Side Multi-Clock Group
Use a simple line of three dashes `---` to separate your clocks, and they will automatically align horizontally using a modern wrapping flex-grid layout:

```yaml
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
---
name: Escape Route Cleared
total: 6
value: 0
color: gold
```
```

---

## 🛠️ How to Install

### Manual Installation
1. Go to your Obsidian vault directory.
2. Ensure hidden folders are visible, and navigate to `.obsidian/plugins/`.
3. Create a new directory named `obsidian-simple-progress-clocks`.
4. Copy `main.js`, `manifest.json`, and `styles.css` into that folder.
5. Reload community plugins in Obsidian and toggle **Simple Progress Clocks** on!

---

## 💻 Developer Guide

If you'd like to modify or build the plugin yourself:

1. Clone or download this repository.
2. In your terminal, navigate to the folder and run:
   ```bash
   npm install
   ```
3. Compile and bundle the TypeScript code using esbuild:
   ```bash
   npm run build
   ```
   *For live recompiling during development, use:*
   ```bash
   npm run dev
   ```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
