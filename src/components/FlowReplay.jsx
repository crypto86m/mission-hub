import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';

export default function FlowReplay({ workflow, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  const steps = workflow.history || [];

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length]);

  const currentStepData = steps[currentStep];
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-card border border-cyan/30 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan/20">
          <div>
            <h2 className="text-2xl font-bold glow-text">{workflow.name}</h2>
            <p className="text-gray-400 text-sm mt-1">Workflow Playback</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-cyan transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Playback area */}
        <div className="flex-1 overflow-y-auto p-6">
          {steps.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No workflow history available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current step visualization */}
              {currentStepData && (
                <div className="glass-card mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-cyan">
                        {currentStepData.stage}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Duration: {currentStepData.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Step</p>
                      <p className="text-2xl font-bold text-cyan">
                        {currentStep + 1} / {steps.length}
                      </p>
                    </div>
                  </div>

                  {/* Timeline for current step */}
                  <div className="relative h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: '100%' }}
                    ></div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {currentStepData.start} → {currentStepData.end || 'in progress'}
                  </p>
                </div>
              )}

              {/* Steps timeline */}
              <div className="border-l-2 border-cyan/30 pl-4 space-y-3">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`cursor-pointer transition-all ${
                      idx === currentStep
                        ? 'text-cyan scale-105'
                        : idx < currentStep
                        ? 'text-gray-500'
                        : 'text-gray-400'
                    }`}
                    onClick={() => setCurrentStep(idx)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full transition-all ${
                          idx === currentStep
                            ? 'bg-cyan scale-150 shadow-lg shadow-cyan/50'
                            : idx < currentStep
                            ? 'bg-green-500'
                            : 'bg-gray-600'
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{step.stage}</p>
                        <p className="text-xs text-gray-500">{step.duration}</p>
                      </div>
                      <span className="text-xs text-gray-600">
                        {step.start} - {step.end || '...'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="border-t border-cyan/20 p-6 space-y-4">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-semibold text-cyan">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentStep(0)}
              className="p-2 hover:bg-cyan/20 rounded-lg transition-colors text-gray-400 hover:text-cyan"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 hover:bg-cyan/20 rounded-lg transition-colors text-gray-400 hover:text-cyan"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              onClick={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))}
              className="p-2 hover:bg-cyan/20 rounded-lg transition-colors text-gray-400 hover:text-cyan"
            >
              <SkipForward size={20} />
            </button>

            {/* Playback speed */}
            <div className="flex-1 flex items-center gap-2">
              <label className="text-xs text-gray-500">Speed:</label>
              <select
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="px-2 py-1 bg-dark-bg border border-cyan/30 rounded text-sm text-white focus:border-cyan focus:outline-none"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
              </select>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
