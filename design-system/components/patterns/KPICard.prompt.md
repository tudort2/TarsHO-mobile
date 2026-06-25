Headline metric block for dashboards — leading icon chip, big display-type value, label, and an optional up/down delta.

```jsx
<KPICard icon={<HomeIcon/>} tone="blue" value="$2.4M" label="Portfolio value" delta="8%" deltaDir="up" />
<KPICard icon={<UsersIcon/>} tone="violet" value="14" label="Active buyers" />
```

Value renders in Geist 800 with tabular numerals. `deltaDir="up"` is green, `down` is rose. Lay them out in a responsive grid (4-up on desktop, 2-up on mobile).
