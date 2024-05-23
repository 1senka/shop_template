import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'فروشگاه ایرانیان',
  description: 'فروشگاه ایرانیان فروشنده انواع طوری ',
  keywords: 'electronics, buy electronics, cheap electroincs',
};

export default Meta;
