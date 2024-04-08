# ScalarDL Benchmarking Tools

This tutorial describes how to run benchmarking tools for ScalarDL. Benchmarking is helpful for evaluating how a system performs against a set of standards.

## Benchmark workloads

- SmallBank
- TPC-C (New-Order and Payment transactions only)
- YCSB (Workloads A, C, and F)

## Prerequisites

- One of the following Java Development Kits (JDKs):
  - [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) LTS version 8
  - [OpenJDK](https://openjdk.org/install/) LTS version 8
- Gradle
- [Kelpie](https://github.com/scalar-labs/kelpie)
  - Kelpie is a framework for performing end-to-end testing, such as system benchmarking and verification. Get the latest version from [Kelpie Releases](https://github.com/scalar-labs/kelpie/releases), and unzip the archive file.

:::note

Currently, only JDK 8 can be used when running the benchmarking tools.

:::

### Set up your environment

The benchmarking tools require the following:

- A client to execute benchmarking
- A target Ledger server
- A target Auditor server (optional)

Set up the above components, and then configure the properties for client, Ledger, and Auditor (optional) according to the following getting started guides:

- [Ledger-only configuration](../getting-started.md)
- [Ledger and Auditor configuration](../getting-started-auditor.md)

:::note

You don't need to download the client SDK and manually register your certificate. As described later in this tutorial, the benchmarking tools will automatically register the required certificate and contracts.

:::

## Set up the benchmarking tools

The following sections describe how to set up the benchmarking tools.

### Clone the ScalarDL benchmarks repository

Open **Terminal**, then clone the ScalarDL benchmarks repository by running the following command:

```console
$ git clone https://github.com/scalar-labs/scalardl-benchmarks
```

Then, go to the directory that contains the benchmarking files by running the following command:

```console
$ cd scalardl-benchmarks
```

### Build the tools

To build the benchmarking tools, run the following command:

```console
$ ./gradlew shadowJar
```

### Prepare a benchmarking configuration file

To run a benchmark, you must prepare a benchmarking configuration file. The configuration file requires at least the locations of the workload modules to run and the client configuration.

The following is an example configuration for running the TPC-C benchmark. The configurations under `client_config` should match the [benchmarking environment that you previously set up](#set-up-your-environment).

:::note

Alternatively, instead of specifying each client configuration item in the `.toml` file, you can use the ScalarDL client properties file. If `config_file` is specified (commented out below), all other configurations under `client_config` will be ignored.

:::

```toml
[modules]
[modules.preprocessor]
name = "com.scalar.dl.benchmarks.tpcc.TpccLoader"
path = "./build/libs/scalardl-benchmarks-all.jar"
[modules.processor]
name = "com.scalar.dl.benchmarks.tpcc.TpccBench"
path = "./build/libs/scalardl-benchmarks-all.jar"
[modules.postprocessor]
name = "com.scalar.dl.benchmarks.tpcc.TpccReporter"
path = "./build/libs/scalardl-benchmarks-all.jar"

[client_config]
config_file = "/<PATH_TO>/client.properties"
#ledger_host = "localhost"
#auditor_host = "localhost"
#auditor_enabled = "true"
#cert_holder_id = "test_holder"
#certificate = "/<PATH_TO>/client.pem"
#private_key = "/<PATH_TO>/client-key.pem"
```

You can define parameters to pass to modules in the configuration file. For details, see the sample configuration files below and available parameters in [Common parameters](#common-parameters):

- **SmallBank:** [`smallbank-benchmark-config.toml`](https://github.com/scalar-labs/scalardl-benchmarks/blob/master/smallbank-benchmark-config.toml)
- **TPC-C:** [`tpcc-benchmark-config.toml`](https://github.com/scalar-labs/scalardl-benchmarks/blob/master/tpcc-benchmark-config.toml)
- **YCSB:** [`ycsb-benchmark-config.toml`](https://github.com/scalar-labs/scalardl-benchmarks/blob/master/ycsb-benchmark-config.toml)

## Run a benchmark

Select a benchmark, and follow the instructions to run the benchmark.

<div id="tabset-1">
<div class="tab">
  <button class="tablinks" onclick="openTab(event, 'SmallBank_1', 'tabset-1')" id="defaultOpen-1">SmallBank</button>
  <button class="tablinks" onclick="openTab(event, 'TPC-C_1', 'tabset-1')">TPC-C</button>
  <button class="tablinks" onclick="openTab(event, 'YCSB_1', 'tabset-1')">YCSB</button>
</div>

<div id="SmallBank_1" class="tabcontent" markdown="1">

To run the SmallBank benchmark, run the following command, replacing `<PATH_TO_KELPIE>` with the path to the Kelpie directory:

```console
$ /<PATH_TO_KELPIE>/bin/kelpie --config smallbank-benchmark-config.toml
```
</div>
<div id="TPC-C_1" class="tabcontent" markdown="1">

To run the TPC-C benchmark, run the following command, replacing `<PATH_TO_KELPIE>` with the path to the Kelpie directory:

```console
$ /<PATH_TO_KELPIE>/bin/kelpie --config tpcc-benchmark-config.toml
```
</div>
<div id="YCSB_1" class="tabcontent" markdown="1">

To run the YCSB benchmark, run the following command, replacing `<PATH_TO_KELPIE>` with the path to the Kelpie directory:

```console
$ /<PATH_TO_KELPIE>/bin/kelpie --config ycsb-benchmark-config.toml
```
</div>
</div>

In addition, the following options are available:

- `--only-pre`. Only registers certificates and contracts and loads the data.
- `--only-process`. Only runs the benchmark.
- `--except-pre` Runs a job without registering certificates and contracts and loading the data.
- `--except-process`. Runs a job without running the benchmark.

## Common parameters

| Name           | Description                                             | Default   |
|:---------------|:--------------------------------------------------------|:----------|
| `concurrency`  | Number of threads for benchmarking.                     | `1`       |
| `run_for_sec`  | Duration of benchmark (in seconds).                     | `60`      |
| `ramp_for_sec` | Duration of ramp-up time before benchmark (in seconds). | `0`       |

## Workload-specific parameters

Select a workload to see its available parameters.

<div id="tabset-2">
<div class="tab">
  <button class="tablinks" onclick="openTab(event, 'SmallBank_2', 'tabset-2')" id="defaultOpen-2">SmallBank</button>
  <button class="tablinks" onclick="openTab(event, 'TPC-C_2', 'tabset-2')">TPC-C</button>
  <button class="tablinks" onclick="openTab(event, 'YCSB_2', 'tabset-2')">YCSB</button>
</div>

<div id="SmallBank_2" class="tabcontent" markdown="1">

| Name               | Description                                         | Default   |
|:-------------------|:----------------------------------------------------|:----------|
| `num_accounts`     | Number of bank accounts for benchmarking.           | `100000`  |
| `load_concurrency` | Number of threads for loading.                      | `1`       |
| `load_batch_size`  | Number of accounts in a single loading transaction. | `1`       |

</div>
<div id="TPC-C_2" class="tabcontent" markdown="1">

| Name               | Description                                           | Default   |
|:-------------------|:------------------------------------------------------|:----------|
| `num_warehouses`   | Number of warehouses (scale factor) for benchmarking. | `1`       |
| `rate_payment`     | Percentage of Payment transaction.                    | `50`      |
| `load_concurrency` | Number of threads for loading.                        | `1`       |

</div>
<div id="YCSB_2" class="tabcontent" markdown="1">

| Name               | Description                                        | Default   |
|:-------------------|:---------------------------------------------------|:----------|
| `record_count`     | Number of records for benchmarking.                | `1000`    |
| `payload_size`     | Payload size (in bytes) of each record.            | `1000`    |
| `ops_per_tx`       | Number of operations in a single transaction       | `2`       |
| `workload`         | Workload type (A, C, or F).                        | `A`       |
| `load_concurrency` | Number of threads for loading.                     | `1`       |
| `load_batch_size`  | Number of records in a single loading transaction. | `1`       |

</div>
</div>
