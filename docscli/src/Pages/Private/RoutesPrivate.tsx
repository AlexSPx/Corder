import React, { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

const Home = React.lazy(() => import("./Home"));
const Document = React.lazy(() => import("./Document"));

export default function RoutesPrivate() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col h-screen">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/docs/:id" component={Document} />
          </Switch>
        </div>
      </Suspense>
    </BrowserRouter>
  );
}
