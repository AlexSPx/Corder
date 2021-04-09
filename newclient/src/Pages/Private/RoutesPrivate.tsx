import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "../../Components/Private/Header";

const Main = React.lazy(() => import("./Main"));
const Teams = React.lazy(() => import("./Teams"));
const TeamProjects = React.lazy(() => import("./TeamProjects"));
const CreateTeam = React.lazy(() => import("./CreateTeam"));
const Project = React.lazy(() => import("./Project"));
const NotFound = React.lazy(() => import("../NotFound"));

export default function RoutesPrivate() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col h-screen">
          <Header />
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/teams" component={Teams} />
            <Route exact path="/teams/create" component={CreateTeam} />
            <Route path="/:name/projects" component={TeamProjects} />
            <Route path="/:name/project/:projectname" component={Project} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Suspense>
    </BrowserRouter>
  );
}
