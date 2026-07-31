import { lazy } from "react";
import Loadable from "components/Loadable";

const PackingSent = Loadable(
  lazy(() => import("views/Packing/PackingSent"))
);

const PackingReceived = Loadable(
  lazy(() => import("views/Packing/PackingReceived"))
);

const PackingRoutes = {
  path: "packing",
  children: [
    {
      path: "sent",
      element: <PackingSent />
    },
    {
      path: "received",
      element: <PackingReceived />
    }
  ]
};

export default PackingRoutes;