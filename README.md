# embassy-checker

A small Node.js scraper that polls the Russian consulate in The Hague
(`hague.kdmid.ru`) for the earliest available appointment slot and sends an SMS
when a sooner date appears.

Built to scratch a personal itch: the consular booking site exposes no API and
slots get taken within minutes of being released, so refreshing it manually was
not workable. This bot does the refresh, the captcha read, and the comparison
on a fixed interval.

## What it does

On each iteration the worker:

1. Launches a headless-ish Chromium via Puppeteer and opens the
   "change appointment" page on `hague.kdmid.ru`.
2. Fills in the request ID and secret code from `config.json`.
3. Screenshots the page, crops the captcha box with Jimp, and runs it through
   the **Google Cloud Vision** text-detection API to read the six-digit code.
4. Submits the form, ticks the first service checkbox, advances to the slot
   list, and reads the first `RadioButtonList` label as the earliest available
   date.
5. Compares it against the date held in memory. If a sooner slot appeared, it
   fires an SMS through **MessageBird**. A "daily report" SMS goes out around
   22:00 local time regardless.
6. Sleeps `hoursDelay` hours and repeats.

There is no HTTP server. Despite the repo name, this is a long-running CLI
worker, not a REST API.

## Tech stack

- Node.js
- Puppeteer for headless browser automation
- Jimp for image cropping
- `@google-cloud/vision` for OCR (captcha bypass)
- MessageBird SDK for SMS delivery
- Redis client is wired up (`publish.js` was extended for pub/sub) but the main
  loop only emits SMS today

## Layout

```
components/
  index.js       main loop, date comparison, daily report trigger
  puppeteer.js   browser automation + form flow
  visionAPI.js   Google Vision wrappers (fromLink / fromFile)
  publish.js    MessageBird SMS sender
  justOnce.js    single-shot runner for manual debugging
config.json      request ID, secret code, SMS recipients, poll interval
start.sh         Linux/macOS entry point
start.bat        Windows entry point
```

## Configuration

`config.json`:

| Key | Meaning |
|---|---|
| `requestID` | Your appointment request ID from the consulate site |
| `secretCode` | The accompanying secret code |
| `sendSMS` | Master switch for SMS delivery |
| `smsRecipients` | List of E.164 phone numbers |
| `redisChannelName` | Channel name for the (currently optional) Redis publish path |
| `hoursDelay` | Poll interval, in hours |

Environment variables:

- `GOOGLE_APPLICATION_CREDENTIALS` — path to the Google Cloud service-account
  JSON used by Vision. The script also tries to read
  `embassy-scheduler.json` from the working directory as a fallback.
- `MESSAGEBIRD_API_KEY` — without this, SMS is skipped (the worker logs and
  keeps running).

## Run locally

```bash
npm install
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/embassy-scheduler.json
export MESSAGEBIRD_API_KEY=...
node components/index.js
```

Or use the provided `start.sh` / `start.bat`.

For a one-shot debug run that bypasses the loop and SMS:

```bash
node components/justOnce.js
```

A `Jenkinsfile` lived in earlier commits — historically this ran on a
self-hosted Jenkins box on a schedule. There is no Dockerfile or serverless
config in the current tree.

## A note on scraping ethics

The consular booking site is the only channel users have to reach the
appointment system, and the slot supply is genuinely scarce. A poll interval
measured in **hours**, a single concurrent browser, and per-user credentials
are deliberate: this is one person checking their own appointment less
aggressively than a human would, not a scalper. Anyone reusing this code
should keep that posture — tightening the interval or running many instances
in parallel would degrade the service for everyone else in the queue.

The captcha is bypassed via OCR because the site requires it on every form
submit; the bot only ever fills in its own owner's credentials and never
books a slot automatically.

## Status

**Dormant / archived in spirit.** Built in 2020–2021 to solve a specific
problem at a specific consulate; the dependency pins (Puppeteer 10, Node
canvas 2) reflect that era and would need a refresh before any new use.
Selectors on `hague.kdmid.ru` may also have drifted. Kept public as a
portfolio sample of practical scraping + OCR + notification glue, not as a
maintained tool.

## License

ISC (see `package.json`).
