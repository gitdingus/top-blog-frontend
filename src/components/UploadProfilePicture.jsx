import React, { useContext, useRef } from 'react';
import { UserContext } from '../contexts/UserContext.jsx';
import '../styles/single-column-grid-form.css';

function UploadProfilePicture() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const uploadPhotoForm = useRef(null);

  return(
    <div className="form-area single-column-grid-form">
      <form ref={uploadPhotoForm} encType="multipart/form" onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(uploadPhotoForm.current);
        
        fetch(`http://localhost:3000/api/users/${currentUser._id}/upload-photo`, {
          method: 'post',
          credentials: 'include',
          body: formData,
        })
          .then((res) => {
            console.log(res.status);
          })
          .catch((err) => console.log(err));
      }}>
        <label htmlFor="photoInput">Profile Picture</label>
        <input type="file" id="photoInput" name="photo" />
        <p>
          <label htmlFor="delete_pic">Delete Profile Pic</label>
          <input type="checkbox" id="delete_pic" name="delete_pic" />
        </p>
        <button type="submit">Upload Photo</button>
      </form>
    </div>
  )
}

export default UploadProfilePicture;