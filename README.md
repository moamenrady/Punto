```mermaid
flowchart TD

    %% Owner side
    A[Owner Signup / Login]
    B[Upload Data (CSV / Parquet / SQL)]
    C[Select Data Domain]
    D[Generate Data Warehouse Schema]
    E[Edit Schema (Add/Delete/Modify Columns)]
    F[AI Enhancement (Owner must Confirm)]
    G[Confirm Data Warehouse Schema]
    H[Dashboard Options:\n- Auto (Standard)\n- Custom (Columns & Charts)]
    I[Manage Departments (Assign Access)]

    %% Employee side
    J[Employee Login with Department ID]
    K[Employee Sees Allowed Columns]
    L[Employee Dashboard Options:\n- Auto (Standard)\n- Custom (Private Dashboards)]

    %% Flow connections
    A --> B --> C --> D --> E --> F --> G --> H --> I
    I -->|Department ID Assigned| J --> K --> L
```
