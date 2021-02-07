export const ComingSoonItems: ComingSoonItem[] = [
  {
    title: "New UI for Custom Departures",
    content:
      "A new interface to graphically create and edit custom departures with your own data",
    isHighlight: true,
  },
];

interface ComingSoonItem {
  title: string;
  content: string;
  isHighlight?: boolean;
  isBeta?: boolean;
}
