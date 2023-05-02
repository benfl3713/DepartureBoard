export const NewsItems: NewsItem[] = [
  {
    title: 'New Framework Version',
    content:
      "Big Framework Version Update with increased performance. Please contact us if you see any issues"
  },
  {
    title: "New Documentation Website",
    content:
      "A new <a href='https://docs.leddepartureboard.com' target='_blank'>website</a> has been built to provide documentation/user guides on leddepartureboard.com",
    isHighlighted: false,
    titleLink: 'https://docs.leddepartureboard.com'
  },
  {
    title: "🚄 Coming Soon: Tube Trains",
    content:
      "TFL Tube Departures are coming soon!!!",
  },
];

interface NewsItem {
  title: string;
  content: string;
  isHighlighted?: boolean;
  titleLink?: string;
}
