import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { AnimatePresence } from "framer-motion";
import { MainSpinner, TemplateDesign } from "../components";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";
import { NoData } from "../assets";
import { useQuery } from "react-query";
import { getSavedResumes } from "../api";

function UserProfile() {
  const { data: user } = useUser();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("collections");

  const {
    data: templates,
    isError: temp_isError,
    isLoading: temp_isLoading,
  } = useTemplates();

  const { data: savedResumes } = useQuery(["savedResumes"], () =>
    getSavedResumes(user?.uid)
  );

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/auth", { replace: true });
  //   }
  // }, []);

  if (temp_isLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="w-full flex flex-col items-center justify-start py-12">
      <div className="w-full h-72">
        <img
          src="https://wallpapercrafter.com/th8001/500185-illustration-landscape-digital-art-mountains-Firewatch.jpg"
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="flex items-center justify-center flex-col gap-4">
          {user?.photoURL ? (
            <React.Fragment>
              <img
                src={user?.photoURL}
                className="w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
                alt=""
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <img
                src="https://static.vecteezy.com/system/resources/previews/011/459/666/original/people-avatar-icon-png.png"
                className="w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
                alt=""
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </React.Fragment>
          )}

          <p className="text-2xl text-txtDark">{user?.displayName}</p>
        </div>
        <div className="flex items-center justify-center mt-12">
          <div
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
            onClick={() => setActiveTab("collections")}
          >
            <p
              className={`text-base group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "collections" &&
                "bg-white shadow-md text-blue-600"
              }`}
            >
              Collections
            </p>
          </div>

          <div
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
            onClick={() => setActiveTab("resumes")}
          >
            <p
              className={`text-base group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "resumes" && " bg-white shadow-md text-blue-600"
              }`}
            >
              My Resumes
            </p>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6">
          <AnimatePresence>
            {activeTab === "collections" && (
              <React.Fragment>
                {user?.collections?.length > 0 && user?.collections ? (
                  <RenderTemplate
                    templates={templates?.filter((temp) =>
                      user?.collections?.includes(temp?._id)
                    )}
                  />
                ) : (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                    <img
                      src={NoData}
                      className="w-32 h-auto object-contain"
                      alt=""
                    />
                    <p>No Data</p>
                  </div>
                )}
              </React.Fragment>
            )}

            {activeTab === "resumes" && (
              <React.Fragment>
                {savedResumes?.length > 0 && savedResumes ? (
                  <RenderTemplate templates={savedResumes} />
                ) : (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                    <img
                      src={NoData}
                      className="w-32 h-auto object-contain"
                      alt=""
                    />
                    <p>No Data</p>
                  </div>
                )}
              </React.Fragment>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const RenderTemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 && (
        <React.Fragment>
          <AnimatePresence>
            {templates &&
              templates.map((template, index) => (
                <TemplateDesign
                  key={template?._id}
                  data={template}
                  index={index}
                />
              ))}
          </AnimatePresence>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default UserProfile;
