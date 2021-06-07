import axios from "axios";
import React, { useEffect, useState } from "react";
import FileCard from "../../Components/Private/FileCard";
import { DocumentInterface } from "../../interfaces";
import { baseurl } from "../../routes";

export default function Home() {
  const [documents, setDocuments] = useState<DocumentInterface[]>();
  const [uniqueUsers, setUniqueUsers] = useState<string[]>();

  useEffect(() => {
    const fetchFiles = async () => {
      const docsRes = await axios.get(`${baseurl}/files/myfiles`, {
        withCredentials: true,
      });

      setDocuments(docsRes.data);
    };

    fetchFiles();
  }, []);

  const mapDocuments = documents?.map((document) => {
    return <FileCard document={document} />;
  });

  return (
    <div className="flex flex-col items-center">
      <p className="text-4xl font-thin mt-12">My files</p>
      <div className="flex flex-wrap justify-center mt-5">{mapDocuments}</div>
    </div>
  );
}
