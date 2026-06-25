Thin rounded progress meter for the home-ownership journey, task completion, or funnel stages.

```jsx
<ProgressBar value={47} tone="blue" label="Journey progress" showPct />
<ProgressBar value={80} tone="green" height={6} />
```

Fill animates on value change. Pair `label` + `showPct` for a titled meter; omit both for a bare inline bar inside a list row.
