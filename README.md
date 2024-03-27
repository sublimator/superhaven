# SuperHaven

For SuperMaven editor plugin developers, this is a web-based viewer for the SuperMaven agent's stdio,
which can be quite busy with all the file content.

This is a work in progress.

## About

This contains a wrapper script for the [SuperMaven](https://supermaven.com/) sm-agent binary.
It wraps the binary in a Node.js process and exposes a WebSocket API that publishes the
agent's stdio for viewing in a browser.

Having a structured log viewer makes the sm-agent much more accessible and relieves
the developer from the mental burden of parsing the agent's output.

## Usage

### Prerequisites

```
git clone https://github.com/sublimator/superhaven.git
cd superhaven
pnpm install
```

### Configuration

You need to create a `superhaven.config.json` file in ~/.supermaven with this structure:

```
{
  "workingDirectory": "/Users/user/.supermaven/binary/v9/macosx-aarch64",
  "authToken": "OPEN_SESAME"
}
```

### Building and installing agent wrapper

```
pnpm build:wrapper
```

We use a symlink to the dist directory so that any modifications to the wrapper
are available without extra effort.

```
# Install the symlink
cd ~/.supermaven/binary/v9/macosx-aarch64 # depends on version/arch 
mv sm-agent sm-agent-real
ln -s $REPO_ROOT/dist/src/wrapper/sm-agent-wrapper.cjs sm-agent
chmod +x sm-agent
```

TODO: pnpm install $path-to-binary

### Viewing the SuperHaven Dashboard

```
pnpm dev:open
```
