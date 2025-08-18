

import React, { useState, useEffect } from 'react';
import { BackIcon, BrainwaveIcon, SolfeggioIcon, RifeIcon, NoiseIcon, SpatialAudioIcon, CelestialIcon, LungsIcon, UserCircleIcon, AtomIcon, PathfinderIcon, InfoIcon, TreeOfLifeIcon } from './BohoIcons';
import { CategoryId, ColorTheme } from '../types';

const ScienceSection: React.FC<{
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  color: string;
}> = ({ id, title, icon, children, color }) => (
  <div id={id} className="p-6 rounded-2xl border scroll-mt-20 dark:bg-slate-800/20" style={{background: `linear-gradient(145deg, ${color}25, transparent 70%)`, borderColor: `${color}50`}}>
    <div className="flex items-center gap-4 mb-3">
      {icon}
      <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-dark-text-primary">{title}</h3>
    </div>
    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-dark-text-secondary leading-relaxed space-y-3">
      {children}
    </div>
  </div>
);

interface SciencePageProps {
    categories: Record<CategoryId, { title: string; description:string; colors: ColorTheme; }>;
}

export const SciencePage: React.FC<SciencePageProps> = ({ categories }) => {
    const [backLink, setBackLink] = useState('#/settings');
    const [backText, setBackText] = useState('Back to Settings');

    useEffect(() => {
        const returnTo = sessionStorage.getItem('returnTo');
        if (returnTo) {
            setBackLink(returnTo);
            if (returnTo.includes('/category/')) {
                setBackText('Back to Category');
            } else if (returnTo.includes('/player/') || returnTo.includes('/session/')) {
                setBackText('Back to Player');
            } else {
                setBackText('Back');
            }
        }
    }, []);

    const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = backLink;
        if (sessionStorage.getItem('returnTo')) {
            sessionStorage.removeItem('returnTo');
        }
    };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
      <a href={backLink} onClick={handleBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-dark-text-muted dark:hover:text-dark-text-primary transition-colors">
        <BackIcon className="w-6 h-6" />
        <span className="font-semibold">{backText}</span>
      </a>

      <div className="text-center">
        <h2 className="text-4xl font-display font-bold text-slate-800 dark:text-dark-text-primary">The Science Behind the Sound</h2>
        <p className="mt-2 text-slate-600 dark:text-dark-text-secondary max-w-2xl mx-auto">
          This app blends established neuro-acoustics with exploratory vibrational models. We’re careful to distinguish between what is well-supported, what is emerging, and what is offered for contemplative use.
        </p>
      </div>

      <div className="space-y-6">
        <ScienceSection 
          id="elements" 
          title="The Harmonic Table of the 81 Elements (Exploratory)" 
          icon={<AtomIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color={categories.elements.colors.primary}
        >
            <p><strong>A Resonant Bridge Between Matter and Frequency</strong></p>
            <p>The Harmonic Elements Chart maps the first 81 elements to distinct tones as a contemplative framework. Rather than chemical spectroscopy, it uses harmonic relationships (integer ratios, tuning systems such as A4 = 432 Hz), interference patterns, and cymatic inspiration to invite a different question: if matter is rhythmic, how might it “feel” as sound?</p>
            <p>Assignments are symbolic mappings, not chemical measurements.</p>
            <p>Frequencies are derived from a harmonic model (octaves, ratios, consonance) to represent qualities like coherence, stability, expansion, or regeneration.</p>
            <p>Example language: “Hydrogen is treated as a spark frequency (e.g., 111 Hz) in this model,” rather than “Hydrogen is 111 Hz.”</p>
            <p>This chart is for meditation, layering, and visual contemplation—a way to experience the idea that atoms can be approached like notes in a symphony, not a diagnostic tool.</p>
        </ScienceSection>
        
        <ScienceSection 
          id="codex"
          title="The Mod-24 Codex Wheel (Exploratory → Applied)"
          icon={<PathfinderIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />}
          color={categories.codex.colors.primary}
        >
            <p>A living map of 24 harmonic positions linked to musical notes, A4 = 432 Hz, and archetypes.</p>
            <p>You’ll see:</p>
            <ul>
                <li>Your note (birth-based or resonance-tested)</li>
                <li>Your archetype (e.g., Unity, Expansion, Illumination)</li>
                <li>Journeys (Triads, Arpeggios, Scales) for meditation, focus, or insight</li>
            </ul>
            <p>When you interact, you’re exploring sound + number + meaning. Your Core Blueprint, Yearly Modulation, Monthly Overlay, and Daily Resonance can be sequenced (a story across time) or layered (a living chord).</p>
            <p>We frame these as self-inquiry tools, not medical instruments.</p>
        </ScienceSection>

         <ScienceSection 
          id="kabbalah"
          title="The Kabbalistic Sound Codex (Exploratory/Contemplative)"
          icon={<TreeOfLifeIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />}
          color={categories.kabbalah.colors.primary}
        >
            <p>This framework maps esoteric concepts from Jewish mysticism to sound frequencies for contemplative use. It is not based on empirical science but on symbolic correspondence and is offered for personal spiritual exploration.</p>
            <ul>
                <li><strong>The Tree of Life (Etz Chaim):</strong> The 10 Sefirot (e.g., Keter, Chokhmah) are treated as energetic archetypes, each assigned a frequency or sound quality to represent concepts like 'Wisdom' or 'Strength'.</li>
                <li><strong>The Hebrew Alphabet:</strong> Each of the 22 letters is viewed as a vibrational archetype. Frequencies are assigned based on their elemental (Air, Water, Fire), planetary, or zodiacal associations as described in texts like the Sefer Yetzirah.</li>
            </ul>
        </ScienceSection>

        <ScienceSection 
          id="brainwaves" 
          title="Neural Entrainment & Binaural Beats (Empirical / Emerging)" 
          icon={<BrainwaveIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color={categories.brainwaves.colors.primary}
        >
            <p><strong>What it is:</strong> When rhythmic stimuli lead brain activity to synchronize toward the stimulus frequency (frequency-following response).</p>
            <p><strong>Binaural beats:</strong> Present two nearby tones to each ear (e.g., 100 Hz left, 110 Hz right) → the brain perceives a 10 Hz beat.</p>
            <p><strong>Notes</strong></p>
            <ul>
                <li>Headphones required (distinct signals per ear).</li>
                <li>Entrainment effects are best-supported in alpha/theta ranges for relaxation/attention; results vary by person and context.</li>
                <li>Isonchronic pulses (single-channel amplitude modulation) can be used when headphones aren’t available.</li>
            </ul>
        </ScienceSection>
        
        <ScienceSection 
          id="schumann" 
          title="The Schumann Resonance & Planetary Harmonics (Emerging / Exploratory)" 
          icon={<CelestialIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color={categories.celestial.colors.primary}
        >
            <p>Schumann resonance (~7.83 Hz) is a natural EM resonance of Earth’s cavity. Some users find sub-audio audible mappings (octave-scaled into hearing range) subjectively grounding.</p>
            <p>Planetary harmonics translate orbital periods into audible octaves to explore archetypal moods (e.g., Mars = drive; Venus = harmony). These are meditative metaphors, not astrophysical tones.</p>
        </ScienceSection>

        <ScienceSection 
          id="solfeggio" 
          title="Solfeggio Frequencies (Exploratory)" 
          icon={<SolfeggioIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color={categories.solfeggio.colors.primary}
        >
          <p>
            A historical/modern set of tones (e.g., 396 Hz, 528 Hz) used in spiritual practice. While widely used experientially, these do not carry consensus clinical claims. We present them as intentional sound practices rather than medical interventions.
          </p>
        </ScienceSection>
        
        <ScienceSection 
          id="rife" 
          title="Rife Bio-Resonance (Exploratory)" 
          icon={<RifeIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color={categories.rife.colors.primary}
        >
           <p>
            Proposes that systems have natural resonant frequencies that can be mirrored with sound. This is a historical/alternative paradigm and not part of mainstream medical science. We include Rife-style sets for optional, personal exploration only.
          </p>
        </ScienceSection>
        
        <ScienceSection 
          id="noise" 
          title="Colored Noise & Acoustic Environments (Empirical / Applied)" 
          icon={<NoiseIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color={categories.noise.colors.primary}
        >
            <p><strong>White noise</strong> (equal energy per frequency) → masks distractions, helps focus/sleep for some.</p>
            <p><strong>Pink noise</strong> (more low-end) → smoother, often preferred for long listening.</p>
            <p><strong>Brown noise</strong> (strong low-end) → deeply relaxing, effective at masking low-frequency intrusions.</p>
        </ScienceSection>

        <ScienceSection 
          id="breathing" 
          title="Breathwork & Coherent Breathing (Empirical / Applied)" 
          icon={<LungsIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color="#96CDB0"
        >
            <p>Breath is a direct lever on the autonomic nervous system.</p>
            <ul>
                <li><strong>Box breathing (4-4-4-4):</strong> stabilizes attention under pressure.</li>
                <li><strong>4-7-8:</strong> elongates exhale → parasympathetic shift, useful before sleep.</li>
                <li><strong>Coherent breathing (~5–6 breaths/min):</strong> supports heart-rate variability and calm alertness.</li>
            </ul>
            <p>Our player syncs isochronic pulses / 8D panning with breath cues for an embodied experience.</p>
        </ScienceSection>

        <ScienceSection 
          id="immersive" 
          title="Immersive Audio (8D Panning) (Applied)" 
          icon={<SpatialAudioIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color="#96CDB0"
        >
           <p>
            Using HRTF (head-related transfer functions), we move sounds in virtual space to create an “around-you” sensation. It’s not a medical technique, but a powerful attentional anchor that many find relaxing and immersive. Headphones recommended.
          </p>
        </ScienceSection>

        <ScienceSection 
          id="research" 
          title="Supporting Research (How we cite)" 
          icon={<InfoIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color="#96CDB0"
        >
            <p>We separate peer-reviewed evidence from conceptual or historical sources. In-app, you’ll see tags:</p>
            <ul>
                <li>Peer-reviewed (link to PubMed/DOI)</li>
                <li>White paper / review</li>
                <li>Historical / practitioner</li>
                <li>Exploratory model</li>
            </ul>
            <p>We avoid medical claims and mark sections like Solfeggio, Rife, and 81 Elements as Exploratory. Where research is mixed or early (e.g., 40 Hz gamma), we say so.</p>
        </ScienceSection>

        <ScienceSection 
          id="safety" 
          title="Safety & Use" 
          icon={<UserCircleIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color="#96CDB0"
        >
            <ul>
                <li>This app is not a medical device and does not diagnose, treat, or cure conditions.</li>
                <li>Headphones required for binaural beats; optional for other modes.</li>
                <li>If you are sensitive to sound/light, start low and short.</li>
                <li>Do not use while driving or operating machinery.</li>
            </ul>
        </ScienceSection>
      </div>
    </div>
  );
};