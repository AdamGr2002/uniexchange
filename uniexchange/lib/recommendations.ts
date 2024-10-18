import { openDb } from './db'

export async function getRecommendations(userId: string) {
  const db = await openDb()

  // Get the user's recent interactions
  const userInteractions = await db.all(`
    SELECT material_id, interaction_type
    FROM user_interactions
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 10
  `, userId)

  // Get the subjects and universities the user has interacted with
  const interactedSubjects = new Set()
  const interactedUniversities = new Set()

  for (const interaction of userInteractions) {
    const material = await db.get('SELECT subject, university FROM materials WHERE id = ?', interaction.material_id)
    if (material) {
      interactedSubjects.add(material.subject)
      interactedUniversities.add(material.university)
    }
  }

  // Get recommendations based on the user's interactions
  const recommendations = await db.all(`
    SELECT m.*
    FROM materials m
    LEFT JOIN user_interactions ui ON m.id = ui.material_id AND ui.user_id = ?
    WHERE (m.subject IN (${Array.from(interactedSubjects).map(() => '?').join(',')})
    OR m.university IN (${Array.from(interactedUniversities).map(() => '?').join(',')}))
    AND ui.id IS NULL
    GROUP BY m.id
    ORDER BY RANDOM()
    LIMIT 10
  `, [userId, ...Array.from(interactedSubjects), ...Array.from(interactedUniversities)])

  return recommendations
}