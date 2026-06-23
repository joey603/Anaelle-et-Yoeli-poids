import type { EncouragementMessage, Profile } from '../types'

const lostMessages = [
  'Bravo ! Chaque gramme compte, continue comme ça ! 💪',
  'Super progression ! Tu es sur la bonne voie ! 🌟',
  'Magnifique ! Ton effort porte ses fruits ! 🎯',
  'Quelle belle avancée ! On est fiers de toi ! ✨',
  'Excellent ! La constance paie toujours ! 🔥',
  'Tu fonds comme un glaçon au soleil ! Continue ! 🧊',
  'Même la balance est impressionnée. Respect ! 😎',
  'On dirait que quelqu\'un a volé des kilos à quelqu\'un... c\'est toi le voleur ! 🦹',
  'Alerte : tu deviens plus léger(ère) qu\'un SMS sans pièce jointe ! 📱',
  'La gravité commence à te lâcher. Bon signe ! 🌍',
  'Champions league de la perte de poids, tu montes en puissance ! ⚽',
  'Ton futur pantalon te remercie déjà ! 👖',
  'À ce rythme, bientôt tu flotteras... non, on reste sérieux, bravo ! 🎈',
  'C\'est pas de la magie, c\'est du travail. Et ça marche ! 🪄',
]

const gainedMessages = [
  'Pas de panique, les fluctuations sont tout à fait normales. On continue ensemble ! 🌱',
  'Ce n\'est qu\'un petit écart, demain est un nouveau jour ! 💫',
  'Le chemin n\'est jamais parfaitement linéaire. Tu es courageux(se) de continuer ! 🤗',
  'Un rebondissement, pas une défaite. Reprenons le cap ensemble ! 🧭',
  'Respire, analyse, et avance. Tu as déjà prouvé que tu peux le faire ! 🌸',
  'Oups, la balance a mangé un cookie en trop... pas grave ! 🍪',
  'Ce n\'est pas de la graisse, c\'est de l\'expérience qui s\'accumule ! 📚',
  'Même les montagnes russes montent parfois. On redescend ensemble ! 🎢',
  'La balance ment parfois. Ou alors elle a besoin de lunettes. 🤓',
  'Un petit détour gastronomique ? On reprend la route ! 🗺️',
  'Ton corps fait une pause stratégique. Rien de grave ! ⏸️',
  'Ce n\'est pas une prise de poids, c\'est du carburant pour la prochaine victoire ! ⛽',
  'Hier c\'était shabbat, aujourd\'hui c\'est sport. Équilibre ! ⚖️',
  'La balance a peut-être confondu les kilos avec les grammes... ou pas. On continue ! 😅',
]

const stableMessages = [
  'Poids stable — la régularité est une victoire en soi ! ⚖️',
  'Maintien réussi ! Parfois tenir bon, c\'est déjà gagner ! 🏆',
  'Stabilité = discipline. Continue sur cette lancée ! 💎',
]

const firstEntryMessages = [
  'Première pesée enregistrée ! Le voyage commence maintenant ! 🚀',
  'C\'est parti ! Chaque pas compte vers ton objectif ! 🌈',
]

const goalReachedMessages = [
  'OBJECTIF ATTEINT ! Félicitations, tu l\'as fait ! 🎉🏆',
  'Incroyable ! Tu as atteint ton objectif ! Quelle fierté ! 🥳',
]

const almostThereMessages = [
  'Plus que quelques kilos ! Tu y es presque ! 🎯',
  'La ligne d\'arrivée est en vue ! Courage ! 🏁',
]

function pickRandom(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)]
}

export function getEncouragementMessage(
  profile: Profile,
  newWeight: number,
  change: number | null,
): EncouragementMessage {
  const remaining = Math.abs(newWeight - profile.goalWeight)
  const isGoalReached =
    profile.goalWeight < profile.initialWeight
      ? newWeight <= profile.goalWeight
      : newWeight >= profile.goalWeight

  if (isGoalReached) {
    return { text: pickRandom(goalReachedMessages), type: 'celebration' }
  }

  if (change === null) {
    return { text: pickRandom(firstEntryMessages), type: 'neutral' }
  }

  if (remaining <= 2 && remaining > 0) {
    return { text: pickRandom(almostThereMessages), type: 'success' }
  }

  if (change < 0) {
    const lost = Math.abs(change).toFixed(1)
    return {
      text: `${pickRandom(lostMessages)} (${lost} kg depuis la dernière pesée)`,
      type: 'success',
    }
  }

  if (change > 0) {
    const gained = change.toFixed(1)
    return {
      text: `${pickRandom(gainedMessages)} (+${gained} kg depuis la dernière pesée)`,
      type: 'encourage',
    }
  }

  return { text: pickRandom(stableMessages), type: 'neutral' }
}
