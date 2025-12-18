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

const introCaption = `Ho ho ho! Merry Christmas everyone! Now listen up, my festive friends, because Santa has a very important mission for you tonight. You’re about to play the legendary Left-Right Christmas Gift Shuffle. When you hear me finish a story segment, you will pass your gift exactly one time. If I say LEFT, you pass your gift to the left. If I say RIGHT, you pass your gift to the right. No skipping, no peeking, and no holding on tighter than a reindeer on a rooftop! Now… let’s begin! Ho ho ho ho ho!`;

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
   SANTA ANIMATION (FIXED)
   =============================== */

let animTimer = null;

function setSanta(cls) {
  santa.className = cls;
}

function startTalking() {
  stopAnim();
  let open = false;
  animTimer = setInterval(() => {
    open = !open;
    setSanta(open ? "santa-talk" : "santa-idle");
  }, 200);
}

function stopAnim() {
  if (animTimer) clearInterval(animTimer);
  animTimer = null;
  setSanta("santa-idle");
}

/* ===============================
   AUDIO (FIXED)
   =============================== */

function playAudio(src, captionText, onEnd) {
  audio.pause();
  audio.currentTime = 0;
  audio.onended = null;

  captions.textContent = captionText;
  audio.src = src;

  audio.play().then(() => {
    playing = true;
    paused = false;
    startTalking();
  });

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
    startTalking();
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
  if (mode === "ready") {
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