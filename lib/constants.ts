export type Event = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: Event[] = [
  {
    image: '/images/event1.png',
    title: 'ReactConf 2026',
    slug: 'reactconf-2026',
    location: 'San Francisco, CA',
    date: 'May 15, 2026',
    time: '9:00 AM',
  },
  {
    image: '/images/event2.png',
    title: 'HackMTY 2026',
    slug: 'hackmty-2026',
    location: 'Monterrey, Mexico',
    date: 'Jun 20, 2026',
    time: '8:00 AM',
  },
  {
    image: '/images/event3.png',
    title: 'JSConf US',
    slug: 'jsconf-us-2026',
    location: 'Portland, OR',
    date: 'Aug 10, 2026',
    time: '9:30 AM',
  },
  {
    image: '/images/event4.png',
    title: 'DevOpsDays London',
    slug: 'devopsdays-london-2026',
    location: 'London, UK',
    date: 'Sep 5, 2026',
    time: '10:00 AM',
  },
  {
    image: '/images/event5.png',
    title: 'PyCon US 2026',
    slug: 'pycon-us-2026',
    location: 'Pittsburgh, PA',
    date: 'Oct 22, 2026',
    time: '8:30 AM',
  },
  {
    image: '/images/event6.png',
    title: 'RustConf 2026',
    slug: 'rustconf-2026',
    location: 'Berlin, Germany',
    date: 'Nov 14, 2026',
    time: '10:00 AM',
  },
];
