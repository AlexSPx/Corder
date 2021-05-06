import axios from "axios";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/User";
import { baseurl } from "../routes";

export default function index({ user }) {
  const userCtx = useContext(UserContext);

  console.log(user);

  return <div>Docs</div>;
}

export async function getStaticProps(context) {
  const userRes = await axios.get(`${baseurl}/authuser/fetchuser`, {
    withCredentials: true,
  });
  if (!userRes.data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { user: userRes.data }, // will be passed to the page component as props
  };
}
