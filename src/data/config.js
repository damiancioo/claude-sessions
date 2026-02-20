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
 * Write persistent user config.
 * Write failure is non-fatal.
 */
export async function writeConfig(config) {
  try {
    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch {
    // Config write failure is non-fatal
  }
}
