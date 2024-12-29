import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/authed-layout.tsx", [index("routes/home.tsx")]),
  route("login", "routes/login.tsx"),
  route("vote/:votingId/:tpsId", "routes/vote.tsx"),
  route("result", "routes/result.tsx"),
] satisfies RouteConfig;
