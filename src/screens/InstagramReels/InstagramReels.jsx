import React, { useState } from 'react';
import './InstagramReels.css';

const InstagramReels = () => {
  const [activeTab, setActiveTab] = useState('phase1');
  const [copiedId, setCopiedId] = useState(null);

  // Phase 1: Final 10 videos
  const phase1Reels = [
    {
      id: 1,
      title: 'Authority + Accountability',
      file: 'post_1_authority.mp4',
      duration: '20s',
      caption: 'Watched the RLM crew operate yesterday and honestly? They just know what to do.\n\nNo scripts. No constant management.\nJust... people who get it.\n\nThat\'s basically it. That\'s the whole thing.\n\nHires well = everything works.\n\nHire poorly = chaos (ask me how I know).\n\nWho\'s on your team? 🧭',
      hashtags: '#BusinessCulture #Leadership #TeamBuilding #Entrepreneur #CompanyValues #ScaleUp #Management',
      audio: 'Ambient + trending sound (128 BPM)',
      bestTime: 'Tue-Thu, 9 AM PT',
      status: 'ready'
    },
    {
      id: 2,
      title: 'Vulnerability + Insight',
      file: 'post_2_vulnerability.mp4',
      duration: '25s',
      caption: 'Spent 10 years printing money and missing everything else.\n\nNot exactly a flex.\n\nThese days I\'m way more interested in being at dinner than being in the boardroom.\n\nFunny how that changes your whole perspective on what "winning" actually means.\n\nNot saying business doesn\'t matter. But there\'s other stuff too.\n\nJust saying.\n\n🧭',
      hashtags: '#PersonalGrowth #Entrepreneur #Success #Authenticity #BusinessWithPurpose #Leadership #Wisdom #FamilyFirst',
      audio: 'Original voiceover (natural, calm)',
      bestTime: 'Fri-Sun, 6 PM PT',
      status: 'ready'
    },
    {
      id: 3,
      title: 'Lifestyle Aspirational',
      file: 'post_3_lifestyle.mp4',
      duration: '22s',
      caption: 'Napa Event Sunday was refreshing because literally nobody was trying to sell anyone anything.\n\nEveryone just... talked. Laughed. Actually listened.\n\nThat\'s rare. Most rooms are like 90% people waiting for their turn to pitch.\n\nGood people in the same place with no agenda?\nThat hits different.\n\nWho are you hanging with? 🧭',
      hashtags: '#Community #Networking #Entrepreneurs #NapaValley #HigherCircle #Alignment #Entrepreneurship #Success',
      audio: 'Lofi/sophisticated ambient',
      bestTime: 'Sun-Wed, 6 PM PT',
      status: 'ready'
    },
    {
      id: 4,
      title: 'Behind-the-Scenes Process',
      file: 'post_4_process.mp4',
      duration: '24s',
      caption: 'Scaling is boring as hell.\n\nIt\'s not 10x growth moments. It\'s showing up and doing the exact same thing over and over.\n\nThat\'s it. That\'s the whole secret.\n\nPeople talk about scaling.\nPeople who actually scale just... work.\n\n🧭',
      hashtags: '#Hustle #Execution #Entrepreneur #BuilderMentality #BusinessOwner #WorkEthic #GrindDaily #Real',
      audio: 'Upbeat/professional (130 BPM)',
      bestTime: 'Tue-Thu, 8 AM PT',
      status: 'ready'
    },
    {
      id: 5,
      title: 'Framework - 3 Scaling Rules',
      file: 'post_5.mp4',
      duration: '23s',
      caption: 'Failed at 2 businesses before this one.\n\nTurns out there\'s basically 3 things that matter when scaling:\n\n1. SYSTEMS — Can you do it the same way 100 times?\n2. PEOPLE — Can you find humans who actually care?\n3. MONEY — Are you growing faster than you\'re burning cash?\n\nGot 2 out of 3 twice. Third time got all 3.\n\nWhat\'s your bottleneck right now?\n\n🧭',
      hashtags: '#Business #Scaling #Entrepreneurship #Strategy #Leadership #Systems #SmallBusiness #Growth',
      audio: 'Motivational (125 BPM)',
      bestTime: 'Tue-Thu, 8 AM PT',
      status: 'ready'
    },
    {
      id: 6,
      title: '5 Lessons Learned',
      file: 'post_6.mp4',
      duration: '23s',
      caption: '5 things I learned:\n\n1. Saying no > saying yes\n2. Good people fix bad systems\n3. If you\'re guessing, you\'re losing\n4. Everyone\'s got ONE thing they\'re unreasonably good at\n5. Invest in yourself\n\nWhich one hits different for you? 🧭',
      hashtags: '#Entrepreneur #BusinessTips #Scaling #Leadership #Success #Mindset #BusinessAdvice #Growth',
      audio: 'Trending motivational sound',
      bestTime: 'Tue-Thu, 9 AM PT',
      status: 'ready'
    },
    {
      id: 7,
      title: 'Story - $500K Contract Pivot',
      file: 'post_7.mp4',
      duration: '28s',
      caption: 'Landed a $500K contract once. Thought we made it.\n\nTwo months in: client cuts it by $200K.\n\nOvernight. No warning.\n\nI was... not having a good day.\n\nBut then I realized: the contract doesn\'t matter. My reaction to the contract matters.\n\nSo we got creative. Added more value. They tripled it.\n\nTurns out everyone gets dealt bad cards. Most people just fold.\n\nNot that interesting of a story unless you actually do something about it.\n\n🧭',
      hashtags: '#Entrepreneurship #Resilience #BusinessStory #Leadership #Authenticity #Mindset #Success #Hustle',
      audio: 'Ambient (soft, contemplative)',
      bestTime: 'Fri-Sun, 6 PM PT',
      status: 'ready'
    },
    {
      id: 8,
      title: 'Challenge - Discipline',
      file: 'post_8.mp4',
      duration: '18s',
      caption: 'Everyone wants to be successful.\n\nAlmost nobody wants to be disciplined enough for it.\n\nBig difference.\n\nDiscipline is basically saying no to a million cool things so you can say yes to one.\n\nThat\'s literally it.\n\nMotivation is for Instagram captions. Discipline is real.\n\n🧭',
      hashtags: '#Discipline #Success #Mindset #Entrepreneur #Character #GrindDaily #Leadership #PersonalDevelopment',
      audio: 'Trending epic/motivational sound',
      bestTime: 'Tue-Wed, 6 PM PT',
      status: 'ready'
    },
    {
      id: 9,
      title: 'Aesthetic - Pure Vibes',
      file: 'post_9.mp4',
      duration: '24s',
      caption: 'No words needed.\n\n🧭',
      hashtags: '#LifestyleBusiness #Entrepreneur #Aspiration #Success #Premium #NapaValley #Hustle #Vision',
      audio: 'Trending premium/lofi sound',
      bestTime: 'Fri-Sun, 6 PM PT',
      status: 'ready'
    },
    {
      id: 10,
      title: 'Social Proof - Team Credibility',
      file: 'post_10.mp4',
      duration: '20s',
      caption: '$2.8M. 40 people. 354 active projects.\n\nNot bragging. Just the current state of things.\n\nThe cool part? Every single person in this photo chose to be here. Nobody\'s forced.\n\nThat\'s the whole thing right there.\n\nYou can\'t scale by forcing people. You scale by building something they actually want to be part of.\n\nEverything else follows from that.\n\n🧭',
      hashtags: '#BusinessGrowth #Scaling #Leadership #TeamBuilding #Success #Entrepreneur #RLMEnterprises #Building',
      audio: 'Upbeat, professional trending sound',
      bestTime: 'Tue-Thu, 9 AM PT',
      status: 'ready'
    }
  ];

  // Phase 2: Posts 1-10 preview (copy-paste)
  const phase2Reels = [
    { number: 1, title: 'Hidden Truths About Business', preview: 'Most people think success is about having the right idea. Wrong...' },
    { number: 2, title: 'Napa Moments', preview: 'Napa isn\'t about the wine (though that\'s part of it)...' },
    { number: 3, title: 'RLM Operations', preview: 'Nobody talks about the unsexy part of running a business...' },
    { number: 4, title: 'Work-Life Balance Myth', preview: 'Work-life balance doesn\'t exist. What exists is integration...' },
    { number: 5, title: 'The Napa Event Vision', preview: 'The Napa Event isn\'t a party. It\'s a gathering...' },
    { number: 6, title: 'What I Got Wrong', preview: 'My first business failed because I hired for talent...' },
    { number: 7, title: 'Premium ≠ Expensive', preview: 'Premium doesn\'t mean expensive. It means intentional...' },
    { number: 8, title: 'Hiring Philosophy', preview: 'I don\'t hire for skills anymore. Skills are cheap...' },
    { number: 9, title: 'On Failure', preview: 'Nobody talks about how much failure hurts...' },
    { number: 10, title: 'Next 5 Years Vision', preview: 'RLM hits $5M in Year 3. NVCC becomes gold standard...' }
  ];

  const handleCopyCaption = (caption, id) => {
    navigator.clipboard.writeText(caption);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="instagram-reels">
      <div className="reels-header">
        <h1>📱 Instagram Reels</h1>
        <div className="tab-switcher">
          <button
            className={`tab-btn ${activeTab === 'phase1' ? 'active' : ''}`}
            onClick={() => setActiveTab('phase1')}
          >
            Phase 1: Ready to Post (10)
          </button>
          <button
            className={`tab-btn ${activeTab === 'phase2' ? 'active' : ''}`}
            onClick={() => setActiveTab('phase2')}
          >
            Phase 2: Copy-Paste (100)
          </button>
        </div>
      </div>

      {activeTab === 'phase1' && (
        <div className="phase-container">
          <div className="phase-info">
            <h2>Phase 1: 10 Final Videos (Ready to Post)</h2>
            <p>All videos are formatted correctly (1080×1920, silent audio). Copy captions below, add hashtags, add music in Instagram app, and post!</p>
          </div>
          <div className="reels-grid">
            {phase1Reels.map(reel => (
              <div key={reel.id} className={`reel-card ${reel.status}`}>
                <div className="reel-header">
                  <span className="reel-number">Reel {reel.id}</span>
                  <span className="reel-status">✅ Ready</span>
                </div>
                <h3>{reel.title}</h3>
                <div className="reel-meta">
                  <span className="duration">⏱️ {reel.duration}</span>
                  <span className="best-time">🕐 {reel.bestTime}</span>
                </div>
                
                <div className="caption-section">
                  <label>Caption (Click to copy):</label>
                  <div 
                    className="caption-box"
                    onClick={() => handleCopyCaption(reel.caption, reel.id)}
                  >
                    <p>{reel.caption}</p>
                    {copiedId === reel.id && <span className="copy-indicator">✅ Copied!</span>}
                  </div>
                </div>

                <div className="hashtags-section">
                  <label>Hashtags (Click to copy):</label>
                  <div 
                    className="hashtags-box"
                    onClick={() => handleCopyCaption(reel.hashtags, `hash-${reel.id}`)}
                  >
                    {reel.hashtags}
                    {copiedId === `hash-${reel.id}` && <span className="copy-indicator">✅ Copied!</span>}
                  </div>
                </div>

                <div className="audio-section">
                  <label>🎵 Audio Suggestion:</label>
                  <p>{reel.audio}</p>
                </div>

                <div className="reel-actions">
                  <div
                    onClick={() => {
                      const videoMap = {
                        'post_1_authority.mp4': '/videos/napa-friday-drive.mp4',
                        'post_2_vulnerability.mp4': '/videos/monday-car-lineup.mp4',
                        'post_3_lifestyle.mp4': '/videos/wednesday-napa-sunset.mp4',
                        'post_4_process.mp4': '/videos/saturday-paint-job.mp4',
                      };
                      const url = videoMap[reel.file] || `/videos/${reel.file}`;
                      window.open(url, '_blank');
                    }}
                    className="btn-preview" style={{cursor:'pointer'}}
                  >
                    👁️ Preview Video
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'phase2' && (
        <div className="phase-container">
          <div className="phase-info">
            <h2>Phase 2: 100 Posts (Copy-Paste Ready)</h2>
            <p>All 100 captions are ready to copy and paste. Posts 1-10 shown below. Full 100-post file available at /instagram/PHASE_2_COPYABLE.md</p>
          </div>
          <div className="phase2-grid">
            {phase2Reels.map(post => (
              <div key={post.number} className="phase2-card">
                <div className="post-header">
                  <h3>Post #{post.number + 20}: {post.title}</h3>
                </div>
                <p className="preview">{post.preview}</p>
                <a 
                  href="/instagram/PHASE_2_COPYABLE.md" 
                  className="btn-copy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📋 Open Full Copy-Paste File
                </a>
              </div>
            ))}
          </div>
          <div className="phase2-summary">
            <h3>Full Phase 2 Details</h3>
            <p><strong>Total posts:</strong> 100</p>
            <p><strong>Timeline:</strong> 5 posts per week, 20 weeks</p>
            <p><strong>Format:</strong> All captions ready to copy directly into Instagram</p>
            <p><strong>Categories:</strong> Authority (20) | Lifestyle (30) | Business (25) | Personal (15) | Events (10)</p>
            <p><strong>Files:</strong></p>
            <ul>
              <li><code>/instagram/PHASE_2_COPYABLE.md</code> — Posts 1-20 (full detail)</li>
              <li><code>/instagram/PHASE_2_POSTS_21_100.md</code> — Posts 21-100 (copy-paste)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramReels;
