import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

interface TutorialStep {
  title: string;
  description: string;
  code?: string;
  tip?: string; // interactive "Try this!" callout
}

/* ═══════════════════════════════════════════════════════════════
   LEVEL TUTORIALS  –  written for 7-12 year-old students
   ═══════════════════════════════════════════════════════════════ */
const LEVEL_TUTORIALS: Record<string, TutorialStep[]> = {

  /* ──────── LEVEL 1-1 : First Dive ──────── */
  "1-1": [
    {
      title: "Welcome Aboard, Captain! \u{1F30A}",
      description:
        "You are the captain of a tiny submarine exploring the ocean!\n\nYour job is to write code that tells the submarine where to go.\n\nCollect all the shells \u{1F41A} and swim to the treasure chest \u{1F3C1} to complete each level.",
      tip: "Look at the left side of the screen \u2014 can you spot the submarine, the shell, and the treasure chest?",
    },
    {
      title: "How to Move Your Sub \u{1F6F3}\uFE0F",
      description:
        "Your submarine knows 4 commands. Each one moves it one square:",
      code: "sub.move_right()   # Go right \u2192\nsub.move_left()    # Go left  \u2190\nsub.move_down()    # Go down  \u2193\nsub.move_up()      # Go up    \u2191",
      tip: "Each command goes on its OWN line. Think of it like giving directions one step at a time!",
    },
    {
      title: "Let\u2019s Play! \u{1F3AE}",
      description:
        "Here\u2019s how it works:\n\n1\uFE0F\u20E3  Look at the ocean on the left \u2014 find the shell and the chest\n2\uFE0F\u20E3  Type your commands in the code box on the right\n3\uFE0F\u20E3  Press the green RUN button\n4\uFE0F\u20E3  Watch your submarine follow your instructions!\n\nMade a mistake? No worries! Hit Reset and try again. Even real programmers do that all the time!",
    },
    {
      title: "One More Thing \u2014 Oxygen! \u{1F4A8}",
      description:
        "Your submarine uses a little oxygen every time it moves. See the O\u2082 bar at the top of the screen?\n\nDon\u2019t worry \u2014 you have plenty for this level!\n\nReady, Captain? Close this window and start coding!",
      tip: "We already put some code in the editor to get you started. Try pressing RUN to see what happens, then add more commands!",
    },
  ],

  /* ──────── LEVEL 1-2 : Reef Path ──────── */
  "1-2": [
    {
      title: "Watch Out \u2014 Rocks Ahead! \u{1FAA8}",
      description:
        "Uh oh \u2014 there are big rocks in the ocean now!\n\nIf you try to move into a rock, your submarine gets stuck and can\u2019t go that way. You need to find a path AROUND the rocks.",
      tip: "Look at the ocean grid. Can you spot the rocks? They\u2019re the grey boulders blocking some squares.",
    },
    {
      title: "Think First, Code Second \u{1F9E0}",
      description:
        "Here\u2019s a secret that real programmers use:\n\nBefore you type any code, LOOK at the grid and plan a route.\n\n\u{1F441}\uFE0F  Where are the shells?\n\u{1F441}\uFE0F  Where are the rocks?\n\u{1F441}\uFE0F  What path can the sub take from start \u2192 shells \u2192 goal?\n\nTrace it with your eyes first!",
      code: "# An example path around rocks:\nsub.move_right()\nsub.move_down()\nsub.move_down()\nsub.move_right()",
    },
    {
      title: "You\u2019ve Got This! \u{1F4AA}",
      description:
        "You already know all the commands you need from Level 1!\n\nJust combine them in the right order to dodge the rocks and collect both shells.\n\nIf you get stuck, tap the yellow Hint button \u2014 it\u2019s there to help, not to judge!",
      tip: "We put one command in the editor to start you off. Press RUN to see it move, then add more commands below it!",
    },
  ],

  /* ──────── LEVEL 1-3 : Deep Collector ──────── */
  "1-3": [
    {
      title: "Tired of Typing the Same Thing? \u{1F605}",
      description:
        "Imagine you needed to move right 10 times.\n\nWould you really type sub.move_right() ten whole times? That\u2019s SO much typing!\n\nGood news \u2014 there\u2019s a super-cool shortcut called a FOR LOOP! It repeats a command as many times as you want.",
    },
    {
      title: "Meet the For Loop! \u{1F504}",
      description:
        "Here\u2019s how a for loop works:\n\nThe number inside range() is how many times it repeats.\n\nThe line underneath that\u2019s pushed to the right (we call that an \"indent\") is what gets repeated.",
      code: "# This moves right 3 times:\nfor i in range(3):\n    sub.move_right()\n\n# It does the same thing as:\n# sub.move_right()\n# sub.move_right()\n# sub.move_right()",
      tip: "See the spaces before sub.move_right()? Those spaces (called an indent) are SUPER important! They tell the computer which line to repeat.",
    },
    {
      title: "Your Turn! \u{1F3AF}",
      description:
        "Look at the grid \u2014 there are 3 shells in a row going right, then the treasure chest at the end.\n\nHow many total steps right do you need? Count them on the grid, then put that number in range()!",
      code: "for i in range( ??? ):\n    sub.move_right()",
      tip: "Count from the submarine to the treasure chest. How many squares is that? Replace the ??? with that number!",
    },
  ],

  /* ──────── LEVEL 1-4 : Shell Spiral ──────── */
  "1-4": [
    {
      title: "Time to Chain Loops! \u{1F517}",
      description:
        "In the last level you used ONE loop. But what if you need to go right AND then down?\n\nEasy \u2014 just write TWO loops! When the first loop finishes, the second one starts.\n\nIt\u2019s like giving directions: \"Go right 3 blocks, then go down 2 blocks.\"",
    },
    {
      title: "Loop + Loop = Power! \u26A1",
      description:
        "Check this out \u2014 two loops, one after the other:",
      code: "# First, go right 3 times\nfor i in range(3):\n    sub.move_right()\n\n# Then, go down 2 times\nfor i in range(2):\n    sub.move_down()",
      tip: "You can also mix loops with single commands! Use a loop for the long parts and a single command for short ones.",
    },
    {
      title: "Plan Your Spiral! \u{1F5FA}\uFE0F",
      description:
        "Look at the grid. The shells aren\u2019t all in one line anymore \u2014 some are to the right and some are further down.\n\nBreak your path into pieces:\n\u2022 Piece 1: Go right to collect the top shells\n\u2022 Piece 2: Go down toward the bottom shell\n\u2022 Piece 3: Reach the goal!\n\nEach straight piece can be its own loop!",
      code: "# Mix loops and single commands:\nfor i in range(2):\n    sub.move_right()\nsub.move_down()\nfor i in range(3):\n    sub.move_right()",
      tip: "Count the steps for each piece on the grid. How many right? How many down? Write a loop for each!",
    },
  ],

  /* ──────── LEVEL 1-5 : Coral Maze ──────── */
  "1-5": [
    {
      title: "The Final Challenge! \u{1F3C6}",
      description:
        "WOW \u2014 you made it to the LAST level of the Coral Reef world!\n\nYou\u2019ve already learned SO much:\n\u2705  Moving the submarine in any direction\n\u2705  Navigating around rocks\n\u2705  Using for loops to save time\n\u2705  Chaining loops together\n\nTime to put it ALL together!",
    },
    {
      title: "Think Like an Explorer \u{1F9ED}",
      description:
        "This maze looks tricky, but here\u2019s the secret:\n\n1\uFE0F\u20E3  Look at the grid and trace a path with your eyes\n2\uFE0F\u20E3  Break the path into straight-line segments\n3\uFE0F\u20E3  Count the steps in each segment\n4\uFE0F\u20E3  Write a for loop for each one!\n\nIt\u2019s like giving directions: \"Go down 2 blocks, turn right for 2 blocks\u2026\"",
      code: "# Break it into segments:\nfor i in range(2):\n    sub.move_down()\nfor i in range(2):\n    sub.move_right()\n# ... what comes next?",
      tip: "Don\u2019t try to solve it all at once! Write the first segment, press RUN to test it, then add the next piece.",
    },
    {
      title: "You\u2019re a Real Coder Now! \u{1F31F}",
      description:
        "You\u2019ve already solved 4 levels \u2014 that makes you an ocean coding expert!\n\nTake your time, plan your route, and remember:\nThe Reset button is your best friend if you need a fresh start.\n\nGood luck, Captain \u2014 we believe in you!",
      tip: "After you beat this level, a whole new world is waiting for you!",
    },
  ],

  /* ──────── LEVEL 2-1 : Ship Entrance ──────── */
  "2-1": [
    {
      title: "Welcome to the Sunken Ship! \u{1F6A2}",
      description:
        "You\u2019ve discovered a mysterious sunken ship at the bottom of the ocean!\n\nInside, the hallways are long and straight \u2014 perfect for your loop skills from World 1.\n\nLet\u2019s explore!",
      tip: "See the walls (grey rocks) forming corridors? Your sub needs to find the gaps to get through!",
    },
    {
      title: "Corridors and Gaps \u{1F6AA}",
      description:
        "Ship hallways are blocked by walls. Look for the gaps \u2014 that\u2019s where your sub can slip through!\n\nUse a loop for each long straight section, and a single command when you need to turn or squeeze through a gap.",
      code: "# Go right along a hallway\nfor i in range(4):\n    sub.move_right()\n\n# Slip through a gap\nsub.move_down()",
      tip: "We put the first loop in the editor already. Press RUN to see it, then add more commands!",
    },
  ],

  /* ──────── LEVEL 2-2 : The Long Hallway ──────── */
  "2-2": [
    {
      title: "Loops Go Both Ways! \u{1F500}",
      description:
        "In World 1, you mostly went right and down. But your sub can also go LEFT and UP!\n\nAnd guess what \u2014 loops work in EVERY direction. You can repeat move_left() in a loop just like move_right()!",
      code: "# A loop going LEFT:\nfor i in range(3):\n    sub.move_left()\n\n# A loop going UP:\nfor i in range(2):\n    sub.move_up()",
    },
    {
      title: "The U-Turn \u{21A9}\uFE0F",
      description:
        "This hallway is shaped like the letter U.\n\nYou\u2019ll go right along the top, slip down through a gap, then go LEFT back along the bottom.\n\nPlan your route and count the steps for each section!",
      tip: "This is the first time you\u2019ll use sub.move_left() inside a loop. Don\u2019t be afraid \u2014 it works exactly the same as move_right()!",
    },
  ],

  /* ──────── LEVEL 2-3 : Staircase Deck ──────── */
  "2-3": [
    {
      title: "Two Commands, One Loop! \u{1F4A1}",
      description:
        "Here\u2019s a cool new trick!\n\nYou can put MORE THAN ONE command inside a for loop. Both lines will repeat together, over and over.\n\nThis is super useful when you need to go in a pattern \u2014 like a staircase!",
      code: "# This repeats BOTH lines 3 times:\nfor i in range(3):\n    sub.move_right()\n    sub.move_down()\n\n# It goes: right, down, right, down, right, down!",
      tip: "Both lines need to be indented (pushed right with spaces). That\u2019s how the computer knows they\u2019re BOTH part of the loop!",
    },
    {
      title: "Spot the Staircase \u{1FA9C}",
      description:
        "Look at the grid \u2014 the shells are arranged like steps on a staircase!\n\nEach step goes one right and one down. That\u2019s a perfect pattern for a two-command loop.\n\nAfter the staircase, you might need one or two more commands to reach the goal.",
      code: "for i in range(3):\n    sub.move_right()\n    sub.move_down()\n# Then finish the path to the goal!",
      tip: "Count the steps in the staircase. Each step = one right + one down. How many steps are there?",
    },
  ],

  /* ──────── LEVEL 2-4 : Engine Room ──────── */
  "2-4": [
    {
      title: "The Engine Room \u{2699}\uFE0F",
      description:
        "This room is bigger and has more walls than anything you\u2019ve seen before!\n\nBut you already know everything you need:\n\u2022 Loops for straight corridors\n\u2022 Single commands for turns\n\u2022 Any direction: right, left, down, up",
      tip: "Take a moment to trace the path with your eyes before writing any code. Where are the gaps in the walls?",
    },
    {
      title: "Plan Your Route \u{1F5FA}\uFE0F",
      description:
        "Break the maze into straight-line pieces:\n\n1\uFE0F\u20E3 Right along the top corridor\n2\uFE0F\u20E3 Down through a gap\n3\uFE0F\u20E3 Move to the next gap\n4\uFE0F\u20E3 Down again\n5\uFE0F\u20E3 Right along the bottom\n\nWrite a loop for each long piece!",
      tip: "You don\u2019t have to solve it all at once. Write the first loop, press RUN, and see how far your sub gets. Then add more!",
    },
  ],

  /* ──────── LEVEL 2-5 : Captain's Treasure ──────── */
  "2-5": [
    {
      title: "The Captain\u2019s Quarters! \u{1F3C6}",
      description:
        "This is it \u2014 the final room of the Sunken Ship!\n\nThe Captain\u2019s treasure is locked behind the biggest maze yet. But you\u2019re ready!\n\nYou\u2019ve mastered:\n\u2705 Loops in every direction\n\u2705 Two commands in one loop\n\u2705 Planning complex routes",
    },
    {
      title: "Navigate the Zigzag \u{1F40D}",
      description:
        "This maze zigzags back and forth through the ship.\n\nFollow the same strategy:\n1\uFE0F\u20E3  Trace the path with your eyes\n2\uFE0F\u20E3  Count the steps in each straight section\n3\uFE0F\u20E3  Write a loop for each section\n4\uFE0F\u20E3  Chain them all together!\n\nThe path is longer, so watch your oxygen!",
      tip: "Oxygen is tight on this one! Count carefully \u2014 every extra move wastes precious O\u2082.",
    },
    {
      title: "You Can Do This! \u{1F31F}",
      description:
        "You\u2019ve already beaten 9 levels across two worlds. That\u2019s AMAZING!\n\nTake your time, plan your route, and don\u2019t forget \u2014 the Reset button is always there.\n\nGo claim that treasure, Captain!",
      tip: "After this level, a brand new world with brand new challenges awaits!",
    },
  ],

  /* ──────── LEVEL 3-1 : Cave Entrance ──────── */
  "3-1": [
    {
      title: "What is Sonar? \uD83D\uDD0D",
      description:
        "Welcome to the Deep Sea Cave! It\u2019s dark in here, and there are jellyfish hiding in the shadows.\n\nLuckily, your sub has SONAR \u2014 it can scan the square next to you and tell you if it\u2019s \"safe\" or \"danger\"!",
      code: 'sub.scan_right()  # Returns "safe" or "danger"',
      tip: "sub.scan_right() checks the cell to your RIGHT. There\u2019s also sub.scan_down(), sub.scan_left(), and sub.scan_up()!",
    },
    {
      title: "Your First If Statement! \uD83E\uDD14",
      description:
        "An \"if\" statement is like asking a question:\n\n\"IF the path is safe, THEN move there.\nELSE, go a different way!\"\n\nLook at the starter code \u2014 it already scans right and decides what to do. Just add 3 more moves after it!",
      code: 'if sub.scan_right() == "safe":\n    sub.move_right()\nelse:\n    sub.move_down()',
      tip: "The code under \"if\" runs when scan says safe. The code under \"else\" runs when it says danger. Like a fork in the road!",
    },
  ],

  /* ──────── LEVEL 3-2 : Dark Fork ──────── */
  "3-2": [
    {
      title: "What if it\u2019s NOT Safe? \u26A0\uFE0F",
      description:
        "Sometimes the path below you has a jellyfish! If you just move down without checking, OUCH \u2014 you lose 20% oxygen.\n\nScan DOWN this time before you move. If it\u2019s danger, go right instead!",
      code: 'if sub.scan_down() == "safe":\n    sub.move_down()\nelse:\n    sub.move_right()',
      tip: "This is your first time writing if/else from scratch! The comments in the starter code show you the pattern.",
    },
    {
      title: "If/Else Explained \uD83E\uDDE0",
      description:
        "Think of if/else like choosing at a fork:\n\n\uD83D\uDFE2 IF the path is clear \u2192 go that way\n\uD83D\uDD34 ELSE (it\u2019s blocked) \u2192 go a different way\n\nThe computer checks the condition and picks ONE path \u2014 never both!",
      tip: "After your if/else dodge, you\u2019ll need more moves to reach the shell and treasure. Count the squares!",
    },
  ],

  /* ──────── LEVEL 3-3 : Sonar Sweep ──────── */
  "3-3": [
    {
      title: "Scan, Scan, Scan! \uD83D\uDD0D\uD83D\uDD0D",
      description:
        "There are TWO jellyfish in this cave! One scan won\u2019t be enough.\n\nYou\u2019ll need to write TWO separate if/else blocks \u2014 one for each jellyfish you might bump into.",
      code: '# First dodge:\nif sub.scan_right() == "safe":\n    sub.move_right()\nelse:\n    sub.move_down()\n\n# Second dodge:\nif sub.scan_right() == "safe":\n    sub.move_right()\nelse:\n    sub.move_down()',
      tip: "Each if/else is independent \u2014 the sub checks its position at the time, then decides!",
    },
    {
      title: "Chaining If Statements \u26D3\uFE0F",
      description:
        "You can put as many if/else blocks as you need, one after another!\n\nThe sub runs them in order:\n1\uFE0F\u20E3 First if/else \u2192 scan and decide\n2\uFE0F\u20E3 Regular moves between scans\n3\uFE0F\u20E3 Second if/else \u2192 scan and decide again\n\nMix regular moves with if/else blocks!",
      tip: "Move down first, then start scanning. Add regular sub.move_right() commands between your two if/else blocks.",
    },
  ],

  /* ──────── LEVEL 3-4 : Crystal Cavern ──────── */
  "3-4": [
    {
      title: "Loops + Brains! \uD83D\uDCA1",
      description:
        "What if you need to scan at EVERY step? Writing 8 if/else blocks would be exhausting!\n\nInstead, put your if/else INSIDE a for loop. The loop repeats the scan-and-decide logic automatically!",
      code: 'for i in range(8):\n    if sub.scan_right() == "safe":\n        sub.move_right()\n    else:\n        sub.move_down()',
      tip: "The loop runs 8 times. Each time, it scans right and either moves right (safe) or down (danger). Like auto-pilot!",
    },
    {
      title: "If Inside a For Loop \uD83D\uDD01",
      description:
        "Look at the starter code \u2014 it has the for loop and the if, but the else is missing!\n\nAdd these two lines after the if block:\n    else:\n        sub.move_down()\n\nMake sure they\u2019re indented under the for loop!",
      tip: "Indentation matters! The else and sub.move_down() need 4 spaces (same level as the if). The sub.move_down() under else needs 8 spaces.",
    },
  ],

  /* ──────── LEVEL 3-5 : The Abyss ──────── */
  "3-5": [
    {
      title: "The Ultimate Challenge! \uD83C\uDF0A",
      description:
        "The deepest cave in the ocean! This level combines EVERYTHING you\u2019ve learned:\n\n\uD83D\uDD01 For loops\n\uD83E\uDD14 If/else conditionals\n\uD83D\uDD0D Sonar scanning\n\u2B05\uFE0F Moving in ALL directions (even left!)\n\nTwo shells to collect, one epic treasure to claim!",
      tip: "You\u2019ll need sub.move_left() for the first time! It works just like the other move commands.",
    },
    {
      title: "Combining Everything \uD83C\uDFC6",
      description:
        "Here\u2019s a strategy:\n\n1\uFE0F\u20E3 Start with a for+if loop to navigate the diagonal hazards (like Level 3-4)\n2\uFE0F\u20E3 Use regular moves to reach the first shell\n3\uFE0F\u20E3 Go down and LEFT to collect the second shell\n4\uFE0F\u20E3 Use a for loop to go right to the goal\n\nPlan your route, then code it step by step!",
      tip: "The for+if loop gets you past the first 4 steps. After that, it\u2019s regular moves and one more loop. You\u2019ve got this!",
    },
  ],

  /* ──────── LEVEL 4-1 : Trench Edge ──────── */
  "4-1": [
    {
      title: "What is a Function? \uD83D\uDCE6",
      description:
        "Welcome to the deep ocean trench! It\u2019s time to learn something AMAZING — FUNCTIONS!\n\nA function is like a recipe. You write the steps ONCE, give it a name, and then you can use that recipe again and again!\n\nInstead of writing the same commands over and over, you put them in a function and just call its name!",
      tip: "Think of a function like a dance move. You learn the move once, name it, and then you can do it anytime by saying its name!",
    },
    {
      title: "Define and Call \uD83D\uDCDD",
      description:
        "Here\u2019s how to make a function:\n\n1\uFE0F\u20E3  DEFINE it with def and a name\n2\uFE0F\u20E3  Put commands inside (indented!)\n3\uFE0F\u20E3  CALL it by writing the name with ()\n\nThe path is a staircase: right, right, down — repeating 3 times. Perfect for a function!",
      code: "# Step 1: DEFINE the function\ndef step():\n    sub.move_right()\n    sub.move_right()\n    sub.move_down()\n\n# Step 2: CALL it!\nstep()\nstep()\nstep()",
      tip: "The commands inside the function need to be indented (pushed right with spaces), just like inside a for loop!",
    },
  ],

  /* ──────── LEVEL 4-2 : Pressure Zone ──────── */
  "4-2": [
    {
      title: "Reuse, Reuse, Reuse! \u267B\uFE0F",
      description:
        "The best thing about functions? You write the code ONCE and use it as many times as you want!\n\nThis level has a diagonal pattern — right then down, over and over. Define a dive() function for that pattern, and call it multiple times!",
      code: "def dive():\n    sub.move_right()\n    sub.move_down()\n\n# Call it 3 times!\ndive()\ndive()\ndive()",
      tip: "After calling your function, you can still add regular commands! Mix function calls with normal moves.",
    },
    {
      title: "Functions Save Time \u23F1\uFE0F",
      description:
        "Without a function, you\u2019d need 8 lines of code.\nWith a function, you need only 7 — and it\u2019s way easier to read!\n\nAs patterns get longer, functions save even MORE time.\n\nAfter your dive() calls, you\u2019ll need a couple of extra sub.move_right() commands to reach the goal.",
      tip: "Look at the grid — the shells are on the diagonal (right+down pattern). How many times does that pattern repeat?",
    },
  ],

  /* ──────── LEVEL 4-3 : Bioluminescent Path ──────── */
  "4-3": [
    {
      title: "Functions + Loops = Super Power! \u26A1",
      description:
        "Here\u2019s where it gets REALLY cool!\n\nYou can CALL a function inside a FOR LOOP! The loop repeats the function call as many times as you want.\n\nIt\u2019s like saying: \"Do that dance move 5 times!\"",
      code: "def zigzag():\n    sub.move_right()\n    sub.move_down()\n    sub.move_down()\n\nfor i in range(2):\n    zigzag()",
      tip: "Define the function FIRST (at the top), then use a for loop to call it. The function must exist before you call it!",
    },
    {
      title: "Call a Function in a Loop \uD83D\uDD01",
      description:
        "Look at the path — it goes: right, down, down. And that pattern happens twice!\n\nSo define a zigzag() function with those 3 moves, then call it in a for loop with range(2).\n\nFunctions + loops = less code, more power!",
      tip: "Notice the zigzag() call inside the loop is indented — just like any other command inside a for loop!",
    },
  ],

  /* ──────── LEVEL 4-4 : Thermal Vent ──────── */
  "4-4": [
    {
      title: "Smart Functions \uD83E\uDDE0",
      description:
        "Functions can do more than just move — they can THINK!\n\nYou can put an if/else INSIDE a function. Now your function scans and decides on its own. It\u2019s like teaching your submarine to be smart!",
      code: "def smart_step():\n    if sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_down()\n\nsmart_step()",
      tip: "The if/else inside the function is indented under def, and the moves are indented under if/else. Watch those spaces!",
    },
    {
      title: "Scanning Inside a Function \uD83D\uDD0D",
      description:
        "Thermal vents are blocking some paths! Your smart_step() function will scan right at every step.\n\nIf it\u2019s safe \u2192 move right.\nIf it\u2019s danger \u2192 move down instead.\n\nPut this in a for loop and watch your sub navigate automatically!",
      code: "def smart_step():\n    if sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_down()\n\nfor i in range(7):\n    smart_step()",
      tip: "Count the total moves needed (rights + downs). That\u2019s roughly how many times to call your function in the loop!",
    },
  ],

  /* ──────── LEVEL 4-5 : Trench Floor ──────── */
  "4-5": [
    {
      title: "The Final Descent \uD83C\uDFC6",
      description:
        "You\u2019ve made it to the bottom of the trench! This is the ULTIMATE challenge.\n\nYou\u2019ll need EVERYTHING:\n\uD83D\uDCE6 Functions\n\uD83D\uDD01 For loops\n\uD83D\uDD0D Sonar scanning\n\u2B05\uFE0F Moving in ALL directions\n\nTwo samples to collect, one final treasure to claim!",
      tip: "Break the level into sections: scan-navigate the hazards, collect the first sample, go down and left for the second, then right to the goal.",
    },
    {
      title: "Combining Everything \uD83C\uDF1F",
      description:
        "Strategy:\n\n1\uFE0F\u20E3 Define a smart scan-step function (like Level 4-4)\n2\uFE0F\u20E3 Use a for loop to navigate through hazards\n3\uFE0F\u20E3 Add regular moves to collect the first sample\n4\uFE0F\u20E3 Use sub.move_down() and sub.move_left() for the second sample\n5\uFE0F\u20E3 Loop right to the goal!\n\nYou\u2019ve already done each of these before. Now put them all together!",
      tip: "Don\u2019t try to solve it all at once! Write one section, press RUN to test, then add the next. You\u2019re a coding legend!",
    },
  ],

  /* ═══════ WORLD 5 — Rescue Mission (Open Ocean Abyss) ═══════ */

  /* ──────── LEVEL 5-1 : Open Waters ──────── */
  "5-1": [
    {
      title: "The Open Ocean Awaits! \u{1F30C}",
      description:
        "Welcome to the FINAL world, Captain! The vast Open Ocean Abyss stretches before you.\n\nThis world tests ALL your skills together:\n\n\u{1F4E6} Functions\n\u{1F501} Loops\n\u{1F50D} Scanning\n\nLet\u2019s warm up! This grid has BOTH rocks and jellyfish \u2014 your scanner treats them both as danger.",
      tip: "Look at the grid coordinates. The grid is bigger now! Use the row/column numbers to plan your path.",
    },
    {
      title: "Review: Function + Scanning \u{1F50D}",
      description:
        "Define a function that scans right:\n\u2022 If safe \u2192 move right\n\u2022 If danger (rock, jellyfish, or edge) \u2192 move down\n\nThen call it 13 times in a for loop!",
      code: "def safe_step():\n    if sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_down()\n\nfor i in range(13):\n    safe_step()",
      tip: "The path zigzags: right when clear, down when blocked. 13 steps navigates the whole 8\u00D77 grid!",
    },
  ],

  /* ──────── LEVEL 5-2 : The Swarm ──────── */
  "5-2": [
    {
      title: "Nested Loops \u2014 A Loop Inside a Loop! \u{1F300}",
      description:
        "Time to learn something NEW: nested loops!\n\nA nested loop is a for loop INSIDE another for loop. The inner loop runs completely each time the outer loop runs once.\n\nIt\u2019s like a clock: the minute hand goes around 60 times for every 1 time the hour hand moves!",
      tip: "Look at the rock-walled corridor \u2014 it forms a STAIRCASE! Each step goes right 2, then down 2.",
    },
    {
      title: "How Nested Loops Work \u{1F9E9}",
      description:
        "Here\u2019s how to put a loop inside a loop:",
      code: "for i in range(3):        # outer: 3 steps\n    for j in range(2):    # inner: 2 rights\n        sub.move_right()\n    for j in range(2):    # inner: 2 downs\n        sub.move_down()",
      tip: "The inner loops (j) use 8 SPACES of indent because they\u2019re inside the outer loop! Each inner loop does its own job: one for right moves, one for down moves.",
    },
    {
      title: "Your Mission \u{1F3AF}",
      description:
        "The corridor is a staircase with shells at each turning point:\n\n\u{1F41A} Shell 1: right 2 from start\n\u{1F41A} Shell 2: down 2, right 2\n\u{1F41A} Shell 3: down 2, right 2 again\n\nUse a nested loop: outer repeats 3 times, with two inner loops (right 2, down 2).\n\nAfter the staircase, add move_down() + move_right() to reach the treasure!",
      tip: "The staircase has 3 identical steps. That\u2019s why nested loops are perfect here!",
    },
  ],

  /* ──────── LEVEL 5-3 : Aurora Path ──────── */
  "5-3": [
    {
      title: "Three Choices \u2014 Meet elif! \u{1F6E4}\uFE0F",
      description:
        "Until now, you\u2019ve used if/else for TWO choices. But what if you need THREE?\n\nThat\u2019s where elif comes in! It\u2019s short for \u201Celse if\u201D \u2014 it checks a SECOND condition if the first fails.\n\nThink of three doors:\n\u{1F6AA} Door 1: if (down is safe)\n\u{1F6AA} Door 2: elif (right is safe)\n\u{1F6AA} Door 3: else (go left!)",
    },
    {
      title: "elif Syntax \u{1F4DD}",
      description:
        "Here\u2019s the full if / elif / else pattern:",
      code: "if sub.scan_down() == \"safe\":\n    sub.move_down()\nelif sub.scan_right() == \"safe\":\n    sub.move_right()\nelse:\n    sub.move_left()",
      tip: "elif goes between if and else. Python checks them in order: if first, then elif, and else only if BOTH are false!",
    },
    {
      title: "Navigate the Winding Cave! \u{1F30C}",
      description:
        "This cave winds downward through rock walls. At TWO spots, both down AND right are blocked by jellyfish \u2014 you MUST go left!\n\nAfter going left, the path continues downward, then eventually goes right along the bottom to reach the goal.\n\nWrap your if/elif/else in a for loop with 16 steps.",
      code: "for i in range(16):\n    if sub.scan_down() == \"safe\":\n        sub.move_down()\n    elif sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_left()",
      tip: "The else branch triggers TWICE in this level! Without it, you\u2019d be stuck. That\u2019s why elif is essential here.",
    },
  ],

  /* ──────── LEVEL 5-4 : Leviathan's Lair ──────── */
  "5-4": [
    {
      title: "Two Challenges in One! \u{1F409}",
      description:
        "This level has TWO distinct sections:\n\n\u{1F3D7}\uFE0F Phase 1: A rock STAIRCASE (nested loops!)\n\u{1F50D} Phase 2: A jellyfish zone (elif scanning!)\n\nYou also need a FUNCTION to keep your scanning code reusable.",
      tip: "Break the level into two parts. Solve Phase 1 with nested loops, then Phase 2 with your scanning function.",
    },
    {
      title: "Phase 1: The Staircase \u{1F3D7}\uFE0F",
      description:
        "The top section is a horizontal staircase corridor:\nRight 3 \u2192 Down 1 \u2192 Right 3 \u2192 Down 1\n\nThat\u2019s a nested loop!",
      code: "for i in range(2):\n    for j in range(3):\n        sub.move_right()\n    sub.move_down()",
      tip: "After Phase 1, you\u2019ll be at the start of the jellyfish zone.",
    },
    {
      title: "Phase 2: Scanning Function \u{1F50D}",
      description:
        "Define a function with if/elif/else scanning for the jellyfish zone. Then call it 8 times!",
      code: "def scan_step():\n    if sub.scan_down() == \"safe\":\n        sub.move_down()\n    elif sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_left()\n\nfor i in range(8):\n    scan_step()",
      tip: "Put Phase 1 and Phase 2 together in your code. The nested loop runs first, then the scanning loop!",
    },
  ],

  /* ──────── LEVEL 5-5 : The Rescue ──────── */
  "5-5": [
    {
      title: "THE FINAL RESCUE! \u{1F3C6}\u{1F30A}",
      description:
        "This is it, Captain \u2014 the ULTIMATE mission!\n\nTrapped divers need your help deep in the abyss. You\u2019ll use EVERY skill:\n\n\u{1F4E6} Functions\n\u{1F300} Nested Loops\n\u{1F50D} Scanning + elif\n\u2B05\uFE0F All movement directions\n\nYou\u2019ve trained for this. You\u2019re ready!",
      tip: "This level descends VERTICALLY first (unlike 5-4 which went horizontally). The grid structure is fundamentally different!",
    },
    {
      title: "Phase 1: Vertical Descent \u{1F53B}",
      description:
        "The first section drops through vertical chambers:\nDown 2 \u2192 Right 1 \u2192 Down 2 \u2192 Right 1\n\nThat\u2019s a nested loop with DOWN as the inner loop!",
      code: "for i in range(2):\n    for j in range(2):\n        sub.move_down()\n    sub.move_right()",
      tip: "Compare this to 5-4: there the inner loop went RIGHT. Here it goes DOWN. Same nested loop idea, different direction!",
    },
    {
      title: "Phase 2: The Jellyfish Trap \u{1F50D}",
      description:
        "After descending, define explore() with three-way scanning and call it 10 times.\n\nThe jellyfish trap forces the else branch \u2014 both down AND right are blocked, so you MUST go left!",
      code: "def explore():\n    if sub.scan_down() == \"safe\":\n        sub.move_down()\n    elif sub.scan_right() == \"safe\":\n        sub.move_right()\n    else:\n        sub.move_left()\n\nfor i in range(10):\n    explore()",
      tip: "You\u2019ve completed Ocean Code Explorer! You learned movement, loops, nested loops, conditionals, elif, and functions. That\u2019s REAL programming! \u{1F389}",
    },
  ],
};

