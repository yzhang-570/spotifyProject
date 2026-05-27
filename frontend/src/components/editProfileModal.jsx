import { useEffect, useState } from 'react';
import './editProfileModal.css';

const EditProfileModal = ({ isOpen, initialProfile, onClose, onSave }) => {
  
  // Form input; holds in progress form changes
  const [formData, setFormData] = useState(initialProfile);

  // Update form input when form opens + profile info changes
  useEffect(() => {
    if (isOpen) setFormData(initialProfile);
  }, [isOpen, initialProfile]);

  // Hides when not open
  if (!isOpen) return null;

  // Update form input state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // submit form -> call onSave in dashboard to update the actual displayed profile + db
  const handleSubmit = (e) => {
    e.preventDefault();  // prevent reload
    onSave(formData); // callback function; (formData) => {//parent's save function}
  };

  console.log(formData);

  return (
    <div className="edit-modal-overlay">
      {/* onClick={onClose} */}

      <div className="edit-modal" aria-label="Edit Profile Popup">

        {/* Header */}
        <header className="edit-modal-header">
          <h2 id="edit-profile-title" className="m edit-modal-title">Edit Profile</h2>
          <button type="button" className="edit-modal-closeX" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        {/* Form */}
        <form className="edit-modal-form" onSubmit={handleSubmit}>

          {/* Display Name (required...) */}
          <div className="edit-modal-field">
            <h2 className="edit-modal-label-text xs">Display Name</h2>
            <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} maxLength={50} required/>
          </div>

          {/* Bio */}
          <div className="edit-modal-field">
            <h2 className="edit-modal-label-text xs">Bio</h2>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} maxLength={300}/>
          </div>

          <p className="xs">I will come back and edit the styling... but functionality first</p>

          {/* Profile isPrivate */}
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

          {/* Top Songs, Top Artists, Liked Songs */}
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

          {/* Buttons */}
          <div className="edit-modal-actions">

            {/* Cancel button */}
            {/* <button type="button" className="edit-modal-button edit-modal-cancel" onClick={onClose}>
              Cancel
            </button> */}

            {/* Save button */}
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
