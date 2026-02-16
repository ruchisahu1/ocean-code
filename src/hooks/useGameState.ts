import { useState, useCallback, useEffect, useRef } from "react";
import { CellType } from "@/components/game/OceanGrid";
import { playMoveSound, playCollectSound, playErrorSound, playHazardSound } from "@/hooks/useSoundEffects";

export interface LevelData {
  title: string;
  mission: string;
  hint: string;
  starterCode: string;
  grid: CellType[][];
  startPos: { row: number; col: number };
  targetCollect: number;
}

export const LEVELS: Record<string, LevelData> = {
  "1-1": {
    title: "First Dive",
    mission: "Your submarine needs to grab the shell and then swim down to the treasure chest. Use sub.move_right() and sub.move_down() to tell it where to go!",
    hint: "Count the squares! How many steps RIGHT to reach the shell? Then how many steps DOWN to the chest? Type each step on its own line.",
    starterCode: `# Move the submarine to collect the shell!\n# Commands: sub.move_right(), sub.move_down()\n# sub.move_left(), sub.move_up()\n\nsub.move_right()\nsub.move_right()\n`,
    grid: [
      ["empty", "empty", "sample", "empty"],
      ["empty", "empty", "empty", "empty"],
      ["empty", "empty", "goal", "empty"],
      ["empty", "empty", "empty", "empty"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 1,
  },
  "1-2": {
    title: "Reef Path",
    mission: "Rocks are blocking the way! Find a path around them, grab both shells, and reach the treasure chest.",
    hint: "Start by going right to get the first shell. Then look at the grid \u2014 which way can you go to avoid the rocks? Try going down, then right to reach the second shell!",
    starterCode: `# Collect both shells and reach the goal!\n# Watch out for rocks - you can't move through them.\n\nsub.move_right()\n`,
    grid: [
      ["empty", "sample", "empty", "empty", "empty"],
      ["empty", "rock", "rock", "empty", "empty"],
      ["empty", "empty", "empty", "sample", "empty"],
      ["empty", "rock", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 2,
  },
  "1-3": {
    title: "Deep Collector",
    mission: "There are 3 shells in a row! Instead of typing the same command over and over, use a for loop to do it for you. How cool is that?",
    hint: "Look at the shells \u2014 they\u2019re all in a line going right. Count how many steps from the sub to the treasure chest. Then write: for i in range(that number): and on the next line (push it right with spaces): sub.move_right()",
    starterCode: `# Use a loop to collect all shells efficiently!\n# for i in range(3):\n#     sub.move_right()\n\n`,
    grid: [
      ["empty", "sample", "sample", "sample", "goal"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 3,
  },
  "1-4": {
    title: "Shell Spiral",
    mission: "The shells are spread out now! You\u2019ll need more than one loop. Write a loop to go right, then another loop to go down, and keep going until you collect all 3 shells!",
    hint: "Break it into pieces! First piece: go right to grab the top shells. Second piece: move down toward the other shell. Third piece: reach the goal. Write a for loop for each piece!",
    starterCode: `# Use MULTIPLE loops to navigate!\n# Chain loops together like this:\n# for i in range(2):\n#     sub.move_right()\n# for i in range(3):\n#     sub.move_down()\n\n`,
    grid: [
      ["empty", "sample", "sample", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "sample", "empty"],
      ["empty", "empty", "empty", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 3,
  },
  "1-5": {
    title: "Coral Maze",
    mission: "The final Coral Reef challenge! Navigate through the coral maze, collect both shells, and reach the treasure chest. You\u2019ve got everything you need \u2014 show us what you\u2019ve learned!",
    hint: "Trace a zigzag path! Go down first, then right to grab a shell, then down again for the second shell, then right to the goal. Count the steps for each part and write a for loop for each one.",
    starterCode: `# The final Coral Reef challenge!\n# Plan your route, then use loops for each segment.\n# Remember: for i in range(n): repeats n times\n\n`,
    grid: [
      ["empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "rock", "empty", "empty", "rock", "empty"],
      ["empty", "empty", "sample", "empty", "empty", "empty"],
      ["empty", "rock", "empty", "empty", "rock", "empty"],
      ["empty", "empty", "sample", "empty", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 2,
  },
  "2-1": {
    title: "Ship Entrance",
    mission: "You\u2019ve entered a sunken ship! Navigate the corridor, collect both shells, and reach the treasure chest. Use loops to move through the hallway!",
    hint: "Go right along the top hallway to grab the first shell. Then go down through the gap in the wall. Can you spot the second shell below? Use loops for the long parts!",
    starterCode: `# Welcome to the Sunken Ship!\n# Use loops to move through corridors.\n\nfor i in range(4):\n    sub.move_right()\n`,
    grid: [
      ["empty", "empty", "empty", "empty", "sample"],
      ["rock", "rock", "rock", "rock", "empty"],
      ["empty", "empty", "empty", "sample", "empty"],
      ["empty", "empty", "empty", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 2,
  },
  "2-2": {
    title: "The Long Hallway",
    mission: "This hallway goes right\u2026 then turns back LEFT! Your sub can go backwards too. Try using sub.move_left() inside a loop!",
    hint: "Go right to grab the first shell, then go down through the gap, then use a LEFT loop to go back and grab the second shell. Then head down to the goal!",
    starterCode: `# Loops work in EVERY direction!\n# Try: for i in range(3):\n#          sub.move_left()\n\n`,
    grid: [
      ["empty", "empty", "empty", "sample", "empty"],
      ["rock", "rock", "rock", "empty", "rock"],
      ["sample", "empty", "empty", "empty", "empty"],
      ["empty", "rock", "rock", "rock", "rock"],
      ["empty", "goal", "empty", "empty", "empty"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 2,
  },
  "2-3": {
    title: "Staircase Deck",
    mission: "The ship has a staircase! Notice the step pattern \u2014 each shell is one step right and one step down. Can you put TWO commands inside one loop?",
    hint: "Look at the staircase \u2014 each step goes right then down. Try putting BOTH commands under one loop:\nfor i in range(3):\n    sub.move_right()\n    sub.move_down()",
    starterCode: `# A loop can repeat MORE than one command!\n# Put two indented lines under the for loop:\n#\n# for i in range(3):\n#     sub.move_right()\n#     sub.move_down()\n\n`,
    grid: [
      ["empty", "sample", "empty", "empty", "empty"],
      ["rock", "empty", "sample", "empty", "empty"],
      ["rock", "rock", "empty", "sample", "empty"],
      ["rock", "rock", "rock", "empty", "empty"],
      ["rock", "rock", "rock", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 3,
  },
  "2-4": {
    title: "Engine Room",
    mission: "The engine room is big and has lots of walls! Plan your route carefully \u2014 you\u2019ll need several loops chained together to navigate the corridors and collect all 3 shells.",
    hint: "Go right to the first shell, then down through the gap. Move left one step, then down through the next gap to the second shell. Finally, go right along the bottom to grab the last shell and reach the goal!",
    starterCode: `# Plan your route through the engine room!\n# Chain loops together for each corridor.\n# You can mix loops and single commands.\n\n`,
    grid: [
      ["empty", "empty", "empty", "sample", "empty", "empty", "empty"],
      ["rock", "rock", "rock", "empty", "rock", "rock", "rock"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["rock", "rock", "empty", "rock", "rock", "rock", "rock"],
      ["empty", "empty", "sample", "empty", "sample", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 3,
  },
  "2-5": {
    title: "Captain\u2019s Treasure",
    mission: "The Captain\u2019s quarters! This is the biggest maze in the ship. Navigate through all the corridors, collect every shell, and claim the treasure. You\u2019ve got this, Captain!",
    hint: "Trace the zigzag path: right along the top, down through the gap, left to grab a shell, down through the next gap, right along the bottom, then down to the goal. Count carefully!",
    starterCode: `# The final Sunken Ship challenge!\n# Plan each corridor segment, then write a loop for it.\n# You know everything you need. Good luck!\n\n`,
    grid: [
      ["empty", "empty", "sample", "empty", "empty", "empty", "empty"],
      ["rock", "rock", "rock", "empty", "rock", "rock", "rock"],
      ["empty", "empty", "sample", "empty", "empty", "empty", "empty"],
      ["rock", "empty", "rock", "rock", "rock", "rock", "rock"],
      ["empty", "empty", "empty", "sample", "empty", "empty", "empty"],
      ["rock", "rock", "rock", "rock", "rock", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 3,
  },
  "3-1": {
    title: "Cave Entrance",
    mission: "Use conditionals to check for hazards before moving. Use sub.scan_right() to check ahead.",
    hint: "if sub.scan_right() == 'safe': sub.move_right() else: sub.move_down()",
    starterCode: `# Use sonar to detect hazards!\n# sub.scan_right() returns 'safe' or 'danger'\n# sub.scan_down() returns 'safe' or 'danger'\n\nif sub.scan_right() == "safe":\n    sub.move_right()\n`,
    grid: [
      ["empty", "empty", "hazard", "empty", "empty"],
      ["empty", "empty", "empty", "sample", "empty"],
      ["empty", "hazard", "empty", "empty", "goal"],
      ["empty", "empty", "empty", "hazard", "empty"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 1,
  },
};

export function useGameState(levelData: LevelData) {
  const [grid, setGrid] = useState<CellType[][]>(() =>
    levelData.grid.map((r) => [...r])
  );
  const [subPos, setSubPos] = useState(levelData.startPos);
  const [oxygen, setOxygen] = useState(100);
  const [collected, setCollected] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState<"right" | "left" | "up" | "down">("right");
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const reset = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setGrid(levelData.grid.map((r) => [...r]));
    setSubPos(levelData.startPos);
    setOxygen(100);
    setCollected(0);
    setOutput([]);
    setIsRunning(false);
    setIsComplete(false);
    setDirection("right");
  }, [levelData]);

  /* Auto-reset when navigating to a new level */
  useEffect(() => {
    reset();
  }, [reset]);

  const runCode = useCallback(
    (code: string) => {
      reset();
      setIsRunning(true);
      setOutput(["▶ Running code..."]);

      // Parse commands from code
      const commands: { action: string; count: number }[] = [];
      const lines = code.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));

      // Simple parser for move commands and basic for loops
      let i = 0;
      while (i < lines.length) {
        const line = lines[i].trim();

        // For loop: for i in range(n):
        const forMatch = line.match(/for\s+\w+\s+in\s+range\((\d+)\)\s*:/);
        if (forMatch) {
          const count = parseInt(forMatch[1]);
          // Get indented lines after for (accept any leading whitespace)
          const loopBody: string[] = [];
          let j = i + 1;
          while (j < lines.length && /^\s/.test(lines[j])) {
            loopBody.push(lines[j].trim());
            j++;
          }
          for (let k = 0; k < count; k++) {
            loopBody.forEach((bl) => {
              const m = bl.match(/sub\.(move_\w+|scan_\w+)\(\)/);
              if (m) commands.push({ action: m[1], count: 1 });
            });
          }
          i = j;
          continue;
        }

        // If statement (simplified)
        const ifMatch = line.match(/if\s+sub\.(scan_\w+)\(\)\s*==\s*["'](\w+)["']\s*:/);
        if (ifMatch) {
          // Get the body
          const ifBody: string[] = [];
          let j = i + 1;
          while (j < lines.length && /^\s/.test(lines[j])) {
            if (lines[j].trim().startsWith("else")) break;
            ifBody.push(lines[j].trim());
            j++;
          }
          // For simplicity, execute the if body (we'll check conditions during execution)
          ifBody.forEach((bl) => {
            const m = bl.match(/sub\.(move_\w+)\(\)/);
            if (m) commands.push({ action: m[1], count: 1 });
          });

          // Check for else
          if (j < lines.length && lines[j].trim().startsWith("else")) {
            j++;
            // Skip else body for now (simplified)
            while (j < lines.length && /^\s/.test(lines[j])) {
              j++;
            }
          }
          i = j;
          continue;
        }

        // Direct command
        const cmdMatch = line.match(/sub\.(move_\w+)\(\)/);
        if (cmdMatch) {
          commands.push({ action: cmdMatch[1], count: 1 });
        }
        i++;
      }

      // Execute commands with animation
      let pos = { ...levelData.startPos };
      let oxy = 100;
      let coll = 0;
      let currentGrid = levelData.grid.map((r) => [...r]);
      const logs: string[] = ["▶ Running code..."];

      commands.forEach((cmd, idx) => {
        const t = setTimeout(() => {
          const dir = cmd.action;
          let newRow = pos.row;
          let newCol = pos.col;

          if (dir === "move_right") newCol++;
          else if (dir === "move_left") newCol--;
          else if (dir === "move_down") newRow++;
          else if (dir === "move_up") newRow--;

          // Bounds check
          if (newRow < 0 || newRow >= currentGrid.length || newCol < 0 || newCol >= currentGrid[0].length) {
            logs.push(`✗ Cannot move ${dir.replace("move_", "")} - out of bounds!`);
            setOutput([...logs]);
            playErrorSound();
            return;
          }

          // Rock check
          if (currentGrid[newRow][newCol] === "rock") {
            logs.push(`✗ Cannot move ${dir.replace("move_", "")} - blocked by rock!`);
            setOutput([...logs]);
            playErrorSound();
            return;
          }

          // Hazard check
          if (currentGrid[newRow][newCol] === "hazard") {
            logs.push(`✗ Hit a hazard! Oxygen depleted by 20%`);
            oxy = Math.max(0, oxy - 20);
            setOxygen(oxy);
            playHazardSound();
          }

          pos = { row: newRow, col: newCol };
          oxy = Math.max(0, oxy - 5);
          setOxygen(oxy);
          setSubPos({ ...pos });
          setDirection(dir.replace("move_", "") as "right" | "left" | "up" | "down");
          playMoveSound();

          // Collect sample
          if (currentGrid[newRow][newCol] === "sample") {
            coll++;
            currentGrid[newRow][newCol] = "collected";
            setGrid(currentGrid.map((r) => [...r]));
            setCollected(coll);
            logs.push(`🐚 Collected sample! (${coll}/${levelData.targetCollect})`);
            playCollectSound();
          }

          // Check goal
          if (currentGrid[newRow][newCol] === "goal" && coll >= levelData.targetCollect) {
            logs.push("✓ Mission complete! All samples collected!");
            setIsComplete(true);
          }

          logs.push(`→ ${dir.replace("move_", "Moved ")}`);
          setOutput([...logs]);

          // Last command
          if (idx === commands.length - 1) {
            setIsRunning(false);
            if (!logs.some((l) => l.includes("Mission complete"))) {
              if (coll < levelData.targetCollect) {
                logs.push(`⚠ Need ${levelData.targetCollect - coll} more sample(s)`);
              }
              if (currentGrid[pos.row][pos.col] !== "goal") {
                logs.push("⚠ Reach the goal (🏁) to complete the mission");
              }
              setOutput([...logs]);
            }
          }
        }, (idx + 1) * 500);

        timeoutsRef.current.push(t);
      });

      if (commands.length === 0) {
        setOutput(["✗ No valid commands found. Use sub.move_right(), sub.move_down(), etc."]);
        setIsRunning(false);
      }
    },
    [levelData, reset]
  );

  return { grid, subPos, oxygen, collected, output, isRunning, isComplete, direction, runCode, reset };
}
