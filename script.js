// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const inputField = document.getElementById("inputField");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const cpmElement = document.getElementById("cpm");
const errorsElement = document.getElementById("errors");
const resetBtn = document.getElementById("resetBtn");
const timeSelect = document.getElementById("timeSelect");
const difficultySelect = document.getElementById("difficultySelect");
const resultModal = document.getElementById("resultModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const newTestBtn = document.getElementById("newTestBtn");
const shareBtn = document.getElementById("shareBtn");
const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const finalCpm = document.getElementById("finalCpm");
const finalErrors = document.getElementById("finalErrors");
const progressBar = document.getElementById("progressBar");
const themeToggle = document.getElementById("themeToggle");
const aboutLink = document.getElementById("aboutLink");
const tipsLink = document.getElementById("tipsLink");
const privacyLink = document.getElementById("privacyLink");
const contactLink = document.getElementById("contactLink");

// Quotes database by difficulty
const quotes = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the art of telling another human what one wants the computer to do.",
    "Every great developer you know got there by solving problems they were unqualified to solve.",
    "The best way to predict the future is to invent it.",
    "Simplicity is the soul of efficiency.",
    "Practice makes perfect when it comes to typing quickly and accurately.",
    "Typing speed is important in today's digital world for productivity.",
    "The more you type, the better and faster you will become over time.",
    "Keyboard shortcuts can significantly improve your workflow efficiency.",
    "Proper typing posture helps prevent strain and injury during long sessions.",
  ],
  medium: [
    "The most disastrous thing that you can ever learn is your first programming language.",
    "The computer was born to solve problems that did not exist before.",
    "The function of good software is to make the complex appear to be simple.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "First, solve the problem. Then, write the code.",
    "Typing is the foundation of all digital communication and content creation.",
    "Regular typing practice can help you maintain and improve your speed and accuracy.",
    "Learning touch typing can dramatically increase your words per minute rate.",
    "Accuracy is just as important as speed when it comes to effective typing.",
    "Ergonomic keyboards can help reduce fatigue during extended typing sessions.",
  ],
  hard: [
    "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
    "There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "The most important property of a program is whether it accomplishes the intention of its user.",
    "Programs must be written for people to read, and only incidentally for machines to execute.",
    "The QWERTY keyboard layout was designed to slow typists down to prevent mechanical typewriter jams.",
    "The world record for typing speed is over 200 words per minute with high accuracy.",
    "Typing without looking at the keyboard is called touch typing and is the most efficient method.",
    "Many professional typists can maintain speeds of 80-100 WPM for extended periods.",
    "The average typing speed is around 40 words per minute, but with practice, most people can reach 65-75 WPM.",
  ],
  expert: [
    "The competent programmer is fully aware of the strictly limited size of his own skull; he therefore approaches his task with full humility, and avoids clever tricks like the plague.",
    "The evolution of languages: FORTRAN is a non-typed language. C is a weakly typed language. Ada is a strongly typed language. C++ is a strongly hyped language.",
    "A language that doesn't affect the way you think about programming is not worth knowing.",
    "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.",
    "Walking on water and developing software from a specification are easy if both are frozen.",
    "The Dvorak keyboard layout was designed to increase typing efficiency by placing the most common letters on the home row.",
    "Stenotype machines allow court reporters to type at speeds exceeding 300 words per minute using chords.",
    "The fastest English language typist was Barbara Blackburn who could maintain 150 WPM for 50 minutes and peak at 212 WPM.",
    "Typing speed is measured in both words per minute (WPM) and characters per minute (CPM).",
    "Many typing tests consider a 'word' to be 5 characters including spaces and punctuation for standardization.",
  ],
  custom: [
    "Enter your own custom text to practice specific typing challenges or difficult words.",
    "Create personalized typing exercises by adding your own text in the settings.",
    "Practice with text from your work or studies to improve real-world typing skills.",
    "Focus on problem areas by typing custom text with difficult letter combinations.",
    "Import text from documents you frequently work with for targeted practice sessions.",
  ],
};

