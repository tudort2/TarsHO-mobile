Surface container for grouping content — the building block of every TARS panel, tile, and stat block.

```jsx
<Card>Default panel</Card>
<Card variant="tinted" padding={24}>Nested surface</Card>
<Card hover>Lifts on hover — use for clickable tiles</Card>
```

Variants: `default` (border + soft shadow), `flat` (no shadow), `tinted` (uses --surface-2). Radius is always 14px. Compose KPIs, lists, and headers inside it; don't nest a default Card directly in another default Card — use `flat` or `tinted` for the inner one.
