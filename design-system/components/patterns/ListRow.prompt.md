The atom of every TARS list — contacts, tasks, properties, activity. Leading slot · title/subtitle · trailing slot, with a hairline divider and hover fill when clickable.

```jsx
<ListRow
  leading={<Avatar name="Sarah Mitchell" size={36} />}
  title="Sarah Mitchell"
  subtitle="Buyer · pre-approved"
  trailing={<Badge tone="success">Active</Badge>}
  onClick={open}
/>
```

Set `divider={false}` on the last row in a Card. Title truncates with ellipsis, so rows stay single-line in narrow panels.
