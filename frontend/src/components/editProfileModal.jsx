import { useState } from 'react';
import './editProfileModal.css';

const EditProfileModal = ({ isOpen, initialProfile, onClose, onSave }) => {
  
  const [formData, setFormData] = useState(initialProfile);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal" aria-label="Edit Profile Popup">

        <header className="edit-modal-header">
          <h2 id="edit-profile-title" className="m edit-modal-title">Edit Profile</h2>
          <button type="button" className="edit-modal-closeX" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <form className="edit-modal-form" onSubmit={handleSubmit}>

          <div className="edit-modal-field">
            <h2 className="edit-modal-label-text xs">Display Name</h2>
            <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} maxLength={50} required/>
          </div>

          <div className="edit-modal-field">
            <h2 className="edit-modal-label-text xs">Bio</h2>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} maxLength={300}/>
          </div>

          <p className="xs">I will come back and edit the styling... but functionality first</p>

          <div className="edit-modal-options-list row">
            <h2 className="edit-modal-label-text xs">Profile Visibility</h2>
            <div className="edit-modal-option">
              <input type="radio" name="isPrivate"
                checked={formData.isPrivate == false}
                onChange={(e) => setFormData(prev => ({...prev, [e.target.name]: false}))}/>
              <span className="edit-modal-option-label">Public</span>
            </div>
            <div className="edit-modal-option">
              <input type="radio" name="isPrivate"
                checked={formData.isPrivate == true}
                onChange={(e) => setFormData(prev => ({...prev, [e.target.name]: true}))}/>
              <span className="edit-modal-option-label">Private</span>
            </div>
          </div>

          <div className="edit-modal-options-list">
            <h2 className="edit-modal-label-text xs">Displayed on My Profile</h2>
            <div className="edit-modal-option">
              <input type="checkbox" name="top_songs_isPrivate"
                checked={formData.top_songs_isPrivate == false}
                onChange={(e) => setFormData(prev => ({...prev, [e.target.name]: !prev[e.target.name]}))}/>
              <span className="edit-modal-option-label">Top Songs</span>
            </div>
            <div className="edit-modal-option">
              <input type="checkbox" name="top_artists_isPrivate"
                checked={formData.top_artists_isPrivate == false}
                onChange={(e) => setFormData(prev => ({...prev, [e.target.name]: !prev[e.target.name]}))}/>
              <span className="edit-modal-option-label">Top Artists</span>
            </div>
            <div className="edit-modal-option">
              <input type="checkbox" name="liked_songs_isPrivate"
                checked={formData.liked_songs_isPrivate == false}
                onChange={(e) => setFormData(prev => ({...prev, [e.target.name]: !prev[e.target.name]}))}/>
              <span className="edit-modal-option-label">Liked Songs</span>
            </div>
          </div>

          <div className="edit-modal-actions">
            <button type="submit" className="edit-modal-button edit-modal-save">
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;