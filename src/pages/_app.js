import { Provider } from "react-redux";
import store from "@/redux/store"; // Adjust path as needed
import "@/styles/globals.css"; // Global CSS
import Layout from "../components/layout/Layout";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Routes that should not use the main layout
  const noLayoutRoutes = [
    "/", 
    "/signup",
    // Don't show main layout on dashboard pages
    "/dashboard/[userId]",
    "/dashboard"
  ];

  // Check if current path should have layout
  const shouldRenderLayout = !noLayoutRoutes.includes(router.pathname) && 
                            !router.pathname.startsWith('/dashboard/');

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
