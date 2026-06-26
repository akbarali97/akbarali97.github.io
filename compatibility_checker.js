// List of questions (Full-time and Freelance paths)
const questions = {
    initial: [
      { id: 1, text: "Are you looking for a full-time hire or a freelancer?", type: "select", options: ["Full-time", "Freelance"] }
    ],
    fullTime: [
      { id: 2, text: "What is the role you're hiring for?", type: "textarea" },
      { id: 3, text: "What is the expected work schedule?", type: "select", options: ["Full-time (40+ hours/week)", "Part-time (20-30 hours/week)"] },
      { id: 4, text: "Are you open to remote work?", type: "select", options: ["Yes", "No"] },
      { id: 5, text: "What type of team will I be working with?", type: "select", options: ["Small startup", "Large corporation"] },
      { id: 6, text: "Do you value autonomy or structured guidance?", type: "select", options: ["Autonomy", "Structured guidance"] },
      { id: 7, text: "What are your expectations for growth?", type: "select", options: ["Long-term commitment", "Short-term contribution"] },
      { id: 8, text: "Are you comfortable using collaboration tools like Slack, Zoom, etc.?", type: "select", options: ["Yes", "No"] }
    ],
    freelance: [
      { id: 2, text: "What is your project type?", type: "select", options: ["Web Development", "Mobile App", "Design"] },
      { id: 3, text: "What is your budget range?", type: "select", options: ["Below $1000", "$1000–$5000", "$5000+"] },
      { id: 4, text: "What is your timeline for delivery?", type: "select", options: ["Flexible", "Within 1–2 months", "ASAP"] },
      { id: 5, text: "How involved do you want to be?", type: "select", options: ["Hands-on", "Occasional check-ins", "Minimal involvement"] },
      { id: 6, text: "Are you open to feedback and revisions?", type: "select", options: ["Yes", "No"] },
      { id: 7, text: "What are your deliverable expectations?", type: "textarea" },
      { id: 8, text: "Are you okay with milestone-based payments?", type: "select", options: ["Yes", "No"] }
    ]
  };
  
  let currentPath = "initial";
  let currentQuestionIndex = 0;
  let answers = {};
  
  // Initialize the form
  function initializeForm() {
    renderQuestionCard(currentQuestionIndex);
  
    // Event listener for "Next" button
    document.getElementById("question-container").addEventListener("click", (event) => {
      if (event.target.classList.contains("next-btn")) {
        saveAnswer(currentQuestionIndex);
  
        // Determine the path if on the initial question
        if (currentPath === "initial" && currentQuestionIndex === 0) {
          currentPath = answers[1] === "Full-time" ? "fullTime" : "freelance";
          currentQuestionIndex = 0; // Reset index for new path
          updateProgress();
        } else {
          currentQuestionIndex++;
        }
  
        // Check if we've reached the end
        if (currentQuestionIndex >= questions[currentPath].length) {
          showResults();
        } else {
          renderQuestionCard(currentQuestionIndex);
        }
      }
    });
  }
  
  // Render a question card
  function renderQuestionCard(index) {
    const question = questions[currentPath][index];
    const container = document.getElementById("question-container");
  
    container.innerHTML = `
      <div class="card p-4 mb-3">
        <h5>${question.text}</h5>
        ${question.type === "select" ? renderSelectOptions(question.options) : renderTextarea()}
        <button class="btn btn-primary mt-3 next-btn">Next</button>
      </div>
    `;
  }
  
  // Render select options
  function renderSelectOptions(options) {
    return `
      <select class="form-select mt-2">
        ${options.map((option) => `<option value="${option}">${option}</option>`).join("")}
      </select>
    `;
  }
  
  // Render textarea
  function renderTextarea() {
    return `<textarea class="form-control mt-2" rows="3"></textarea>`;
  }
  
  // Save the answer
  function saveAnswer(index) {
    const question = questions[currentPath][index];
    const answerElement = document.querySelector(".form-select, .form-control");
    answers[question.id] = answerElement.value;
  }
  
  // Show results
  function showResults() {
    // Evaluate compatibility
    const message = currentPath === "fullTime"
      ? evaluateFullTimeCompatibility()
      : evaluateFreelanceCompatibility();
  
    // Display results
    const container = document.getElementById("question-container");
    container.innerHTML = `
      <div class="text-center">
        <h4>Results</h4>
        <p>${message}</p>
        <button class="btn btn-success" onclick="location.reload()">Start Over</button>
      </div>
    `;
  }
  
  // Evaluate full-time compatibility
  function evaluateFullTimeCompatibility() {
    let score = 0;
    score += answers[3] === "Full-time (40+ hours/week)" ? 10 : 5;
    score += answers[4] === "Yes" ? 10 : -10;
    score += answers[5] === "Small startup" ? 10 : 5;
    score += answers[6] === "Autonomy" ? 10 : 5;
    score += answers[8] === "Yes" ? 10 : -10;
  
    return score >= 40
      ? "Great fit for full-time collaboration!"
      : "Some adjustments may be needed for full-time work.";
  }
  
  // Evaluate freelance compatibility
  function evaluateFreelanceCompatibility() {
    let score = 0;
    score += answers[3] === "$5000+" ? 10 : answers[3] === "$1000–$5000" ? 5 : -10;
    score += answers[4] === "Flexible" ? 10 : answers[4] === "Within 1–2 months" ? 5 : -5;
    score += answers[5] === "Occasional check-ins" ? 10 : 5;
    score += answers[6] === "Yes" ? 10 : -10;
  
    return score >= 40
      ? "Great fit for freelance collaboration!"
      : "Some adjustments may be needed for freelance work.";
  }
  
  // Update progress
  function updateProgress() {
    const totalQuestions = questions[currentPath].length;
    document.getElementById("current-question").innerText = currentQuestionIndex + 1;
    document.getElementById("total-questions").innerText = totalQuestions;
  }
  
  // Initialize form on page load
  document.addEventListener("DOMContentLoaded", initializeForm);
  