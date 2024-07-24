interface ISiteMetadataResult {
  siteTitle: string;
  siteUrl: string;
  description: string;
  keywords: string;
  logo: string;
  navLinks: {
    name: string;
    url: string;
  }[];
}

const data: ISiteMetadataResult = {
  siteTitle: 'Workouts',
  siteUrl: 'https://ben29.xyz',
  logo: 'https://images.ygria.site/logo.png',
  description: 'Personal site and blog',
  keywords: 'workouts, running, cycling, riding, roadtrip, hiking, swimming',
  navLinks: [
    {
      name: 'Blog',
      icon: 'Blog',
      url: 'https://ygria.site',
    },
    {
      name: 'Blog',
      icon: 'Github',
      url: 'https://github.com/Ygria',
    },
    // {
    //   name: 'About',
    //   url: 'https://github.com/ben-29/workouts_page/blob/master/README-CN.md',
    // },
  ],
};

export default data;
