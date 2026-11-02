import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("fetcher", "routes/fetcher.tsx"),
  route("token", "routes/token.ts"),
] satisfies RouteConfig;
