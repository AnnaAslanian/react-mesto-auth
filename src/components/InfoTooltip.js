import success from "../images/success.svg";
import fail from "../images/fail.svg"
import Popup from "./Popup";

const ICONS = {
  success: success,
  fail: fail
}

function InfoToolTip({ onClose, isOpen, status: { iconType, text } = {}, isRegisterSuccess}) {
    return (
      <Popup
        name="tooltip"
        title=""
        isOpen={isOpen}
        onClose={onClose}
      >
        <img
          src={ICONS[iconType]}
          className="popup__tooltip-img"
          alt={text}
        />
        <h2 className="popup__tooltip-info">
          {text}
        </h2>
      </Popup>
    );
}

export default InfoToolTip;