export interface ProfileData {
  userName: string
  isProfilingComplete: boolean
  answers: Record<string, string>
  primaryGoal: string
  riskTolerance: string
  investmentHorizon: string
  monthlyInvestment: string
  investorType: string
  geminiSummary: string
  projectionName: string
  optimistic: number
  expected: number
  projectionReasoning: string
  growthVector: string
  drawdownGuard: string
  hedgeEfficiency: string
  recommendations: Array<{
    product: string
    section: string
    title: string
    description: string
    matchScore: number
    url: string
    tags: string[]
    geminiReason: string
  }>
}

const STORAGE_KEY = "obsidian_profile"

export const defaultProfile: ProfileData = {
  userName: "",
  isProfilingComplete: false,
  answers: {},
  primaryGoal: "",
  riskTolerance: "",
  investmentHorizon: "",
  monthlyInvestment: "",
  investorType: "",
  geminiSummary: "",
  projectionName: "Growth Alpha",
  optimistic: 42,
  expected: 28,
  projectionReasoning: "",
  growthVector: "",
  drawdownGuard: "",
  hedgeEfficiency: "",
  recommendations: []
}

export function saveProfile(data: Partial<ProfileData>) {
  const existing = loadProfile()
  const updated = { ...existing, ...data }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function loadProfile(): ProfileData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultProfile }
    const parsed = JSON.parse(raw);
    return { ...defaultProfile, ...parsed, recommendations: parsed.recommendations || [] }
  } catch {
    return { ...defaultProfile }
  }
}

export function clearProfile() {
  localStorage.removeItem(STORAGE_KEY)
}
