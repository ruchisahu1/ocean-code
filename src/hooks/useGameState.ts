import { useState, useCallback, useEffect, useRef } from "react";
import { CellType } from "@/components/game/OceanGrid";
import { playMoveSound, playCollectSound, playErrorSound, playHazardSound } from "@/hooks/useSoundEffects";
import { checkSyntax } from "@/utils/syntaxChecker";

export interface LevelData {
  title: string;
  mission: string;
  hint: string;
  hints?: [string, string, string];
  starterCode: string;
  grid: CellType[][];
  startPos: { row: number; col: number };
  targetCollect: number;
  requiresScan?: boolean;
  requiresFunction?: boolean;
  requiresNestedLoop?: boolean;
  requiresElif?: boolean;
  walkedExample?: { steps: { text: string; code: string }[] };
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
    hints: [
      "Go right along the top hallway first. Then find the gap in the wall to go down!",
      "Use for i in range(4): sub.move_right() to reach the first shell. Then go down TWICE (through the gap and into the lower corridor). Then left to the second shell, down, and right to the goal.",
      "for i in range(4):\n    sub.move_right()\nfor i in range(2):\n    sub.move_down()\nsub.move_left()\nsub.move_down()\nsub.move_right()"
    ],
    starterCode: `# Welcome to the Sunken Ship!\n# Use loops to move through corridors.\n\nfor i in range(4):\n    sub.move_right()\n`,
    grid: [
      ["empty", "empty", "empty", "empty", "sample"],
      ["rock", "rock", "rock", "rock", "empty"],
      ["empty", "empty", "empty", "sample", "empty"],
      ["empty", "empty", "empty", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 2,
    walkedExample: {
      steps: [
        { text: "Go right 4 times to grab the first shell at the end of the top corridor.", code: "for i in range(4):\n    sub.move_right()" },
        { text: "Go down twice — through the gap and into the lower corridor.", code: "for i in range(2):\n    sub.move_down()" },
        { text: "Move left to the second shell, then down and right to the goal.", code: "sub.move_left()\nsub.move_down()\nsub.move_right()" },
      ],
    },
  },
  "2-2": {
    title: "The Long Hallway",
    mission: "This hallway goes right\u2026 then turns back LEFT! Your sub can go backwards too. Try using sub.move_left() inside a loop!",
    hint: "Go right to grab the first shell, then go down through the gap, then use a LEFT loop to go back and grab the second shell. Then head down to the goal!",
    hints: [
      "This is a U-shape! Go right, down through the gap, then LEFT to go back.",
      "Use for i in range(3): sub.move_right() to get the first shell. Then go down TWICE to reach the middle corridor. Then for i in range(3): sub.move_left() to grab the second shell. Then down twice and right to the goal.",
      "for i in range(3):\n    sub.move_right()\nfor i in range(2):\n    sub.move_down()\nfor i in range(3):\n    sub.move_left()\nfor i in range(2):\n    sub.move_down()\nsub.move_right()"
    ],
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
    walkedExample: {
      steps: [
        { text: "Go right 3 times to reach the first shell.", code: "for i in range(3):\n    sub.move_right()" },
        { text: "Go down TWICE to the middle corridor, then LEFT 3 times to collect the second shell.", code: "for i in range(2):\n    sub.move_down()\nfor i in range(3):\n    sub.move_left()" },
        { text: "Head down twice and right to the goal.", code: "for i in range(2):\n    sub.move_down()\nsub.move_right()" },
      ],
    },
  },
  "2-3": {
    title: "Staircase Deck",
    mission: "The ship has a staircase! Notice the step pattern \u2014 each shell is one step right and one step down. Can you put TWO commands inside one loop?",
    hint: "Look at the staircase \u2014 each step goes right then down. Try putting BOTH commands under one loop:\nfor i in range(3):\n    sub.move_right()\n    sub.move_down()",
    hints: [
      "Each step is right then down. Can you spot the repeating pattern on the grid?",
      "Put TWO commands inside one loop! Both sub.move_right() and sub.move_down() go under the for loop. Make sure both are indented with 4 spaces.",
      "for i in range(___):\n    sub.move_right()\n    sub.move_down()\n# Then go down and right to the goal!\nsub.move_down()\nsub.move_right()"
    ],
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
    walkedExample: {
      steps: [
        { text: "The shells form a staircase! Each step goes right then down. Put BOTH commands in one loop.", code: "for i in range(3):\n    sub.move_right()\n    sub.move_down()" },
        { text: "After the staircase, go down and right to reach the goal.", code: "sub.move_down()\nsub.move_right()" },
      ],
    },
  },
  "2-4": {
    title: "Engine Room",
    mission: "The engine room is big and has lots of walls! Plan your route carefully \u2014 you\u2019ll need several loops chained together to navigate the corridors and collect all 3 shells.",
    hint: "Go right to the first shell, then down through the gap. Move left one step, then down through the next gap to the second shell. Finally, go right along the bottom to grab the last shell and reach the goal!",
    hints: [
      "Break the maze into straight-line pieces. Go right first, then find the gaps in the walls to move down.",
      "Piece 1: right 3 to the first shell. Piece 2: down 2 through the gap. Piece 3: left 1 to reach the gap in the lower wall. Piece 4: down 2 to the bottom row (second shell!). Piece 5: right 4 along the bottom to the goal.",
      "for i in range(3):\n    sub.move_right()\nfor i in range(2):\n    sub.move_down()\nsub.move_left()\nfor i in range(2):\n    sub.move_down()\nfor i in range(___):\n    sub.move_right()"
    ],
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
    walkedExample: {
      steps: [
        { text: "Go right 3 to grab the first shell, then down twice through the gap.", code: "for i in range(3):\n    sub.move_right()\nfor i in range(2):\n    sub.move_down()" },
        { text: "Go left 1 to line up with the lower gap, then down twice to the bottom row (second shell!).", code: "sub.move_left()\nfor i in range(2):\n    sub.move_down()" },
        { text: "Go right 4 along the bottom to collect the third shell and reach the goal.", code: "for i in range(4):\n    sub.move_right()" },
      ],
    },
  },
  "2-5": {
    title: "Captain\u2019s Treasure",
    mission: "The Captain\u2019s quarters! This is the biggest maze in the ship. Navigate through all the corridors, collect every shell, and claim the treasure. You\u2019ve got this, Captain!",
    hint: "Trace the zigzag path: right along the top, down through the gap, left to grab a shell, down through the next gap, right along the bottom, then down to the goal. Count carefully!",
    hints: [
      "The path zigzags right, then left, then right again. Trace it with your eyes first!",
      "Go right 3 (grab first shell at col 2), down 2 through the gap, left 2 to the second shell, down 2 through the next gap, right 4 to the third shell, down to the goal.",
      "for i in range(3):\n    sub.move_right()\nfor i in range(2):\n    sub.move_down()\nfor i in range(___):  # Left to second shell\n    sub.move_left()\nfor i in range(2):\n    sub.move_down()\nfor i in range(___):  # Right to third shell + beyond\n    sub.move_right()\nsub.move_down()"
    ],
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
    walkedExample: {
      steps: [
        { text: "Go right 3 along the top (collecting the first shell), then down twice through the gap.", code: "for i in range(3):\n    sub.move_right()\nfor i in range(2):\n    sub.move_down()" },
        { text: "Go left twice to collect the second shell, then down twice through the next gap.", code: "for i in range(2):\n    sub.move_left()\nfor i in range(2):\n    sub.move_down()" },
        { text: "Go right 4 (collecting the third shell along the way), then down to the goal.", code: "for i in range(4):\n    sub.move_right()\nsub.move_down()" },
      ],
    },
  },
  "3-1": {
    title: "Cave Entrance",
    mission: "Your submarine has a special sonar scanner! Use it to check if the path ahead is safe before you move. If there's a jellyfish to the right, go down instead!",
    hint: "The starter code already shows you how to scan and decide. Just add 3 more moves after the if/else block: move down to the shell, then move right twice to the treasure!",
    hints: [
      "Look at the starter code \u2014 it already has an if/else that scans right. You just need to add more moves after it!",
      "After the if/else block, add: sub.move_down() to go down to the shell row, then sub.move_right() twice to reach the treasure.",
      "sub.move_right()\n\nif sub.scan_right() == \"safe\":\n    sub.move_right()\nelse:\n    sub.move_down()\n\nsub.move_down()\nsub.move_right()\nsub.move_right()"
    ],
    starterCode: `# Your sub has SONAR! Scan before you move.\n# sub.scan_right() checks the cell to your right.\n\nsub.move_right()\n\nif sub.scan_right() == "safe":\n    sub.move_right()\nelse:\n    sub.move_down()\n\n# Add 3 more moves to reach the shell and treasure!\n`,
    grid: [
      ["empty", "empty", "hazard", "empty"],
      ["empty", "empty", "empty", "empty"],
      ["empty", "sample", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 1,
    requiresScan: true,
    walkedExample: {
      steps: [
        { text: "Move right once, then scan right to check for the jellyfish.", code: "sub.move_right()\n\nif sub.scan_right() == \"safe\":\n    sub.move_right()\nelse:\n    sub.move_down()" },
        { text: "After the if/else dodge, go down to the shell row, then right to the treasure.", code: "sub.move_down()\nsub.move_right()\nsub.move_right()" },
      ],
    },
  },
  "3-2": {
    title: "Dark Fork",
    mission: "Time to write your OWN if/else! The cave path below has a jellyfish blocking the way. Scan down before you move \u2014 if it\u2019s danger, go right instead!",
    hint: "Start with: if sub.scan_down() == \"safe\": and put sub.move_down() under it. Then add else: and sub.move_right() under that. After dodging, go down, right to the shell, and down-right to the treasure!",
    hints: [
      "Write an if/else that scans DOWN. If safe, go down. If danger, go right instead.",
      "Start with: if sub.scan_down() == \"safe\": then sub.move_down() under it. Then else: with sub.move_right() under it. After the dodge, go down twice, right to the shell, then down and right to the goal.",
      "if sub.scan_down() == \"safe\":\n    sub.move_down()\nelse:\n    sub.move_right()\n\nfor i in range(2):\n    sub.move_down()\nsub.move_right()\nsub.move_down()\nfor i in range(2):\n    sub.move_right()"
    ],
    starterCode: `# Write your OWN if/else!\n# Check: is going down safe?\n# if sub.scan_down() == "safe":\n#     sub.move_down()\n# else:\n#     sub.move_right()\n\n`,
    grid: [
      ["empty", "empty", "empty", "empty", "empty"],
      ["hazard", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "sample", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 1,
    requiresScan: true,
    walkedExample: {
      steps: [
        { text: "Scan down first to check for the jellyfish below you.", code: "if sub.scan_down() == \"safe\":\n    sub.move_down()\nelse:\n    sub.move_right()" },
        { text: "Go down twice to the shell row, then right to collect the shell.", code: "for i in range(2):\n    sub.move_down()\nsub.move_right()" },
        { text: "Go down then right twice to reach the goal.", code: "sub.move_down()\nfor i in range(2):\n    sub.move_right()" },
      ],
    },
  },
  "3-3": {
    title: "Sonar Sweep",
    mission: "There are TWO jellyfish blocking your path! You\u2019ll need to scan TWICE \u2014 once for each jellyfish. Write two if/else blocks to dodge them both!",
    hint: "Go down first, then scan right. When the scan finds danger, the else block sends you down. Move right to the shell, then scan right again for the second jellyfish. Two if/else blocks, two dodges!",
    hints: [
      "You need TWO separate if/else blocks \u2014 one for each jellyfish. Move between them with regular commands.",
      "Move down first. Then write the first if/else scanning right (dodges the jellyfish at row 1). Add a right move. Then write the second if/else scanning right (collects the shell if safe, dodges the jellyfish at row 2). Then navigate down and right to the goal.",
      "sub.move_down()\n\nif sub.scan_right() == \"safe\":\n    sub.move_right()\nelse:\n    sub.move_down()\n\nsub.move_right()\n\nif sub.scan_right() == \"safe\":\n    sub.move_right()\nelse:\n    sub.move_down()\n\nsub.move_down()\nfor i in range(2):\n    sub.move_right()"
    ],
    starterCode: `# Dodge TWO jellyfish with TWO if/else blocks!\n\nsub.move_down()\n\n# First scan and dodge...\n\n# Keep moving to the shell, then scan again!\n`,
    grid: [
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "hazard", "empty", "empty", "empty"],
      ["empty", "empty", "sample", "hazard", "empty"],
      ["empty", "empty", "empty", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 1,
    requiresScan: true,
    walkedExample: {
      steps: [
        { text: "Move down first, then scan right for the first jellyfish.", code: "sub.move_down()\n\nif sub.scan_right() == \"safe\":\n    sub.move_right()\nelse:\n    sub.move_down()" },
        { text: "Move right, then scan right again — this time it finds the shell (safe!) and collects it.", code: "sub.move_right()\n\nif sub.scan_right() == \"safe\":\n    sub.move_right()\nelse:\n    sub.move_down()" },
        { text: "Go down to the goal row, then right twice to the goal.", code: "sub.move_down()\nfor i in range(2):\n    sub.move_right()" },
      ],
    },
  },
  "3-4": {
    title: "Crystal Cavern",
    mission: "The Crystal Cavern has a diagonal wall of jellyfish! Instead of writing lots of if/else blocks, put one INSIDE a for loop \u2014 it will scan and decide at every step automatically!",
    hint: "Use: for i in range(8): and inside it write the if/else. When the scan is safe, go right. When it\u2019s danger, go down. The loop handles everything \u2014 you just need to add the else!",
    hints: [
      "Put your if/else INSIDE a for loop. The loop will scan and decide at every step!",
      "The starter code already has the for loop and the if part. You need to add else: with sub.move_down() under it. Make sure else is indented under the for (4 spaces) and sub.move_down() is indented under else (8 spaces).",
      "for i in range(8):\n    if sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_down()"
    ],
    starterCode: `# Put an if INSIDE a for loop!\n# What happens when it's NOT safe?\n\nfor i in range(8):\n    if sub.scan_right() == "safe":\n        sub.move_right()\n    # What should happen when it's danger?\n`,
    grid: [
      ["empty", "empty", "hazard", "empty", "empty"],
      ["empty", "empty", "empty", "hazard", "empty"],
      ["empty", "empty", "sample", "empty", "hazard"],
      ["empty", "empty", "empty", "sample", "empty"],
      ["empty", "empty", "empty", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 2,
    requiresScan: true,
    walkedExample: {
      steps: [
        { text: "Put an if/else INSIDE a for loop. It scans and decides at each step.", code: "for i in range(8):\n    if sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_down()" },
      ],
    },
  },
  "3-5": {
    title: "The Abyss",
    mission: "The deepest cave! You\u2019ll need everything you\u2019ve learned: loops, if/else, scanning, AND going left! Collect both shells and reach the treasure at the bottom-right!",
    hint: "Start with a for+if loop (like Level 3-4) to zigzag past the diagonal hazards. Then use regular moves to reach the first shell. Go down, move left to collect the second shell, then loop right to the goal!",
    hints: [
      "Use a for+if loop first to dodge hazards, then regular moves and sub.move_left() for the rest.",
      "Start with a for loop containing an if/else to navigate past the diagonal jellyfish (like 3-4). Then add moves to reach the first shell. Go down, move left to the second shell, then loop right to the goal.",
      "for i in range(___):\n    if sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_down()\n\n# Navigate to first shell, then go down\n# Use sub.move_left() for the second shell\n# Then loop right to the goal"
    ],
    starterCode: `# The final cave challenge!\n# Combine loops, if/else, and regular moves.\n# You can also use sub.move_left()\n\n`,
    grid: [
      ["empty", "empty", "hazard", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "hazard", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "sample", "empty"],
      ["empty", "hazard", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "sample", "empty", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 2,
    requiresScan: true,
    walkedExample: {
      steps: [
        { text: "Use a for+if loop with range(6) to zigzag past the diagonal hazards and reach the first shell.", code: "for i in range(6):\n    if sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_down()" },
        { text: "Go down twice, then LEFT twice to collect the second shell.", code: "for i in range(2):\n    sub.move_down()\nfor i in range(2):\n    sub.move_left()" },
        { text: "Finally, loop right 3 times to reach the goal.", code: "for i in range(3):\n    sub.move_right()" },
      ],
    },
  },

  /* ── World 4: Trench Exploration — Functions ──────────────────── */
  "4-1": {
    title: "Trench Edge",
    mission: "Welcome to the deep ocean trench! You'll learn to create FUNCTIONS — reusable blocks of code. The path ahead is a staircase: right, right, down — repeating 3 times. Define a function and call it!",
    hint: "Define a function like: def step(): then put sub.move_right() and sub.move_down() inside. Call it with step() three times!",
    hints: [
      "The pattern right-right-down repeats 3 times. Put that pattern inside a function!",
      "Write def step(): then put sub.move_right(), sub.move_right(), and sub.move_down() inside (indented). Then call step() three times below.",
      "def step():\n    sub.move_right()\n    sub.move_right()\n    sub.move_down()\n\nstep()\nstep()\nstep()"
    ],
    starterCode: `# Define a function and call it!\n# Example:\n# def step():\n#     sub.move_right()\n#     sub.move_right()\n#     sub.move_down()\n#\n# step()\n\n`,
    grid: [
      ["empty", "empty", "sample", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "sample", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 2,
    requiresFunction: true,
    walkedExample: {
      steps: [
        { text: "Define a step() function with the staircase pattern: right, right, down.", code: "def step():\n    sub.move_right()\n    sub.move_right()\n    sub.move_down()" },
        { text: "Call the function 3 times to follow the staircase pattern.", code: "step()\nstep()\nstep()" },
      ],
    },
  },
  "4-2": {
    title: "Pressure Zone",
    mission: "The trench squeezes in! A diagonal staircase of right-down-right-down leads to the samples. Define a dive() function to handle each step, then call it and add extra moves to reach the goal!",
    hint: "Try: def dive(): with sub.move_right() and sub.move_down() inside. Call dive() three times, then add sub.move_right() twice to reach the goal.",
    hints: [
      "The diagonal pattern is right+down. Define a function for that pattern and call it multiple times.",
      "Write def dive(): with sub.move_right() and sub.move_down() inside. Call dive() three times to follow the diagonal. Then add extra sub.move_right() commands to reach the goal.",
      "def dive():\n    sub.move_right()\n    sub.move_down()\n\ndive()\ndive()\ndive()\nsub.move_right()\nsub.move_right()"
    ],
    starterCode: `# Define a function for the diagonal pattern\n# Then call it multiple times!\n\n`,
    grid: [
      ["empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "sample", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "sample", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "sample", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 3,
    requiresFunction: true,
    walkedExample: {
      steps: [
        { text: "Define a dive() function for the diagonal pattern: right then down.", code: "def dive():\n    sub.move_right()\n    sub.move_down()" },
        { text: "Call dive() three times, then add extra moves to reach the goal.", code: "dive()\ndive()\ndive()\nsub.move_right()\nsub.move_right()" },
      ],
    },
  },
  "4-3": {
    title: "Bioluminescent Path",
    mission: "Beautiful glowing creatures light the path! The pattern repeats: move right, then move down twice. Define a zigzag() function and use a FOR LOOP to call it. Functions + loops = super power!",
    hint: "Define def zigzag(): with sub.move_right() and two sub.move_down() calls inside. Then use: for i in range(2): zigzag()",
    hints: [
      "The pattern right-down-down repeats. Define a function for it, then call it in a for loop!",
      "Write def zigzag(): with sub.move_right() and two sub.move_down() inside. Then use for i in range(2): and call zigzag() inside the loop.",
      "def zigzag():\n    sub.move_right()\n    sub.move_down()\n    sub.move_down()\n\nfor i in range(___):\n    zigzag()"
    ],
    starterCode: `# Combine functions with loops!\n# Define a function, then call it in a loop\n\n`,
    grid: [
      ["empty", "empty", "empty"],
      ["empty", "sample", "empty"],
      ["empty", "empty", "empty"],
      ["empty", "empty", "sample"],
      ["empty", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 2,
    requiresFunction: true,
    walkedExample: {
      steps: [
        { text: "Define a zigzag() function: right, down, down.", code: "def zigzag():\n    sub.move_right()\n    sub.move_down()\n    sub.move_down()" },
        { text: "Call it in a for loop to repeat the pattern.", code: "for i in range(2):\n    zigzag()" },
      ],
    },
  },
  "4-4": {
    title: "Thermal Vent",
    mission: "Hot thermal vents block parts of the trench! You'll need to combine functions WITH scanning. Define a smart_step() function that scans before moving — then call it repeatedly to navigate safely!",
    hint: "Define def smart_step(): and put an if/else with sub.scan_right() inside. If safe, move right; else move down. Then use a for loop to call smart_step() enough times.",
    hints: [
      "Put an if/else with scanning INSIDE your function. Then call the function in a loop!",
      "Write def smart_step(): and inside it write if sub.scan_right() == \"safe\": sub.move_right() else: sub.move_down(). Then use for i in range(5): smart_step(). After the loop, add sub.move_down() and sub.move_right() to collect the last sample and reach the goal.",
      "def smart_step():\n    if sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_down()\n\nfor i in range(5):\n    smart_step()\nsub.move_down()\nsub.move_right()"
    ],
    starterCode: `# Define a smart function that scans!\n# def smart_step():\n#     if sub.scan_right() == "safe":\n#         sub.move_right()\n#     else:\n#         sub.move_down()\n\n`,
    grid: [
      ["empty", "empty", "hazard", "empty", "empty"],
      ["empty", "sample", "empty", "hazard", "empty"],
      ["empty", "empty", "sample", "empty", "empty"],
      ["empty", "empty", "empty", "sample", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 3,
    requiresFunction: true,
    requiresScan: true,
    walkedExample: {
      steps: [
        { text: "Define a smart_step() function that scans before moving.", code: "def smart_step():\n    if sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_down()" },
        { text: "Call it 5 times in a loop to navigate past the hazards (collects 2 shells along the way).", code: "for i in range(5):\n    smart_step()" },
        { text: "Go down to collect the third shell, then right to the goal.", code: "sub.move_down()\nsub.move_right()" },
      ],
    },
  },
  "4-5": {
    title: "Trench Floor",
    mission: "The final descent! You've reached the trench floor. Use EVERYTHING: functions, loops, scanning, and even move_left! Collect both samples and reach the treasure at the bottom-right corner!",
    hint: "Define a scan-step function for the hazard zone. Use a for loop to move through the top section, then use regular moves (including move_left) to collect the bottom sample. Finally, loop right to the goal.",
    hints: [
      "Define a smart function like Level 4-4, use it in a loop, then add regular moves and sub.move_left() for the rest.",
      "Start with def smart_step(): containing scan+move logic. Use a for loop to get past the hazards. Then add regular moves to get the first shell, go down, use move_left for the second shell, and loop right to the goal.",
      "def smart_step():\n    if sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_down()\n\nfor i in range(___):\n    smart_step()\n\n# Then navigate to shells with regular moves\n# Use sub.move_left() for the second shell\n# Loop right to goal"
    ],
    starterCode: `# The ultimate challenge!\n# Combine functions + loops + scanning + move_left\n# Plan your route carefully!\n\n`,
    grid: [
      ["empty", "empty", "hazard", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "hazard", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "sample", "empty"],
      ["empty", "hazard", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "sample", "empty", "empty", "goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 2,
    requiresFunction: true,
    requiresScan: true,
    walkedExample: {
      steps: [
        { text: "Define a smart_step() function that scans right before moving.", code: "def smart_step():\n    if sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_down()" },
        { text: "Use a for loop to get through the hazard zone and collect the first shell.", code: "for i in range(6):\n    smart_step()" },
        { text: "Navigate down, then use move_left to collect the second shell, and loop right to the goal.", code: "sub.move_down()\nsub.move_down()\nfor i in range(2):\n    sub.move_left()\nfor i in range(3):\n    sub.move_right()" },
      ],
    },
  },

  /* ═══════ WORLD 5 — Rescue Mission (Open Ocean Abyss) ═══════ */
  "5-1": {
    title: "Open Waters",
    mission: "Welcome to the Open Ocean Abyss! Review all your skills — define a scanning function, call it in a loop, and navigate past rocks AND jellyfish to collect both shells.",
    hint: "Define a function that scans right: if safe move right, else move down. Call it 13 times in a loop.",
    hints: [
      "Define a function that checks right before moving. If right is dangerous (hazard, rock, or edge), go down instead.",
      "Create def safe_step(): with if sub.scan_right() == \"safe\": move right, else move down. Then use for i in range(13): safe_step().",
      "def safe_step():\n    if sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_down()\n\nfor i in range(13):\n    safe_step()"
    ],
    starterCode: `# Welcome to the Abyss, Captain!\n# Define a scanning function\n# and call it in a loop\n\n`,
    grid: [
      ["empty","empty","empty","hazard","empty","empty","empty","empty"],
      ["empty","rock","empty","empty","sample","rock","empty","empty"],
      ["empty","rock","empty","rock","empty","empty","hazard","empty"],
      ["empty","empty","empty","rock","empty","empty","sample","rock"],
      ["rock","empty","hazard","empty","empty","empty","empty","empty"],
      ["rock","empty","empty","empty","rock","empty","empty","empty"],
      ["rock","empty","empty","empty","rock","empty","empty","goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 2,
    requiresFunction: true,
    requiresScan: true,
    walkedExample: {
      steps: [
        { text: "Define a function that scans right. If safe, go right. If not (hazard, rock, or edge), go down.", code: "def safe_step():\n    if sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_down()" },
        { text: "The path zigzags: right when clear, down when blocked. Call safe_step() 13 times to collect both shells and reach the goal.", code: "for i in range(13):\n    safe_step()" },
      ],
    },
  },
  "5-2": {
    title: "The Swarm",
    mission: "A staircase of rock walls! Use NESTED loops — an outer loop for each step, with inner loops for right moves and down moves — to navigate the corridor and collect all 3 shells.",
    hint: "Each step goes right 2, then down 2. Repeat 3 times. Then move down 1 and right 1 to reach the goal.",
    hints: [
      "Look at the corridor — it's a staircase! Each 'step' moves right 2 then down 2. That's a nested loop: outer loop for the steps, inner loops for the moves.",
      "Use for i in range(3): with two inner loops — for j in range(2): sub.move_right() and for j in range(2): sub.move_down(). Then add sub.move_down() and sub.move_right() at the end.",
      "for i in range(3):\n    for j in range(2):\n        sub.move_right()\n    for j in range(2):\n        sub.move_down()\nsub.move_down()\nsub.move_right()"
    ],
    starterCode: `# Nested loops: a loop INSIDE a loop!\n# The staircase goes: right 2, down 2\n# Repeat that pattern 3 times\n\n`,
    grid: [
      ["empty","empty","sample","rock","rock","rock","rock","rock"],
      ["rock","rock","empty","rock","rock","rock","rock","rock"],
      ["rock","rock","empty","empty","sample","rock","rock","rock"],
      ["rock","rock","rock","rock","empty","rock","rock","rock"],
      ["rock","rock","rock","rock","empty","empty","sample","rock"],
      ["rock","rock","rock","rock","rock","rock","empty","rock"],
      ["rock","rock","rock","rock","rock","rock","empty","empty"],
      ["rock","rock","rock","rock","rock","rock","empty","goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 3,
    requiresNestedLoop: true,
    walkedExample: {
      steps: [
        { text: "The corridor forms a staircase: right 2 → shell, down 2, repeat. That's perfect for nested loops!", code: "# Staircase: right 2, down 2, repeated 3 times" },
        { text: "Use an outer loop (3 repetitions) with two inner loops: one for right moves and one for down moves.", code: "for i in range(3):\n    for j in range(2):\n        sub.move_right()\n    for j in range(2):\n        sub.move_down()" },
        { text: "After the staircase, one more down and one right to reach the treasure.", code: "sub.move_down()\nsub.move_right()" },
      ],
    },
  },
  "5-3": {
    title: "Aurora Path",
    mission: "Three directions! Sometimes down is blocked AND right is blocked — you MUST go left. Use if / elif / else to make three-way decisions through this winding cave.",
    hint: "Use a for loop with: if scan_down safe → down, elif scan_right safe → right, else → left. 16 steps total.",
    hints: [
      "This cave needs THREE-WAY decisions! At certain spots, both below and to the right are jellyfish, so the only safe move is LEFT.",
      "Use a for loop with: if scan_down is safe → move down, elif scan_right is safe → move right, else → move left. The elif handles the second check, and else is the fallback!",
      "for i in range(16):\n    if sub.scan_down() == \"safe\":\n        sub.move_down()\n    elif sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_left()"
    ],
    starterCode: `# Three choices: down, right, or left?\n# Use if / elif / else!\n# elif = \"else if\" — a second check\n\n`,
    grid: [
      ["rock","rock","rock","empty","rock","rock","rock","rock"],
      ["rock","rock","rock","empty","rock","rock","rock","rock"],
      ["rock","rock","empty","sample","hazard","rock","rock","rock"],
      ["rock","rock","empty","hazard","empty","rock","rock","rock"],
      ["rock","empty","sample","hazard","empty","rock","rock","rock"],
      ["rock","empty","hazard","empty","empty","rock","rock","rock"],
      ["rock","empty","empty","empty","empty","empty","empty","rock"],
      ["rock","empty","empty","empty","empty","empty","empty","goal"],
    ],
    startPos: { row: 0, col: 3 },
    targetCollect: 2,
    requiresElif: true,
    requiresScan: true,
    walkedExample: {
      steps: [
        { text: "This cave has dead ends where BOTH down and right are jellyfish. You need THREE branches: if (down), elif (right), else (left).", code: "# At some spots:\n# down = jellyfish, right = jellyfish\n# Only option: go LEFT!" },
        { text: "Wrap the three-way if/elif/else in a for loop. 16 steps navigates the whole cave — the else branch saves you from dead ends!", code: "for i in range(16):\n    if sub.scan_down() == \"safe\":\n        sub.move_down()\n    elif sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_left()" },
      ],
    },
  },
  "5-4": {
    title: "Leviathan's Lair",
    mission: "Two challenges in one! First, use NESTED LOOPS to navigate a rock staircase. Then define a FUNCTION with elif scanning to navigate past jellyfish. Combine everything!",
    hint: "Phase 1: nested loop (right 3, down 1) × 2. Phase 2: define a scan_step() function with if/elif/else, call it 8 times.",
    hints: [
      "This level has TWO sections. First: a rock staircase (nested loops: right 3, down 1, repeat 2 times). Second: jellyfish obstacles (function with elif scanning).",
      "For the staircase: for i in range(2): for j in range(3): sub.move_right() then sub.move_down(). For the jellyfish: define scan_step() with if down safe/elif right safe/else left, then loop 8 times.",
      "def scan_step():\n    if sub.scan_down() == \"safe\":\n        sub.move_down()\n    elif sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_left()\n\nfor i in range(2):\n    for j in range(3):\n        sub.move_right()\n    sub.move_down()\n\nfor i in range(8):\n    scan_step()"
    ],
    starterCode: `# Two phases in one level!\n# Phase 1: Nested loops for the staircase\n# Phase 2: Function with elif for jellyfish\n\n`,
    grid: [
      ["empty","empty","empty","sample","rock","rock","rock","rock"],
      ["rock","rock","rock","empty","rock","rock","rock","rock"],
      ["rock","rock","rock","empty","empty","empty","sample","rock"],
      ["rock","rock","rock","rock","rock","empty","empty","hazard"],
      ["rock","rock","rock","rock","rock","empty","hazard","rock"],
      ["rock","rock","rock","rock","rock","sample","empty","rock"],
      ["rock","rock","rock","rock","rock","empty","empty","rock"],
      ["rock","rock","rock","rock","rock","empty","empty","goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 3,
    requiresFunction: true,
    requiresElif: true,
    requiresNestedLoop: true,
    walkedExample: {
      steps: [
        { text: "Phase 1: The top section is a rock staircase. Use nested loops: right 3, down 1, repeated 2 times.", code: "for i in range(2):\n    for j in range(3):\n        sub.move_right()\n    sub.move_down()" },
        { text: "Phase 2: Define a function with three-way scanning for the jellyfish zone below.", code: "def scan_step():\n    if sub.scan_down() == \"safe\":\n        sub.move_down()\n    elif sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_left()" },
        { text: "Call scan_step() 8 times to navigate past the jellyfish, collect the last shell, and reach the treasure.", code: "for i in range(8):\n    scan_step()" },
      ],
    },
  },
  "5-5": {
    title: "The Rescue",
    mission: "THE FINAL MISSION! Use EVERYTHING — functions, nested loops, elif scanning — to descend through vertical chambers, dodge jellyfish traps, and rescue the lost expedition!",
    hint: "Phase 1: nested loop (down 2, right 1) × 2 to descend. Phase 2: define explore() with if/elif/else, call it 10 times.",
    hints: [
      "This level descends vertically! Phase 1: nested loops with down 2, right 1, repeated 2 times. Phase 2: a function with elif scanning to navigate the jellyfish trap zone.",
      "For Phase 1: for i in range(2): for j in range(2): sub.move_down() then sub.move_right(). For Phase 2: define explore() with if scan_down/elif scan_right/else move_left, loop 10 times.",
      "def explore():\n    if sub.scan_down() == \"safe\":\n        sub.move_down()\n    elif sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_left()\n\nfor i in range(2):\n    for j in range(2):\n        sub.move_down()\n    sub.move_right()\n\nfor i in range(10):\n    explore()"
    ],
    starterCode: `# THE FINAL RESCUE!\n# Combine ALL your skills:\n# Functions + Nested Loops + elif + Scanning\n\n`,
    grid: [
      ["empty","rock","rock","rock","rock","rock","rock","rock"],
      ["sample","rock","rock","rock","rock","rock","rock","rock"],
      ["empty","empty","rock","rock","rock","rock","rock","rock"],
      ["rock","sample","rock","rock","rock","rock","rock","rock"],
      ["rock","empty","empty","hazard","rock","rock","rock","rock"],
      ["rock","empty","empty","hazard","empty","empty","empty","rock"],
      ["rock","empty","hazard","empty","empty","empty","empty","rock"],
      ["rock","empty","empty","empty","sample","empty","empty","goal"],
    ],
    startPos: { row: 0, col: 0 },
    targetCollect: 3,
    requiresFunction: true,
    requiresScan: true,
    requiresElif: true,
    requiresNestedLoop: true,
    walkedExample: {
      steps: [
        { text: "Phase 1: Descend through vertical chambers. Use nested loops: down 2, right 1, repeated 2 times.", code: "for i in range(2):\n    for j in range(2):\n        sub.move_down()\n    sub.move_right()" },
        { text: "Phase 2: Define explore() with three-way scanning for the jellyfish trap zone below.", code: "def explore():\n    if sub.scan_down() == \"safe\":\n        sub.move_down()\n    elif sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_left()" },
        { text: "Call explore() 10 times to dodge the jellyfish trap, collect the final shell, and complete the ULTIMATE RESCUE!", code: "for i in range(10):\n    explore()" },
      ],
    },
  },
};

/* ── Instruction tree types ──────────────────────────────────── */
type Instruction =
  | { type: "move"; action: string; line: number }
  | { type: "if"; scanDir: string; expected: string; ifBody: Instruction[]; elifBranches: { scanDir: string; expected: string; body: Instruction[] }[]; elseBody: Instruction[]; line: number }
  | { type: "for"; count: number; body: Instruction[]; line: number }
  | { type: "funcdef"; name: string; body: Instruction[]; line: number }
  | { type: "call"; name: string; line: number };

interface FlatCommand {
  action: string;
  scanLog?: string;
  sourceLine: number;
}

/* ── Parser helpers ──────────────────────────────────────────── */
function getIndent(line: string): number {
  const m = line.match(/^(\s*)/);
  return m ? m[1].length : 0;
}

function parseBlock(
  lines: string[],
  startIdx: number,
  minIndent: number
): { instructions: Instruction[]; nextIdx: number } {
  const instructions: Instruction[] = [];
  let i = startIdx;

  while (i < lines.length) {
    const raw = lines[i];
    const indent = getIndent(raw);
    const trimmed = raw.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      i++;
      continue;
    }

    if (indent < minIndent) break;

    // For loop
    const forMatch = trimmed.match(/for\s+\w+\s+in\s+range\((\d+)\)\s*:/);
    if (forMatch) {
      const count = parseInt(forMatch[1]);
      const { instructions: body, nextIdx } = parseBlock(lines, i + 1, indent + 1);
      instructions.push({ type: "for", count, body, line: i });
      i = nextIdx;
      continue;
    }

    // If statement
    const ifMatch = trimmed.match(
      /if\s+sub\.(scan_\w+)\(\)\s*==\s*["'](\w+)["']\s*:/
    );
    if (ifMatch) {
      const ifIndent = indent;
      const { instructions: ifBody, nextIdx: afterIf } = parseBlock(lines, i + 1, indent + 1);
      const elifBranches: { scanDir: string; expected: string; body: Instruction[] }[] = [];
      let elseBody: Instruction[] = [];
      let nextI = afterIf;

      // Collect elif branches
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // Skip blanks / comments
        while (
          nextI < lines.length &&
          (!lines[nextI].trim() || lines[nextI].trim().startsWith("#"))
        )
          nextI++;

        if (nextI >= lines.length || getIndent(lines[nextI]) !== ifIndent) break;

        const elifMatch = lines[nextI].trim().match(
          /elif\s+sub\.(scan_\w+)\(\)\s*==\s*["'](\w+)["']\s*:/
        );
        if (elifMatch) {
          const { instructions: elifBody, nextIdx: afterElif } = parseBlock(lines, nextI + 1, indent + 1);
          elifBranches.push({ scanDir: elifMatch[1], expected: elifMatch[2], body: elifBody });
          nextI = afterElif;
          continue;
        }

        // Check for else (terminal)
        if (lines[nextI].trim().startsWith("else")) {
          const { instructions: eb, nextIdx: afterElse } = parseBlock(lines, nextI + 1, indent + 1);
          elseBody = eb;
          nextI = afterElse;
        }
        break;
      }

      instructions.push({
        type: "if",
        scanDir: ifMatch[1],
        expected: ifMatch[2],
        ifBody,
        elifBranches,
        elseBody,
        line: i,
      });
      i = nextI;
      continue;
    }

    // Function definition
    const defMatch = trimmed.match(/^def\s+(\w+)\(\)\s*:/);
    if (defMatch) {
      const { instructions: body, nextIdx } = parseBlock(lines, i + 1, indent + 1);
      instructions.push({ type: "funcdef", name: defMatch[1], body, line: i });
      i = nextIdx;
      continue;
    }

    // Direct move command
    const cmdMatch = trimmed.match(/sub\.(move_\w+)\(\)/);
    if (cmdMatch) {
      instructions.push({ type: "move", action: cmdMatch[1], line: i });
      i++;
      continue;
    }

    // Function call (bare name(), must come after sub.move_* check)
    const callMatch = trimmed.match(/^(\w+)\(\)$/);
    if (callMatch) {
      instructions.push({ type: "call", name: callMatch[1], line: i });
    }

    i++;
  }

  return { instructions, nextIdx: i };
}

/* ── Scan evaluation — checks the adjacent cell ──────────────── */
function scanCell(
  grid: CellType[][],
  pos: { row: number; col: number },
  dir: string
): "safe" | "danger" {
  let r = pos.row;
  let c = pos.col;
  if (dir === "scan_right") c++;
  else if (dir === "scan_left") c--;
  else if (dir === "scan_down") r++;
  else if (dir === "scan_up") r--;

  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return "danger";
  const cell = grid[r][c];
  if (cell === "hazard" || cell === "rock") return "danger";
  return "safe";
}

/* ── Simulate a move for position tracking during flattening ─── */
function simulateMove(
  state: { pos: { row: number; col: number }; grid: CellType[][] },
  action: string
) {
  let nr = state.pos.row;
  let nc = state.pos.col;
  if (action === "move_right") nc++;
  else if (action === "move_left") nc--;
  else if (action === "move_down") nr++;
  else if (action === "move_up") nr--;

  if (nr < 0 || nr >= state.grid.length || nc < 0 || nc >= state.grid[0].length) return;
  if (state.grid[nr][nc] === "rock") return;

  state.pos = { row: nr, col: nc };
  if (state.grid[nr][nc] === "sample") state.grid[nr][nc] = "collected";
}

/* ── Flatten instruction tree → executable command list ───────── */
function flattenInstructions(
  instrs: Instruction[],
  state: { pos: { row: number; col: number }; grid: CellType[][]; funcs: Map<string, Instruction[]> }
): FlatCommand[] {
  const result: FlatCommand[] = [];

  for (const instr of instrs) {
    if (instr.type === "move") {
      result.push({ action: instr.action, sourceLine: instr.line });
      simulateMove(state, instr.action);
    } else if (instr.type === "for") {
      for (let k = 0; k < instr.count; k++) {
        result.push(...flattenInstructions(instr.body, state));
      }
    } else if (instr.type === "funcdef") {
      state.funcs.set(instr.name, instr.body);
    } else if (instr.type === "call") {
      const body = state.funcs.get(instr.name);
      if (body) {
        const callCmds = flattenInstructions(body, state);
        callCmds.forEach((c) => { c.sourceLine = instr.line; });
        result.push(...callCmds);
      }
    } else if (instr.type === "if") {
      const scanResult = scanCell(state.grid, state.pos, instr.scanDir);
      const dirName = instr.scanDir.replace("scan_", "");
      let allScanLogs = `\u{1F50D} Scanned ${dirName}: ${scanResult}`;

      let chosenBranch: Instruction[] | null = null;

      if (scanResult === instr.expected) {
        chosenBranch = instr.ifBody;
      } else {
        for (const elif of instr.elifBranches) {
          const elifResult = scanCell(state.grid, state.pos, elif.scanDir);
          const elifDir = elif.scanDir.replace("scan_", "");
          allScanLogs += `\n\u{1F50D} Scanned ${elifDir}: ${elifResult}`;
          if (elifResult === elif.expected) {
            chosenBranch = elif.body;
            break;
          }
        }
        if (!chosenBranch) chosenBranch = instr.elseBody;
      }

      const branchFlat = flattenInstructions(chosenBranch, state);

      if (branchFlat.length > 0) {
        branchFlat[0] = {
          ...branchFlat[0],
          scanLog: allScanLogs + (branchFlat[0].scanLog ? "\n" + branchFlat[0].scanLog : ""),
          sourceLine: instr.line,
        };
      } else {
        result.push({ action: "noop", scanLog: allScanLogs, sourceLine: instr.line });
      }
      result.push(...branchFlat);
    }
  }

  return result;
}

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
  const [scanWarning, setScanWarning] = useState(false);
  const [functionWarning, setFunctionWarning] = useState(false);
  const [nestedLoopWarning, setNestedLoopWarning] = useState(false);
  const [elifWarning, setElifWarning] = useState(false);
  const [direction, setDirection] = useState<"right" | "left" | "up" | "down">("right");
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [failCount, setFailCount] = useState(0);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [stepCommands, setStepCommands] = useState<FlatCommand[] | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const stepStateRef = useRef<{
    pos: { row: number; col: number };
    oxy: number;
    coll: number;
    currentGrid: CellType[][];
    logs: string[];
  } | null>(null);

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
    setScanWarning(false);
    setFunctionWarning(false);
    setNestedLoopWarning(false);
    setElifWarning(false);
    setDirection("right");
    setCurrentLine(null);
    setStepCommands(null);
    setStepIndex(0);
    stepStateRef.current = null;
  }, [levelData]);

  /* Auto-reset when navigating to a new level */
  useEffect(() => {
    reset();
    setFailCount(0);
  }, [reset]);

  const runCode = useCallback(
    (code: string) => {
      reset();
      setIsRunning(true);
      setOutput(["▶ Running code..."]);

      // 0. Syntax check — catch common mistakes before parsing
      const syntaxErrors = checkSyntax(code);
      const criticalErrors = syntaxErrors.filter((e) => e.severity === "error");
      if (criticalErrors.length > 0) {
        const errorLogs = ["▶ Running code...", ""];
        criticalErrors.forEach((e) => {
          errorLogs.push(`✗ Line ${e.line}: ${e.message}`);
        });
        errorLogs.push("", "Fix the errors above and try again!");
        setOutput(errorLogs);
        setIsRunning(false);
        return;
      }
      // Show warnings but continue execution
      const warnings = syntaxErrors.filter((e) => e.severity === "warning");
      if (warnings.length > 0) {
        const warnLogs = ["▶ Running code..."];
        warnings.forEach((w) => {
          warnLogs.push(`⚠ Line ${w.line}: ${w.message}`);
        });
        setOutput(warnLogs);
      }

      // 1. Parse code into instruction tree (handles for, if/else, nested blocks)
      const lines = code.split("\n");
      const { instructions } = parseBlock(lines, 0, 0);

      // 2. Flatten tree → executable commands, evaluating conditionals at runtime
      const simGrid = levelData.grid.map((r) => [...r]);
      const simState = { pos: { ...levelData.startPos }, grid: simGrid, funcs: new Map<string, Instruction[]>() };
      const commands = flattenInstructions(instructions, simState);

      // 3. Execute commands with animation
      let pos = { ...levelData.startPos };
      let oxy = 100;
      let coll = 0;
      let currentGrid = levelData.grid.map((r) => [...r]);
      const logs: string[] = ["▶ Running code..."];

      const delayMs = speed === "slow" ? 900 : speed === "fast" ? 200 : 500;

      commands.forEach((cmd, idx) => {
        const t = setTimeout(() => {
          setCurrentLine(cmd.sourceLine);

          // Show scan log if present
          if (cmd.scanLog) {
            cmd.scanLog.split("\n").forEach((msg) => logs.push(msg));
            setOutput([...logs]);
          }

          // Handle noop (scan-only step, no movement)
          if (cmd.action === "noop") {
            if (idx === commands.length - 1) {
              setIsRunning(false);
              setCurrentLine(null);
              if (coll < levelData.targetCollect) {
                logs.push(`⚠ Need ${levelData.targetCollect - coll} more sample(s)`);
              }
              if (currentGrid[pos.row][pos.col] !== "goal") {
                logs.push("⚠ Reach the goal (🏁) to complete the mission");
              }
              setOutput([...logs]);
              setFailCount((f) => f + 1);
            }
            return;
          }

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
            setIsRunning(false);
            setCurrentLine(null);
            setFailCount((f) => f + 1);
            playErrorSound();
            return;
          }

          // Rock check
          if (currentGrid[newRow][newCol] === "rock") {
            logs.push(`✗ Cannot move ${dir.replace("move_", "")} - blocked by rock!`);
            setOutput([...logs]);
            setIsRunning(false);
            setCurrentLine(null);
            setFailCount((f) => f + 1);
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
            if (levelData.requiresScan) {
              const codeLines = code.split("\n").filter((l) => !l.trim().startsWith("#"));
              const usesScan = codeLines.some((l) => /if\s+sub\.scan_\w+\(\)/.test(l));
              if (!usesScan) {
                logs.push("\u26A0 You reached the treasure! But cave explorers MUST use their sonar scanner.");
                logs.push('Try using: if sub.scan_right() == "safe": before your moves!');
                setOutput([...logs]);
                setScanWarning(true);
                return;
              }
            }
            if (levelData.requiresFunction) {
              const codeLines = code.split("\n").filter((l) => !l.trim().startsWith("#"));
              const usesFunc = codeLines.some((l) => /def\s+\w+\(\)\s*:/.test(l));
              if (!usesFunc) {
                logs.push("\u26A0 You reached the goal! But trench explorers MUST use functions.");
                logs.push("Try defining: def my_move(): with your commands inside!");
                setOutput([...logs]);
                setFunctionWarning(true);
                return;
              }
            }
            if (levelData.requiresNestedLoop) {
              const codeLines = code.split("\n").filter((l) => !l.trim().startsWith("#"));
              let hasNested = false;
              for (let li = 0; li < codeLines.length - 1; li++) {
                if (/for\s+\w+\s+in\s+range\(\d+\)\s*:/.test(codeLines[li].trim())) {
                  const outerIndent = getIndent(codeLines[li]);
                  for (let lj = li + 1; lj < codeLines.length; lj++) {
                    const innerIndent = getIndent(codeLines[lj]);
                    if (innerIndent <= outerIndent && codeLines[lj].trim()) break;
                    if (/for\s+\w+\s+in\s+range\(\d+\)\s*:/.test(codeLines[lj].trim()) && innerIndent > outerIndent) {
                      hasNested = true; break;
                    }
                  }
                  if (hasNested) break;
                }
              }
              if (!hasNested) {
                logs.push("\u26A0 You reached the goal! But this mission requires a nested loop (a loop inside a loop).");
                setOutput([...logs]);
                setNestedLoopWarning(true);
                return;
              }
            }
            if (levelData.requiresElif) {
              const codeLines = code.split("\n").filter((l) => !l.trim().startsWith("#"));
              const usesElif = codeLines.some((l) => /^\s*elif\s+/.test(l));
              if (!usesElif) {
                logs.push("\u26A0 You reached the goal! But this mission requires elif for multi-branch decisions.");
                setOutput([...logs]);
                setElifWarning(true);
                return;
              }
            }
            logs.push("\u2713 Mission complete! All samples collected!");
            setIsComplete(true);
            setCurrentLine(null);
          }

          logs.push(`→ ${dir.replace("move_", "Moved ")}`);
          setOutput([...logs]);

          // Last command
          if (idx === commands.length - 1) {
            setIsRunning(false);
            setCurrentLine(null);
            if (!logs.some((l) => l.includes("Mission complete"))) {
              if (coll < levelData.targetCollect) {
                logs.push(`⚠ Need ${levelData.targetCollect - coll} more sample(s)`);
              }
              if (currentGrid[pos.row][pos.col] !== "goal") {
                logs.push("⚠ Reach the goal (🏁) to complete the mission");
              }
              setOutput([...logs]);
              setFailCount((f) => f + 1);
            }
          }
        }, (idx + 1) * delayMs);

        timeoutsRef.current.push(t);
      });

      if (commands.length === 0) {
        setOutput(["✗ No valid commands found. Use sub.move_right(), sub.move_down(), etc."]);
        setIsRunning(false);
      }
    },
    [levelData, reset, speed]
  );

  /* ── Step mode: prepare commands, then execute one at a time ── */
  const startStep = useCallback(
    (code: string) => {
      reset();
      setOutput(["▶ Step mode — press NEXT STEP to execute each line..."]);

      const syntaxErrors = checkSyntax(code);
      const criticalErrors = syntaxErrors.filter((e) => e.severity === "error");
      if (criticalErrors.length > 0) {
        const errorLogs = ["▶ Step mode...", ""];
        criticalErrors.forEach((e) => {
          errorLogs.push(`✗ Line ${e.line}: ${e.message}`);
        });
        errorLogs.push("", "Fix the errors above and try again!");
        setOutput(errorLogs);
        return;
      }

      const lines = code.split("\n");
      const { instructions } = parseBlock(lines, 0, 0);
      const simGrid = levelData.grid.map((r) => [...r]);
      const simState = { pos: { ...levelData.startPos }, grid: simGrid, funcs: new Map<string, Instruction[]>() };
      const commands = flattenInstructions(instructions, simState);

      if (commands.length === 0) {
        setOutput(["✗ No valid commands found."]);
        return;
      }

      setStepCommands(commands);
      setStepIndex(0);
      setIsRunning(true);
      stepStateRef.current = {
        pos: { ...levelData.startPos },
        oxy: 100,
        coll: 0,
        currentGrid: levelData.grid.map((r) => [...r]),
        logs: ["▶ Step mode — press NEXT STEP to execute each line..."],
      };
      setCurrentLine(commands[0].sourceLine);
    },
    [levelData, reset]
  );

  const executeStep = useCallback(
    (code: string) => {
      if (!stepCommands || !stepStateRef.current) return;
      const idx = stepIndex;
      if (idx >= stepCommands.length) return;

      const cmd = stepCommands[idx];
      const st = stepStateRef.current;
      const { logs } = st;

      if (cmd.scanLog) {
        cmd.scanLog.split("\n").forEach((msg) => logs.push(msg));
        setOutput([...logs]);
      }

      if (cmd.action === "noop") {
        const nextIdx = idx + 1;
        if (nextIdx >= stepCommands.length) {
          setIsRunning(false);
          setCurrentLine(null);
          setStepCommands(null);
          setFailCount((f) => f + 1);
        } else {
          setStepIndex(nextIdx);
          setCurrentLine(stepCommands[nextIdx]?.sourceLine ?? null);
        }
        setOutput([...logs]);
        return;
      }

      const dir = cmd.action;
      let newRow = st.pos.row;
      let newCol = st.pos.col;

      if (dir === "move_right") newCol++;
      else if (dir === "move_left") newCol--;
      else if (dir === "move_down") newRow++;
      else if (dir === "move_up") newRow--;

      if (newRow < 0 || newRow >= st.currentGrid.length || newCol < 0 || newCol >= st.currentGrid[0].length) {
        logs.push(`✗ Cannot move ${dir.replace("move_", "")} - out of bounds!`);
        setOutput([...logs]);
        setIsRunning(false);
        setCurrentLine(null);
        setStepCommands(null);
        setFailCount((f) => f + 1);
        playErrorSound();
        return;
      }

      if (st.currentGrid[newRow][newCol] === "rock") {
        logs.push(`✗ Cannot move ${dir.replace("move_", "")} - blocked by rock!`);
        setOutput([...logs]);
        setIsRunning(false);
        setCurrentLine(null);
        setStepCommands(null);
        setFailCount((f) => f + 1);
        playErrorSound();
        return;
      }

      if (st.currentGrid[newRow][newCol] === "hazard") {
        logs.push(`✗ Hit a hazard! Oxygen depleted by 20%`);
        st.oxy = Math.max(0, st.oxy - 20);
        setOxygen(st.oxy);
        playHazardSound();
      }

      st.pos = { row: newRow, col: newCol };
      st.oxy = Math.max(0, st.oxy - 5);
      setOxygen(st.oxy);
      setSubPos({ ...st.pos });
      setDirection(dir.replace("move_", "") as "right" | "left" | "up" | "down");
      playMoveSound();

      if (st.currentGrid[newRow][newCol] === "sample") {
        st.coll++;
        st.currentGrid[newRow][newCol] = "collected";
        setGrid(st.currentGrid.map((r) => [...r]));
        setCollected(st.coll);
        logs.push(`🐚 Collected sample! (${st.coll}/${levelData.targetCollect})`);
        playCollectSound();
      }

      if (st.currentGrid[newRow][newCol] === "goal" && st.coll >= levelData.targetCollect) {
        if (levelData.requiresScan) {
          const codeLines = code.split("\n").filter((l) => !l.trim().startsWith("#"));
          const usesScan = codeLines.some((l) => /if\s+sub\.scan_\w+\(\)/.test(l));
          if (!usesScan) {
            logs.push("\u26A0 You reached the treasure! But cave explorers MUST use their sonar scanner.");
            setOutput([...logs]);
            setScanWarning(true);
            return;
          }
        }
        if (levelData.requiresFunction) {
          const codeLines = code.split("\n").filter((l) => !l.trim().startsWith("#"));
          const usesFunc = codeLines.some((l) => /def\s+\w+\(\)\s*:/.test(l));
          if (!usesFunc) {
            logs.push("\u26A0 You reached the goal! But trench explorers MUST use functions.");
            setOutput([...logs]);
            setFunctionWarning(true);
            return;
          }
        }
        if (levelData.requiresNestedLoop) {
          const codeLines = code.split("\n").filter((l) => !l.trim().startsWith("#"));
          let hasNested = false;
          for (let li = 0; li < codeLines.length - 1; li++) {
            if (/for\s+\w+\s+in\s+range\(\d+\)\s*:/.test(codeLines[li].trim())) {
              const outerIndent = getIndent(codeLines[li]);
              for (let lj = li + 1; lj < codeLines.length; lj++) {
                const innerIndent = getIndent(codeLines[lj]);
                if (innerIndent <= outerIndent && codeLines[lj].trim()) break;
                if (/for\s+\w+\s+in\s+range\(\d+\)\s*:/.test(codeLines[lj].trim()) && innerIndent > outerIndent) {
                  hasNested = true; break;
                }
              }
              if (hasNested) break;
            }
          }
          if (!hasNested) {
            logs.push("\u26A0 You reached the goal! But this mission requires a nested loop.");
            setOutput([...logs]);
            setNestedLoopWarning(true);
            return;
          }
        }
        if (levelData.requiresElif) {
          const codeLines = code.split("\n").filter((l) => !l.trim().startsWith("#"));
          const usesElif = codeLines.some((l) => /^\s*elif\s+/.test(l));
          if (!usesElif) {
            logs.push("\u26A0 You reached the goal! But this mission requires elif.");
            setOutput([...logs]);
            setElifWarning(true);
            return;
          }
        }
        logs.push("\u2713 Mission complete! All samples collected!");
        setIsComplete(true);
        setIsRunning(false);
        setCurrentLine(null);
        setStepCommands(null);
      }

      logs.push(`→ ${dir.replace("move_", "Moved ")}`);
      setOutput([...logs]);

      const nextIdx = idx + 1;
      if (nextIdx >= stepCommands.length && !logs.some((l) => l.includes("Mission complete"))) {
        setIsRunning(false);
        setCurrentLine(null);
        setStepCommands(null);
        if (st.coll < levelData.targetCollect) {
          logs.push(`⚠ Need ${levelData.targetCollect - st.coll} more sample(s)`);
        }
        if (st.currentGrid[st.pos.row][st.pos.col] !== "goal") {
          logs.push("⚠ Reach the goal (🏁) to complete the mission");
        }
        setOutput([...logs]);
        setFailCount((f) => f + 1);
      } else if (nextIdx < stepCommands.length) {
        setStepIndex(nextIdx);
        setCurrentLine(stepCommands[nextIdx].sourceLine);
      }
    },
    [stepCommands, stepIndex, levelData]
  );

  const isStepping = stepCommands !== null;

  return {
    grid, subPos, oxygen, collected, output, isRunning, isComplete,
    scanWarning, functionWarning, nestedLoopWarning, elifWarning,
    direction, currentLine, failCount,
    speed, setSpeed, isStepping,
    runCode, startStep, executeStep, reset,
  };
}
