import { useEffect, useState } from 'react';
import './editProfileModal.css';

const EditProfileModal = ({ isOpen, initialProfile, onClose, onSave }) => {
  
  // Form input
  const [form, setForm] = useState(initialProfile);

  useEffect(() => {
    if (isOpen) setForm(initialProfile);
  }, [isOpen, initialProfile]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  console.log(form);

  return (
    <div className="edit-modal-overlay" 
      // onClick={onClose}
    >
      <div
        className="edit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="edit-modal-header">
          <h2 id="edit-profile-title" className="edit-modal-title">Edit Profile</h2>
          <button
            type="button"
            className="edit-modal-close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <form className="edit-modal-form" onSubmit={handleSubmit}>

          <label className="edit-modal-field">
            <span className="edit-modal-label">Display Name</span>
            <input
              type="text"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              maxLength={50}
              required
            />
          </label>

          <label className="edit-modal-field">
            <span className="edit-modal-label">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              maxLength={300}
            />
          </label>

          <div className="edit-modal-actions">
            <button
              type="button"
              className="edit-modal-button edit-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="edit-modal-button edit-modal-save"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