// App state
let timer;
let timeLeft;
let isTyping = false;
let correctCharacters = 0;
let totalCharacters = 0;
let errors = 0;
let startTime;
let currentQuote = "";
let currentDifficulty = "medium";
let testHistory = [];
let darkMode = true;

// Initialize the app
function init() {
  loadNewQuote();
  setupEventListeners();
  createParticles();
  loadThemePreference();
  updateProgressBar(0);
}

// Set up event listeners
function setupEventListeners() {
  inputField.addEventListener("input", handleInput);
  resetBtn.addEventListener("click", resetTest);
  timeSelect.addEventListener("change", updateTimer);
  difficultySelect.addEventListener("change", handleDifficultyChange);
  closeModalBtn.addEventListener("click", closeResultModal);
  newTestBtn.addEventListener("click", startNewTest);
  shareBtn.addEventListener("click", shareResults);
  themeToggle.addEventListener("click", toggleTheme);
  aboutLink.addEventListener("click", showAbout);
  tipsLink.addEventListener("click", showTypingTips);
  privacyLink.addEventListener("click", showPrivacy);
  contactLink.addEventListener("click", showContact);

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      resetTest();
    }
    if (e.key === "Escape" && resultModal.classList.contains("active")) {
      closeResultModal();
    }
  });
}

// Handle typing input
function handleInput(e) {
  if (!isTyping) {
    startTest();
  }

  const inputText = inputField.value;
  const quoteText = currentQuote.substring(0, inputText.length);

  // Update progress
  const progress = (inputText.length / currentQuote.length) * 100;
  updateProgressBar(progress);

  // Calculate stats
  calculateStats(inputText, quoteText);

  // Update UI
  updateQuoteDisplay(inputText, quoteText);

  // Check if test is complete
  if (inputText === currentQuote) {
    completeTest();
  }
}

// Update progress bar
function updateProgressBar(progress) {
  progressBar.style.width = `${Math.min(100, progress)}%`;

  // Change color based on progress
  if (progress < 30) {
    progressBar.style.background =
      "linear-gradient(to right, var(--danger), var(--danger-dark))";
  } else if (progress < 70) {
    progressBar.style.background =
      "linear-gradient(to right, var(--warning), var(--warning-dark))";
  } else {
    progressBar.style.background =
      "linear-gradient(to right, var(--success), var(--success-dark))";
  }
}

// Start the test
function startTest() {
  isTyping = true;
  startTime = new Date();
  startTimer();

  // Focus the input field
  inputField.focus();
}

// Start the timer
function startTimer() {
  timeLeft = parseInt(timeSelect.value);
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      completeTest();
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  timerElement.textContent = timeLeft;

  // Change color when time is running out
  if (timeLeft <= 10) {
    timerElement.style.color = "var(--danger)";
    timerElement.classList.add("pulse");
  } else {
    timerElement.style.color = "var(--accent)";
    timerElement.classList.remove("pulse");
  }
}

// Update timer when selection changes
function updateTimer() {
  if (!isTyping) {
    timerElement.textContent = timeSelect.value;
  }
}

// Handle difficulty change
function handleDifficultyChange() {
  currentDifficulty = difficultySelect.value;

  if (currentDifficulty === "custom") {
    // For custom difficulty, prompt user to enter their own text
    const customText = prompt("Enter your custom text for typing practice:");
    if (customText) {
      quotes.custom = [customText];
      loadNewQuote();
    } else {
      difficultySelect.value = "medium";
      currentDifficulty = "medium";
    }
  } else {
    resetTest();
  }
}

