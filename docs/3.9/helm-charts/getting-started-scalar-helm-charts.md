# Getting Started with Scalar Helm Charts

This document explains how to get started with Scalar Helm Chart on a Kubernetes cluster as a test environment. Here, we assume that you already have a Mac or Linux environment for testing. We use **Minikube** in this document, but the steps we will show should work in any Kubernetes cluster.

## Tools

We will use the following tools for testing.  

1. minikube (If you use other Kubernetes distributions, minikube is not necessary.)
1. kubectl
1. Helm
1. cfssl / cfssljson

## Step 1. Install tools

First, you need to install the following tools used in this guide.

1. Install the `minikube` command according to the [minikube documentation](https://minikube.sigs.k8s.io/docs/start/)

1. Install the `kubectl` command according to the [Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

1. Install the `helm` command according to the [Helm documentation](https://helm.sh/docs/intro/install/)

1. Install the `cfssl` and `cfssljson` according to the [CFSSL documentation](https://github.com/cloudflare/cfssl)

{% capture notice--info %}
**Note**

You need to install the `cfssl` and `cfssljson` command when following these getting started guides:

* [ScalarDB Cluster with TLS](getting-started-scalardb-cluster-tls.md)
* [ScalarDL Ledger and Auditor with TLS (Auditor mode)](getting-started-scalardl-auditor-tls.md)
* [ScalarDL Ledger (Ledger only)](getting-started-scalardl-ledger.md)
* [ScalarDL Ledger and Auditor (Auditor mode)](getting-started-scalardl-auditor.md)

{% endcapture %}

<div class="notice--info">{{ notice--info | markdownify }}</div>

## Step 2. Start minikube with docker driver (Optional / If you use minikube)

1. Start minikube.
   ```console
   minikube start
   ```

1. Check the status of the minikube and pods.
   ```console
   kubectl get pod -A
   ```
   [Command execution result]
   ```console
   NAMESPACE     NAME                               READY   STATUS    RESTARTS      AGE
   kube-system   coredns-64897985d-lbsfr            1/1     Running   1 (20h ago)   21h
   kube-system   etcd-minikube                      1/1     Running   1 (20h ago)   21h
   kube-system   kube-apiserver-minikube            1/1     Running   1 (20h ago)   21h
   kube-system   kube-controller-manager-minikube   1/1     Running   1 (20h ago)   21h
   kube-system   kube-proxy-gsl6j                   1/1     Running   1 (20h ago)   21h
   kube-system   kube-scheduler-minikube            1/1     Running   1 (20h ago)   21h
   kube-system   storage-provisioner                1/1     Running   2 (19s ago)   21h
   ```
   If the minikube starts properly, you can see some pods are **Running** in the kube-system namespace.

## Step 3. 

After the Kubernetes cluster starts, you can try each Scalar Helm Charts on it. Please refer to the following documents for more details.

* [ScalarDB Cluster with TLS](getting-started-scalardb-cluster-tls.md)
* [ScalarDB Analytics with PostgreSQL](getting-started-scalardb-analytics-postgresql.md)
* [ScalarDL Ledger and Auditor with TLS (Auditor mode)](getting-started-scalardl-auditor-tls.md)
* [ScalarDL Ledger (Ledger only)](getting-started-scalardl-ledger.md)
* [ScalarDL Ledger and Auditor (Auditor mode)](getting-started-scalardl-auditor.md)
* [Monitoring using Prometheus Operator](getting-started-monitoring.md)
  * [Logging using Loki Stack](getting-started-logging.md)
  * [Scalar Manager](getting-started-scalar-manager.md)
* [[Deprecated] ScalarDB Server](getting-started-scalardb.md)
