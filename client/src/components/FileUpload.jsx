// import { useState } from "react";

// export default function Upload() {
//   const [img, setImg] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const imgUrl = await uploadFile("image");
//       await axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/api`)
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   //uploadFile
//   const uploadFile = async (type) => {
//     const data = new FormData();
//     data.append("file", type === "image");
//     data.append("upload_preset", type === "image");
//     try{
//         let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
//         let resourceType = type = "image"
//         let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

//         const res = await axios.post(api, data);
//         const {secure_url} = res.data;
//         console.log(secure_url);
//         return secure_url;

//     }catch(error){
//         console.log(error);

//     }
//   };

//   return (
//     <form action="" onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="img">Image</label>
//         <br />
//         <input
//           type="file"
//           accept="image/*"
//           id="img"
//           onChange={(e) => {
//             setImg(e.target.value);
//           }}
//         />
//       </div>
//     </form>
//   );
// }

// src/components/FileUpload.js


import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:3000/user/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadedFile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onFileChange} />
        <button type="submit">Upload</button>
      </form>
      {uploadedFile && (
        <div>
          <h3>Uploaded File:</h3>
          <p>{uploadedFile.public_id}</p>
          <img src={uploadedFile.url} alt="uploaded file" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
