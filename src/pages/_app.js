import { Provider } from "react-redux";
import store from "@/redux/store"; // Adjust path as needed
import "@/styles/globals.css"; // Global CSS
import Layout from "../components/layout/Layout";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noLayoutRoutes = ["/","/signup"]; // Don't show Layout on login page

  const shouldRenderLayout = !noLayoutRoutes.includes(router.pathname);

  return (
    <Provider store={store}>
      {shouldRenderLayout ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </Provider>
  );
}
