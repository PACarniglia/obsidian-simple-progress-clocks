import { Plugin, MarkdownPostProcessorContext, TFile } from 'obsidian';

interface ClockConfig {
  name: string;
  total: number;
  value: number;
  color?: string;
}

const THEMES: Record<string, { start: string; end: string }> = {
  violet: { start: '#7c3aed', end: '#db2777' },
  royal: { start: '#7c3aed', end: '#db2777' },
  emerald: { start: '#059669', end: '#10b981' },
  green: { start: '#059669', end: '#10b981' },
  amber: { start: '#d97706', end: '#f59e0b' },
  orange: { start: '#d97706', end: '#f59e0b' },
  rose: { start: '#e11d48', end: '#f43f5e' },
  red: { start: '#e11d48', end: '#f43f5e' },
  sky: { start: '#0284c7', end: '#38bdf8' },
  blue: { start: '#0284c7', end: '#38bdf8' },
  cyan: { start: '#0891b2', end: '#22d3ee' },
  teal: { start: '#0891b2', end: '#22d3ee' },
  gold: { start: '#d97706', end: '#facc15' },
  yellow: { start: '#d97706', end: '#facc15' }
};

export default class SimpleProgressClocksPlugin extends Plugin {
  async onload() {
    console.log('Loading Simple Progress Clocks Plugin');

    // Register Markdown Code Block Processors for both 'clock' and 'progress-clock'
    this.registerMarkdownCodeBlockProcessor('clock', this.processCodeblock.bind(this));
    this.registerMarkdownCodeBlockProcessor('progress-clock', this.processCodeblock.bind(this));
  }

