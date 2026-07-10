/**
 * DEPRECATED — removido em julho/2026.
 *
 * O embed oficial do GuildQuality (script + iframe externos) foi retirado para
 * não prejudicar a performance do site (JS de terceiros + layout shift).
 * A seção GuildQualityReviews agora mostra apenas números estáticos, atualizados
 * manualmente quando necessário. O Google segue via API (dado de primeira parte).
 *
 * Mantido apenas como stub para não quebrar imports antigos. Não renderiza nada.
 */
export function GuildQualityEmbed() {
  return null;
}
