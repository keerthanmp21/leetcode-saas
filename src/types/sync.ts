export interface SyncSuccessResponse {
  totalFetched: number
  newProblems: number
  syncedAt: string
}

export interface SyncErrorResponse {
  error: string
  settingsRequired?: boolean
}
