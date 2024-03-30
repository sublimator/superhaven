# SuperHaven

For SuperMaven editor plugin developers, this is a web-based viewer for the SuperMaven agent's stdio.
It also support ignoring files by selectively neglecting to pass on messages to the agent.

See [agent-out-messages.ts](src/types/messages/agent-out-messages.ts)
and [editor-out-messages.ts](src/types/messages/editor-out-messages.ts) for the message types.

![dash](public/dash.png)

## About

This contains a wrapper script for the [SuperMaven](https://supermaven.com/) sm-agent binary.
This is a Node.js process that exposes a WebSocket API that publishes the
agent's stdio for viewing in a browser as well as forwarding messages to the real agent.

When first written `touch  ~/sm-log.txt` was not yet supported so having a structured
log viewer made the sm-agent much more accessible, relieving the developer from the
mental burden of parsing the agent's output.

## WARNING NOTE

It will definitely not work very well with very large files, given that
it sends the content to the browser encoded as json!

## Usage

### Prerequisites

```bash
git clone https://github.com/sublimator/superhaven.git
cd superhaven
pnpm install
```

### Configuration

You need to create a `superhaven.config.json` file in ~/.supermaven.
See [docs/superhaven.config.json](docs/superhaven.config.json) for an example.

```json
{
  "binaryDirectory": "~/.supermaven/binary/v9/macosx-aarch64",
  "logFile": "~/.supermaven/superhaven.log",
  "authToken": "OPEN_SESAME",
  "projects": {
    "superhaven": {
      "root": "~/projects/superhaven",
      "ignoreGlobs": [
        "**/.env"
      ]
    }
  }
}
```

Note: `logFile` is optional, for developing.
You can simply use the dash or touch ~/sm-log.txt.

### Building and installing agent wrapper

We use a symlink to the dist directory so that any modifications to the wrapper
are available without extra effort.

Requires setting the config first!

```bash
pnpm install:wrapper
```

### Viewing the SuperHaven Dashboard

```bash
pnpm dev:open
```
