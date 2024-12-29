import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/authed-layout.tsx", [
    index("routes/home.tsx"),
    route("result", "routes/result.tsx"),
    route("vote/:votingId/:tpsId", "routes/vote.tsx"),
  ]),
  route("login", "routes/login.tsx"),
] satisfies RouteConfig;
