Circular user mark — shows a photo, or falls back to gradient-filled initials.

```jsx
<Avatar name="Sarah Mitchell" />
<Avatar name="Alex Johnson" src={photoUrl} size={48} />
<Avatar name="Lisa Chen" tone="violet" size={30} />
```

Initials are auto-derived (non-alpha tokens skipped). Default 36px; use 30px in dense lists, 48px+ in detail headers. Tones: `blue` / `cyan` / `violet` / `slate`.
