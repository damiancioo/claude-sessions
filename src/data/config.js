import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

const CONFIG_PATH = join(homedir(), '.claude-sessions-config.json');

/**
 * Read persistent user config.
 * Returns an empty object if missing or unreadable.
 */
export async function readConfig() {
  try {
    const raw = await readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Write persistent user config, merging into any existing config so callers
 * can update a single key without clobbering the others.
 * Write failure is non-fatal.
 */
export async function writeConfig(config) {
  try {
    const existing = await readConfig();
    const merged = { ...existing, ...config };
    await writeFile(CONFIG_PATH, JSON.stringify(merged, null, 2), 'utf-8');
  } catch {
    // Config write failure is non-fatal
  }
}
