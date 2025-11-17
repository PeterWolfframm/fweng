<script setup>
import WelcomeItem from './WelcomeItem.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')

const welcomeItems = [
  {
    id: 1,
    icon: '🎤🌙💔',
    heading: 'The Aesthetic of Melancholy',
    content: 'Exploring the dark, cinematic aesthetic that defines Lana Del Rey\'s artistic identity and how it has influenced modern music culture.'
  },
  {
    id: 2,
    icon: '🎤🌙💔',
    heading: 'Ultraviolence Album Deep Dive',
    content: 'A comprehensive analysis of her third studio album, examining themes of love, toxicity, and vulnerability throughout its haunting tracks.'
  },
  {
    id: 3,
    icon: '🎤🌙💔',
    heading: 'Cinematic Storytelling in Music',
    content: 'How Lana Del Rey crafts narratives through her lyrics, transforming personal experiences into universal stories of longing and heartbreak.'
  },
  {
    id: 4,
    icon: '🎤🌙💔',
    heading: 'Cola Dreams and Vintage Vibes',
    content: 'The vintage Americana influence in her music videos and how she reimagines old Hollywood aesthetic for contemporary audiences.'
  },
  {
    id: 5,
    icon: '🎤🌙💔',
    heading: 'The Birth of Lana Del Rey',
    content: 'Tracing her musical journey from Lizzy Grant to becoming one of the most influential artists of the 2010s.'
  },
  {
    id: 6,
    icon: '🎤🌙💔',
    heading: 'Paradise as Escapism',
    content: 'Examining the Paradise album as a sonic escape and how it explores themes of desire, wealth, and the American Dream.'
  },
  {
    id: 7,
    icon: '🎤🌙💔',
    heading: 'Sadness as an Art Form',
    content: 'A philosophical exploration of how Lana transformed melancholia into a celebrated and relatable form of artistic expression.'
  },
  {
    id: 8,
    icon: '🎤🌙💔',
    heading: 'Neon and Noir: Visual Identity',
    content: 'The color palettes, cinematography, and visual themes that make her aesthetic instantly recognizable across all mediums.'
  },
  {
    id: 9,
    icon: '🎤🌙💔',
    heading: 'Behind the Honeymoon Phase',
    content: 'Analyzing how relationship dynamics appear throughout her discography and their evolution from early to later work.'
  },
  {
    id: 10,
    icon: '🎤🌙💔',
    heading: 'Reclaiming the Dark Feminine',
    content: 'Her influence on reclaiming sadness and vulnerability as powerful expressions of strength in the dark feminine movement.'
  },
  {
    id: 11,
    icon: '🎤🌙💔',
    heading: 'Old Hollywood Influence',
    content: 'The starlets, film noir, and classic cinema that inspire her artistic choices and musical direction.'
  },
  {
    id: 12,
    icon: '🎤🌙💔',
    heading: 'Lana\'s Evolution Through The Years',
    content: 'Tracking her career progression from experimental beginnings to mainstream success and artistic maturation.'
  },
  {
    id: 13,
    icon: '🎤🌙💔',
    heading: 'The Art of Longing',
    content: 'Discovering how desire and yearning become central emotional threads throughout her most powerful compositions.'
  },
  {
    id: 14,
    icon: '✈️💨🔥',
    heading: 'The Physics of Flight',
    content: 'Understanding aerodynamics, lift, drag, and thrust that enable fighter jets to achieve incredible speeds and maneuverability.'
  },
  {
    id: 15,
    icon: '✈️💨🔥',
    heading: 'Modern Air Combat Tactics',
    content: 'Exploring contemporary dogfighting strategies, missile systems, and aerial engagement protocols used by military pilots worldwide.'
  },
  {
    id: 16,
    icon: '✈️💨🔥',
    heading: 'History of the F-16 Fighting Falcon',
    content: 'The legendary aircraft that revolutionized fighter jet design and remains one of the most produced combat aircraft ever.'
  },
  {
    id: 17,
    icon: '✈️💨🔥',
    heading: 'Breaking the Sound Barrier',
    content: 'The science and history behind supersonic flight, from Chuck Yeager\'s historic achievement to modern capabilities.'
  },
  {
    id: 18,
    icon: '✈️💨🔥',
    heading: 'Elite Pilot Training Programs',
    content: 'Inside the rigorous selection, training, and preparation processes that transform ordinary individuals into elite combat aviators.'
  },
  {
    id: 19,
    icon: '✈️💨🔥',
    heading: 'Stealth Technology Explained',
    content: 'How radar-evading technology works and why stealth aircraft represent the cutting edge of modern military aviation.'
  },
  {
    id: 20,
    icon: '✈️💨🔥',
    heading: 'The Sound Barrier: Fact vs Myth',
    content: 'Debunking common misconceptions about supersonic flight and exploring the actual physics involved.'
  },
  {
    id: 21,
    icon: '✈️💨🔥',
    heading: 'Air Shows Around the World',
    content: 'Spectacular demonstrations of fighter jet precision flying, aerobatic displays, and international aviation showcases.'
  },
  {
    id: 22,
    icon: '✈️💨🔥',
    heading: 'Engineering Marvels',
    content: 'The incredible technical innovations, materials science, and engineering that go into creating modern combat aircraft.'
  },
  {
    id: 23,
    icon: '✈️💨🔥',
    heading: 'Historic Air Battles',
    content: 'Exploring pivotal aerial engagements throughout history that changed warfare and defined generations of aircraft.'
  },
  {
    id: 24,
    icon: '✈️💨🔥',
    heading: 'The Future of Aviation',
    content: 'Next-generation fighter jets, AI integration, hypersonic technology, and the evolution of aerial combat.'
  },
  {
    id: 25,
    icon: '✈️💨🔥',
    heading: 'Precision and Control',
    content: 'The extraordinary pilot skills required to operate fighter jets at extreme speeds and perform complex aerial maneuvers.'
  },
  {
    id: 26,
    icon: '✈️💨🔥',
    heading: 'NATO Air Operations',
    content: 'How allied nations coordinate military aviation, share resources, and conduct joint air defense operations.'
  },
  {
    id: 27,
    icon: '🚴🛣️🌄',
    heading: 'Mountains on Two Wheels',
    content: 'Tackling challenging alpine terrain and learning advanced climbing techniques for conquering steep mountain passes.'
  },
  {
    id: 28,
    icon: '🚴🛣️🌄',
    heading: 'The Perfect Bike Setup',
    content: 'Essential equipment, gear ratios, bike sizing, and customization tips to maximize comfort and performance on long rides.'
  },
  {
    id: 29,
    icon: '🚴🛣️🌄',
    heading: 'Training for Century Rides',
    content: 'Progressive training plans, nutrition strategies, and mental preparation for completing challenging 100-mile cycling adventures.'
  },
  {
    id: 30,
    icon: '🚴🛣️🌄',
    heading: 'Cycling Routes Through Europe',
    content: 'Discovering scenic European cycling paths, from the Alps to Mediterranean coastlines, with detailed route recommendations.'
  },
  {
    id: 31,
    icon: '🚴🛣️🌄',
    heading: 'Nutrition for Long-Distance Cyclists',
    content: 'Fueling strategies, hydration protocols, and energy management techniques for sustained endurance on extended rides.'
  },
  {
    id: 32,
    icon: '🚴🛣️🌄',
    heading: 'Mental Toughness on the Road',
    content: 'Psychological strategies for overcoming fatigue, self-doubt, and physical challenges during demanding cycling events.'
  },
  {
    id: 33,
    icon: '🚴🛣️🌄',
    heading: 'Group Rides and Community',
    content: 'The social aspects of cycling culture, finding local riding groups, and building lasting connections through shared passion.'
  },
  {
    id: 34,
    icon: '🚴🛣️🌄',
    heading: 'Bike Maintenance Basics',
    content: 'Essential maintenance routines, gear adjustment, brake tuning, and keeping your bike in peak riding condition.'
  },
  {
    id: 35,
    icon: '🚴🛣️🌄',
    heading: 'Climbing Techniques',
    content: 'Advanced strategies for mastering hills, optimizing cadence on climbs, and developing superior climbing power.'
  },
  {
    id: 36,
    icon: '🚴🛣️🌄',
    heading: 'Cadence and Efficiency',
    content: 'Understanding pedal rhythm, optimizing leg strength, and achieving maximum efficiency at various speeds and terrains.'
  },
  {
    id: 37,
    icon: '🚴🛣️🌄',
    heading: 'Road Safety Tips',
    content: 'Sharing the streets safely, visibility gear, defensive riding tactics, and protecting yourself from traffic hazards.'
  },
  {
    id: 38,
    icon: '🚴🛣️🌄',
    heading: 'Urban Cycling Adventures',
    content: 'Exploring cities by bike, discovering hidden routes, and experiencing urban environments from a cyclist\'s perspective.'
  },
  {
    id: 39,
    icon: '🚴🛣️🌄',
    heading: 'Rest Days and Recovery',
    content: 'Balancing training intensity with adequate recovery, cross-training methods, and injury prevention strategies.'
  },
  {
    id: 40,
    icon: '🚴🛣️🌄',
    heading: 'Choosing Your First Road Bike',
    content: 'A beginner\'s guide to selecting the right road bike, understanding frame sizes, and making informed equipment choices.'
  }
]
</script>

<template>
  <WelcomeItem v-for="item in welcomeItems" :key="item.id">
    <template #icon>{{ item.icon }}</template>
    <template #heading>{{ item.heading }}</template>
    <div v-html="item.content"></div>
  </WelcomeItem>
</template>
