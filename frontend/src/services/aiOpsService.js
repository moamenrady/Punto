// aiOpsService.js
//
// Service layer for the IT Management Agentic RAG API
// (https://ahmedradwan.up.railway.app/docs).
//
// Routes are grouped by domain so consumers only import what they need:
//   - SystemAdmin      -> /health, /api/rebuild-db, /api/ai/trigger-stock-check
//   - AiFeatures       -> /chat, /api/ai/assign-task
//   - TicketManagement -> /api/tickets/create, /api/work/complete
//
// Every method returns the parsed response body on success and throws a
// normalized Error (with a readable .message) on failure, so callers can
// just try/catch without inspecting axios internals.

import axios from "axios";

const AI_API_BASE_URL =
  import.meta.env.VITE_AI_API_URL || "https://ahmedradwan.up.railway.app";

const aiClient = axios.create({
  baseURL: AI_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

/**
 * Normalizes axios/FastAPI errors into a single Error with a readable
 * message, and re-throws so calling code can rely on a consistent shape.
 */
function handleError(error, fallbackMessage) {
  if (error.response) {
    // FastAPI validation errors (422) come back as { detail: [{ msg, loc, type }] }
    const detail = error.response.data?.detail;
    let message = fallbackMessage;

    if (Array.isArray(detail)) {
      message = detail.map((d) => d.msg).join(", ") || fallbackMessage;
    } else if (typeof detail === "string") {
      message = detail;
    } else if (error.response.data?.message) {
      message = error.response.data.message;
    }

    const err = new Error(message);
    err.status = error.response.status;
    throw err;
  }

  if (error.request) {
    throw new Error(
      "No response from the AI service. It may be waking up (Railway cold start) — please try again in a moment."
    );
  }

  throw new Error(error.message || fallbackMessage);
}

// ── System Admin ──────────────────────────────────────────────────────────
// Health checks, vector DB maintenance, and stock-check automation.
export const SystemAdmin = {
  checkHealth: async () => {
    try {
      const { data } = await aiClient.get("/health");
      return data;
    } catch (err) {
      handleError(err, "Health check failed");
    }
  },

  rebuildVectorDb: async () => {
    try {
      const { data } = await aiClient.post("/api/rebuild-db");
      return data;
    } catch (err) {
      handleError(err, "Failed to rebuild the vector database");
    }
  },

  triggerStockCheck: async () => {
    try {
      const { data } = await aiClient.post("/api/ai/trigger-stock-check");
      return data;
    } catch (err) {
      handleError(err, "Failed to trigger the stock check");
    }
  },
};

// ── AI Features ────────────────────────────────────────────────────────────
// Conversational assistant + AI-driven task assignment.
export const AiFeatures = {
  /**
   * @param {Object} params
   * @param {string} params.query
   * @param {string} params.userRole
   * @param {string} params.userId
   * @param {string} params.companyId
   * @param {Array<Object>} [params.chatHistory] - array of { role, content } (stringified) turns
   */
  sendChatMessage: async ({ query, userRole, userId, companyId, chatHistory = [] }) => {
    try {
      const { data } = await aiClient.post("/chat", {
        query,
        user_role: userRole,
        user_id: userId,
        company_id: companyId,
        chat_history: chatHistory,
      });
      return data;
    } catch (err) {
      handleError(err, "The AI assistant failed to respond");
    }
  },

  /**
   * @param {Object} params
   * @param {string} params.taskId
   * @param {string} params.teamId
   */
  assignTask: async ({ taskId, teamId }) => {
    try {
      const { data } = await aiClient.post("/api/ai/assign-task", {
        task_id: taskId,
        team_id: teamId,
      });
      return data;
    } catch (err) {
      handleError(err, "Failed to assign the task");
    }
  },
};

// ── Ticket Management ───────────────────────────────────────────────────────
// Ticket creation + work completion (both drive the same RAG/knowledge base).
export const TicketManagement = {
  /**
   * @param {Object} params
   * @param {string} params.title
   * @param {string} params.description
   * @param {string} params.priority
   * @param {string} params.createdById
   */
  createTicket: async ({ title, description, priority, createdById }) => {
    try {
      const { data } = await aiClient.post("/api/tickets/create", {
        title,
        description,
        priority,
        created_by_id: createdById,
      });
      return data;
    } catch (err) {
      handleError(err, "Failed to create the ticket");
    }
  },

  /**
   * @param {Object} params
   * @param {string} params.workId
   * @param {string} params.workType
   * @param {string} params.userId
   */
  completeWork: async ({ workId, workType, userId }) => {
    try {
      const { data } = await aiClient.post("/api/work/complete", {
        work_id: workId,
        work_type: workType,
        user_id: userId,
      });
      return data;
    } catch (err) {
      handleError(err, "Failed to mark the work item as complete");
    }
  },
};

export default { SystemAdmin, AiFeatures, TicketManagement };
