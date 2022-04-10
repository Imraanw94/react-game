import classnames from "classnames"; // This utility allows us to conditionally set classnames https://www.npmjs.com/package/classnames
import { Card } from "react-bootstrap";
import cardBack from "../images/islamic-art-pattern.jpg";

// The GameTile Component
function GameTile(props) {
  // This function handles the logic when a card is clicked. We pass the index of the card back to the onClickHandler function in App.js
  const handleClick = () => props.onClickHandler(props.index);

  return (
    <Card
      className={classnames({
        "is-flipped": props.isFlipped,
        "is-inactive": props.isInactive,
      })}
      onClick={handleClick}
    >
      <Card.Body>
        <div className="card-face card-front-face">
          <img src={cardBack} alt="islamic mosaic art" />
        </div>
        <div className="card-face card-back-face">
          <img src={props.card.image} alt={props.card.name + " flag"} />
        </div>
      </Card.Body>
    </Card>
  );
}

export default GameTile;
