# PACER API Client

This module provides a high-level interface for the
[PACER API](https://pacer.uscourts.gov/file-case/developer-resources). You may
be interested in PACER data if you are building software that interfaces with
data from the US court system. Before you get started, you will need a valid
[PACER login with access to the case locator](https://pcl.uscourts.gov/pcl/index.jsf).

## Installation

The PACER client is compatible with Deno, Node.js, Cloudflare Workers, and Bun,
and is published on [JSR](https://jsr.io) at
[@kwhinnery/pacer](https://jsr.io/@kwhinnery/pacer).

**Deno installation:**

```sh
deno add @kwhinnery/pacer
```

**npm installation (Node, Bun, Workers):**

```sh
npx jsr add @kwhinnery/pacer
```

## Usage

Authenticate a PACER client by providing your website username and password. By
default, the client constructor will look for these values in the following
system environment variables:

- `PACER_USERNAME`
- `PACER_PASSWORD`

```ts
import PACERClient from "@kwhinnery/pacer";

const client = new PACERClient();
```