// Calculate typing stats
function calculateStats(inputText, quoteText) {
  errors = 0;
  correctCharacters = 0;
  totalCharacters = inputText.length;

  for (let i = 0; i < inputText.length; i++) {
    if (inputText[i] === quoteText[i]) {
      correctCharacters++;
    } else {
      errors++;
    }
  }

  // Calculate WPM (5 characters = 1 word)
  const timeElapsed = (new Date() - startTime) / 60000; // in minutes
  const wpm =
    timeElapsed > 0 ? Math.round(correctCharacters / 5 / timeElapsed) : 0;

  // Calculate accuracy
  const accuracy =
    totalCharacters > 0
      ? Math.round((correctCharacters / totalCharacters) * 100)
      : 0;

  // Calculate CPM (characters per minute)
  const cpm = timeElapsed > 0 ? Math.round(correctCharacters / timeElapsed) : 0;

  // Update UI
  wpmElement.textContent = wpm;
  accuracyElement.textContent = accuracy + "%";
  cpmElement.textContent = cpm;
  errorsElement.textContent = errors;
}

// Update the quote display with highlighting
function updateQuoteDisplay(inputText, quoteText) {
  let displayHTML = "";

  for (let i = 0; i < currentQuote.length; i++) {
    const quoteChar = currentQuote[i];

    if (i < inputText.length) {
      if (inputText[i] === quoteChar) {
        displayHTML += `<span class="correct">${quoteChar}</span>`;
      } else {
        displayHTML += `<span class="incorrect">${quoteChar}</span>`;
      }
    } else if (i === inputText.length) {
      displayHTML += `<span class="current">${quoteChar}</span>`;
    } else {
      displayHTML += `<span>${quoteChar}</span>`;
    }
  }

  quoteDisplay.innerHTML = displayHTML;
}

// Complete the test
function completeTest() {
  clearInterval(timer);
  isTyping = false;
  inputField.disabled = true;

  // Save test results to history
  saveTestResults();

  // Show results
  showResults();
}

// Save test results to history
function saveTestResults() {
  const result = {
    wpm: parseInt(wpmElement.textContent),
    accuracy: accuracyElement.textContent,
    cpm: parseInt(cpmElement.textContent),
    errors: parseInt(errorsElement.textContent),
    date: new Date().toLocaleString(),
    duration: parseInt(timeSelect.value) - timeLeft,
    quoteLength: currentQuote.length,
    difficulty: currentDifficulty,
  };

  testHistory.push(result);

  // Keep only the last 10 results
  if (testHistory.length > 10) {
    testHistory.shift();
  }

  // Save to localStorage
  localStorage.setItem("typingTestHistory", JSON.stringify(testHistory));
}

// Show results modal
function showResults() {
  finalWpm.textContent = wpmElement.textContent;
  finalAccuracy.textContent = accuracyElement.textContent;
  finalCpm.textContent = cpmElement.textContent;
  finalErrors.textContent = errorsElement.textContent;

  resultModal.classList.add("active");

  // Add confetti effect
  createConfetti();
}

// Close results modal
function closeResultModal() {
  resultModal.classList.remove("active");
  resetTest();
}

// Start new test
function startNewTest() {
  closeResultModal();
  resetTest();
}

// Share results
function shareResults() {
  const wpm = finalWpm.textContent;
  const accuracy = finalAccuracy.textContent;

  if (navigator.share) {
    navigator
      .share({
        title: "My Typing Test Results",
        text: `I just typed at ${wpm} WPM with ${accuracy} accuracy on NitroType Pro!`,
        url: window.location.href,
      })
      .catch((err) => {
        console.log("Error sharing:", err);
        fallbackShare(wpm, accuracy);
      });
  } else {
    fallbackShare(wpm, accuracy);
  }
}

// Fallback for browsers that don't support Web Share API
function fallbackShare(wpm, accuracy) {
  const text = `I just typed at ${wpm} WPM with ${accuracy} accuracy on NitroType Pro! Try it yourself: ${window.location.href}`;
  prompt("Copy your results to share:", text);
}

// Reset the test
function resetTest() {
  clearInterval(timer);
  isTyping = false;
  inputField.disabled = false;
  inputField.value = "";

  // Reset stats
  correctCharacters = 0;
  totalCharacters = 0;
  errors = 0;

  wpmElement.textContent = "0";
  accuracyElement.textContent = "0%";
  cpmElement.textContent = "0";
  errorsElement.textContent = "0";

  // Reset progress bar
  updateProgressBar(0);

  // Reset timer
  timeLeft = parseInt(timeSelect.value);
  timerElement.textContent = timeLeft;
  timerElement.style.color = "var(--accent)";
  timerElement.classList.remove("pulse");

  // Load new quote
  loadNewQuote();

  // Focus input field
  inputField.focus();
}

