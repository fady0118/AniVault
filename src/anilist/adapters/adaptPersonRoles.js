import { formatCharacterRoles } from "./adaptPerson"

export function adaptPersonRoles(data) {
    const voiceRoles = formatCharacterRoles(data)
    return voiceRoles
}