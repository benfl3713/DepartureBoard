export const NewsItems: NewsItem[] = [
  {
    title: "❌ RealTimeTrains Integration Removed",
    content:
      "Unfortunately RealTimeTrains has released a new API which is no longer free to use for the request requirements of this app",
  },
  {
    title: "🚄 NEW: Tube Trains!!",
    content:
      "TFL Tube Departures are here in beta!!!. You can use them immediately by going to <a href='/london-tube/search'>Boards > London Tube</a> <span style=\"margin-left: 15px; font-size: 15px\" class=\"badge badge-pill badge-primary\">Beta</span>",
  },
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
  }
];

interface NewsItem {
  title: string;
  content: string;
  isHighlighted?: boolean;
  titleLink?: string;
}
