import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

export function useGenerativeAudio(intensity: number) {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const lfoRef = useRef<Tone.LFO | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);

  // Initialize Audio Nodes
  useEffect(() => {
    // We only create nodes but don't start them until user clicks
    const initAudio = async () => {
      const filter = new Tone.Filter(400, "lowpass", -24);
      const reverb = new Tone.Reverb({ decay: 10, preDelay: 0.1 });
      const delay = new Tone.FeedbackDelay("8n", 0.5);
      
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 2, decay: 1, sustain: 1, release: 5 }
      }).chain(filter, delay, reverb, Tone.getDestination());
      
      const lfo = new Tone.LFO(0.1, 200, 1000).connect(filter.frequency);
      
      synthRef.current = synth;
      filterRef.current = filter;
      lfoRef.current = lfo;
      reverbRef.current = reverb;
    };

    initAudio();

    return () => {
      // Cleanup
      synthRef.current?.dispose();
      filterRef.current?.dispose();
      lfoRef.current?.dispose();
      reverbRef.current?.dispose();
      loopRef.current?.dispose();
    };
  }, []);

  // Update sound based on intensity
  useEffect(() => {
    if (!isPlaying || !synthRef.current || !lfoRef.current) return;

    // Map intensity (0 to 1) to audio parameters
    // Low intensity (Flow) = low filter freq, slow LFO, consonant intervals
    // High intensity (Critical Vortex) = high filter freq, fast LFO, dissonant intervals

    const minFreq = 100 + intensity * 400; 
    const maxFreq = 400 + intensity * 2000;
    
    lfoRef.current.min = minFreq;
    lfoRef.current.max = maxFreq;
    lfoRef.current.frequency.rampTo(0.1 + intensity * 2, 1);

    // Stop previous loop
    if (loopRef.current) {
      loopRef.current.dispose();
    }

    const chords: Record<string, string[]> = {
      flow: ["C3", "G3", "C4", "E4"], // Consonant
      fluctuating: ["C3", "F3", "A#3", "E4"], // Slightly uneasy
      vortex: ["C3", "C#3", "F#3", "A#3"], // Dissonant/Critical
    };

    const currentChord = intensity > 0.7 ? chords.vortex : intensity > 0.4 ? chords.fluctuating : chords.flow;
    const tempo = intensity > 0.7 ? "4n" : intensity > 0.4 ? "2n" : "1n";

    Tone.Transport.bpm.value = 60 + (intensity * 40);

    const loop = new Tone.Loop((time) => {
      // Play a random note from the chord
      const note = currentChord[Math.floor(Math.random() * currentChord.length)];
      synthRef.current?.triggerAttackRelease(note, "2n", time, 0.2 + (intensity * 0.3));
    }, tempo);

    loop.start(0);
    loopRef.current = loop;

  }, [intensity, isPlaying]);

  const toggleAudio = async () => {
    if (isPlaying) {
      Tone.Transport.stop();
      if (lfoRef.current) lfoRef.current.stop();
      setIsPlaying(false);
    } else {
      await Tone.start();
      await reverbRef.current?.generate();
      Tone.Transport.start();
      if (lfoRef.current) lfoRef.current.start();
      setIsPlaying(true);
    }
  };

  return { isPlaying, toggleAudio };
}
