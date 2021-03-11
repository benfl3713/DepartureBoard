export const NewsItems: NewsItem[] = [
  {
    title: "New UI for Custom Departures",
    content:
      "A new interface to graphically create and edit <a href='/custom-departures'>custom departures</a> with your own data",
    isHighlighted: true,
  },
  {
    title: "New Documentation Website",
    content:
      "A new <a href='https://docs.leddepartureboard.com' target='_blank'>website</a> has been built to provide documentation/user guides on leddepartureboard.com",
    isHighlighted: false,
  },
];

interface NewsItem {
  title: string;
  content: string;
  isHighlighted?: boolean;
}
