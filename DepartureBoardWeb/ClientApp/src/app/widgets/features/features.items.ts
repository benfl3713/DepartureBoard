export const Features: Feature[] = [
  {
    title: "Accurate Recreation",
    content: `All the boards are designed to accuratly recreate the boards you would find at stations.
    Including scrolling information displays and paging stop displays`
  },
  {
    title: "Live Departure Times",
    content: `All the boards constantly update with the latest data including delays to services or platform alterations.
    Sometimes the platform will be shown even before it would appear in the actual station`
  },
  {
    title: "Open Source",
    content: `Led Departure Board is an opensource project.
    This means everyone has access to the source code and can contribute towards the webapp.
    You can click <a href="https://github.com/benfl3713/DepartureBoard">this link</a> to view the project`
  }
]

interface Feature {
  title: string;
  content: string;
}
