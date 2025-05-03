# DrPepe.ai: Your Jarvis for Longevity

DrPepe.ai is an AI-driven personal longevity agent—your Jarvis for healthspan and lifespan optimization. By ingesting wearable data, diagnostics, and a peer-reviewed knowledge base, DrPepe.ai delivers evidence-backed recommendations, automates supplement and pharmaceutical protocols, and continuously adapts to your evolving biology.


## 📋 Project Overview

### Immortality Framework

* **Central Hub**: The DrPepe.ai agent orchestrates data flow and decision-making.
* **Knowledge Engine**: A community-curated, peer-reviewed longevity database powering recommendations.
* **Inputs**:

* **Wearable Data**: Real-time biofeedback (HRV, sleep, activity).
* **Diagnostics**: 100+ biomarkers, biological age assessments, health risk profiles.
* **Outputs**:

* **Supplement & Pharma Automation**: Curated, evidence-backed supplements and DTC pharmaceuticals delivered via affiliate links and licensed provider workflows.
* **Feedback Loop**: Continuous data ingestion and periodic diagnostics drive dynamic protocol adjustments.

## 🏗 Architecture

```
[Wearables] → DrPepe.ai Agent → [Immortality DB]
      ↳ Diagnostics →          ↖︎
                ↳ Recommendations → [Supplements / Pharma API]
```

1. **Frontend**: Next.js, React, Tailwind CSS
2. **API Layer**: Next.js API Routes + OpenAI Assistants API
3. **Data Integrations**: Webhooks and SDKs for wearables & diagnostics
4. **Persistence**: MongoDB (user profiles, history), Immortality DB for research

## 🔧 Key Components

* `app/components/Chat.tsx` — Chat UI with streaming & function calling
* `app/components/WearableSync.tsx` — Wearable data ingestion
* `app/components/DiagnosticsViewer.tsx` — Biomarker report rendering
* `pages/api/ai-agent/*` — Endpoints for assistant threads and actions
* `lib/immortality-db.js` — DB client & query helpers

## 🛠 Features

* **Conversational Longevity Advisor**: Ask questions and get evidence-based responses.
* **Automated Protocols**: Schedule and manage supplement deliveries and DTC prescriptions.
* **Real-time Feedback**: Adjust protocols based on incoming wearable and diagnostic data.
* **Pay-per-Query Billing**: Lightweight billing system for on-demand AI interactions.


## 🤝 Contributing

We welcome contributions! Please fork the repo, create a feature branch, and submit a PR. Check the [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.

---

Happy optimizing your longevity with DrPepe.ai! 🧬
