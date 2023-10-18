import React, { useContext, useRef, useState } from 'react';
import { UserContext } from '../contexts/UserContext.jsx';
import defaultAuthorImage from '../images/account.png';
import imageStyles from '../styles/images.module.css';
import '../styles/single-column-grid-form.css';

function UploadProfilePicture() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ photoPreview, setPhotoPreview ] = useState(null);
  const [ deleteSelected, setDeleteSelected ] = useState(false);
  const uploadPhotoForm = useRef(null);
  const deletePhotoForm = useRef(null);
  return(
    <>
      <div className="photo-preview">
        <img className={imageStyles.profileImage} src={currentUser?.image || defaultAuthorImage} alt="current profile picture" />
        <p>Current Photo</p>
      </div>
      <div className="profile-photo-forms">
        <div className="form-area single-column-grid-form">
          <form ref={uploadPhotoForm} encType="multipart/form" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(uploadPhotoForm.current);
        
            fetch(`http://localhost:3000/api/users/${currentUser._id}/profile-pic`, {
              method: 'post',
              credentials: 'include',
              body: formData,
            })
              .then(async (res) => {
                if (res.status === 200) {
                  const newUserData = await res.json();

                  setCurrentUser(newUserData.currentUser);
                  uploadPhotoForm.current.reset();
                  deletePhotoForm.current.reset();
                  setPhotoPreview(null);
                }
              });
          }}>
            <label htmlFor="photoInput">Profile Picture</label>
            <input type="file" id="photoInput" name="photo" onChange={(e) => {
              setPhotoPreview(e.target.files[0]);
            }}/>
            {
              photoPreview &&
              <img className={imageStyles.profileImage} src={URL.createObjectURL(photoPreview)} alt="profile photo preview" />
              ||
              <p>No photo preview available</p>
            }
            <button type="submit">Upload Photo</button>
          </form>
        </div>
        <div>
          <form ref={deletePhotoForm} onSubmit={(e) => {
            e.preventDefault();

            fetch(`http://localhost:3000/api/users/${currentUser._id}/profile-pic`, {
              method: 'delete',
              credentials: 'include',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                delete_pic: e.target.delete_pic.checked,
              }),
            })
              .then(async (res) => {
                if (res.status === 200) {
                  const newUserData = await res.json();

                  setCurrentUser(newUserData.currentUser);
                  uploadPhotoForm.current.reset();
                  deletePhotoForm.current.reset();
                  setPhotoPreview(null);

                }
              });
          }}>
            <label htmlFor="delete_pic">Delete Profile Pic</label>
            <input type="checkbox" id="delete_pic" name="delete_pic" onChange={(e) => {
              setDeleteSelected(e.target.checked);
            }}/>
            { 
              deleteSelected &&
              <button type="submit">Delete Photo</button>
            }
          </form>
        </div>
      </div>
    </>
  )
}

export default UploadProfilePicture;