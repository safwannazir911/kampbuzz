import { useState, useEffect, useCallback } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { CrudServices } from "../../../../Api/CrudServices";
import { toast } from "sonner";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TransferCoins = () => {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [amount, setAmount] = useState("");
  const [availableCoins, setAvailableCoins] = useState(0);
  const crudServices = new CrudServices();
  const authUser = useAuthUser();

  // Fetch institution details (authors and available coins)
  const fetchInstitutionDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await crudServices.getInstitutionDetails();
      console.log(response);
      if (response.error) {
        toast.error(response.error);
      } else {
        setPublishers(response.data.institution.institutionPublisher || []);
        setAvailableCoins(response.data.institution.kcoins);
      }
    } catch (err) {
      toast.error("Error fetching institution details", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstitutionDetails();
  }, [fetchInstitutionDetails]);

  const handleTransfer = async () => {
    if (!selectedPublisher || !amount) {
      toast.error("Please select a publisher and enter an amount");
      return;
    }
    setLoading(true);
    try {
      const response = await crudServices.transferCoins(
        selectedPublisher,
        Number(amount)
      );
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Coins transferred successfully!");
        fetchInstitutionDetails(); // Refresh institution data
      }
    } catch (err) {
      toast.error("Error during coin transfer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="md:w-[25vw] w-full m-auto">
      <CardHeader>
        <CardTitle>Transfer Coins</CardTitle>
        <CardDescription>Available coins: {availableCoins}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div>
              <p>Select Publisher</p>
              <select
                value={selectedPublisher}
                onChange={(e) => setSelectedPublisher(e.target.value)}
                className="w-full p-2 border rounded-md mt-2"
                placeholder="Select Publisher"
              >
                <option value="">Select Publisher</option>
                {publishers.map((publisher) => (
                  <option key={publisher._id} value={publisher._id}>
                    {publisher.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-5">
              <p>Enter Amount to transfer</p>
              <Input
                type="number"
                placeholder="Enter amount to transfer"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2"
              />
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleTransfer} disabled={loading || !authUser}>
          {loading ? "Loading..." : "Transfer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransferCoins;
