import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "../../Components/Private/Header";

const Main = React.lazy(() => import("./Main"));
const Teams = React.lazy(() => import("./Teams"));
const Profile = React.lazy(() => import("./Profile"));
const TeamProjects = React.lazy(() => import("./TeamProjects"));
const CreateTeam = React.lazy(() => import("./CreateTeam"));
const Project = React.lazy(() => import("./Project"));
const Assignment = React.lazy(() => import("./Assignment"));
const AssignmentAdmin = React.lazy(() => import("./AssignmentAdmin"));
const AssignmentFe = React.lazy(() => import("./AssignmentFe"));
const TeamChats = React.lazy(() => import("./ChatRooms/TeamChats"));
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
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/teams/create" component={CreateTeam} />
            <Route exact path="/:name/projects" component={TeamProjects} />
            <Route
              exact
              path="/:name/project/:projectname"
              component={Project}
            />
            <Route
              exact
              path="/:name/project/:projectname/:assignment"
              component={Assignment}
            />
            <Route
              exact
              path="/:name/project/:projectname/fe/:collector"
              component={AssignmentFe}
            />
            <Route
              exact
              path="/:name/project/:projectname/:assignment/:id"
              component={AssignmentAdmin}
            />
            <Route path="/:name/chats/:id?" component={TeamChats} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Suspense>
    </BrowserRouter>
  );
}