/** Fallback for levels without a specific tutorial */
const DEFAULT_TUTORIAL: TutorialStep[] = [
  {
    title: "New Level! \u{1F680}",
    description:
      "Use what you\u2019ve learned so far. Read the Mission Brief, write your code, and hit RUN!\n\nYou\u2019ve got this!",
  },
];

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  levelKey: string;
}

const TutorialOverlay = ({ isOpen, onClose, levelKey }: TutorialOverlayProps) => {
  const steps = LEVEL_TUTORIALS[levelKey] || DEFAULT_TUTORIAL;
  const [step, setStep] = useState(0);
  const current = steps[step];

  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen]);

  const next = () => (step < steps.length - 1 ? setStep(step + 1) : onClose());
  const prev = () => step > 0 && setStep(step - 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          {/* Card */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <div className="bg-card border border-primary/30 rounded-2xl p-6 box-glow-cyan shadow-2xl">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title */}
              <h3 className="font-display text-base tracking-wider text-primary mb-3 pr-6">
                {current.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-line mb-4">
                {current.description}
              </p>

              {/* Code example */}
              {current.code && (
                <div className="rounded-lg bg-background/80 border border-border/40 p-3 mb-4 font-mono text-xs leading-relaxed">
                  {current.code.split("\n").map((line, i) => (
                    <div key={i} className={line.startsWith("#") ? "text-muted-foreground" : "text-cyan-300"}>
                      {line || "\u00A0"}
                    </div>
                  ))}
                </div>
              )}

              {/* Interactive tip callout */}
              {current.tip && (
                <div className="flex gap-2.5 items-start rounded-lg bg-accent/10 border border-accent/30 p-3 mb-4">
                  <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-accent leading-relaxed">
                    {current.tip}
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-display">
                  {step + 1} / {steps.length}
                </span>
                <div className="flex gap-2">
                  {step > 0 && (
                    <button
                      onClick={prev}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronLeft className="w-3 h-3" /> Back
                    </button>
                  )}
                  <button
                    onClick={next}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs bg-primary text-primary-foreground font-display tracking-wider hover:bg-primary/90 transition-colors"
                  >
                    {step === steps.length - 1 ? "Got it!" : "Next"}{" "}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Step dots */}
              {steps.length > 1 && (
                <div className="flex gap-1.5 justify-center mt-4">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === step ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorialOverlay;
