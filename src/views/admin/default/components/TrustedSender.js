import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Input, Button } from "@chakra-ui/react";
import Card from "components/card/Card";
import { toast } from "react-hot-toast";
import Papa from "papaparse";  // CSV parsing library

export default function TrustedSenders() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [trustedBatches, setTrustedBatches] = useState([]);
  const [csvFile, setCsvFile] = useState(null);  // For storing CSV file
  const csvInputRef = useRef(null);  // Reference for the CSV file input field

  useEffect(() => {
    axios
      .get("http://localhost:8080/incident/trusted-senders")
      .then((response) => {
        setTrustedBatches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching trusted senders:", error);
        toast.error("Failed to fetch trusted senders");
      });
  }, []);

  // Handle CSV file upload
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      parseCsv(file);
    }
  };

  // Parse CSV file to extract emails
  const parseCsv = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        const emails = result.data
          .map((row) => row[0].trim()) // Assuming emails are in the first column
          .filter((email) => email); // Remove empty rows
        setEmailList(emails);
        toast.success(`${emails.length} emails loaded from CSV`);
      },
      header: false,  // Ensure the first row isn't treated as a header
      skipEmptyLines: true,  // Skip empty lines
    });
  };

  const handleAddToList = () => {
    if (!email.trim()) {
      toast.error("Enter a valid email");
      return;
    }
    setEmailList([...emailList, email]);
    setEmail("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Enter a valid name for the batch");
      return;
    }
    if (emailList.length === 0) {
      toast.error("No emails to submit");
      return;
    }

    try {
      console.log("Submitting emails:", emailList);
      const response = await axios.post(
        "http://localhost:8080/incident/trusted-senders",
        { name, emails: emailList },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        const data = response.data;
        const newBatch = {
          code: data.code,
          name, 
          emails: emailList,
        };

        setTrustedBatches((prevBatches) => [...prevBatches, newBatch]);
        setEmailList([]);
        setName("");
        setCsvFile(null); // Reset CSV file state after submission
        if (csvInputRef.current) {
          csvInputRef.current.value = ''; // Clear CSV input field
        }
        toast.success(`Added batch "${name}" with ${emailList.length} emails`);
      } else {
        toast.error("Failed to add emails");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error, try again later");
    }
  };

  return (
    <Card className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Trusted Senders</h2>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Batch Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mb-4">
        <Input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleAddToList}>Add</Button>
      </div>
      
      {/* CSV Upload Section */}
      <div className="mb-4">
        <Input 
          type="file" 
          accept=".csv" 
          onChange={handleCsvUpload} 
          ref={csvInputRef} // Attach ref here
        />
      </div>
      
      {emailList.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-medium">Emails to be added:</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {emailList.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
          <Button className="mt-2" onClick={handleSubmit}>
            Submit Batch
          </Button>
        </div>
      )}
      
      <h3 className="text-lg font-medium mt-4">Stored Batches</h3>
      {trustedBatches.length === 0 ? (
        <p className="text-gray-500">No trusted senders added yet.</p>
      ) : (
        trustedBatches.map((batch) => (
          <div key={batch.code} className="border p-3 rounded-lg mb-2">
            <p className="font-medium">Batch Name: {batch.name || "Unnamed Batch"}</p>
            <p className="font-medium">Batch Code: {batch.code}</p>
            <ul className="list-disc pl-5 text-gray-700">
              {batch.emails.map((email, idx) => (
                <li key={idx}>{email}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </Card>
  );
}
