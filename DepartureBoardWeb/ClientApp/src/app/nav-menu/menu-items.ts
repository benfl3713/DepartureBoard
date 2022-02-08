export const navItemList: any = [
  {
    href: '/', title: 'Home',
    routerLinkActiveOptions: { exact: true },
    is_link: true,
    icon: "fas fa-home"
  },
  { href: '/search', title: 'Search', is_link: true, icon: "fas fa-search" },
  { href: '/examples', title: 'Examples', is_link: true, icon: "far fa-lightbulb" },
  { href: '', title: 'Boards', is_link: false, children: true, icon: "fas fa-chalkboard", child: [
    { href: '/custom-departures', title: 'Custom Departures', is_link: true, icon: "fas fa-chalkboard" },
    { href: '/buses', title: 'Buses', is_link: true, icon: "fas fa-bus", isBeta: true },
  ] },
  { href: '', title: 'Learn', is_link: false, children: true, icon: "fas fa-graduation-cap", child: [
    { href: '/about', title: 'About', is_link: true, icon: "fas fa-info" },
    { href: 'https://docs.leddepartureboard.com', title: 'Docs', is_link: true, use_href: true, icon: "far fa-file" },
  ] },
  { href: '/settings', title: 'Settings', is_link: true, icon: "fas fa-cogs" },
  { href: 'https://admin.leddepartureboard.com', title: 'Admin', is_link: true, use_href: true, icon: "fas fa-external-link-alt" },
];
