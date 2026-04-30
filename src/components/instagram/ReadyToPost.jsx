import React, { useState } from 'react';
import { Copy, Check, Calendar, Star } from 'lucide-react';

const POSTS = [
  {
    id: 1,
    rank: 1,
    score: 9.2,
    file: 'NapaEvent-2371.JPEG',
    label: 'Vineyard Blazer — Editorial',
    postDate: 'Sat Apr 26 @ 9–11 AM PT',
    caption: `Wine country hits different when you earn it. 🍷

The vines, the blazer, the moment — this is what building something real looks like when you finally stop and breathe it in.

Napa Valley keeps rewarding you every time you show up for it.

#NapaValley #LuxuryLifestyle #WineCountry #WeekendVibes #MensFashion #LifestylePhotography #ExoticLife #NapaLife #Entrepreneur #BenjaminMartinez`,
  },
  {
    id: 2,
    rank: 2,
    score: 9.0,
    file: 'NapaEvent-516.JPEG',
    label: 'Crew at Villa — Candid Group',
    postDate: 'Fri Apr 25 @ 5–7 PM PT',
    caption: `Squad goals? More like squad standards. 🚗✨

When the crew rolls up to The Napa Event looking like this, the vibes are already won before noon.

Real ones recognize real ones.

#TheNapaEvent #NapaValley #LuxuryCars #CarClub #ExoticCars #SupercarLife #NapaEventLife #LuxuryLifestyle #WeekendInNapa #FriendsWhoGetIt`,
  },
  {
    id: 3,
    rank: 3,
    score: 9.0,
    file: 'NatVisualz-9617.JPEG',
    label: 'Turquoise Supercar — Full Body',
    postDate: 'Sun Apr 27 @ 10 AM PT',
    caption: `Some cars are meant to be driven. Others are meant to be experienced. 🩵

This one? Both.

@NapaValleyCarClub — the collection speaks for itself.

#NapaValleyCarClub #NVCC #ExoticCars #SupercarLife #LuxuryGarage #CarPhotography #HypercarsOfInstagram #DriveLife #NapaLife #CarCulture`,
  },
  {
    id: 4,
    rank: 4,
    score: 8.8,
    file: 'NapaEvent-2317.JPEG',
    label: 'Four Men at Villa — Polished Group',
    postDate: 'Thu Apr 24 @ 6–8 PM PT',
    caption: `Four guys. One car. Zero excuses not to show up right. 🤙

The Napa Event is where the lifestyle gets real — surrounded by the right people, the right cars, and the right energy.

This is what we built it for.

#TheNapaEvent #NapaEvent2025 #NapaValley #LuxuryLifestyle #CarGuys #ExoticCars #BlueSupercar #LifestyleContent #Entrepreneurs #NapaEventVibes`,
  },
  {
    id: 5,
    rank: 5,
    score: 8.5,
    file: 'NapaEvent-376.JPEG',
    label: 'Five Blazers at Ivy Villa Entrance',
    postDate: 'Wed Apr 23 @ 12 PM PT',
    caption: `You don't just attend The Napa Event. You become part of the story. 🎭🚗

Five guys, five blazers, two exotic cars, and one unforgettable afternoon in the valley.

This is the culture.

#TheNapaEvent #NapaEvent2025 #LuxuryCarCulture #NapaValley #MenInBlazer #CarLifestyle #ExoticCars #HNWLifestyle #NapaLife #NapaEventMoments`,
  },
  {
    id: 6,
    rank: 6,
    score: 8.5,
    file: 'NapaEvent-1711.JPEG',
    label: 'Vineyard Pointing — Playful Energy',
    postDate: 'Tue Apr 22 @ 7 AM PT',
    caption: `Catch me in the vineyard when the deal closes. 😄🍇

Not every win is on a screen. Sometimes it's right here — between the vines, in the California sun, with your people.

#NapaValley #VineyardLife #WineCountry #LuxuryLifestyle #EntrepreneurLifestyle #WinnersMindset #CaliforniaDreamin #NapaLife #PersonalBrand #LifestyleGoals`,
  },
  {
    id: 7,
    rank: 7,
    score: 8.5,
    file: 'NapaEvent-298.JPEG',
    label: 'Solo Vineyard Portrait — Clean',
    postDate: 'Tue Apr 29 @ 11 AM PT',
    caption: `You can feel the valley in shots like this. 🌿

The kind of afternoon you only find in Napa — good company, open land, and the feeling that everything you've built is worth it.

#NapaValley #VineyardLife #WineCountry #LuxuryLifestyle #CasualElegance #NapaEvent #NapaLife #StyleAndSubstance #LifestyleContent #EntrepreneurVibes`,
  },
  {
    id: 8,
    rank: 8,
    score: 8.0,
    file: 'NatVisualz-9630.JPEG',
    label: 'Car Garage Editorial — Blazer',
    postDate: 'Mon Apr 21 @ 12 PM PT',
    caption: `The garage isn't just where the cars live. It's where the mindset lives. 🏁

Sharp fit. Exotic background. Eye contact that says everything.

@NapaValleyCarClub — come see for yourself.

#NapaValleyCarClub #NVCC #ExoticGarage #CarPhotography #LuxuryLifestyle #MensFashion #GarageGoals #DriveLife #SupercarLifestyle #NapaLife`,
  },
  {
    id: 9,
    rank: 9,
    score: 8.0,
    file: 'NapaEvent-1815.JPEG',
    label: 'Vineyard — Soft Reset Vibe',
    postDate: 'Mon Apr 28 @ 8 AM PT',
    caption: `Napa hits like a reset button. 🍷🌿

Wine country, fresh air, and the kind of afternoon that reminds you why you work as hard as you do.

Breathe it in.

#NapaValley #WineCountry #VineyardLife #LuxuryLifestyle #WeekendInNapa #CaliforniaLifestyle #NapaLife #SlowDown #MenOfStyle #LifestylePhotography`,
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        copied
          ? 'bg-green-500/20 text-green-400 border border-green-500/40'
          : 'bg-cyan/10 text-cyan border border-cyan/30 hover:bg-cyan/20'
      }`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied!' : 'Copy Caption'}
    </button>
  );
}

export default function ReadyToPost() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Star className="text-yellow-400" size={24} />
          <div>
            <h3 className="text-xl font-bold text-white">Ready to Post — 9 Curated Posts</h3>
            <p className="text-gray-400 text-sm">Apr 21–29 · Luxury lifestyle · All captions ready</p>
          </div>
        </div>
        <span className="text-xs bg-cyan/10 text-cyan border border-cyan/20 px-3 py-1 rounded-full">
          2-Week Content Plan
        </span>
      </div>

      <div className="space-y-3">
        {POSTS.map((post) => (
          <div
            key={post.id}
            className="bg-dark-bg rounded-lg border border-dark-border overflow-hidden"
          >
            {/* Post Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setExpanded(expanded === post.id ? null : post.id)}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-sm font-bold flex items-center justify-center">
                  {post.rank}
                </span>
                <div>
                  <p className="text-white font-medium text-sm">{post.label}</p>
                  <p className="text-gray-500 text-xs">{post.file}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Calendar size={12} />
                  {post.postDate}
                </div>
                <span className="text-yellow-400 text-sm font-bold">{post.score}/10</span>
                <span className="text-gray-500 text-xs">{expanded === post.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Expanded Caption */}
            {expanded === post.id && (
              <div className="px-4 pb-4 border-t border-dark-border">
                <div className="mt-3 flex items-start justify-between gap-4">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed flex-1">
                    {post.caption}
                  </pre>
                  <CopyButton text={post.caption} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-gray-600 text-xs mt-4 text-center">
        Click any post to expand · Copy caption with one click
      </p>
    </div>
  );
}
