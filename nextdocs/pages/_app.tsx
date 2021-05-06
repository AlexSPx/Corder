import axios from "axios";
import { AppProps } from "next/app";
import UserCtxProvider from "../context/User";

function App({ Component, pageProps }: AppProps) {
  return (
    <UserCtxProvider>
      <Component {...pageProps} />
    </UserCtxProvider>
  );
}

export default App;
