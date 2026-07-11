const mongoose = require("mongoose");

// Counter model
const Counter = require("./Counter");

// ===============================
// 🔥 Allowed status transitions
// ===============================
const allowedTransitions = {
  open: ["in_progress"],
  in_progress: ["resolved"],
  resolved: ["closed"],
  closed: [],
};

const ticketSchema = new mongoose.Schema(
  {
    // ===============================
    // 🔥 CUSTOM ID
    // ===============================
    custom_id: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: [true, "A ticket must have a name"],
    },

    description: {
      type: String,
      required: [true, "A ticket must have a description"],
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },

    // ===============================
    // 🔥 CATEGORY
    // ===============================
    category: {
      type: String,
      enum: [
        "Network issues",
        "Hardware",
        "Software",
        "Account access",
      ],
      required: true,
    },

    status_changed_at: {
      type: Date,
      default: null,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    assign_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },

    // ===============================
    // 🔥 ATTACHMENTS
    // ===============================
    attachments: [
      {
        data: Buffer,
        contentType: String,
        filename: String,
      },
    ],

    // ===============================
    // 🔥 HISTORY
    // ===============================
    history: [
      {
        action: String,
        from: mongoose.Schema.Types.Mixed,
        to: mongoose.Schema.Types.Mixed,

        changed_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        changed_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//
// ===============================
// 🔥 AUTO CUSTOM ID
// ===============================
ticketSchema.pre("save", async function () {
  if (this.custom_id) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "ticket" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.custom_id = `tkt_${counter.seq}`;
});

//
// ===============================
// 🔥 KEEP ORIGINAL VALUES
// ===============================
ticketSchema.pre("init", function (doc) {
  this._originalStatus = doc.status;
  this._originalAssign = doc.assign_to;
});

//
// ===============================
// 🔥 UPDATE LOGIC
// ===============================
ticketSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return;

  const finalUpdate = {};

  // ===============================
  // 🔥 STATUS CHANGE
  // ===============================
  if (update.status && update.status !== doc.status) {
    const from = doc.status;
    const to = update.status;

    if (!allowedTransitions[from]?.includes(to)) {
      throw new Error(`Invalid status transition from ${from} to ${to}`);
    }

    finalUpdate.status_changed_at = new Date();

    finalUpdate.$push = {
      ...(finalUpdate.$push || {}),
      history: {
        action: "status_change",
        from,
        to,
        changed_by: this.options._changedBy,
        changed_at: new Date(),
      },
    };
  }

  // ===============================
  // 🔥 ASSIGN CHANGE
  // ===============================
  if (
    update.assign_to &&
    update.assign_to?.toString() !== doc.assign_to?.toString()
  ) {
    finalUpdate.$push = {
      ...(finalUpdate.$push || {}),
      history: {
        action: "assign_change",
        from: doc.assign_to,
        to: update.assign_to,
        changed_by: this.options._changedBy,
        changed_at: new Date(),
      },
    };
  }

  this.setUpdate({
    ...update,
    ...finalUpdate,
  });
});

//
// ===============================
// 🔥 POPULATE
// ===============================
ticketSchema.pre(/^find/, function () {
  this.populate("created_by", "name email role photo")
    .populate("assign_to", "name email role photo")
    .populate("history.changed_by", "name email role photo");
});

module.exports = mongoose.model("Ticket", ticketSchema);