  async processCodeblock(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
    const configs = this.parseConfigs(source);
    
    // Create outer row container for support of side-by-side clocks
    const groupContainer = el.createDiv({ cls: 'progress-clock-group' });

    configs.forEach((config, index) => {
      // Create individual clock card
      const container = groupContainer.createDiv({ cls: 'progress-clock-container' });
      
      // Header with Title and Fraction
      const header = container.createDiv({ cls: 'progress-clock-header' });
      header.createDiv({ cls: 'progress-clock-title', text: config.name });
      header.createDiv({ 
        cls: 'progress-clock-fraction', 
        text: `${config.value} / ${config.total}` 
      });

      // SVG Wrapper
      const svgWrapper = container.createDiv({ cls: 'progress-clock-svg-wrapper' });
      
      // Render SVG using HTML template injection (solves Obsidian rendering bugs)
      const svgHtml = this.renderSvgHtml(config);
      svgWrapper.innerHTML = svgHtml;

      const svgEl = svgWrapper.querySelector('svg');
      if (svgEl) {
        // Interactivity click listeners
        svgEl.addEventListener('click', (e) => {
          e.preventDefault();
          const newValue = Math.min(config.total, config.value + 1);
          if (newValue !== config.value) {
            this.updateClockValue(el, ctx, index, newValue);
          }
        });

        // Right-click decrements value and prevents standard context menu
        svgEl.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          const newValue = Math.max(0, config.value - 1);
          if (newValue !== config.value) {
            this.updateClockValue(el, ctx, index, newValue);
          }
        });
      }
    });
  }

  parseConfigs(source: string): ClockConfig[] {
    // Support multiple clocks divided by '---' line
    const blocks = source.split(/\n\s*---\s*\n/);
    const configs: ClockConfig[] = [];

    for (const block of blocks) {
      const lines = block.split('\n');
      let name = 'Progress Clock';
      let total = 6;
      let value = 0;
      let color: string | undefined = undefined;

      for (const line of lines) {
        const separatorIndex = line.indexOf(':');
        if (separatorIndex !== -1) {
          const key = line.substring(0, separatorIndex).trim().toLowerCase();
          const val = line.substring(separatorIndex + 1).trim();

          if (key === 'name') {
            name = val.replace(/^['"]|['"]$/g, '');
          } else if (key === 'total') {
            const parsed = parseInt(val, 10);
            if (!isNaN(parsed)) total = Math.max(1, parsed);
          } else if (key === 'value') {
            const parsed = parseInt(val, 10);
            if (!isNaN(parsed)) value = parsed;
          } else if (key === 'color') {
            color = val.replace(/^['"]|['"]$/g, '');
          }
        }
      }

      // Clamp value to [0, total]
      value = Math.max(0, Math.min(total, value));
      configs.push({ name, total, value, color });
    }

    return configs;
  }

  renderSvgHtml(config: ClockConfig): string {
    const total = config.total;
    const value = config.value;

    // Generate a unique suffix for the gradient ID of each clock
    // This prevents browser ID collisions in reading mode where multiple clocks share the page
    const uniqueSuffix = Math.random().toString(36).substring(2, 9);
    let gradId = `grad-violet-${uniqueSuffix}`;
    let startColor = THEMES.violet.start;
    let endColor = THEMES.violet.end;

    if (config.color) {
      const cleanColor = config.color.toLowerCase();
      if (THEMES[cleanColor]) {
        gradId = `grad-${cleanColor}-${uniqueSuffix}`;
        startColor = THEMES[cleanColor].start;
        endColor = THEMES[cleanColor].end;
      } else {
        gradId = `grad-custom-${uniqueSuffix}`;
        startColor = config.color;
        endColor = config.color;
      }
    }

    const stopOpacityAttr = gradId.startsWith('grad-custom') ? 'stop-opacity="0.85"' : '';

    let slicesHtml = '';
    if (total === 1) {
      // Special case: Single segment (full circle)
      if (value === 1) {
        slicesHtml = `<circle cx="100" cy="100" r="80" class="clock-slice clock-slice-filled" fill="url(#${gradId})" stroke="var(--background-primary-alt)" stroke-width="3" />`;
      } else {
        slicesHtml = `<circle cx="100" cy="100" r="80" class="clock-slice clock-slice-unfilled clock-slice-next-highlight" />`;
      }
    } else {
      // General case: Multiple slices
      const theta = (2 * Math.PI) / total;
      
      for (let i = 0; i < total; i++) {
        const theta_s = i * theta - Math.PI / 2;
        const theta_e = (i + 1) * theta - Math.PI / 2;

        const xs = 100 + 80 * Math.cos(theta_s);
        const ys = 100 + 80 * Math.sin(theta_s);
        const xe = 100 + 80 * Math.cos(theta_e);
        const ye = 100 + 80 * Math.sin(theta_e);

        const d = `M 100 100 L ${xs.toFixed(2)} ${ys.toFixed(2)} A 80 80 0 0 1 ${xe.toFixed(2)} ${ye.toFixed(2)} Z`;

        if (i < value) {
          // Filled slice
          slicesHtml += `<path d="${d}" class="clock-slice clock-slice-filled" fill="url(#${gradId})" stroke="var(--background-primary-alt)" stroke-width="3" />\n`;
        } else {
          // Unfilled slice
          let sliceClass = 'clock-slice clock-slice-unfilled';
          if (i === value) {
            // Next fillable slice highlight
            sliceClass += ' clock-slice-next-highlight';
          }
          slicesHtml += `<path d="${d}" class="${sliceClass}" />\n`;
        }
      }
    }

    return `
<svg viewBox="0 0 200 200" class="progress-clock-svg">
  <defs>
    <filter id="clock-shadow-${uniqueSuffix}">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.15" />
    </filter>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${startColor}" />
      <stop offset="100%" stop-color="${endColor}" ${stopOpacityAttr} />
    </linearGradient>
  </defs>
  <g filter="url(#clock-shadow-${uniqueSuffix})">
    <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(128, 128, 128, 0.1)" stroke-width="4" />
    ${slicesHtml}
    <circle cx="100" cy="100" r="14" class="clock-center-cutout" />
  </g>
</svg>
    `;
  }

  async updateClockValue(el: HTMLElement, ctx: MarkdownPostProcessorContext, clockIndex: number, newValue: number) {
    const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
    if (!file || !(file instanceof TFile)) return;

    // Use ctx.getSectionInfo to safely locate code block start and end lines
    const section = ctx.getSectionInfo(el);
    if (!section) return;

    try {
      const content = await this.app.vault.read(file);
      const lines = content.split('\n');

      const blockLines = lines.slice(section.lineStart, section.lineEnd + 1);

      // Identify sub-block corresponding to clicked clockIndex
      let currentClockIndex = 0;
      let lineOffset = 0;

      for (let i = 0; i < blockLines.length; i++) {
        if (blockLines[i].trim() === '---') {
          if (currentClockIndex === clockIndex) {
            break;
          }
          currentClockIndex++;
          lineOffset = i + 1;
        }
      }

      // Inside blockLines (from lineOffset), find 'value:' line before next '---' or end of block
      let valueIndex = -1;
      for (let i = lineOffset; i < blockLines.length; i++) {
        if (blockLines[i].trim() === '---') {
          break; // reached next clock configuration
        }
        if (blockLines[i].trim().toLowerCase().startsWith('value:')) {
          valueIndex = i;
          break;
        }
      }

      if (valueIndex !== -1) {
        // Replace current value
        const leadingWhitespace = blockLines[valueIndex].match(/^\s*/)?.[0] || '';
        blockLines[valueIndex] = `${leadingWhitespace}value: ${newValue}`;
      } else {
        // value: was omitted in original code block definition, add it before next '---' or closing backticks
        let insertIndex = blockLines.length - 1; // before closing backticks
        for (let i = lineOffset; i < blockLines.length; i++) {
          if (blockLines[i].trim() === '---') {
            insertIndex = i;
            break;
          }
        }
        blockLines.splice(insertIndex, 0, `value: ${newValue}`);
      }

      // Splice changes back
      lines.splice(section.lineStart, section.lineEnd - section.lineStart + 1, ...blockLines);

      // Save changes back to file
      await this.app.vault.modify(file, lines.join('\n'));
    } catch (e) {
      console.error('Simple Progress Clocks: Error updating file contents', e);
    }
  }
}
