

import React, { useState, useEffect } from 'react';
import { BackIcon, BrainwaveIcon, SolfeggioIcon, RifeIcon, NoiseIcon, SpatialAudioIcon, CelestialIcon, AngelIcon, LungsIcon, UserCircleIcon, AtomIcon, PathfinderIcon } from './BohoIcons';
import { CategoryId, ColorTheme } from '../types';

const ResearchLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <li><a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">{children}</a></li>
);

const ScienceSection: React.FC<{
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  color: string;
  researchLinks?: React.ReactNode;
}> = ({ id, title, icon, children, color, researchLinks }) => (
  <div id={id} className="p-6 rounded-2xl border scroll-mt-20 dark:bg-slate-800/20" style={{background: `linear-gradient(145deg, ${color}25, transparent 70%)`, borderColor: `${color}50`}}>
    <div className="flex items-center gap-4 mb-3">
      {icon}
      <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-dark-text-primary">{title}</h3>
    </div>
    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-dark-text-secondary leading-relaxed space-y-3">
      {children}
    </div>
    {researchLinks && (
      <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-700/80">
        <h4 className="font-bold text-slate-700 dark:text-dark-text-primary">Supporting Research</h4>
        <ul className="list-disc list-inside text-sm mt-2 space-y-1 prose prose-slate dark:prose-invert max-w-none">
            {researchLinks}
        </ul>
      </div>
    )}
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
        <h2 className="text-4xl font-display font-bold text-slate-800 dark:text-dark-text-primary">The Science Behind The Sound</h2>
        <p className="mt-2 text-slate-600 dark:text-dark-text-secondary max-w-2xl mx-auto">
          This application utilizes established principles of neuro-acoustics and bio-resonance to help you guide your mind and body into desired states. Here’s a brief overview of the core technologies.
        </p>
      </div>

      <div className="space-y-6">
        <ScienceSection 
          id="elements" 
          title="The Harmonic Table of the 81 Elements" 
          icon={<AtomIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color={categories.elements.colors.primary}
        >
          <p className="font-semibold">A Resonant Bridge Between Matter and Frequency</p>
          <p>
            The Harmonic Elements Chart is a vibrational mapping of the first 81 elements in the periodic table, each aligned with a distinct sound frequency. Unlike traditional chemical classifications, this system approaches the periodic table through the lens of harmonic resonance—exploring how the elemental building blocks of nature express themselves not only as matter, but as coherent vibrational patterns.
          </p>
          <p>
            Each frequency assigned to an element is derived from a harmonic model that integrates principles of wave interference, musical tuning systems (notably A = 432 Hz), and resonant field theory. These values are not arbitrary—they are rooted in observable frequency intervals that correspond to qualities such as coherence, stability, expansion, or regeneration. In this way, Hydrogen is not just the lightest element—it becomes the spark of pure potential at 111 Hz, while Carbon, the basis of all organic life, anchors structural stability at 162 Hz.
          </p>
          <p>
            While the chart is not aligned with conventional spectroscopy or quantum chemistry, it offers a complementary language—one that frames matter as music, and atoms as notes in a larger universal symphony. This approach draws inspiration from sacred geometry, Pythagorean harmonics, and recent work in cymatics, quantum acoustics, and biofield science.
          </p>
          <p>
            Rather than presenting frequencies as diagnostic or therapeutic claims, the Harmonic Elements Chart invites exploration. It allows users to resonate with the “tonal essence” of each element, whether through meditative listening, sound layering, or visual contemplation of cymatic patterns. Each element becomes a portal—not just to scientific inquiry, but to a felt experience of the vibrational order behind physical form.
          </p>
        </ScienceSection>
        
        <ScienceSection 
          id="codex"
          title="The Mod-24 Codex Wheel"
          icon={<PathfinderIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />}
          color={categories.codex.colors.primary}
          researchLinks={
            <>
              <ResearchLink href="https://www.academia.edu/130330346/Dedicated_to_Kirby_D_Cooper_Codex_of_Resonant_Harmonics_Volumes_I_VI_with_Appendices?utm_source=chatgpt.com">
                Codex of Resonant Harmonics (Volumes I-VI)
              </ResearchLink>
            </>
          }
        >
          <p>
            The Codex Harmonics wheel is a living map of 24 harmonic positions — each linked to a musical note, its exact frequency, and a symbolic meaning.
          </p>
          <p>
            Rooted in numerology, sacred geometry, and the musical mathematics of the Circle of Fifths, each position (or Modulus) reveals:
          </p>
          <ul>
            <li>Your note — tuned to A4 = 432 Hz for natural resonance.</li>
            <li>Your archetype — a symbolic theme like Unity, Expansion, or Illumination.</li>
            <li>Your journeys — pre‑designed tone sequences (Triads, Arpeggios, Scales) that create resonant pathways for meditation, focus, or deep listening.</li>
          </ul>
          <p>
            When you interact with the wheel, you’re not just playing tones — you’re exploring a system where sound, number, and meaning converge. Each tone is a doorway into your own inner landscape, expressed in the universal language of frequency.
          </p>
          <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 italic my-4">
            <p>The Codex wheel isn't just generating tones—it’s echoing the memory of you, written in the universal language of frequency.</p>
            <p>Each harmonic—your Core Blueprint, Yearly Modulation, Monthly Overlay, and Daily Resonance—is a note in your ongoing composition. Together, they create a resonant field that reflects both your current state and your inherent design. When played in sequence, they tell a story across time. When layered, they become a harmonic field—a living chord of your soul's geometry.</p>
            <p>You’re not just listening to sound.<br />You’re listening to the architecture of your becoming.</p>
          </blockquote>
        </ScienceSection>

        <ScienceSection 
          id="habit-tracking" 
          title="The Power of Habit Tracking" 
          icon={<UserCircleIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color="#96CDB0"
          researchLinks={
            <>
              <ResearchLink href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3505409/">Habit formation and change (PubMed)</ResearchLink>
              <ResearchLink href="https://jamesclear.com/habit-tracker">The Power of Habit Trackers - by James Clear</ResearchLink>
            </>
          }
        >
          <p>
            Consistently tracking your habits is a cornerstone of effective biohacking. The simple act of logging your daily activities provides powerful psychological benefits and actionable data to optimize your life.
          </p>
          <ul>
            <li>
              <strong>Makes the Invisible Visible:</strong> Tracking reveals patterns and correlations you might otherwise miss. Our analytics tools help you see how your habits influence each other, empowering you to make data-driven decisions about your wellness.
            </li>
            <li>
              <strong>Dopamine Feedback Loop:</strong> Each time you log a completed habit, your brain releases a small amount of dopamine, the "reward" neurotransmitter. This positive reinforcement strengthens the neural pathways associated with that habit, making it easier to repeat.
            </li>
            <li>
              <strong>Builds Momentum:</strong> Seeing a chain of successful days on a heatmap or chart creates a powerful sense of accomplishment. This motivates you to "not break the chain," fostering consistency and long-term change.
            </li>
          </ul>
        </ScienceSection>

        <ScienceSection 
          id="brainwaves" 
          title="Neural Entrainment & Binaural Beats" 
          icon={<BrainwaveIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color={categories.brainwaves.colors.primary}
          researchLinks={
            <>
              <ResearchLink href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6165862/">Auditory Beat Stimulation and its Effects on Cognition and Mood States (PubMed)</ResearchLink>
              <ResearchLink href="https://www.medicalnewstoday.com/articles/320019">What are binaural beats and how do they work?</ResearchLink>
              <ResearchLink href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7683678/">40Hz Gamma Stimulation for Brain Health (PubMed)</ResearchLink>
              <ResearchLink href="https://news.mit.edu/2023/40-hz-vibrations-reduce-alzheimers-pathology-symptoms-mouse-models-0605">MIT News on 40 Hz Vibrations for Alzheimer's</ResearchLink>
              <ResearchLink href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5836039/">Effect of Music on the Gut-Brain Axis (PubMed)</ResearchLink>
            </>
          }
        >
          <p>
            Neural entrainment is a process where the brain's electrical activity (brainwaves) synchronizes its frequency to the rhythm of external sensory stimuli, such as sound. Binaural beats are a powerful method to achieve this.
          </p>
          <ul>
            <li>
              <strong>How it works:</strong> Two slightly different frequencies are presented to each ear (e.g., 100 Hz in the left, 110 Hz in the right). Your brain, in processing these two signals, perceives a third "phantom" frequency—the mathematical difference between the two (in this case, 10 Hz).
            </li>
            <li>
              <strong>The Effect:</strong> This phantom beat is not audible but is registered by the brain. Through a process called the "frequency-following response," your brainwaves begin to align with this new frequency. By targeting specific brainwave states (like Alpha for relaxation or Gamma for focus), we can gently guide your mind into that desired state.
            </li>
            <li>
              <strong>Requirement:</strong> Headphones are essential for binaural beats to work, as each ear must receive its distinct frequency.
            </li>
          </ul>
        </ScienceSection>

        <ScienceSection 
          id="solfeggio" 
          title="Solfeggio Frequencies" 
          icon={<SolfeggioIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color={categories.solfeggio.colors.primary}
          researchLinks={
            <>
              <ResearchLink href="https://www.forbes.com/councils/forbestechcouncil/2022/12/21/think-youve-heard-it-all-new-research-into-the-science-of-sound-proves-otherwise/">Forbes: New Research Into The Science Of Sound</ResearchLink>
              <ResearchLink href="https://www.researchgate.net/publication/333852911_Sound_Healing_using_Solfeggio_Frequencies">Sound Healing using Solfeggio Frequencies (ResearchGate)</ResearchLink>
            </>
          }
        >
          <p>
            The Solfeggio frequencies are a set of ancient tones believed to possess specific spiritual and healing properties. These frequencies are often used in meditative practices to support energetic balance and cellular harmony. Each tone is thought to correspond to a specific aspect of physical, mental, or spiritual well-being, such as 528 Hz for transformation and cellular repair, or 396 Hz for releasing fear.
          </p>
        </ScienceSection>
        
        <ScienceSection 
          id="rife" 
          title="Rife Bio-Resonance" 
          icon={<RifeIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color={categories.rife.colors.primary}
        >
           <p>
            Bio-resonance is a concept based on the idea that every organism and cell has its own natural resonant frequency. Rife frequencies, developed by Dr. Royal Rife, are specific tones intended to match the natural frequencies of the body's systems.
          </p>
          <ul>
            <li>
              <strong>The Principle:</strong> When a part of the body is "out of tune" due to stress or imbalance, its resonant frequency may be altered. By re-introducing the correct, healthy frequency through sound, it's believed that the body can be encouraged to return to its natural state of homeostatic balance.
            </li>
            <li>
              <strong>Application:</strong> These protocols are used to support the body's innate ability to maintain wellness and equilibrium.
            </li>
          </ul>
        </ScienceSection>
        
        <ScienceSection 
          id="noise" 
          title="Acoustic Environments (Colored Noise)" 
          icon={<NoiseIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color={categories.noise.colors.primary}
          researchLinks={
            <>
              <ResearchLink href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7986458/">The effects of background noise on cognitive performance (PubMed)</ResearchLink>
            </>
          }
        >
            <p>
                Colored noises are steady, random signals that cover the entire sound spectrum. Different "colors" like White, Pink, and Brown Noise emphasize different parts of the spectrum, which has varying psychological effects.
            </p>
            <ul>
                <li><strong>White Noise:</strong> Contains all frequencies at equal intensity. It's excellent for masking distracting background sounds, making it ideal for focus or sleep in noisy environments.</li>
                <li><strong>Pink Noise:</strong> Has more power in the lower frequencies, making it sound "softer" or more balanced than white noise, similar to steady rain or wind. It's often considered more relaxing and is used for sustained focus.</li>
                <li><strong>Brown Noise:</strong> Has even more energy at the lowest frequencies, creating a deep, rumbling sound like a distant waterfall. It's highly effective for deep relaxation and blocking out intrusive, low-frequency noises.</li>
            </ul>
        </ScienceSection>

        <ScienceSection 
          id="schumann" 
          title="The Schumann Resonance & Planetary Harmonics" 
          icon={<CelestialIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color={categories.celestial.colors.primary}
          researchLinks={
            <>
              <ResearchLink href="https://pubmed.ncbi.nlm.nih.gov/38318288/">Effects of Schumann resonance on human psychophysiological states (PubMed Review)</ResearchLink>
            </>
          }
        >
          <p>
            This category is based on the concept of cosmic resonance. The Schumann Resonance is the fundamental "heartbeat" of the Earth (approx. 7.83 Hz). Planetary Harmonics are frequencies derived from the orbital periods of celestial bodies, translated into the audible range.
          </p>
          <ul>
            <li>
              <strong>Biological Significance:</strong> Life on Earth has evolved for millennia within the Schumann resonant field. It's believed that connecting with this frequency has a grounding and stabilizing effect on our biological systems, as our own Alpha/Theta brainwaves operate in this range.
            </li>
            <li>
              <strong>Archetypal Energy:</strong> Listening to a planet's orbital frequency is a meditative practice designed to help you align with the archetypal energy that planet represents (e.g., Mars for drive, Venus for harmony).
            </li>
          </ul>
        </ScienceSection>
        
        <ScienceSection id="angel" title="Ascension Codes" icon={<AngelIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} color={categories.angel.colors.primary}>
           <p>
            The frequencies in this category, often referred to as "Angel Numbers" in numerology, are used in meditative practices to connect with higher states of awareness and specific spiritual concepts. Each sequence is believed to carry a unique vibrational message.
          </p>
          <ul>
            <li>
              <strong>Example:</strong> The 444 Hz frequency is associated with protection and environmental shielding, while 999 Hz represents completion and the end of a cycle.
            </li>
            <li>
              <strong>Application:</strong> These protocols are intended for spiritual exploration, helping to clear energetic channels and elevate one's consciousness.
            </li>
          </ul>
        </ScienceSection>

        <ScienceSection 
          id="breathing" 
          title="Breathwork & Coherent Breathing" 
          icon={<LungsIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color="#96CDB0"
          researchLinks={
            <>
              <ResearchLink href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5455070/">The Effect of Coherent Breathing (PubMed)</ResearchLink>
              <ResearchLink href="https://www.health.harvard.edu/mind-and-mood/relaxation-techniques-breath-control-helps-quell-errant-stress-response">Harvard Health on Breath Control</ResearchLink>
            </>
          }
        >
          <p>
            Controlled breathing, or breathwork, is one of the most direct ways to influence your autonomic nervous system (ANS), which controls functions like heart rate, digestion, and stress response. By consciously changing the rhythm and depth of your breath, you can shift from a "fight-or-flight" (sympathetic) state to a "rest-and-digest" (parasympathetic) state.
          </p>
          <ul>
            <li>
              <strong>Box Breathing:</strong> A simple technique of equal-length inhales, holds, and exhales. It's excellent for calming the nervous system and improving focus under pressure.
            </li>
            <li>
              <strong>4-7-8 Relax:</strong> Developed by Dr. Andrew Weil, this pattern involves a longer exhale, which powerfully activates the parasympathetic nervous system, making it highly effective for reducing anxiety and preparing for sleep.
            </li>
            <li>
              <strong>Coherent Breathing:</strong> Involves breathing at a rate of around 5.5 breaths per minute. This rhythm is believed to create "coherence" in the body, where heart rate, blood pressure, and brainwaves synchronize, leading to a state of calm, balanced alertness.
            </li>
          </ul>
        </ScienceSection>

        <ScienceSection 
          id="immersive" 
          title="Immersive Audio (8D Panning)" 
          icon={<SpatialAudioIcon className="w-10 h-10 text-slate-700 dark:text-dark-text-secondary" />} 
          color="#96CDB0"
          researchLinks={
            <>
              <ResearchLink href="https://en.wikipedia.org/wiki/Sound_localization">Sound Localization (Wikipedia)</ResearchLink>
            </>
          }
        >
           <p>
            Immersive or "8D" audio is an audio processing effect that creates the illusion of sound moving and rotating around the listener's head. It transforms a standard stereo track into a three-dimensional soundscape.
          </p>
          <ul>
            <li>
              <strong>How it works:</strong> This is achieved using a Web Audio API node called a `PannerNode` with an "HRTF" (Head-Related Transfer Function) model. We use low-frequency oscillators (LFOs) to continuously and smoothly change the virtual X, Y, and Z coordinates of the sound source, making it seem as though it's orbiting you.
            </li>
            <li>
              <strong>The Benefit:</strong> This creates a highly engaging and immersive listening experience. It can make meditation more profound by removing the sense of the sound source being "in your ears" and instead placing it in the space around you. It can also be deeply relaxing, as the moving sound can be a gentle focus point for the mind. Headphones are required to experience the full 3D effect.
            </li>
          </ul>
        </ScienceSection>
      </div>
    </div>
  );
};