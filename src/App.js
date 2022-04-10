import "bootstrap/dist/css/bootstrap.min.css"; // Import some styling from Bootstrap
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import "./App.css";
import GameTile from "./Components/GameTile";

function App() {
  // This is the array we use to create the cards to play the game
  const greatIslamicStatesArray = [
    {
      name: "Abbasid Caliphate",
      image: require("./images/Abbasid_Caliphate.png"),
    },
    {
      name: "Marinid Sultanate",
      image: require("./images/Marinid_Sultanate.png"),
    },
    {
      name: "Mughal Empire",
      image: require("./images/Mughal_Empire.png"),
    },
    {
      name: "Ottoman Empire",
      image: require("./images/Ottoman_Empire_(1844-1922).png"),
    },
    {
      name: "Seljuk Empire",
      image: require("./images/Seljuk_Empire.png"),
    },
    {
      name: "Umayyad Caliphate",
      image: require("./images/Umayyad_Caliphate.png"),
    },
  ];

  // In this state we duplicate the card image array, then call the shufflecards() function using the duplicated array
  // The shufflecards() function returns an array to use
  // The warning for unique keys comes from duplicating the array within this state
  const [cards, setCards] = useState(
    shuffleCards(greatIslamicStatesArray.concat(greatIslamicStatesArray))
  );
  // This state is used to keep track of the clicked/flipped cards in an array format.
  const [openCards, setOpenCards] = useState([]);
  // This state keeps track of the cards that have been matched
  // Using arrays failed me with this state so I decided to go with an object, use the card names as property names, and set their value as true if matched
  const [matchedCards, setMatchedCards] = useState({});

  // This state is used to count the number of moves the player has made
  const [moves, setMoves] = useState(0);

  // This state sets the user's best score. If JSON.parse(sessionStorage.getItem("bestScore")) is not truthy (i.e. does not exist),
  // we just set the best score to the highest maximum value in Javascript
  const [bestScore, setBestScore] = useState(
    JSON.parse(sessionStorage.getItem("bestScore")) || "No Score Set"
  );
  // This state is used to display the Game Over Modal component
  const [show, setShow] = useState(false);
  // Closes the Modal component
  const handleClose = () => setShow(false);
  // Opens the Modal component
  const handleShow = () => setShow(true);
  // This state is used to display the help Modal component
  const [showHelp, setShowHelp] = useState(false);
  // Closes the Modal component
  const handleCloseHelp = () => setShowHelp(false);
  // Opens the Modal component
  const handleShowHelp = () => setShowHelp(true);

  // Fisher Yates Shuffle https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  function shuffleCards(array) {
    const length = array.length;
    for (let i = length; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * i);
      const currentIndex = i - 1;
      const temp = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temp;
    }
    return array;
  }

  // This function checks whether the game is over
  const checkGameOver = () => {
    // Object.keys returns an array of matchedCards property names
    // If the length of matchedCards is the same as the starting array, the game is over
    if (Object.keys(matchedCards).length === greatIslamicStatesArray.length) {
      handleShow(); // Show the Modal
      let highScore = 0;
      // This conditional checks if this is the first highscore set of the game,
      // i.e. bestScore equals to "No Score Set", so set the first highscore to the moves taken
      if (isNaN(bestScore)) {
        highScore = moves;
      } else {
        highScore = Math.min(moves, bestScore);
      }
      setBestScore(highScore);
      sessionStorage.setItem("bestScore", highScore); // Store the new bestScore
    }
  };

  // This function checks whether the cards the player selected match or not
  const evaluate = () => {
    // Set a shallow array of the openCards array to use
    const [one, two] = openCards;
    // Use the index of the cards in openCards to get the cards in the cards array, i.e. cards[2].name === cards[5].name
    // If the two flipped cards match, set one card as matched and empty the openCards array
    if (cards[one].name === cards[two].name) {
      // Use of spread operator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      setMatchedCards((prev) => ({ ...prev, [cards[one].name]: true }));
      setOpenCards([]);
      return;
    }
    // This is to flip the cards back after 400ms duration
    setTimeout(() => {
      setOpenCards([]);
    }, 400);
  };

  // This function handles logic when a card is clicked
  // We don't need to use the entire card, just the index of it
  const handleCardClick = (index) => {
    // If we flip a card and already have a flipped card, set the array of openCards to both cards, and increment the move counter
    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
      setMoves((moves) => moves + 1);
    } else {
      // If we're only flipping one of the two cards, just set the openCards array with the one card
      setOpenCards([index]);
    }
  };

  // When a change is made to the openCards state, call the evaluate function after 400ms
  useEffect(() => {
    let timeout = null;
    // If there are two cards flipped, call the evaluate function
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 400);
    }
    // Clear the timeout at the end of the useEffect function
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]);

  // When a change is made to the matchedCards, call the checkGameOver function
  useEffect(() => {
    checkGameOver();
  }, [matchedCards]);

  // This function returns true/false if the openCards array contains the index of the card passed to the function
  // This function's return value is used as a prop by the GameTile to flip the card
  const checkIsFlipped = (index) => {
    return openCards.includes(index);
  };

  // This function returns true/false if the matchedCards state contains a property that matches the passed card's name
  // his function's return value is used as a prop by the GameTile to hide the card
  const checkIsInactive = (card) => {
    return Boolean(matchedCards[card.name]);
  };

  // This function resets some of the states and restarts the game
  const handleRestart = () => {
    setMatchedCards({}); // Reset the matchedCards
    setOpenCards([]); // Reset the openCards
    setMoves(0); // Reset the number of moves made
    handleClose(); // Close the Modal
    setCards(
      shuffleCards(greatIslamicStatesArray.concat(greatIslamicStatesArray))
    ); // set a new shuffled deck of cards
  };

  return (
    <Container className="App">
      <Container>
        <Card>
          <Card.Header className="text-center" style={{ fontSize: "40px" }}>
            Play the Flip card game
          </Card.Header>
          <Card.Body>
            <Stack direction="horizontal" gap={3}>
              <Button
                className="mr-3"
                onClick={handleRestart}
                variant="outline-primary"
              >
                Restart
              </Button>
              <Button onClick={setShowHelp} variant="outline-info">
                Help
              </Button>
              <Card>
                <Card.Body>
                  <div className="score">
                    <div className="moves">
                      <span className="bold">Moves:</span> {moves}
                    </div>
                    <div className="high-score">
                      <span className="bold">Best Score: {bestScore}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Stack>
          </Card.Body>
        </Card>
      </Container>
      <Container>
        <Col>
          {cards.map((card, index) => {
            return (
              <Row>
                <GameTile
                  key={index}
                  card={card}
                  index={index}
                  isInactive={checkIsInactive(card)}
                  isFlipped={checkIsFlipped(index)}
                  onClickHandler={handleCardClick}
                />
              </Row>
            );
          })}
        </Col>
      </Container>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>
            You finished the game in {moves} moves. Your best score is{" "}
            {bestScore} moves.
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="primary" onClick={handleRestart}>
            Restart
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showHelp}
        onHide={handleCloseHelp}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>
            Click on the cards to flip them. Select two cards with same content
            consequtively to make them vanish. Match all cards to finish the
            game. The fewer moves to match all cards, the better the score.
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseHelp}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
