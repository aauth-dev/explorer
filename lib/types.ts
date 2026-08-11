// ─── Participants ─────────────────────────────────────────────────────────────

export type ParticipantType =
  | "agent"
  | "resource"
  | "person-server"
  | "access-server"
  | "user";

export interface Participant {
  id: string;
  label: string;
  type: ParticipantType;
  port?: number;
  metadata_url?: string;
  jwks_url?: string;
}

// ─── Tokens ───────────────────────────────────────────────────────────────────

export interface DecodedToken {
  name: string;         // e.g. "Resource Token", "Auth Token"
  typ: string;          // e.g. "aa-resource+jwt"
  raw: string;          // Full JWT string
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature_b64: string;
}

// ─── HTTP Signatures ──────────────────────────────────────────────────────────

export interface SignatureDetails {
  scheme: string;              // hwk | jwks_uri | jwt
  signature_base: string;      // The exact signature base string
  signature_input: string;     // Signature-Input header value
  signature_key: string;       // Signature-Key header value
  covered_components: string[];
}

// ─── Protocol Steps ──────────────────────────────────────────────────────────

export interface ProtocolStep {
  step: number;
  from: string;                        // participant id
  to: string;                          // participant id
  label: string;                       // short description for the arrow
  method: string;
  url: string;
  request_headers: Record<string, string>;
  request_body?: unknown;
  response_status: number;
  response_headers: Record<string, string>;
  response_body?: unknown;
  tokens: DecodedToken[];
  signature?: SignatureDetails;
  r3_document?: R3Document;
  annotations: string[];               // explanatory notes / spec references
  is_response?: boolean;               // true for response arrows
}

export interface TokenFlowEvent {
  step: number;
  participant: string;
  label: string;
  kind: "issued" | "forwarded" | "returned" | "presented";
}

export interface TokenFlow {
  token: string;
  label: string;
  tokenType?: string;
  accent?: "resource" | "auth" | "agent";
  events: TokenFlowEvent[];
}

export interface DeferredTimelineEvent {
  step: number;
  status: number;
  label: string;
  detail: string;
}

export interface DeferredTimeline {
  title: string;
  events: DeferredTimelineEvent[];
}

export interface MissionTool {
  name: string;
  description: string;
}

export interface MissionBlobData {
  title: string;
  description: string;
  /** Blob member `description` — the approved Markdown scope */
  markdown: string;
  /** Blob member — HTTPS URL of the entity that approved the mission (always the PS today) */
  approver: string;
  /** Blob member — the agent identifier the mission belongs to */
  agent: string;
  /** Blob member — ISO 8601; ensures the s256 is globally unique */
  approved_at: string;
  /** Optional blob member — after this the PS treats the mission as terminated */
  expires_at?: string;
  /** Optional blob member — tools usable without a per-call permission request */
  approved_tools: MissionTool[];
  /** Optional blob member — resources the person pre-approved for this mission */
  approved_resources?: string[];
  /** The `mission` member of the approval response: the blob base64url-encoded, unpadded */
  encoded?: string;
  /** The mission identifier: BASE64URL(SHA-256(blob bytes)). Not a blob member. */
  s256: string;
  /**
   * From the approval response, not the blob, and not covered by the digest —
   * it says whether the PS can currently reach the person.
   */
  capabilities?: string[];
}

export interface S256ChainLink {
  label: string;
  source: string;
  s256: string;
  detail: string;
}

// ─── R3 (Rich Resource Requests) ─────────────────────────────────────────────

export interface R3Display {
  summary: string;
  implications?: string;
  data_accessed?: string;
  irreversible?: string;
  /** Per-call proposals only: Markdown detail for the person's approval decision */
  detail?: string;
}

export interface R3Document {
  vocabulary: string;
  operations: Record<string, unknown>[];
  /** Per-call proposals only: the concrete parameters of the one call being proposed */
  parameters?: Record<string, unknown>;
  display?: R3Display;
}

// ─── Scenarios ────────────────────────────────────────────────────────────────

export type ScenarioCategory = "signing" | "access" | "missions" | "advanced" | "bootstrap" | "r3";

export interface ScenarioVariant {
  description: string;
  participants: Participant[];
  steps: ProtocolStep[];
  token_flow?: TokenFlow[];
  deferred_timeline?: DeferredTimeline;
  mission_blob?: MissionBlobData;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  spec_section?: string;
  category: ScenarioCategory;
  demo_phase?: number;
  participants: Participant[];
  steps: ProtocolStep[];
  token_flow?: TokenFlow[];
  deferred_timeline?: DeferredTimeline;
  mission_blob?: MissionBlobData;
  s256_chain?: S256ChainLink[];
  /** Optional interactive/user-approval variant of this scenario */
  interactive?: ScenarioVariant;
  /** Override the variant toggle button labels. Defaults to "Autonomous" / "With User Approval". */
  variant_labels?: { autonomous: string; interactive: string };
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  phase?: number;
  description?: string;
}

export interface NavSection {
  title: string;
  icon: string;
  items: NavItem[];
}
