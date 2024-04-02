import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { storage } from "../config/firebase.config";

const CreateTemplate = () => {
  const [formData, setFormData] = useState({
    title: "",
    imageURL: null,
  });

  const [imageAssest, setImageAssest] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevRec) => ({ ...prevRec, [name]: value }));
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    return allowedTypes.includes(file.type);
  };

  const deleteImage = async () => {
    setInterval(() => {
      setImageAssest((prevAssest) => ({
        ...prevAssest,
        progress: 0,
        uri: null,
      }));
    }, 2000);

    const deleteRef = ref(storage, imageAssest.uri);

    deleteObject(deleteRef).then(() => {
      toast.success("Image Removed");
    });
  };

  const handleFileSelect = async (e) => {
    setImageAssest((prevAssest) => ({ ...prevAssest, isImageLoading: true }));
    const file = e.target.files[0];

    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageAssest((prevAssest) => ({
            ...prevAssest,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorized")) {
            toast.error(`Error: Authorization Revoked`);
          } else {
            toast.error(`Error: ${error.message}`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageAssest((prevAssest) => ({
              ...prevAssest,
              uri: downloadURL,
            }));
          });

          toast.success("Image Uploaded");
          setInterval(() => {
            setImageAssest((prevAssest) => ({
              ...prevAssest,
              isImageLoading: false,
            }));
          }, 2000);
        }
      );
    } else {
      toast.info("Invald File Type");
    }
  };

  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3 w-full flax-1 flex items-center justify-start flex-col gap-4 px-2">
        <div className="w-full">
          <p className="text-lg text-txtPrimary">Create a new template</p>
        </div>

        <div className="w-full flex items-center justify-end">
          <p className="text-base text-txtLight uppercase font-semibold ">
            TempID :{" "}
          </p>
          <p className="text-sm text-txtDark capitalize font-bold">
            Template 1
          </p>
        </div>
        <input
          type="text"
          placeholder="Template Title"
          value={formData.title}
          onChange={handleInputChange}
          name="title"
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark
          focus:shadow-md outline-none"
        />
        <div className="w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
          {imageAssest.isImageLoading ? (
            <React.Fragment>
              <div className="flex flex-col items-center justify-center gap-4">
                <PuffLoader color="#498FCD" size={40} />
                <p>{imageAssest?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAssest?.uri ? (
                <React.Fragment>
                  <label className="w-full cursor-pointer h-full">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="flex items-center justify-center cursor-pointer flex-col gap-4">
                        <FaUpload className="text-2xl" />
                        <p className="text-lg text-txtLight">Click to upload</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg, .jpg, .png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAssest?.uri}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      alt=""
                    />
                    <div
                      className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                      onClick={deleteImage}
                    >
                      <FaTrash className="text-sm text-white" />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 bg-red-200 ">
        2
      </div>
    </div>
  );
};

export default CreateTemplate;
