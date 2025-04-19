import MainHeader from './main-header/MainHeader';

export default function Layout({ children }) {
  return (
    <>
      <MainHeader />
      <main>{children}</main>
    </>
  );
}
