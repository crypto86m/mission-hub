import React, { useState } from 'react';
import { Video, ChevronDown, ChevronUp, Film, Music, Palette, Type } from 'lucide-react';

const briefs = [
  {
    day: 'Friday, April 11',
    title: 'The Weekend Mindset',
    duration: '20 sec',
    type: 'Motivational/Mindset',
    target: '40K+ views',
    vibe: 'Aspirational',
    
    scenes: [
      {
        time: '0:00-0:08',
        name: 'HOOK',
        description: 'You in car, hand on wheel, cinematic',
        visual: 'Car interior, driver perspective',
        text: '"FRIDAY MINDSET" (Montserrat Bold, white, 60pt)',
        music: 'Trending motivation beat drops here',
        transition: 'Text fade in, zoom on face',
        notes: 'Match music drop to text appearance'
      },
      {
        time: '0:08-0:10',
        name: 'CUT 1',
        description: 'Luxury dashboard detail',
        visual: 'Gauge cluster or dashboard',
        text: '"52 EXTRA DAYS" (gold/orange)',
        music: 'Subtle hi-hat rolling',
        transition: 'Quick cut on beat, slide text',
        notes: 'Emphasize luxury detail'
      },
      {
        time: '0:10-0:14',
        name: 'CUT 2',
        description: 'Wide scenery shot',
        visual: 'Road/Napa valley scenery',
        text: '"THE WEALTH GAP" (lower third)',
        music: 'Music continues, building',
        transition: 'Smooth zoom out, parallax',
        notes: 'Golden hour look preferred'
      },
      {
        time: '0:14-0:18',
        name: 'CUT 3',
        description: 'Direct camera, intense look',
        visual: 'You, back to camera, direct',
        text: '"IT\'S NOT TALENT"',
        music: 'Music peaks',
        transition: 'Quick hard cut (impactful)',
        notes: 'Intensity here'
      },
      {
        time: '0:18-0:20',
        name: 'CLOSE',
        description: 'Sunset/movement',
        visual: 'Car moving, sunset background',
        text: '"IT\'S WEEKENDS" + "SAVE THIS 📌"',
        music: 'Music conclusion',
        transition: 'Fade to black with text',
        notes: 'Final statement'
      }
    ],
    
    specs: {
      colorGrade: 'Warm LUT (gold/orange), -10 contrast, +20 saturation',
      transitions: '3 quick cuts (0.1s), 1 zoom (0.3s)',
      effects: 'Subtle vignette only',
      textFont: 'Montserrat Bold',
      textTiming: '2.5-3 seconds each',
      music: 'Trending motivation track (500M+ uses, 90-120 BPM)'
    },
    
    checklist: [
      'Raw footage gathered (car interior, road, you)',
      'Music selected (trending motivation track)',
      'Color grade LUT applied',
      'Text animations synced to beats',
      'Audio levels normalized',
      'Tested on mobile vertical view',
      'No pixelation, smooth transitions',
      'Final export at Instagram Reels spec'
    ]
  },
  {
    day: 'Saturday, April 12',
    title: 'The Napa Difference',
    duration: '25 sec',
    type: 'Lifestyle/Location',
    target: '45K+ views',
    vibe: 'Aspirational Wanderlust',
    
    scenes: [
      {
        time: '0:00-0:06',
        name: 'HOOK',
        description: 'Cinematic drive through vineyard',
        visual: 'Car driving Napa vineyard (golden hour)',
        text: '"NAPA STATE OF MIND" (white, 55pt)',
        music: 'Smooth luxury lo-fi beat drops',
        transition: 'Text slides from top, tilt effect',
        notes: 'Golden hour essential'
      },
      {
        time: '0:06-0:10',
        name: 'CUT 1',
        description: 'Valley landscape wide shot',
        visual: 'Dramatic valley view',
        text: '"WHERE WINE MEETS WORK" (gold)',
        music: 'Music continues',
        transition: 'Smooth zoom out, parallax',
        notes: 'Emphasize scale'
      },
      {
        time: '0:10-0:15',
        name: 'CUT 2',
        description: 'Luxury detail',
        visual: 'Wine glass, steering wheel, luxury item',
        text: '"MOST MISS THE VIEW" (lower third)',
        music: 'Music beat continues',
        transition: 'Quick cut on beat',
        notes: 'Subtle tilt-shift effect'
      },
      {
        time: '0:15-0:20',
        name: 'CUT 3',
        description: 'You at scenic moment',
        visual: 'You at overlook or wine bar',
        text: '"WHILE BUILDING"',
        music: 'Music climax',
        transition: 'Smooth cut',
        notes: 'Authentic, not posed'
      },
      {
        time: '0:20-0:25',
        name: 'CLOSE',
        description: 'Sunset/return to car',
        visual: 'Sunset, car moving',
        text: '"LIVE DIFFERENT" + "SAVE & SHARE ↓"',
        music: 'Music concludes',
        transition: 'Fade out',
        notes: 'Strong closer'
      }
    ],
    
    specs: {
      colorGrade: 'Warm sunset LUT, +15 saturation, golden hour',
      transitions: 'Smooth zooms (0.4s), parallax on landscape',
      effects: 'Subtle tilt-shift on detail (luxury feel)',
      textFont: 'Montserrat Bold, 2.5-3 sec',
      music: 'Luxury lo-fi (trending)',
      resolution: '1080x1920 (Instagram Reels standard)'
    },
    
    checklist: [
      'Napa footage (vineyard, landscape, overlook)',
      'Golden hour timing optimal',
      'Music selected (luxury lo-fi)',
      'Color grade warm sunset LUT',
      'All transitions smooth (no jarring cuts)',
      'Tilt-shift effect applied to detail shot',
      'Text readable in 1 second',
      'Mobile test passed'
    ]
  },
  {
    day: 'Sunday, April 13',
    title: 'The Compound Effect',
    duration: '22 sec',
    type: 'Business/Mindset',
    target: '50K+ views',
    vibe: 'Educational Authority',
    
    scenes: [
      {
        time: '0:00-0:07',
        name: 'HOOK',
        description: 'You at desk, busy building',
        visual: 'Workspace, candid action (not posed)',
        text: '"1% COMPOUND" (white, bold)',
        music: 'Powerful motivational drop',
        transition: 'Text scale-up animation (modern)',
        notes: 'Show momentum'
      },
      {
        time: '0:07-0:10',
        name: 'CUT 1',
        description: 'Work montage (B-roll quality matters)',
        visual: 'Typing, analyzing, data-focused',
        text: '"DAILY ACTIONS" (gold)',
        music: 'Continues, energetic',
        transition: 'Jump cut on beat (fast)',
        notes: 'Shows momentum'
      },
      {
        time: '0:10-0:15',
        name: 'CUT 2',
        description: 'Success metric',
        visual: 'Graph going up OR you on phone',
        text: '"EXPONENTIAL RESULTS" (upper third)',
        music: 'Building to peak',
        transition: 'Smooth scale',
        notes: 'High contrast, blue/gold'
      },
      {
        time: '0:15-0:20',
        name: 'CUT 3',
        description: 'Success moment',
        visual: 'Subtle celebration or peaceful moment',
        text: '"IN 12 MONTHS" (large, center)',
        music: 'Music peaks',
        transition: 'Fade out effect',
        notes: 'Confidence moment'
      },
      {
        time: '0:20-0:22',
        name: 'CLOSE',
        description: 'You, confident',
        visual: 'You, direct look',
        text: '"WHAT ARE YOU BUILDING?"',
        music: 'Music concludes',
        transition: 'Fade to text',
        notes: 'Final question'
      }
    ],
    
    specs: {
      colorGrade: 'High contrast, blue tint (authority), +20 saturation',
      transitions: 'Fast jump cuts (0.1s), 1 scale (0.3s)',
      effects: 'Light leaks on transitions (modern)',
      textFont: 'Montserrat Bold or Futura (corporate)',
      music: 'Powerful motivational track'
    },
    
    checklist: [
      'B-roll footage of work (quality matters)',
      'Success visuals (graph, metric, moment)',
      'Music selected (hustle/motivation trending)',
      'High contrast color grade applied',
      'Fast jump cuts (3.2-4.5 cuts/sec)',
      'Light leak effects added',
      'Text appears on music peaks',
      'Published & monitored for engagement'
    ]
  }
];

