/**
 * Pre-execution syntax checker for student code.
 * Returns kid-friendly error messages for common mistakes.
 * If errors are returned, execution should be halted.
 */

export interface SyntaxError {
  line: number;       // 1-based line number
  message: string;    // kid-friendly message
  severity: "error" | "warning";
}

const VALID_COMMANDS = [
  "sub.move_right()",
  "sub.move_left()",
  "sub.move_up()",
  "sub.move_down()",
  "sub.scan_right()",
  "sub.scan_left()",
  "sub.scan_up()",
  "sub.scan_down()",
];

const VALID_COMMAND_NAMES = [
  "move_right", "move_left", "move_up", "move_down",
  "scan_right", "scan_left", "scan_up", "scan_down",
];

export function checkSyntax(code: string): SyntaxError[] {
  const errors: SyntaxError[] = [];
  const lines = code.split("\n");
  const definedFunctions = new Set<string>();

  // First pass: collect function definitions
  for (const line of lines) {
    const defMatch = line.trim().match(/^def\s+(\w+)\(\)\s*:/);
    if (defMatch) definedFunctions.add(defMatch[1]);
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    const lineNum = i + 1;

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) continue;

    // --- Missing colon after for ---
    if (/^for\s+\w+\s+in\s+range\(\d+\)\s*$/.test(trimmed)) {
      errors.push({
        line: lineNum,
        message: "Oops! Your for loop needs a colon (:) at the end! Try: for i in range(3):",
        severity: "error",
      });
      continue;
    }

    // --- Invalid range in for loop (missing number) ---
    if (/^for\s+\w+\s+in\s+range\(\s*\)\s*:?/.test(trimmed)) {
      errors.push({
        line: lineNum,
        message: "Your for loop needs a number inside range()! Try: for i in range(3):",
        severity: "error",
      });
      continue;
    }

    // --- Missing colon after if ---
    if (/^if\s+sub\.scan_\w+\(\)\s*==\s*["']\w+["']\s*$/.test(trimmed)) {
      errors.push({
        line: lineNum,
        message: "Almost! Add a colon (:) at the end of your if line!",
        severity: "error",
      });
      continue;
    }

    // --- Missing colon after elif ---
    if (/^elif\s+sub\.scan_\w+\(\)\s*==\s*["']\w+["']\s*$/.test(trimmed)) {
      errors.push({
        line: lineNum,
        message: "Almost! Add a colon (:) at the end of your elif line!",
        severity: "error",
      });
      continue;
    }

    // --- Missing colon after else ---
    if (/^else\s*$/.test(trimmed)) {
      errors.push({
        line: lineNum,
        message: "Don't forget the colon after else! It should be: else:",
        severity: "error",
      });
      continue;
    }

    // --- Missing colon after def ---
    if (/^def\s+\w+\(\)\s*$/.test(trimmed)) {
      errors.push({
        line: lineNum,
        message: "Your function definition needs a colon (:) at the end! Try: def my_move():",
        severity: "error",
      });
      continue;
    }

    // --- Check for sub. commands with typos ---
    const subDotMatch = trimmed.match(/sub\.(\w+)/);
    if (subDotMatch) {
      const cmdName = subDotMatch[1];
      if (!VALID_COMMAND_NAMES.includes(cmdName)) {
        // Find closest match
        const closest = findClosestCommand(cmdName);
        errors.push({
          line: lineNum,
          message: `Did you mean sub.${closest}()? Check the spelling of "${cmdName}"!`,
          severity: "error",
        });
        continue;
      }

      // Check for missing parentheses on sub commands
      const fullSubMatch = trimmed.match(/sub\.\w+(?!\()/);
      if (fullSubMatch && !trimmed.includes("sub." + cmdName + "(")) {
        errors.push({
          line: lineNum,
          message: `Don't forget the parentheses! It should be sub.${cmdName}()`,
          severity: "error",
        });
        continue;
      }
    }

    // --- No indented body after : ---
    if (trimmed.endsWith(":")) {
      const currentIndent = getIndentCount(raw);
      // Check next non-empty line
      let nextNonEmpty = i + 1;
      while (nextNonEmpty < lines.length && !lines[nextNonEmpty].trim()) {
        nextNonEmpty++;
      }
      if (nextNonEmpty < lines.length) {
        const nextTrimmed = lines[nextNonEmpty].trim();
        if (nextTrimmed && !nextTrimmed.startsWith("#")) {
          const nextIndent = getIndentCount(lines[nextNonEmpty]);
          if (nextIndent <= currentIndent) {
            errors.push({
              line: nextNonEmpty + 1,
              message: "The line after for/if/def/else needs to be indented (add 4 spaces at the start)!",
              severity: "error",
            });
          }
        }
      }
    }

    // --- Wrong indentation (not a multiple of 4, but inside a block) ---
    const indent = getIndentCount(raw);
    if (indent > 0 && indent % 4 !== 0) {
      errors.push({
        line: lineNum,
        message: `Check your spaces! Use exactly 4 spaces for each indent level. This line has ${indent} spaces.`,
        severity: "warning",
      });
    }

    // --- Unknown function call ---
    const callMatch = trimmed.match(/^(\w+)\(\)\s*$/);
    if (callMatch) {
      const funcName = callMatch[1];
      // Not a sub command and not a defined function
      if (!trimmed.startsWith("sub.") && !definedFunctions.has(funcName)) {
        errors.push({
          line: lineNum,
          message: `Hmm, the function "${funcName}" doesn't exist yet. Did you define it with: def ${funcName}(): ?`,
          severity: "error",
        });
      }
    }
  }

  return errors;
}

function getIndentCount(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function findClosestCommand(typo: string): string {
  let best = VALID_COMMAND_NAMES[0];
  let bestDist = Infinity;
  for (const cmd of VALID_COMMAND_NAMES) {
    const d = levenshtein(typo.toLowerCase(), cmd.toLowerCase());
    if (d < bestDist) {
      bestDist = d;
      best = cmd;
    }
  }
  return best;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}
