import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "../../Components/Private/Header";

const Main = React.lazy(() => import("./Main"));
const Teams = React.lazy(() => import("./Teams"));
const TeamProjects = React.lazy(() => import("./TeamProjects"));
const NotFound = React.lazy(() => import("../NotFound"));

export default function RoutesPrivate() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col h-screen">
          <Header />
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/teams" component={Teams} />
            <Route path="/:name/projects" component={TeamProjects} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Suspense>
    </BrowserRouter>
  );
}
