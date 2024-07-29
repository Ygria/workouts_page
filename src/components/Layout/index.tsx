import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import useSiteMetadata from '@/hooks/useSiteMetadata';


import useIsEmbedded from '@/hooks/useIsEmbedded';
import { cn } from '@/lib/util';
const Layout = ({ children }: React.PropsWithChildren) => {
  const { siteTitle, description, keywords } = useSiteMetadata();

  const isEmbedded = useIsEmbedded();

  return (
    <>


      <Helmet>
        <html lang="cn" />
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Helmet>
      {!isEmbedded && (<>
        <Header /></>)}

      <div className={cn('mb-16 p-4 lg:flex lg:p-16',isEmbedded && 'px-0')}>
        {children}
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