// Load a new quote based on difficulty
function loadNewQuote() {
  const difficultyQuotes = quotes[currentDifficulty] || quotes.medium;
  currentQuote =
    difficultyQuotes[Math.floor(Math.random() * difficultyQuotes.length)];

  // Highlight the first character
  quoteDisplay.innerHTML = `<span class="current">${
    currentQuote[0]
  }</span>${currentQuote.substring(1)}`;
}

// Create floating particles for background
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = window.innerWidth < 768 ? 30 : 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Random size between 1px and 5px
    const size = Math.random() * 4 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    // Random opacity
    particle.style.opacity = Math.random() * 0.5 + 0.1;

    // Random animation duration and delay
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 10;
    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

    particlesContainer.appendChild(particle);
  }
}

// Create confetti effect
function createConfetti() {
  const particlesContainer = document.getElementById("particles");
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("particle");
    confetti.style.background = getRandomColor();

    // Random size between 5px and 10px
    const size = Math.random() * 5 + 5;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;

    // Random shape (square or circle)
    if (Math.random() > 0.5) {
      confetti.style.borderRadius = "50%";
    } else {
      confetti.style.borderRadius = "0";
    }

    // Random position at top
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = `-10px`;

    // Random animation
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 1;
    confetti.style.animation = `float ${duration}s ease-in ${delay}s forwards`;

    particlesContainer.appendChild(confetti);

    // Remove after animation
    setTimeout(() => {
      confetti.remove();
    }, duration * 1000);
  }
}

function getRandomColor() {
  const colors = [
    "#6c5ce7",
    "#a29bfe",
    "#fd79a8",
    "#00b894",
    "#fdcb6e",
    "#e17055",
    "#0984e3",
    "#00cec9",
    "#ffeaa7",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Toggle dark/light theme
function toggleTheme() {
  darkMode = !darkMode;
  document.body.classList.toggle("light-theme", !darkMode);

  // Update theme toggle icon
  const icon = themeToggle.querySelector("i");
  icon.classList.toggle("fa-moon", darkMode);
  icon.classList.toggle("fa-sun", !darkMode);

  // Save preference to localStorage
  localStorage.setItem("typingTestTheme", darkMode ? "dark" : "light");
}

// Load theme preference from localStorage
function loadThemePreference() {
  const savedTheme = localStorage.getItem("typingTestTheme") || "dark";
  darkMode = savedTheme === "dark";

  if (!darkMode) {
    document.body.classList.add("light-theme");
    const icon = themeToggle.querySelector("i");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
}

// Show about information
function showAbout(e) {
  e.preventDefault();
  alert(
    "NitroType Pro is an advanced typing test application designed to help you improve your typing speed and accuracy. Practice regularly to see your progress!"
  );
}

// Show typing tips
function showTypingTips(e) {
  e.preventDefault();
  alert(
    "Typing Tips:\n\n1. Use all 10 fingers\n2. Maintain proper posture\n3. Don't look at the keyboard\n4. Start slow, focus on accuracy\n5. Practice regularly\n6. Use keyboard shortcuts\n7. Take breaks to avoid strain"
  );
}

// Show privacy information
function showPrivacy(e) {
  e.preventDefault();
  alert(
    "Privacy Policy:\n\nYour typing test results are stored locally in your browser and are not shared with any external servers. We respect your privacy and do not collect personal data."
  );
}

// Show contact information
function showContact(e) {
  e.preventDefault();
  alert(
    "Contact Us:\n\nFor any questions or feedback, please email: support@nitrotypepro.example.com"
  );
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);

window.addEventListener("DOMContentLoaded", () => {
  const mobileModal = document.getElementById("mobileWarningModal");

  if (window.innerWidth <= 768) {
    mobileModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
});
