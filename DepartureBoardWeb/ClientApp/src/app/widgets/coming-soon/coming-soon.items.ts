export const ComingSoonItems: ComingSoonItem[] = [
  {
    title: "New Documentation Website",
    content:
      "We are building a brand new <a href='https://docs.leddepartureboard.com' target='_blank'>website</a> to include full documentation on led departure board",
    isHighlight: false,
    isBeta: true,
  },
];

interface ComingSoonItem {
  title: string;
  content: string;
  isHighlight?: boolean;
  isBeta?: boolean;
}
