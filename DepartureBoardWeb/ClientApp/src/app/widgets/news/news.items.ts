export const NewsItems: NewsItem[] = [
  {
    title: "❌ RealTimeTrains Integration Removed",
    content:
      "Unfortunately RealTimeTrains has released a new API which is no longer free to use for the request requirements of this app",
  },
  {
    title: "New Website",
    content: "I'm currently working on a brand new website for transit departures. Featuring new board types and more advanced features. Feel free to suggest new features"
  },
  {
    title: "🚄 NEW: Tube Trains!!",
    content:
      "TFL Tube Departures are here in beta!!!. You can use them immediately by going to <a href='/london-tube/search'>Boards > London Tube</a> <span style=\"margin-left: 15px; font-size: 15px\" class=\"badge badge-pill badge-primary\">Beta</span>",
  }
];

interface NewsItem {
  title: string;
  content: string;
  isHighlighted?: boolean;
  titleLink?: string;
}
