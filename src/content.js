// Approved core-team order. Contact channels can be filled in when confirmed.
export const club = {
  email: 'ieee.cis@vit.edu', instagram: 'https://www.instagram.com/ieee_cisvitpune/', linkedin: 'https://www.linkedin.com/company/ieee-cis-chapter-vit-pune/',
  address: 'Vishwakarma Institute of Technology, Pune',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vishwakarma+Institute+of+Technology+Pune',
};
export const team = [
  { name: 'Prasanna Mehkarkar', role: 'President', image: '/images/team/prasanna.webp' },
  { name: 'Atharva Mankar', role: 'Vice President', image: '/images/team/atharva.webp' },
  { name: 'Surabhi Patel', role: 'Secretary', image: '/images/team/surabhi.webp' },
  { name: 'Vedant Gandhi', role: 'Event Manager', image: '/images/team/vedant.webp' },
  { name: 'Angel Gurjar', role: 'Event Manager', image: '/images/team/angel.webp' },
  { name: 'Saachi Biyani', role: 'Treasurer', image: '/images/team/saachi.webp' },
  { name: 'Samarth Shinde', role: 'PR Officer', image: '/images/team/samarth.webp' },
];
export const gallery = [
  ['0379', 'The Techshift community together after the session'],
  ['0137', 'A speaker welcoming the Techshift audience'],
  ['0167', 'A talk in progress at Techshift'],
  ['0186', 'A conversation with students during the session'],
  ['0219', 'Students taking part in the classroom session'],
  ['0241', 'A speaker sharing ideas at Techshift'],
  ['0264', 'The audience and speaker during Techshift'],
  ['0299', 'A moment of appreciation at Techshift'],
  ['0329', 'Speakers, faculty and students at the front of the room'],
  ['0343', 'Students attending Techshift'],
  ['0357', 'The team and guests at Techshift'],
  ['0395', 'A group photograph from Techshift'],
].map(([id, alt]) => ({ src: `/images/techshift/techshift-${id}.webp`, alt }));
export const events = [{
  id: 'techshift', title: 'Techshift', category: 'Speaker session', status: 'past',
  date: '12 October 2026', dateISO: '2026-10-12', venue: 'VIT Pune',
  image: '/images/techshift/techshift-0379.webp',
  description: 'A room full of curiosity. A shared space for ideas. Techshift brought students together for a speaker session and conversations with the IEEE CIS community.',
  details: [
    'Held on 12 October 2026, Techshift brought students, speakers and the IEEE CIS community together for a speaker session. It created a shared space for listening, exchanging ideas and connecting with people beyond everyday classroom interactions.',
    'Speaker-led talks and conversations with students formed the heart of the session. Audience participation made the gathering an interactive exchange, with students engaging with speakers and taking part in the discussion.',
    'The day also included moments of appreciation for the guests and photographs with speakers, faculty and students. The gallery captures the talks, audience interactions and the community coming together at the end of the session. For the chapter’s own account of the event, read the official LinkedIn recap below.',
  ],
  highlights: ['Speaker-led conversations', 'Student participation', 'Community connections'],
  recapUrl: 'https://www.linkedin.com/posts/ieee-cis-chapter-vit-pune_thetechshift-ieeecis-vitpune-ugcPost-7515819269675323392-t4Nc',
  registrationUrl: '', fee: null, gallery,
}];
// Add confirmed upcoming events with status: 'upcoming', date, venue, fee and
// registrationUrl: 'https://your-approved-registration-or-payment-page'.

