import React, { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "../../Components/Public/Header";

const Landing = React.lazy(() => import("./Landing"));
const About = React.lazy(() => import("./About"));
const Login = React.lazy(() => import("./Login"));
const Signup = React.lazy(() => import("./Signup"));
const NotFound = React.lazy(() => import("../NotFound"));

export default function Routes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col h-screen">
          <Header />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/about" component={About} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Suspense>
    </BrowserRouter>
  );
}
