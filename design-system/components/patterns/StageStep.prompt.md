A single node of the TARS home-ownership journey (the 17-stage timeline). Stack several to form the vertical stepper.

```jsx
<StageStep index={1} title="Pre-approval" caption="Completed Mar 2" state="done" />
<StageStep index={2} title="Home search" caption="In progress" state="active" />
<StageStep index={3} title="Offer & negotiation" state="todo" last />
```

States: `done` (filled accent + check), `active` (ringed), `todo` (muted). Set `last` on the final step to drop the trailing connector.
