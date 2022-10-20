export const NewsItems: NewsItem[] = [
  {
    title: 'New UI Project',
    content:
      "Brand new redesigned UI being introduced into the application. Starting with this home page"
  },
  {
    title: "New Documentation Website",
    content:
      "A new <a href='https://docs.leddepartureboard.com' target='_blank'>website</a> has been built to provide documentation/user guides on leddepartureboard.com",
    isHighlighted: false,
    titleLink: 'https://docs.leddepartureboard.com'
  },
  {
    title: "Serverless Design",
    content:
      "The production website has been moved to a new serverless deployment. Please let me know if you have any issues",
  },
];

interface NewsItem {
  title: string;
  content: string;
  isHighlighted?: boolean;
  titleLink?: string;
}
