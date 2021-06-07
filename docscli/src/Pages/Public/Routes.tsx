import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const Home = React.lazy(() => import("./Home"));

export default function Routes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}
