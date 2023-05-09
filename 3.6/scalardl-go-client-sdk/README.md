# Scalar DL Go Client SDK
This module is for developing applications that interact with [Scalar DL](https://github.com/scalar-labs/scalardl) networks.

## Install

This SDK is released as a GO module. To install it, go to the root folder of your project and use

```
go get github.com/scalar-labs/scalardl-go-client-sdk/v3@{version}
```

to add this SDK to your module.

### Compitablity

The SDK is compitable with Scalar DL by the aligned minor versions.

For instance, the users can use this SDK version 3.4.* to connect to Scalar DL 3.4.* networks.

## HOWTO

This section explains the following main structures:

- ClientConfig
- ClientService
- ClientError

### ClientConfig

ClientConfig represents the Scalar DL Client configuration.

The users need to prepare it before connect to a Scalar DL network.

ClientConfig can be created by loading either the `Java Properties`-format strings or the `JSON`-format strings.

The example of loading from Java Properties:
```
import "github.com/scalar-labs/scalardl-go-client-sdk/v3/client/config"

var clientConfig config.ClientConfig
var err error
var javaProperties = `
scalar.dl.client.server.host=localhost
scalar.dl.client.server.port=80
scalar.dl.client.server.privileged_port=8080
scalar.dl.client.cert_holder_id=foo
scalar.dl.client.cert_pem=-----BEGIN CERTIFICATE-----\nMIICjTCCAj...\n
scalar.dl.client.private_key_pem=-----BEGIN EC PRIVATE KEY-----\nMHc...
`

clientConfig, err = config.NewClientConfigFromJavaProperties(javaProperties);
```

The example of loading from JSON:
```
import "github.com/scalar-labs/scalardl-go-client-sdk/v3/client/config"

var clientConfig config.ClientConfig
var err error
var json = `
{
	"scalar.dl.client.server.host": "localhost",
	"scalar.dl.client.server.port": 80,
	"scalar.dl.client.server.privileged_port": 8080,
	"scalar.dl.client.cert_holder_id": "foo",
	"scalar.dl.client.cert_pem": "-----BEGIN CERTIFICATE-----\nMIICjTCCAj...\n",
	"scalar.dl.client.private_key_pem": "-----BEGIN EC PRIVATE KEY-----\nMHc...",
}
`

clientConfig, err = config.NewClientConfigFromJSON(json);
```

The ClientConfig variable then can be used to construct the ClientService structure.

### ClientService

ClientService is the main interface to send requests to and receive responses from the Scalar DL networks.

Use a ClientConfig variable to construct ClientService.

```
import "github.com/scalar-labs/scalardl-go-client-sdk/v3/client/service"

var clientService service.ClientService
var err error

clientService, err = service.NewClientService(clientConfig)
```

As clientService is created successfully, users can use its functions to send the requests
|Name|Request|
|----|-------|
|RegisterCertificate|Certificate registration|
|RegisterContract|Contract registration|
|ExecuteContract|Contract execution|
|ValidateLedger|Ledger validation|

The souce code in the [example](https://github.com/scalar-labs/scalardl-go-client-sdk/tree/main/example) sub-folder demonstrate the details respectively.

### ClientError

ClientError implements error interface and one more `StatusCode` function to contains Scalar DL status code returned by the Scalar DL networks.

Note that errors returned from ClientService are not always albe to be asserted to ClientError.

```
import (
	client_error "github.com/scalar-labs/scalardl-go-client-sdk/v3/client/error"
	"github.com/scalar-labs/scalardl-go-client-sdk/v3/client/service"
)

var clientService service.ClientService
var clientError client_error.ClientError
var err error

...

err = service.RegisterCertificate()

if clientError, ok := err.(client_error.ClientError); ok {
	// clientError.StatusCode() can be used here
}
```

## Re-generate gRPC protobuf files

Scalar DL uses gRPC as the communication protocol.

The generated gRPC go files are placed in the `rpc` sub-folder.

To genearte them,
check [prerequsisites](https://grpc.io/docs/languages/go/quickstart/#prerequisites) to install necessary tools.
We also need to add `option go_package = "./rpc";` to the *.proto files to specify the Golang package.
Then, use the following command to generate related files.
```
protoc --go_out=<path-to-this-repository> --go-grpc_out=<path-to-this-repository> scalar.proto
```
