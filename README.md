# 🌐 GEN Data — Intelligent Data Warehouse & Analytics SaaS

**GEN Data** is a modern **Data Warehouse & Analytics SaaS platform** designed for teams that want to seamlessly **ingest, model, orchestrate, and analyze data at scale**.  

It bridges the gap between raw datasets and actionable insights by combining:
- **AI-assisted schema modeling**
- **Automated transformations (dbt + Airflow)**
- **Scalable processing (Spark)**
- **Fine-grained access control**
- **Self-service dashboards (auto/custom/Power BI)**

---

## 🚀 Why GEN Data?

Traditional data warehouse projects are **time-consuming, error-prone, and lack flexibility**:  
- Schema design is manual and brittle.  
- Engineers are bottlenecks for transformations.  
- Access control is coarse-grained.  
- Business teams wait for IT to build dashboards.  

**GEN Data solves this by**:
- Automating schema generation & evolution with **AI suggestions**.  
- Enabling **owners** to approve/modify models before deployment.  
- Allowing **employees** to work with data safely through **department-based permissions**.  
- Embedding **Power BI dashboards** for a no-code analytics experience.  

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Owner["👑 Owner Workflow"]
        A[Signup / Login]
        B[Upload Data (CSV / Parquet / SQL)]
        C[Generate Schema]
        D[Edit Schema]
        E[AI Enhancements <br/> (Confirm Required)]
        F[Confirm DW Schema]
        G[Manage Dashboards <br/> (Auto / Custom)]
        H[Manage Departments & Access]
    end

    subgraph Employee["👤 Employee Workflow"]
        I[Login with Department ID]
        J[View Allowed Columns]
        K[Create Auto/Custom Dashboards <br/> (Private)]
    end

    A --> B --> C --> D --> E --> F --> G --> H
    H -->|Department ID Assigned| I --> J --> K
