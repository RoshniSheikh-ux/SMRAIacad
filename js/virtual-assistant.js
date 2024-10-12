let assistantButton = document.querySelector(".chatbot-icon-container"); // Changed variable name
let isListening = false; // Track the listening state
let isSpeaking = false;  // Track the speaking state

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.continuous = false;  // Listen for one result at a time
recognition.interimResults = false;  // Avoid partial responses

// Function to speak and control the assistant's state
function speak(text) {
    return new Promise((resolve) => {
        let text_speak = new SpeechSynthesisUtterance(text);
        text_speak.rate = 1;
        text_speak.pitch = 1;
        text_speak.volume = 1;
        text_speak.lang = "hi-GB";

        // Stop recognition while speaking
        if (isListening) recognition.stop();
        isSpeaking = true;

        text_speak.onend = () => {
            console.log("Finished speaking.");
            isSpeaking = false;
            resolve(); // Resolve after speaking ends
        };

        window.speechSynthesis.speak(text_speak);
    });
}

// Function to greet based on the time of day
async function wishMe() {
    let day = new Date();
    let hrs = day.getHours();
    let greetingText;

    if (hrs >= 0 && hrs < 12) {
        greetingText = "Good Morning, How can I help you?";
    } else if (hrs >= 12 && hrs < 16) {
        greetingText = "Good Afternoon, How can I help you?";
    } else {
        greetingText = "Good Evening, How can I help you?";
    }

    await speak(greetingText); // Wait for the greeting to finish
}

// Handle speech recognition results
recognition.onresult = async (event) => {
    let transcript = event.results[event.resultIndex][0].transcript.trim();
    console.log(`Heard: ${transcript}`);

    await takeCommand(transcript);

    // Restart recognition after speaking ends
    if (isListening && !isSpeaking) {
        recognition.start();
    }
};

// Restart recognition when it ends
recognition.onend = () => {
    if (isListening && !isSpeaking) {
        console.log("Restarting recognition...");
        recognition.start();
    }
};

// Toggle listening on button click
assistantButton.addEventListener("click", async () => {
    isListening = !isListening; // Toggle listening state

    if (isListening) {
        await wishMe();  // Greet and start listening
        recognition.start();
    } else {
        recognition.stop();
    }
});

// Handle commands with the same stop logic
async function takeCommand(message) {
    // Convert the message to lowercase for easier comparison
    const lowerCaseMessage = message.toLowerCase();
    console.log(`Heard: ${lowerCaseMessage}`);  // Debugging line to see what was heard

    if (lowerCaseMessage.includes('hello')) {
        await speak("Hello, how can I help you?");
    } else if (lowerCaseMessage.includes('go to classes page')||lowerCaseMessage.includes('open classes page')) {
        pageSwitcher("classes.html");
    } else if (lowerCaseMessage.includes('go to contact page')) {
        pageSwitcher("contact.html");
    } else if (lowerCaseMessage.includes('go to home page') || lowerCaseMessage.includes('go to homepage')) {
        pageSwitcher("index.html");
    } else if(lowerCaseMessage.includes('go to courses page')||lowerCaseMessage.includes('open courses page')){
        pageSwitcher("courses.html");
    }//can be added oothers
    else if(lowerCaseMessage.includes('go to blog page')||lowerCaseMessage.includes('open blog page')){
        pageSwitcher("Blog.html");
    }
    else if(lowerCaseMessage.includes('what is your name'|| lowerCaseMessage.includes('tumhara name kya hai'))){
        await speak("My name is Edith. I am a virtual assistant at this page.");
    }  
    else if(lowerCaseMessage.includes('who made you')){
        await speak("I am made by SmartCoderRahis for assistance on his website.");
    }  
    else if(lowerCaseMessage.includes('tumko kisne banaya hai')){
        await speak("Mujhe Smart Coder Rahis dwaraa banaya gaya hai. Mai ek Virtual Assistant hoo!");
    }
    else if(lowerCaseMessage.includes('what can you do')|| lowerCaseMessage.includes('tell me your capability')){
        await speak("I can assist you through this page. I can do lots of things except the things which is in developing phase.");
    }
    else if(lowerCaseMessage.includes('tum kya kar sakti ho')){
        await speak("Mai iss website ko apke voice se control karne me help karsakti hoo, aap jo bolenge uska jawab dena mera farz hai!");
    }
    else if (lowerCaseMessage.includes('stop')||lowerCaseMessage.includes('goodbye')||lowerCaseMessage.includes('go to hell')) {
        await speak("I am gonna sleep now. Goodbye!");
        simulateClick(assistantButton); // Programmatically click the button
        simulateCloseButtonClick(); // Programmatically click the close button
    } else {
        await speak("Oops! Lagta hai mujhe sunaai nahi diya.");
    }
}

// Function to programmatically click the button
function simulateClick(element) {
    const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });

    setTimeout(() => {
        element.dispatchEvent(event);  // Trigger the click
        console.log("Button clicked programmatically.");
    }, 500); // Delay to ensure the speech finishes
}

// Function to programmatically click the close button
function simulateCloseButtonClick() {
    const closeButton = document.querySelector(".close-btn");
    if (closeButton) {
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        closeButton.dispatchEvent(event);  // Trigger the close button click
        console.log("Close button clicked programmatically.");
    }
}

function pageSwitcher(pageUrl) {
    // Get the current page URL
    const currentPageUrl = window.location.href.split('/').pop(); // Get only the last part of the URL

    // Check if the current page URL matches the requested page URL
    if (currentPageUrl === pageUrl) {
        speak("You are already on this page. check please!").then(() => {
            // Restart listening after speaking
            if (isListening && !isSpeaking) {
                recognition.start();
            }
        }); // Inform the user
    } else {
        // Extract the page name from the pageUrl
        let pageName = pageUrl.split('.html')[0]; // Get the page name without the extension
        speak("Opening " + pageName + " page.").then(() => {
            // Redirect to the new page after speaking
            window.location.href = pageUrl; // Redirect to the new page
        });
    }
}

