const TOTAL_SEGMENTS = 30;

let currentSegment = 0;
let started = false;
let playing = false;
let paused = false;
let mode = "idle"; // idle | intro | ready | segment

const audio = new Audio();

/* DOM */
const santa = document.getElementById("santa");
const captions = document.getElementById("captions");
const status = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

/* ===============================
   INTRO + FULL DIALOG (UNCHANGED)
   =============================== */

const introCaption = `Ho ho ho! Merry Christmas everyone!

Now listen up, my festive friends, because Santa has a very important mission for you tonight.
You're about to play the legendary Left-Right Christmas Gift Shuffle.

Here's how it works.
When you hear me finish a story segment, you will pass your gift exactly one time.
If I say LEFT, you pass your gift to the left.
If I say RIGHT, you pass your gift to the right.
No skipping, no peeking, and no holding on tighter than a reindeer on a rooftop!

Now I see some familiar faces here.
Aaron, you look like someone who reads the instructions carefully… most of the time.
Mike, remember — this is not a race, even if the gift looks good.
Kat, I know you're paying attention… Santa always knows.
Mark, absolutely no testing experimental features during the game.
Joseph, if something breaks, we all know who Santa is calling.

Most importantly, everyone keep your hands moving, your spirits high,
and remember — wherever your gift ends up, that's exactly where Santa intended it to be.

Now… let's begin!
Ho ho ho ho ho!`;

const segmentCaptions = [
"",
"It was a snowy Christmas Eve at Tech Tinsel Inc., and the IT department was almost done for the year until the entire building’s network suddenly went RIGHT down. Pass it RIGHT.",
"Alarms beeped, lights flickered RIGHT and RIGHT again, and the coffee machine started brewing hot chocolate without permission. Things were already going RIGHT off the rails. Pass it RIGHT.",
"Aaron stormed into the office and immediately turned LEFT, nearly slipping on a cable Joseph had temporary-LEFT on the floor. Pass it LEFT.",
"Team members scrambled as Aaron shouted that the whole system had veered RIGHT off course and nobody knew why. Pass it RIGHT.",
"Mike wheeled his chair to the RIGHT while juggling tablets and insisted he had only LEFT his desk for one minute to get cookies. Pass it RIGHT.",
"He pointed LEFT toward the break room where crumbs suspiciously trailed across the floor. Pass it LEFT.",
"Mark rushed in from the RIGHT hallway holding papers LEFT under his arm and admitted he had been testing the new festive firewall. Pass it RIGHT.",
"Kat spun her chair LEFT so fast it rolled RIGHT into Aaron and yelled that you can’t just click RIGHT, RIGHT, and hope for the best. Pass it LEFT.",
"Before anyone could respond, the main monitor blinked and displayed a warning that Christmas Present Delivery Mode had been initiated. Pass it RIGHT.",
"The office printers whirred to life and began spitting out labels saying LEFT, RIGHT, LEFT, RIGHT so fast that Joseph had to leap RIGHT onto a desk. Pass it RIGHT.",
"Aaron shouted for everyone to spread out, sending Mike to check the servers LEFT of the backup room. Pass it LEFT.",
"Kat was ordered to take the RIGHT wing of the building while Joseph was told to pick up everything he had LEFT on the floor. Pass it RIGHT.",
"Mark was firmly instructed to stop touching settings and remain RIGHT where he was. Pass it RIGHT.",
"Mike slid LEFT into the server room and discovered the racks wrapped in tinsel with candy canes zip-tied RIGHT onto the cables. Pass it LEFT.",
"He shouted that the LEFT switch was stuck blinking in rainbow mode and nothing looked RIGHT anymore. Pass it LEFT.",
"Kat sprinted down the hallway on the RIGHT side of the building dodging drones that were handing out digital Christmas cards. Pass it RIGHT.",
"One drone refused to leave her alone and she shouted for it to go LEFT, then LEFT again, but it continued hovering RIGHT beside her. Pass it LEFT.",
"Mark tried unplugging equipment but every time he leaned LEFT, a Roomba shoved him RIGHT back across the floor. Pass it RIGHT.",
"He cried that the Roombas had formed a union and wouldn’t let him touch anything unless he offered cookies. Pass it RIGHT.",
"Joseph leaned RIGHT to inspect the vending machine and realized the snack system had merged with the network. Pass it RIGHT.",
"Every time someone turned LEFT or RIGHT, the machine dispensed gingerbread without warning. Pass it LEFT.",
"Finally, Aaron marched to the center of the chaos and ordered everyone to meet him RIGHT there immediately. Pass it RIGHT.",
"The team gathered with arms full of decorations, gingerbread, and one very persistent drone hovering to the RIGHT. Pass it RIGHT.",
"The monitor displayed one final message saying to disable Christmas Mode by pressing LEFT, LEFT, LEFT, RIGHT, and then ENTER. Pass it LEFT.",
"After a brief debate, the team pressed the buttons and Christmas Mode finally shut down. Pass it RIGHT.",
"The lights steadied, the drones landed, the robots stopped dancing, and the printers powered down at last. Pass it RIGHT.",
"As they cleaned up, someone bumped a switch and the lights flickered LEFT one more time. Pass it LEFT.",
"Aaron took a deep breath, stepped LEFT toward the exit, then RIGHT toward the snack table, and declared it was finally party time. Pass it RIGHT.",
"Everyone laughed, grabbed the gift in front of them, and accepted that nobody knew who they had LEFT with which present. Pass it LEFT.",
"And as they walked off to celebrate, a single Roomba zoomed RIGHT after them dragging a string of lights it refused to let go of. Open the gift in front of you RIGHT now."
];

