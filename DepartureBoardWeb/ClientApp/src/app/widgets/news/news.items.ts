export const NewsItems: NewsItem[] = [
  {
    title: "New Documentation Website",
    content:
      "A new <a href='https://docs.leddepartureboard.com' target='_blank'>website</a> has been built to provide documentation/user guides on leddepartureboard.com",
    isHighlighted: false,
  },
  {
    title: "New Datasource for Germany (DB)",
    content:
      "We have expanded to overseas datasouces by implementing all current features with the German Railway (DB). (Currently we only support ICE trains and some local services)",
    isHighlighted: false,
  },
  {
    title: "Departure Board Admin",
    content: `A new
      <a href="https://admin.leddepartureboard.com" target="_blank">webapp</a>
      to manage your boards remotely with instant live updates. To get started
      check out the
      <a href="/about/departureboard-admin">About Page</a>`,
  },
];

interface NewsItem {
  title: string;
  content: string;
  isHighlighted?: boolean;
}
