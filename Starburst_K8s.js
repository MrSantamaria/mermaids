graph TD
  %% GitOps and Helm Management Subgraph
  subgraph Management["GitOps & Helm Management"]
    gitops["GitOps Repository"]
    helm["Helm Charts"]
  end

  %% External UI Service that feeds the Coordinators
  subgraph UI_Service["UI Service"]
    ui["User Interface"]
  end

  %% Kubernetes Cluster Grouping
  subgraph Kubernetes_Cluster["Kubernetes Cluster"]
    
    %% Master Node (with kubelet)
    subgraph RHEL_Instance_5["RHEL Instance 5 (Kubernetes Master)"]
      master["Master (charging per usage of CPU)"]
    end

    %% RHEL Instance for Coordinators with vertical scaling (2 namespaces)
    subgraph RHEL_Instance_1["RHEL Instance 1 (Kubelet)"]
      subgraph Namespace_A["Namespace A"]
        coordinatorA["Coordinator A (Queue: 1 item, charging per usage of CPU)"]
      end
      subgraph Namespace_B["Namespace B"]
        coordinatorB["Coordinator B (Queue: 10 items, charging per usage of CPU)"]
      end
    end

    %% RHEL Instance 2 for Worker nodes horizontally scaled into 3 namespaces (for Coordinator A)
    subgraph RHEL_Instance_2["RHEL Instance 2 (Kubelet)"]
      subgraph Worker_NS1["Namespace 1"]
        worker2a["Worker (Busy, charging per usage of CPU)"]
      end
      subgraph Worker_NS2["Namespace 2"]
        worker2b["Worker (Idle - Pod not up)"]
      end
      subgraph Worker_NS3["Namespace 3"]
        worker2c["Worker (Idle - Pod not up)"]
      end
    end

    %% RHEL Instance 3 for Worker nodes horizontally scaled into 3 namespaces (for Coordinator B)
    subgraph RHEL_Instance_3["RHEL Instance 3 (Kubelet)"]
      subgraph Worker_NS1_3["Namespace 1"]
        worker3a["Worker (Busy, charging per usage of CPU)"]
      end
      subgraph Worker_NS2_3["Namespace 2"]
        worker3b["Worker (Busy, charging per usage of CPU)"]
      end
      subgraph Worker_NS3_3["Namespace 3"]
        worker3c["Worker (Busy, charging per usage of CPU)"]
      end
    end

    %% RHEL Instance for HMS remains unchanged
    subgraph RHEL_Instance_4["RHEL Instance 4 (Kubelet)"]
      hms["HMS (charging per usage of CPU)"]
    end
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

  %% UI Service feeds both Coordinators
  ui --> coordinatorA
  ui --> coordinatorB

  %% Communication: Coordinator A communicates ONLY with Workers on RHEL Instance 2
  coordinatorA --> worker2a
  coordinatorA --> worker2b
  coordinatorA --> worker2c

  %% Communication: Coordinator B communicates ONLY with Workers on RHEL Instance 3
  coordinatorB --> worker3a
  coordinatorB --> worker3b
  coordinatorB --> worker3c

  %% Both Coordinators communicate with Databases and AWS S3
  coordinatorA --> db1
  coordinatorA --> db2
  coordinatorA --> db3
  coordinatorA --> S3

  coordinatorB --> db1
  coordinatorB --> db2
  coordinatorB --> db3
  coordinatorB --> S3

  %% HMS communication
  hms --> db3

  %% Management/control flow from the Master to each pod/node (dashed lines)
  master --- coordinatorA
  master --- coordinatorB
  master --- worker2a
  master --- worker2b
  master --- worker2c
  master --- worker3a
  master --- worker3b
  master --- worker3c
  master --- hms

  %% Link the Management subgraph to the Kubernetes Cluster to indicate that scaling is managed via GitOps/Helm
  gitops --- Kubernetes_Cluster
  helm --- Kubernetes_Cluster
