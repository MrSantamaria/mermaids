graph TD
  %% External UI Service
  subgraph UI_Service["UI Service"]
    ui["User Interface"]
  end

  %% New System (Docker Compose-based)
  subgraph New_System["New System (Docker Compose)"]
    %% RHEL Instance 1: Coordinator
    subgraph RHEL_Instance_1["RHEL Instance 1 (Coordinator)"]
      newCoordinatorDC["Coordinator (Queue: X, charging per usage of CPU)"]
    end

    %% RHEL Instance 2: Worker Service (Docker Compose)
    subgraph RHEL_Instance_2["RHEL Instance 2 (Docker Compose)"]
      workerService2["Worker Service (Round Robin)"]
      worker2a["Worker (Busy, charging per usage of CPU)"]
      worker2b["Worker (Idle - Container not up)"]
      worker2c["Worker (Idle - Container not up)"]
    end

    %% RHEL Instance 3: Worker Service (Docker Compose)
    subgraph RHEL_Instance_3["RHEL Instance 3 (Docker Compose)"]
      workerService3["Worker Service (Round Robin)"]
      worker3a["Worker (Busy, charging per usage of CPU)"]
      worker3b["Worker (Busy, charging per usage of CPU)"]
      worker3c["Worker (Busy, charging per usage of CPU)"]
    end
  end

  %% Original System (System Services)
  subgraph Original_System["Original System (System Services)"]
    %% RHEL Instance 6: Additional Coordinator
    subgraph RHEL_Instance_6["RHEL Instance 6 (Coordinator)"]
      origCoordinatorSS["Coordinator (System Service, Queue: X, charging per usage of CPU)"]
    end

    %% RHEL Instance 7: Single Worker
    subgraph RHEL_Instance_7["RHEL Instance 7 (Worker)"]
      origWorker1["Worker (System Service, charging per usage of CPU)"]
    end

    %% RHEL Instance 8: Single Worker
    subgraph RHEL_Instance_8["RHEL Instance 8 (Worker)"]
      origWorker2["Worker (System Service, charging per usage of CPU)"]
    end
  end

  %% HMS System (Shared by both groups)
  subgraph HMS_System["HMS System (System Service)"]
    hms["HMS (charging per usage of CPU)"]
  end

  %% AWS On-Site component
  subgraph AWS_On_Site["AWS On-Site"]
    S3["HMS_S3_Bucket"]
  end

  %% Databases group
  subgraph Databases["Databases"]
    db1["SEP_DB"]
    db2["Cache_SvcDB"]
    db3["HMS_DB"]
  end

  %% Connections for the New System (Docker Compose-based)
  ui --> newCoordinatorDC
  newCoordinatorDC --> workerService2
  newCoordinatorDC --> workerService3

  workerService2 --> worker2a
  workerService2 --> worker2b
  workerService2 --> worker2c

  workerService3 --> worker3a
  workerService3 --> worker3b
  workerService3 --> worker3c

  newCoordinatorDC --> db1
  newCoordinatorDC --> db2
  newCoordinatorDC --> db3
  newCoordinatorDC --> S3

  %% Connections for the Original System (System Services)
  ui --> origCoordinatorSS
  origCoordinatorSS --> origWorker1
  origCoordinatorSS --> origWorker2

  origCoordinatorSS --> db1
  origCoordinatorSS --> db2
  origCoordinatorSS --> db3
  origCoordinatorSS --> S3

  %% Both Systems share the HMS instance
  newCoordinatorDC --> hms
  origCoordinatorSS --> hms

  %% HMS communication with its Database
  hms --> db3
