const cards = document.querySelectorAll(".card");
let matchedPairs = 0;
let cardOne, cardTwo;
let disableDeck = false;

let mySound = new Audio('audio/cheering.wav');

function flipCard(evt) { // take an event object's as a scoped variable
    const clickedCard = evt.target; // set the event's target DOM element as a variable
    if (cardOne !== clickedCard && !disableDeck) { // make sure that the current variable cardOne is not the same value as the clickedCard, AND that the deck is NOT disabled
        clickedCard.classList.add("flip"); // add the 'flip' class to the classes currently assigned to the clickedCard
        if (!cardOne) { // if there is not yet a value assigned to the cardOne variable...
            return cardOne = clickedCard; // set the cardOne value as the clickedCard and end this function.
        }
        // everything below will execute if the condition above was not met (if cardOne already had a value when flipCard() was called)
        cardTwo = clickedCard; // set the cardTwo value as the clickedCard
        disableDeck = true; // set this to true for the next time this flipCard function is called, when the top level condition is evaluated
        // if the function has come this far, it means we have set values for both cardOne and cardTwo.
        // each of the cardOne and cardTwo variables currently represent a whole HTML element with childNodes
        let cardOneImg = cardOne.querySelector(".back-view img").src; // query the elements inside cardOne to get the value of the img src, such as `img-2.png`, and set that as the value of cardOneImg
        let cardTwoImg = cardTwo.querySelector(".back-view img").src; // query the elements inside cardOne to get the value of the img src, such as `img-2.png`, and set that as the value of cardTwoImg
        matchCards(cardOneImg, cardTwoImg); // now check the images by filename to see if they are a match!
    }
}

function matchCards(img1, img2) {
    if (img1 === img2) { // this code will run if the card images match
        matchedPairs++; // if the card images match, we can increment the global `matchedPairs` variable by 1 match
        if (matchedPairs == 8) { // if your number of matches is 8, you've made all the matches! Game Won!
            console.log('YOU WIN!');
            confetti(); // execute the confetti function when the user wins the game
            mySound.play(); // play the sound when the user wins the game
            return; // for now, lets call this game over, end this function and do nothing else.
        }
        // everything below will execute if the game has not yet been won...
        cardOne.removeEventListener("click", flipCard); // remove the eventlistener so that this matchedPairs card cannot be flipped anymore
        cardTwo.removeEventListener("click", flipCard); // remove the eventlistener so that this matchedPairs card cannot be flipped anymore
        cardOne = cardTwo = ""; // now reset the cardOne & cardTwo variables to empty strings, so we can use them again
        disableDeck = false;
        return; // end function
    }

    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    // these cards didn't match so we'll un-flip them, but let the user see them both before they disappear
    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = ""; // reset the cardOne & cardTwo variables to empty string
        disableDeck = false;
        return;
    }, 1200);
}

function shuffleCards() {
    matchedPairs = 0; // reset matchedPairs variable to 0
    disableDeck = false; // reset disableDeck boolean
    cardOne = cardTwo = ""; // reset cardOne and cardTwo variables
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]; // create an array of the image numbers, 1-8, twice
    arr.sort(() => Math.random() > 0.5 ? 1 : -1); // randomly sort the array

    cards.forEach((card, i) => { // loop over the set of cards. For each card...
        card.classList.remove("flip"); // remove the 'flip' class
        let imgTag = card.querySelector(".back-view img"); // find the back-view image tag by querying all the childNodes of the current card element for the '.back-view img' CSS selector
        imgTag.src = `images/img-${arr[i]}.png`; // set the value of the src attribute on the current imgTag to a numbered filename based on our randomized array
        card.addEventListener("click", flipCard); // add the click event listener to the current card to execute a function `flipCard` when clicked
    });
}

function confetti() {
    //-----------Var Inits--------------
    canvas = document.getElementById("canvas");
    canvas.classList.add("active"); // set active to show the confetti
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cx = ctx.canvas.width / 2;
    cy = ctx.canvas.height / 2;

    let confetti = [];
    const confettiCount = 300;
    const gravity = 0.5;
    const terminalVelocity = 5;
    const drag = 0.075;
    const colors = [
        { front: 'red', back: 'darkred' },
        { front: 'green', back: 'darkgreen' },
        { front: 'blue', back: 'darkblue' },
        { front: 'yellow', back: 'darkyellow' },
        { front: 'orange', back: 'darkorange' },
        { front: 'pink', back: 'darkpink' },
        { front: 'purple', back: 'darkpurple' },
        { front: 'turquoise', back: 'darkturquoise' }];


    //-----------Functions--------------
    resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cx = ctx.canvas.width / 2;
        cy = ctx.canvas.height / 2;
    };

    randomRange = (min, max) => Math.random() * (max - min) + min;

    initConfetti = () => {
        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                color: colors[Math.floor(randomRange(0, colors.length))],
                dimensions: {
                    x: randomRange(10, 20),
                    y: randomRange(10, 30)
                },

                position: {
                    x: randomRange(0, canvas.width),
                    y: canvas.height - 1
                },

                rotation: randomRange(0, 2 * Math.PI),
                scale: {
                    x: 1,
                    y: 1
                },

                velocity: {
                    x: randomRange(-25, 25),
                    y: randomRange(0, -50)
                }
            });


        }
    };

    //---------Render-----------
    render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach((confetto, index) => {
            let width = confetto.dimensions.x * confetto.scale.x;
            let height = confetto.dimensions.y * confetto.scale.y;

            // Move canvas to position and rotate
            ctx.translate(confetto.position.x, confetto.position.y);
            ctx.rotate(confetto.rotation);

            // Apply forces to velocity
            confetto.velocity.x -= confetto.velocity.x * drag;
            confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
            confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

            // Set position
            confetto.position.x += confetto.velocity.x;
            confetto.position.y += confetto.velocity.y;

            // Delete confetti when out of frame
            if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

            // Loop confetto x position
            if (confetto.position.x > canvas.width) confetto.position.x = 0;
            if (confetto.position.x < 0) confetto.position.x = canvas.width;

            // Spin confetto by scaling y
            confetto.scale.y = Math.cos(confetto.position.y * 0.1);
            ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

            // Draw confetti
            ctx.fillRect(-width / 2, -height / 2, width, height);

            // Reset transform matrix
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        });

        // Fire off another round of confetti
        if (confetti.length <= 10) initConfetti();

        window.requestAnimationFrame(render);
    };

    //---------Execution--------
    initConfetti();
    render();

    //----------Resize----------
    window.addEventListener('resize', function () {
        resizeCanvas();
    });

    //------------Click------------
    window.addEventListener('click', function () {
        initConfetti();
    });
}

shuffleCards(); // execute the shuffleCards function