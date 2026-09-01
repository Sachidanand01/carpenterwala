export const metadata = {
  title: "My Bookings & Warranties | Carpenterwala",
  description: "Manage your active home service bookings and track appliance warranties.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  alternates: {
    canonical: 'https://carpenterwala.com/bookings',
  },
};

export default function BookingsLayout({ children }) {
  return children;
}
