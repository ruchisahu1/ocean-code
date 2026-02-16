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
      title: "Danger \u2014 Jellyfish! \u{1F9CA}",
      description:
        "The cave has jellyfish that sting! If you bump into one, you lose a LOT of oxygen.\n\nBut your submarine has a sonar scanner! Use it to check if the next square is safe before moving.",
      code: 'if sub.scan_right() == "safe":\n    sub.move_right()',
      tip: "sub.scan_right() looks at the square to the right and tells you if it\u2019s \"safe\" or \"danger\". Smart, right?",
    },
    {
      title: "If This, Then That! \u{1F914}",
      description:
        "An \"if\" statement is like asking a question:\n\n\"IF the path is safe, THEN move there.\"\n\nThe code under the if only runs when the answer is yes!",
      code: 'if sub.scan_down() == "safe":\n    sub.move_down()\n\nif sub.scan_right() == "safe":\n    sub.move_right()',
      tip: "You can scan in different directions! Use sub.scan_right() and sub.scan_down() to check before you move.",
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
