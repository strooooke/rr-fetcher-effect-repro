# `useFetcher`: effect on `fetcher.data` never runs

An effect that depends on `fetcher.data` never runs for new data when another,
unrelated update of the same component ends with "no change" while the router's
transition is still pending. The page renders the new data, but the effect
never sees it.

The whole case is in [`app/routes/fetcher.tsx`](app/routes/fetcher.tsx).

## Run it

```sh
npm install
npm run build
npm start          # http://localhost:3000
```

Open http://localhost:3000 and click "fetcher page".

- **Expected:** "token rendered" and "token seen by effect" show the same id.
- **Actual:** "token seen by effect" stays `none`.

It also fails with `npm run dev`.

## Automated check

```sh
npx playwright install chromium
npm run check      # runs 10 times against BASE (default http://localhost:3000)
```

Results on React Router 8.5.1 and 7.18.4, React 19.3.1, Chromium 156:

| Setup                                            | Effect missed |
| ------------------------------------------------ | ------------- |
| production build                                 | 10 / 10       |
| `react-router dev`                               | 6 / 6         |
| without the `setTick(1); setTick(0)` subscription | 0 / 6         |

## What happens

1. `RouterProvider`'s `setState` writes the fetcher data into
   `fetcherData.current` first, then applies the new router state inside
   `React.startTransition`.
2. `useFetcher` reads `fetcherData.get(fetcherKey)` during render, so any render
   in between already sees the new data.
3. The subscription in this example causes such a render at default priority.
   Its state ends equal, so React bails out (`didReceiveUpdate === false`,
   `bailoutHooks`). The bailout keeps the new hook state, including the new
   effect deps, but drops the passive effect.
4. The transition render then compares deps against those kept deps, finds them
   equal, and never schedules the effect.

In a real app the "no change" update came from a store subscription that set
the same value again. Effects that also depend on `fetcher.state` are not
affected, because `state` comes from React state and changes in the transition
render.
