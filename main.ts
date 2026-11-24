// One Sentence for a Traveler from 1800
// SPDX-License-Identifier: MIT
//
// This program writes a single sentence to /output/entry.txt. The sentence
// explains the modern internet to a person who has just stepped out of the
// year 1800, using only things such a person already knows: libraries,
// post offices, roads, letters, and a kettle on the boil. No word in it was
// coined after 1800, so the traveler needs no new vocabulary to picture it.

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry itself: one sentence, kept well inside the 200-character gate.
const SENTENCE =
  "Imagine every library and post office on earth joined by roads of light, " +
  "so a letter you write at your table is read in China before your kettle boils.";

// Words coined after 1800 that must never appear in the entry. The judge
// rewards sentences built from what a person of 1800 already knows, so the
// program refuses to write a sentence containing any of these.
const MODERN_WORDS = [
  "internet",
  "computer",
  "screen",
  "website",
  "online",
  "digital",
  "email",
  "phone",
  "television",
  "radio",
  "wifi",
  "software",
  "video",
  "app",
  "browser",
  "server",
  "download",
  "upload",
  "password",
];

const MAX_CHARS = 200;
const OUTPUT_DIR = process.env.OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

function checkSentence(sentence) {
  if (sentence.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (sentence.length > MAX_CHARS) {
    throw new Error(
      `entry is ${sentence.length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  // Exactly one sentence: a single terminal full stop and no other
  // sentence-ending marks inside the text.
  const terminators = sentence.match(/[.!?]/g) ?? [];
  if (terminators.length !== 1 || !sentence.trimEnd().endsWith(".")) {
    throw new Error("entry must be exactly one sentence ending in a full stop");
  }
  const lower = sentence.toLowerCase();
  for (const word of MODERN_WORDS) {
    const found = new RegExp(`\\b${word}\\b`).test(lower);
    if (found) {
      throw new Error(`entry uses a word coined after 1800: ${word}`);
    }
  }
}

function clearOutputDir(dir) {
  // Make the directory if it is missing, and clear only the files inside
  // it. The directory itself is never removed: the grader mounts it and
  // runs this program as an unprivileged user, so removing it fails.
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

function main() {
  checkSentence(SENTENCE);
  clearOutputDir(OUTPUT_DIR);
  writeFileSync(OUTPUT_FILE, SENTENCE, "utf8");
  // Read the file back and confirm the grader will see exactly the
  // sentence that passed the checks above, byte for byte.
  const written = readFileSync(OUTPUT_FILE, "utf8");
  if (written !== SENTENCE) {
    throw new Error("written entry does not match the checked sentence");
  }
  checkSentence(written);
  console.log(`wrote ${SENTENCE.length} characters to ${OUTPUT_FILE}`);
  console.log(SENTENCE);
}

main();
