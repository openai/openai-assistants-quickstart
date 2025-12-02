# OpenAI Assistants API Quickstart

A quick-start template using the OpenAI [Assistants API](https://platform.openai.com/docs/assistants/overview) with [Next.js](https://nextjs.org/docs).
<br/>
<br/>
![OpenAI Assistants API Quickstart](https://github.com/openai/openai-assistants-quickstart/assets/27232/755e85e9-3ea4-421f-b202-3b0c435ea270)

## Quickstart Setup

### 1. Clone repo

```shell
git clone https://github.com/openai/openai-assistants-quickstart.git
cd openai-assistants-quickstart
```

### 2. Set your [OpenAI API key](https://platform.openai.com/api-keys) and other credentials

```shell
export OPENAI_API_KEY="sk_..."
# Optional integrations
export BRIOSTACK_INSTANCE_NAME="demo-instance"
export BRIOSTACK_API_KEY="demo-key"
export TWILIO_ACCOUNT_SID="your-sid"
export TWILIO_AUTH_TOKEN="your-token"
export TWILIO_PHONE_NUMBER="+1234567890"
export SENDGRID_API_KEY="sg-key"
export SENDGRID_FROM_EMAIL="no-reply@example.com"
export STRIPE_SECRET_KEY="sk_test_..."
export GHL_API_DOMAIN="link.jom.services"
export GHL_API_KEY="your-ghl-api-key"
```

(or in `.env.example` and rename it to `.env`).

### 3. Install dependencies

Run the helper script (it accepts all normal `npm install` flags and lets you
override the registry when you are behind a proxy):

```shell
./scripts/install-deps.sh
```

If you prefer to call npm directly, this is equivalent to:

```shell
REGISTRY=https://registry.npmjs.org npm install --no-progress --no-fund --no-audit
```

You can also use `pnpm install` or `yarn` if you prefer those package managers.

Troubleshooting registry or proxy errors (for example, `403 Forbidden - GET https://registry.npmjs.org/@sendgrid%2Fmail`):

- Ensure your environment can reach `https://registry.npmjs.org` (or set
  `REGISTRY=<your mirror>` when running the script above).
- If you use an authenticated mirror, log in first: `npm login --registry <your mirror>`.
- Clear your cache and retry: `npm cache clean --force && ./scripts/install-deps.sh`.

Ensure this step completes while your environment still has network
access so all required packages are downloaded.

> **Note**: If `npm install` prints `npm warn Unknown env config "http-proxy"`,
> your shell is exporting `npm_config_http_proxy` or `npm_config_https_proxy`.
> Those variables are deprecated in newer versions of npm. Unset them or rename
> them to `HTTP_PROXY`/`HTTPS_PROXY` (or `npm_config_proxy`) to remove the
> warning.

### 4. Run

```shell
npm run dev
```

### 5. Run tests

```shell
npm test
```

This uses Node's built-in test runner to verify the included Briostack OpenAPI specification.

### 6. Navigate to [http://localhost:3000](http://localhost:3000).

The Briostack API specification used by the examples lives at
`public/briostack-openapi.json`. Feel free to explore it for a full list of
available endpoints. A basic test in `test/briostack-openapi.test.js` ensures this file can be loaded and contains the expected title.

## Deployment

You can deploy this project to Vercel or any other platform that supports Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fopenai%2Fopenai-assistants-quickstart&env=OPENAI_API_KEY,OPENAI_ASSISTANT_ID&envDescription=API%20Keys%20and%20Instructions&envLink=https%3A%2F%2Fgithub.com%2Fopenai%2Fopenai-assistants-quickstart%2Fblob%2Fmain%2F.env.example)

## Overview

This project is intended to serve as a template for using the Assistants API in Next.js with [streaming](https://platform.openai.com/docs/assistants/overview/step-4-create-a-run), tool use ([code interpreter](https://platform.openai.com/docs/assistants/tools/code-interpreter) and [file search](https://platform.openai.com/docs/assistants/tools/file-search)), and [function calling](https://platform.openai.com/docs/assistants/tools/function-calling). While there are multiple pages to demonstrate each of these capabilities, they all use the same underlying assistant with all capabilities enabled.

The main logic for chat will be found in the `Chat` component in `app/components/chat.tsx`, and the handlers starting with `api/assistants/threads` (found in `api/assistants/threads/...`). Feel free to start your own project and copy some of this logic in! The `Chat` component itself can be copied and used directly, provided you copy the styling from `app/components/chat.module.css` as well.

### Pages

- Basic Chat Example: [http://localhost:3000/examples/basic-chat](http://localhost:3000/examples/basic-chat)
- Function Calling Example: [http://localhost:3000/examples/function-calling](http://localhost:3000/examples/function-calling)
- File Search Example: [http://localhost:3000/examples/file-search](http://localhost:3000/examples/file-search)
- Full-featured Example: [http://localhost:3000/examples/all](http://localhost:3000/examples/all)

### Main Components

- `app/components/chat.tsx` - handles chat rendering, [streaming](https://platform.openai.com/docs/assistants/overview?context=with-streaming), and [function call](https://platform.openai.com/docs/assistants/tools/function-calling/quickstart?context=streaming&lang=node.js) forwarding
- `app/components/file-viewer.tsx` - handles uploading, fetching, and deleting files for [file search](https://platform.openai.com/docs/assistants/tools/file-search)

### Endpoints

- `api/assistants` - `POST`: create assistant (only used at startup)
- `api/assistants/threads` - `POST`: create new thread
- `api/assistants/threads/[threadId]/messages` - `POST`: send message to assistant
- `api/assistants/threads/[threadId]/actions` - `POST`: inform assistant of the result of a function it decided to call
- `api/assistants/files` - `GET`/`POST`/`DELETE`: fetch, upload, and delete assistant files for file search

### Briostack Function Example

To check that your assistant has the `call_briostack` function registered, run:

```ts
npm install
node scripts/check-functions.ts
```

This prints the assistant's registered functions. You can also run

```ts
node scripts/briostack-example.ts
```

to try a simple request if you have set `BRIOSTACK_INSTANCE_NAME` and
`BRIOSTACK_API_KEY` in your environment. You can also store these
values in the browser by visiting [`/briostack-connect`](./briostack-connect).
The page saves your instance name and API key to `localStorage` so the
helper functions can use them on subsequent visits.

The `app/utils/briostack.ts` file also exposes helper methods like
`listCustomers`, `getCustomer`, and `listProperties` for common API calls.
Additional helpers such as `listAppointments`, `createAppointment`, and
`listServices` demonstrate how to access other paid endpoints defined in the
`public/briostack-openapi.json` specification. Recent additions
`listWebhooks`, `createWebhook`, `getWebhook`, and `updateWebhook` make it easy
to manage webhook resources as well. New helpers `createService` and
`updateService` let you modify a service's `serviceSchedule` if needed. You can
try them with the new
script:

```ts
node scripts/briostack-appointments.ts
```

You can also inspect a service's schedule with:

```ts
node scripts/briostack-services.ts
```


### NextBillion Route Optimization

This project also includes a helper for [NextBillion's Route Optimization API](https://nextbillion.ai/route-optimization-api).
Use the `optimize_routes` function to post a JSON payload describing jobs and vehicles.
The helper lives in `app/utils/nextbillion.ts` and reads `NEXTBILLION_API_KEY` from the environment.

When you call `optimize_routes`, NextBillion considers the full set of vehicle-routing constraints you include in the payload. The request can describe:

- **Depots and start/end locations** to anchor each route.
- **Service times and time windows** on jobs, so stops respect earliest/latest start and on-site durations.
- **Vehicle capacities** (multiple dimensions supported) alongside **job demands** to keep each route within its capacity limits.
- **Maximum route durations or distances** per vehicle.
- **Pickup → delivery precedences** (shipments) so paired jobs stay in order on the same route.
- **Driver or vehicle skills/tags** to ensure only qualified vehicles are assigned to certain jobs.
- **Priorities and penalties** that influence which jobs may be dropped versus must be served.
- **Traffic-aware travel times** when you specify the matrix type and departure time, so ETAs account for real-world speeds.

Structure your payload around these fields to give the optimizer the necessary rules for building practical routes.

In this starter, clients post the payload to a server-side proxy at `/api/nextbillion/optimize`, which injects the server-held `NEXTBILLION_API_KEY` so secrets never reach the browser:

```ts
const res = await fetch("/api/nextbillion/optimize", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ payload: { /* ... */ } }),
});
const result = await res.json();
```

You can experiment with this by calling `optimize_routes` in the example chats; the UI already proxies requests through the server route.


### Realtime API Demo

This repo now includes a minimal example page using the new Realtime API.
Run `npm run dev` and navigate to `/realtime` to try a WebRTC session in your
browser. The `/api/realtime/session` endpoint mints an ephemeral token using
your `OPENAI_API_KEY` for authentication. The client page then connects to the
Realtime model and streams events back and forth.

### Messaging and Payments

This template now includes optional API routes for sending SMS via Twilio,
sending email via SendGrid, creating Stripe Checkout sessions, and proxying
requests to GoHighLevel's Lead Connector API. Configure the related environment
variables in `.env` and POST to the following endpoints:

- `POST /api/messages/send-sms` – send an SMS message
- `POST /api/messages/send-email` – send an email
- `POST /api/payments/create-checkout-session` – create a Stripe checkout session
- `POST /api/ghl/proxy` – proxy a call to your GHL domain

## Feedback

Let us know if you have any thoughts, questions, or feedback in [this form](https://docs.google.com/forms/d/e/1FAIpQLScn_RSBryMXCZjCyWV4_ebctksVvQYWkrq90iN21l1HLv3kPg/viewform?usp=sf_link)!
