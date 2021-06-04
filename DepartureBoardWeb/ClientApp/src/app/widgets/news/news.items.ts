export const NewsItems: NewsItem[] = [
  {
    title: "Serverless Design",
    content:
      "The production website has been moved to a new serverless deployment. Please let me know if you have any issues",
  },
  {
    title: "New UI for Custom Departures",
    content:
      "A new interface to graphically create and edit <a href='/custom-departures'>custom departures</a> with your own data",
    isHighlighted: true,
    titleLink: "https://docs.leddepartureboard.com/blog/custom-departure-ui",
  },
  {
    title: "New Documentation Website",
    content:
      "A new <a href='https://docs.leddepartureboard.com' target='_blank'>website</a> has been built to provide documentation/user guides on leddepartureboard.com",
    isHighlighted: false,
    titleLink: 'https://docs.leddepartureboard.com'
  },
];

interface NewsItem {
  title: string;
  content: string;
  isHighlighted?: boolean;
  titleLink?: string;
}
