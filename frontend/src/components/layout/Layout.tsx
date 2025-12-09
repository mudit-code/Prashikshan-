import Navbar from './Navbar';
import Footer from './Footer';
import styles from './Layout.module.css';
import React from 'react';

import { useRouter } from 'next/router';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isDashboard = router.pathname.includes('dashboard');

  return (
    <div className={styles.layout}>
      {!isDashboard && <Navbar />}
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
