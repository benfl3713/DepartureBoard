export const ComingSoonItems: ComingSoonItem[] = [
  {
    title: "New Datasource for Germany (DB)",
    content:
      "We are expanding to overseas datasouces by implementing all current features with the German Railway (DB)",
    isBeta: true,
  },
];

interface ComingSoonItem {
  title: string;
  content: string;
  isHighlight?: boolean;
  isBeta?: boolean;
}
