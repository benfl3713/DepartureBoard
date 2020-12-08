export const ComingSoonItems: ComingSoonItem[] = [
  {
    title: "New Datasource for Germany (DB)",
    content:
      "We are expanding to overseas datasouces by implementing all current features with the German Railway (DB)",
    isBeta: true,
  },
  {
    title: "New Documentation Website",
    content:
      "We are building a brand new website to include full documentation on led departure board",
    isHighlight: true,
  },
];

interface ComingSoonItem {
  title: string;
  content: string;
  isHighlight?: boolean;
  isBeta?: boolean;
}
