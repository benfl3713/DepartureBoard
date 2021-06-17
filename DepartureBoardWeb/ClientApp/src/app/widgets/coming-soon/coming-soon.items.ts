export const ComingSoonItems: ComingSoonItem[] = [
  {
    title: "New UI",
    content: "Brand New UI coming to the home and search pages"
  }
];

interface ComingSoonItem {
  title: string;
  content: string;
  isHighlight?: boolean;
  isBeta?: boolean;
}
