import { useNavigate } from 'react-router-dom'
import './collectionCard.css'
import { ArrowRight } from 'lucide-react';

const CollectionCard = ({ navLink, styles, text, imageLink }) => {

  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(navLink)} className="collection-div"
      style={styles}>
      <div className="colleciton-image-mask">
        <img className="collection-image" src={imageLink} />
      </div>
      <ArrowRight className="arrow-icon" color="#ffffff" />
      <h3 className="collection-name-text">{text}</h3>
    </button>
  )
};

export default CollectionCard;