export default function EditingBriefs() {
  const [expandedBrief, setExpandedBrief] = useState(0);
  const [expandedScene, setExpandedScene] = useState({});

  const toggleScene = (briefIdx, sceneIdx) => {
    const key = `${briefIdx}-${sceneIdx}`;
    setExpandedScene(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto pb-20">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Film size={32} className="text-cyan" />
          Instagram Editing Briefs
        </h1>
        <p className="text-gray-400 mt-1">Professional CapCut frame-by-frame production guides</p>
      </div>

      <div className="bg-cyan/10 border border-cyan/30 rounded-lg p-4">
        <p className="text-cyan text-sm">
          <strong>How to use:</strong> Each brief contains exact timing, visuals, text, music, and transitions. 
          Follow frame-by-frame in CapCut. Reference CAPCUT_QUICK_REFERENCE.md for color grades, transitions, and presets.
        </p>
      </div>

      <div className="space-y-4">
        {briefs.map((brief, briefIdx) => (
          <div key={briefIdx} className="bg-dark-card rounded-lg border border-cyan/20 overflow-hidden">
            {/* Brief Header */}
            <button
              onClick={() => setExpandedBrief(expandedBrief === briefIdx ? -1 : briefIdx)}
              className="w-full p-6 flex items-start justify-between hover:bg-dark-card/80 transition-colors"
            >
              <div className="text-left flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Video size={18} className="text-cyan" />
                  <p className="text-cyan font-semibold text-sm">{brief.day}</p>
                </div>
                <h2 className="text-2xl font-bold text-white">{brief.title}</h2>
                <div className="flex gap-4 mt-2 text-sm text-gray-400">
                  <span>• {brief.duration}</span>
                  <span>• {brief.type}</span>
                  <span className="text-cyan">• {brief.target}</span>
                </div>
              </div>
              <div className="text-gray-400 ml-4">
                {expandedBrief === briefIdx ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
            </button>

            {/* Expanded Content */}
            {expandedBrief === briefIdx && (
              <div className="border-t border-cyan/20 p-6 space-y-6">
                {/* Scenes */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Film size={20} className="text-cyan" />
                    Scene Breakdown
                  </h3>
                  <div className="space-y-2">
                    {brief.scenes.map((scene, sceneIdx) => {
                      const sceneKey = `${briefIdx}-${sceneIdx}`;
                      const isExpanded = expandedScene[sceneKey];
                      
                      return (
                        <div key={sceneIdx} className="border border-gray-700/30 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleScene(briefIdx, sceneIdx)}
                            className="w-full p-4 flex items-start justify-between hover:bg-dark-bg/50 transition-colors text-left"
                          >
                            <div className="flex-1">
                              <p className="text-cyan font-semibold text-sm">{scene.time}</p>
                              <p className="text-white font-medium">{scene.name}: {scene.description}</p>
                            </div>
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>

                          {isExpanded && (
                            <div className="border-t border-gray-700/30 bg-dark-bg/30 p-4 space-y-3 text-sm">
                              <div>
                                <p className="text-gray-400 font-semibold mb-1">Visual</p>
                                <p className="text-gray-300">{scene.visual}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 font-semibold mb-1 flex items-center gap-2">
                                  <Type size={14} /> Text Overlay
                                </p>
                                <p className="text-gray-300">{scene.text}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 font-semibold mb-1 flex items-center gap-2">
                                  <Music size={14} /> Music
                                </p>
                                <p className="text-gray-300">{scene.music}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 font-semibold mb-1">Transition</p>
                                <p className="text-gray-300">{scene.transition}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 font-semibold mb-1">Notes</p>
                                <p className="text-gray-300">{scene.notes}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Technical Specs */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Palette size={20} className="text-cyan" />
                    CapCut Technical Specs
                  </h3>
                  <div className="bg-dark-bg/50 rounded-lg p-4 space-y-2 text-sm text-gray-300">
                    {Object.entries(brief.specs).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-400 font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <p className="ml-4 text-gray-300">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checklist */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Production Checklist</h3>
                  <div className="bg-dark-bg/50 rounded-lg p-4 space-y-2">
                    {brief.checklist.map((item, idx) => (
                      <label key={idx} className="flex items-center gap-3 cursor-pointer hover:text-cyan transition-colors">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-dark-card rounded-lg border border-cyan/20 p-6">
        <h3 className="text-lg font-bold text-white mb-3">Quick Reference Files</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>📄 <strong>CAPCUT_QUICK_REFERENCE.md</strong> — One-page checklists & presets</p>
          <p>🎬 <strong>CAPCUT_TECHNICAL_GUIDE.md</strong> — Step-by-step build workflow</p>
          <p>📊 <strong>CAPCUT_LUXURY_REELS_BRIEF.md</strong> — Creator analysis & templates</p>
        </div>
      </div>
    </div>
  );
}
