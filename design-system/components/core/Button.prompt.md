Action button for TARS — use for any primary/secondary action; `primary` is brand blue, `ghost` is the subtle outline used in toolbars.

```jsx
<Button variant="primary" onClick={save}>Save changes</Button>
<Button variant="ghost" size="sm" icon={<PlusIcon/>}>Add contact</Button>
<Button variant="sell">List property</Button>
```

Variants: `primary` (blue), `dark` (ink), `sell` (cyan), `buy` (violet), `danger` (rose), `ghost` (outline). Sizes: `sm` / `md` / `lg`. Hover lifts -1px with a soft shadow. Pass `icon` / `iconRight` as nodes.
