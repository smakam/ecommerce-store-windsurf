import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'ShopHub | Your One-Stop Shopping Destination',
  description: 'We sell the best products for affordable prices',
  keywords: 'electronics, buy electronics, cheap electronics, clothing, accessories, home goods',
};

export default Meta;
