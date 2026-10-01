export const wedding = {
couple: {
one: {
first: "Suriya",
last: "S",
family: "Son of Mr. Narayanan & Mrs. Vijayalakshmi",
city: "Chennai",
photo: { src: "/images/groom.jpg", alt: "Suriya, the groom", w: 900, h: 1200 },
},
other: {
first: "Jyothika",
last: "R",
family: "Daughter of Mr. Ramanathan & Mrs. Janaki",
city: "Madurai",
photo: { src: "/images/bride.jpeg", alt: "Jyothika, the bride", w: 900, h: 1200 },
},
},

meta: {
hashtag: "#SuriyaWedsJyothika",
inviteLine: "Please join us to celebrate our wedding",
welcomeLine: "Welcomes you to the wedding celebration of",
cta: "Open Invitation",
dateISO: "2026-12-05T18:30:00+05:30",
dateLabel: "Saturday, the 5th of December",
yearLabel: "2026",
},

events: [
{
id: "marriage",
name: "Marriage",
day: "Morning",
date: "Saturday, 5 December 2026",
time: "7:30 AM onwards",
venue: "Grand Ballroom",
dress: "Traditional Silk Attire",
art: "arch",
image: {
src: "/images/reception.jpg",
alt: "The couple in traditional wedding attire at the mandapam",
w: 575,
h: 697,
},
text: "The sacred wedding ceremony where vows are exchanged and two souls become one.",
},
{
id: "reception",
name: "Reception",
day: "Evening",
date: "Saturday, 5 December 2026",
time: "6:30 PM onwards",
venue: "Palace Lawn",
dress: "Formal or Traditional Wear",
art: "lamps",
image: {
src: "/images/marriage.jpg",
alt: "The couple together at the celebration",
w: 399,
h: 501,
},
text: "An evening of celebration, dining, music, and heartfelt blessings.",
},
],

venue: {
name: "The Leela Palace",
line1: "MRC Nagar",
city: "Chennai, Tamil Nadu 600028",
mapsUrl:
"https://www.google.com/maps/search/?api=1&query=The+Leela+Palace+Chennai",
},

gallery: [
{ src: "/images/gallery-1.jpg", alt: "The couple in the bride's pink floral gown and the groom's navy suit" },
{ src: "/images/gallery-2.jpg", alt: "The couple in a cream and rose lehenga with a sage green sherwani" },
{ src: "/images/gallery-3.jpg", alt: "The couple in a rose and turmeric kanjivaram with a gold veshti" },
{ src: "/images/gallery-4.jpg", alt: "The couple in yellow silk, standing hand in hand" },
{ src: "/images/gallery-5.jpg", alt: "The couple face to face in a yellow and magenta saree with a green vest" },
],

decor: {
ganesha: "/images/ganesha.png",
floralLeft: "/images/floral-left.png",
floralRight: "/images/floral-right.png",
},

intro: {
fps: 12,
stride: 1,
keep: null,
alt: "Traditional temple doors opening to reveal the wedding invitation",
},

message: {
from: "Suriya & Jyothika",
heading: "A note from us to you",
body: "Your presence in our lives has been one of our greatest blessings. As we begin this new journey together, we would be delighted to celebrate this special occasion with you. We look forward to sharing laughter, love, and unforgettable memories with our family and friends.",
},

rsvp: {
headline: "We'd love to celebrate with you",
subline: "Kindly reply by the 20th of November, 2026",
deadlineISO: "2026-11-20T23:59:59+05:30",
maxGuests: 6,
// Google Apps Script web-app URL from tools/google-sheets/Code.gs.
// Leave empty to keep replies in this browser only.
endpoint: "",
attendanceOptions: [
{ value: "accept", label: "Joyfully Accept" },
{ value: "decline", label: "Regretfully Decline" },
],
},

footer: {
title: "Join us as we begin a beautiful journey together",
subtitle: "Save the date and celebrate with us",
closing: "With love and gratitude",
},

audio: {
label: "wedding music",
volume: 0.55,
tracks: [
"/audio/wedding-music1.mp4",
"/audio/wedding-music2.mp4",
"/audio/wedding-music3.mp4",
"/audio/wedding-music4.mp4",
"/audio/wedding-music5.mp4",
],
},
};