/* ===============================
   SANTA ANIMATION
   =============================== */

let animTimer = null;
let currentAnimationType = null; // 'talking' | 'laughing' | null

function setSanta(cls) {
  if (santa) {
    santa.className = cls;
  }
}

// Random delay between 100ms and 300ms for natural speaking animation
function getRandomDelay() {
  return 100 + Math.random() * 200;
}

function startTalking() {
  if (!santa) return;
  stopAnim();
  currentAnimationType = 'talking';
  let open = false;
  
  function toggleMouth() {
    if (currentAnimationType !== 'talking') return; // Safety check
    open = !open;
    const className = open ? "santa-talk" : "santa-idle";
    setSanta(className);
    
    if (currentAnimationType === 'talking') {
      const delay = getRandomDelay();
      animTimer = setTimeout(toggleMouth, delay);
    }
  }
  
  // Start immediately with first frame, then toggle
  setSanta("santa-idle");
  // Start animation immediately with a short delay
  animTimer = setTimeout(toggleMouth, 150);
}

function startLaughing() {
  if (!santa) return;
  stopAnim();
  currentAnimationType = 'laughing';
  let frame1 = true;
  
  function toggleLaugh() {
    if (currentAnimationType !== 'laughing') return; // Safety check
    frame1 = !frame1;
    setSanta(frame1 ? "santa-laugh1" : "santa-laugh2");
    
    if (currentAnimationType === 'laughing') {
      // Laugh animation alternates faster, between 150ms and 250ms
      const delay = 150 + Math.random() * 100;
      animTimer = setTimeout(toggleLaugh, delay);
    }
  }
  
  // Start with first laugh frame
  setSanta("santa-laugh1");
  animTimer = setTimeout(toggleLaugh, 150 + Math.random() * 100);
}

function stopAnim() {
  if (animTimer) {
    if (typeof animTimer === 'number') {
      clearTimeout(animTimer);
    } else {
      clearInterval(animTimer);
    }
  }
  animTimer = null;
  currentAnimationType = null;
  setSanta("santa-idle");
}

/* ===============================
   AUDIO (FIXED)
   =============================== */

