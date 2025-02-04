import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toZonedTime } from "date-fns-tz"

const TIMEZONE = "America/Sao_Paulo"

/**
 * Converte uma data UTC para o timezone do Brasil e formata para exibição relativa
 */
export function formatRelativeDate(date: Date | string): string {
    // Converte a string para Date se necessário
    const utcDate = typeof date === "string" ? new Date(date) : date

    // Converte para o timezone do Brasil
    const brazilDate = toZonedTime(utcDate, TIMEZONE)

    return formatDistanceToNow(brazilDate, {
        locale: ptBR,
        addSuffix: true,
    })
}
