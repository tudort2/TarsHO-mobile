Rounded status/type tag with a soft tinted background — use for property status (Active/Pending), contact type (Buyer/Seller), or journey role.

```jsx
<Pill tone="success" dot>Active</Pill>
<Pill tone="buy">Buyer</Pill>
<Pill tone="sell" minWidth={80}>Listed</Pill>
```

Tones map to brand roles: `primary` blue, `buy` violet, `sell` cyan, plus `success` / `warning` / `danger` / `ghost`. Give a row of pills the same `minWidth` so they read as a column. For inline-in-text status with smaller padding, prefer `Badge`.