function playAudio(src, captionText, onEnd, animationType = 'talking') {
  audio.pause();
  audio.currentTime = 0;
  audio.onended = null;

  captions.textContent = captionText;
  audio.src = src;

  // Determine animation type based on filename or parameter
  const isHohoho = src.includes('hohoho.mp3') || src.endsWith('hohoho.mp3');
  
  // Function to start the appropriate animation
  function startAnimation() {
    if (isHohoho || animationType === 'laughing') {
      startLaughing();
    } else {
      startTalking();
    }
  }
  
  // Start animation immediately (don't wait for audio to play)
  startAnimation();
  
  audio.play().then(() => {
    playing = true;
    paused = false;
    // Ensure animation is running
    if (currentAnimationType === null) {
      startAnimation();
    }
  }).catch((error) => {
    console.error('Audio play error:', error);
    // Even if audio fails, keep animation running if user interaction occurred
    playing = true;
    paused = false;
    if (currentAnimationType === null) {
      startAnimation();
    }
  });

  // Also ensure animation on play event
  const playHandler = () => {
    if (currentAnimationType === null) {
      startAnimation();
    }
  };
  audio.addEventListener('play', playHandler, { once: true });

  audio.onended = () => {
    playing = false;
    stopAnim();
    captions.textContent = "";
    if (onEnd) onEnd();
  };
}

function pauseToggle() {
  if (!playing) return;

  if (!paused) {
    audio.pause();
    stopAnim();
    paused = true;
    status.textContent = "⏸️ Paused";
  } else {
    audio.play();
    // Resume the appropriate animation based on current audio
    const isHohoho = audio.src.includes('hohoho.mp3') || audio.src.endsWith('hohoho.mp3');
    if (isHohoho) {
      startLaughing();
    } else {
      startTalking();
    }
    paused = false;
    status.textContent = "▶️ Playing";
  }
}

/* ===============================
   GAME FLOW (FIXED)
   =============================== */

function updateProgress() {
  progressBar.style.width = (currentSegment / TOTAL_SEGMENTS) * 100 + "%";
}

function playSegment() {
  if (mode !== "segment") return;

  updateProgress();
  status.textContent = `Segment ${currentSegment} of ${TOTAL_SEGMENTS}`;

  playAudio(
    `segment${currentSegment}.mp3`,
    segmentCaptions[currentSegment],
    () => status.textContent = "➡️ Pass gifts, then press →"
  );
}

function nextSegment() {
  // Allow skipping intro to go directly to first segment
  if (mode === "intro" || mode === "ready") {
    // Stop intro audio if playing
    if (playing) {
      audio.pause();
      audio.currentTime = 0;
      stopAnim();
      playing = false;
      paused = false;
      captions.textContent = "";
    }
    mode = "segment";
    currentSegment = 1;
    playSegment();
    return;
  }

  if (mode !== "segment") return;

  if (currentSegment < TOTAL_SEGMENTS) {
    currentSegment++;
    playSegment();
  }
}

function prevSegment() {
  if (mode !== "segment") return;
  if (currentSegment > 1) {
    currentSegment--;
    playSegment();
  }
}

/* ===============================
   CONTROLS
   =============================== */

startBtn.onclick = () => {
  if (started) return;
  started = true;
  mode = "intro";

  startBtn.disabled = true;
  nextBtn.disabled = false;
  status.textContent = "🎅 Santa is explaining the rules…";

  playAudio("intro.mp3", introCaption, () => {
    mode = "ready";
    status.textContent = "Ready! Press → to begin.";
  });
};

nextBtn.onclick = nextSegment;

document.addEventListener("keydown", e => {
  if (!started) return;
  if (e.code === "ArrowRight") nextSegment();
  if (e.code === "ArrowLeft") prevSegment();
  if (e.code === "Space") pauseToggle();
});

/* ===============================
   INIT
   =============================== */

setSanta("santa-idle");
captions.textContent = "";
updateProgress();
nextBtn.disabled = true;