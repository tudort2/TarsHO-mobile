TARS standard icon — a stroke icon from the Lucide set (1.75 stroke, round caps). Inherits `currentColor` so it tints to its parent text/IconChip color.

```jsx
<Icon name="home" size={18} />
<IconChip tone="blue"><Icon name="trendingUp" /></IconChip>
<Button icon={<Icon name="plus" size={16} />}>Add</Button>
```

A curated subset is inlined for offline rendering; `ICON_NAMES` lists them. For icons outside the subset, load the full Lucide CDN set with the same stroke settings. **Substitution note:** the source apps used hand-placed inline SVGs; this DS standardizes on Lucide as the closest stroke-style match.
